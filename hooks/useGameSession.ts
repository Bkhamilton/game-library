import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { useFocusEffect, usePreventRemove } from 'expo-router';

export type SessionStatus = 'ready' | 'playing' | 'paused' | 'terminal';
export type SessionSnapshot<T> = { state: T; elapsedMs: number; revision: number };
export type SessionError = { operation: 'checkpoint' | 'terminal' | 'navigation'; cause: unknown };
export type GameSessionOptions<T, O> = {
    initialState: T;
    restored?: { state: T; elapsedMs: number; revision?: number };
    checkpoint: (snapshot: SessionSnapshot<T>) => Promise<unknown>;
    onTerminal: (outcome: O, snapshot: SessionSnapshot<T>) => Promise<unknown>;
    /** Injectable monotonic clock, primarily for deterministic tests. */
    now?: () => number;
};

/**
 * Mount once per run (key the owning component by run ID). State updates must be
 * immutable. I/O callbacks must reject on failure and finalize idempotently by run ID.
 */
export function useGameSession<T, O = string>(options: GameSessionOptions<T, O>) {
    const callbacks = useRef(options);
    callbacks.current = options;
    const [model, setModel] = useState(() => ({
        state: options.restored?.state ?? options.initialState,
        status: (options.restored ? 'paused' : 'ready') as SessionStatus,
        elapsedMs: Math.max(0, options.restored?.elapsedMs ?? 0),
        revision: options.restored?.revision ?? 0,
        runToken: 0,
    }));
    const current = useRef(model);
    const mounted = useRef(true);
    const focused = useRef(false);
    const appActive = useRef(AppState.currentState === 'active');
    const androidFocused = useRef(true);
    const startedAt = useRef<number | null>(null);
    const lastNow = useRef(0);
    const queue = useRef<Promise<boolean>>(Promise.resolve(true));
    const pending = useRef(0);
    const failure = useRef<null | (() => Promise<boolean>)>(null);
    const exiting = useRef(false);
    const [error, setError] = useState<SessionError | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [terminalSaved, setTerminalSaved] = useState(false);
    const terminalCommitted = useRef(false);
    const [removalAllowed, setRemovalAllowed] = useState(false);
    const continuation = useRef<null | (() => void | Promise<void>)>(null);

    const now = useCallback(() => {
        lastNow.current = Math.max(lastNow.current, (callbacks.current.now ?? (() => performance.now()))());
        return lastNow.current;
    }, []);
    const elapsed = useCallback(() => current.current.elapsedMs +
        (startedAt.current === null ? 0 : Math.max(0, now() - startedAt.current)), [now]);
    const publish = useCallback(() => {
        if (mounted.current) setModel({ ...current.current, elapsedMs: elapsed() });
    }, [elapsed]);
    const snapshot = useCallback((): SessionSnapshot<T> => ({
        state: current.current.state,
        elapsedMs: elapsed(),
        revision: current.current.revision,
    }), [elapsed]);
    const freeze = useCallback(() => {
        if (current.current.status !== 'playing') return false;
        current.current.elapsedMs = elapsed();
        startedAt.current = null;
        current.current.status = 'paused';
        current.current.runToken += 1;
        current.current.revision += 1;
        publish();
        return true;
    }, [elapsed, publish]);

    const enqueue = useCallback((operation: SessionError['operation'], work: () => Promise<unknown>,
        retryWork?: () => Promise<unknown>): Promise<boolean> => {
        pending.current += 1;
        if (mounted.current) setIsSaving(true);
        const execute = async (): Promise<boolean> => {
            if (failure.current) {
                // A final result or exit supersedes an earlier failed checkpoint,
                // but still requires an explicit retry of its durable boundary.
                if (operation !== 'checkpoint') {
                    failure.current = async () => {
                        failure.current = null;
                        if (mounted.current) setError(null);
                        return enqueue(operation, work, retryWork);
                    };
                }
                return false;
            }
            try {
                await work();
                return true;
            } catch (cause) {
                freeze();
                if (mounted.current) setError({ operation, cause });
                failure.current = async () => {
                    failure.current = null;
                    if (mounted.current) setError(null);
                    return enqueue(operation, retryWork ?? work, retryWork);
                };
                return false;
            }
        };
        const result = queue.current.then(execute).finally(() => {
            pending.current -= 1;
            if (mounted.current) setIsSaving(pending.current > 0);
        });
        queue.current = result;
        return result;
    }, [freeze]);

    const checkpoint = useCallback(() => {
        if (current.current.status === 'ready' || current.current.status === 'terminal') {
            return Promise.resolve(!failure.current);
        }
        const saved = snapshot();
        return enqueue('checkpoint', () => callbacks.current.checkpoint(saved),
            () => callbacks.current.checkpoint(snapshot()));
    }, [enqueue, snapshot]);
    const pause = useCallback(() => {
        if (freeze()) return checkpoint();
        return Promise.resolve(!failure.current);
    }, [checkpoint, freeze]);
    const activate = useCallback((from: SessionStatus) => {
        if (!mounted.current || !focused.current || !appActive.current || !androidFocused.current ||
            failure.current || exiting.current || current.current.status !== from) return false;
        startedAt.current = now();
        current.current.status = 'playing';
        current.current.runToken += 1;
        current.current.revision += 1;
        publish();
        void checkpoint();
        return true;
    }, [checkpoint, now, publish]);
    const start = useCallback(() => activate('ready'), [activate]);
    const resume = useCallback(() => activate('paused'), [activate]);
    const accepts = useCallback((token?: number) => mounted.current && !exiting.current &&
        current.current.status === 'playing' && !failure.current &&
        (token === undefined || token === current.current.runToken), []);
    const change = useCallback((update: T | ((previous: T) => T), token?: number) => {
        if (!accepts(token)) return false;
        current.current.state = typeof update === 'function'
            ? (update as (previous: T) => T)(current.current.state) : update;
        current.current.revision += 1;
        publish();
        void checkpoint();
        return true;
    }, [accepts, checkpoint, publish]);
    const finish = useCallback((outcome: O, token?: number) => {
        if (!accepts(token)) return Promise.resolve(false);
        freeze();
        current.current.status = 'terminal';
        publish();
        const final = snapshot();
        return enqueue('terminal', async () => {
            await callbacks.current.onTerminal(outcome, final);
            terminalCommitted.current = true;
            if (mounted.current) setTerminalSaved(true);
        });
    }, [accepts, enqueue, freeze, publish, snapshot]);
    const retry = useCallback(() => failure.current?.() ?? Promise.resolve(true), []);

    const leave = useCallback(async (action: () => void | Promise<void>): Promise<boolean> => {
        if (exiting.current || failure.current || !mounted.current) return false;
        if (current.current.status === 'terminal' && !terminalCommitted.current) return false;
        freeze();
        exiting.current = true;
        const saved = snapshot();
        const work = async () => {
            if (current.current.status !== 'ready' && current.current.status !== 'terminal') {
                await callbacks.current.checkpoint(saved);
            }
            if (!mounted.current) return;
            continuation.current = action;
            setRemovalAllowed(true);
        };
        const result = await enqueue('navigation', work);
        if (!result) exiting.current = false;
        return result;
    }, [enqueue, freeze, snapshot]);
    const disablePrevention = usePreventRemove(!removalAllowed &&
        model.status !== 'ready' && !(model.status === 'terminal' && terminalSaved), ({ repeat }) => {
        void leave(repeat);
    });
    useEffect(() => {
        if (!removalAllowed || !continuation.current) return;
        const action = continuation.current;
        continuation.current = null;
        void (async () => {
            try {
                disablePrevention();
                await action();
            } catch (cause) {
                if (!mounted.current) return;
                exiting.current = false;
                setRemovalAllowed(false);
                setError({ operation: 'navigation', cause });
                failure.current = () => {
                    failure.current = null;
                    setError(null);
                    return leave(action);
                };
            }
        })();
    }, [disablePrevention, leave, removalAllowed]);

    useFocusEffect(useCallback(() => {
        focused.current = true;
        // A route that stayed mounted after a push must guard its next removal too.
        exiting.current = false;
        setRemovalAllowed(false);
        return () => {
            focused.current = false;
            void pause();
        };
    }, [pause]));
    useEffect(() => {
        const subscriptions = [
            AppState.addEventListener('change', state => {
                appActive.current = state === 'active';
                if (!appActive.current) void pause();
            }),
            AppState.addEventListener('blur', () => {
                androidFocused.current = false;
                void pause();
            }),
            AppState.addEventListener('focus', () => { androidFocused.current = true; }),
        ];
        return () => subscriptions.forEach(subscription => subscription.remove());
    }, [pause]);
    useEffect(() => {
        if (model.status !== 'playing') return;
        const timer = setInterval(() => {
            if (mounted.current) setModel({ ...current.current, elapsedMs: elapsed() });
        }, 100);
        return () => clearInterval(timer);
    }, [elapsed, model.status]);
    useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
            current.current.runToken += 1;
            // Fallback only: before-remove, blur and AppState are the primary saves.
            if (freeze()) void checkpoint();
        };
    }, [checkpoint, freeze]);

    return {
        state: model.state, status: model.status, elapsedMs: model.elapsedMs,
        isActive: model.status === 'playing', runToken: model.runToken,
        start, resume, pause, change, checkpoint, finish, leave, error, retry, isSaving,
        isTerminalSaved: terminalSaved,
        getSnapshot: snapshot,
    };
}

export default useGameSession;
