import { act, renderHook } from '@testing-library/react-native';
import { AppState } from 'react-native';
import { afterEach, beforeEach, expect, it, jest } from '@jest/globals';
import { useGameSession } from '@/hooks/useGameSession';

let mockBlur: (() => void) | undefined;
let mockFocus: (() => void) | undefined;
let mockPrevent: ((event: { repeat: () => void }) => void) | undefined;
let mockPreventing = false;
const mockDisable = jest.fn();
jest.mock('expo-router', () => {
    const React = require('react');
    return {
        useFocusEffect: (effect: () => (() => void)) => {
            React.useEffect(() => {
                mockFocus = () => { mockBlur = effect(); };
                mockBlur = effect();
                return () => mockBlur?.();
            }, [effect]);
        },
        usePreventRemove: (prevent: boolean, callback: typeof mockPrevent) => {
            mockPreventing = prevent;
            mockPrevent = callback;
            return mockDisable;
        },
    };
});

const settle = async () => { await act(async () => { await Promise.resolve(); }); };
let listeners: Record<string, (...state: any[]) => void>;
let clock: number;
const setup = async (overrides = {}) => {
    const checkpoint = jest.fn(async () => {});
    const onTerminal = jest.fn(async () => {});
    const hook = await renderHook(() => useGameSession<number, string>({
        initialState: 0, checkpoint, onTerminal, now: () => clock, ...overrides,
    }));
    return { ...hook, checkpoint, onTerminal };
};
beforeEach(() => {
    jest.useFakeTimers();
    clock = 0;
    listeners = {};
    mockDisable.mockReset();
    Object.defineProperty(AppState, 'currentState', { configurable: true, value: 'active' });
    jest.spyOn(AppState, 'addEventListener').mockImplementation((event, listener) => {
        listeners[event] = listener;
        return { remove: jest.fn() };
    });
});
afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
});

it('freezes active elapsed time on overlapping interruptions and requires explicit resume', async () => {
    const { result } = await setup();
    await act(() => { expect(result.current.start()).toBe(true); });
    await settle();
    clock = 1500;
    await act(() => { listeners.change('background'); listeners.blur(); mockBlur?.(); });
    expect(result.current.status).toBe('paused');
    expect(result.current.elapsedMs).toBe(1500);
    clock = 9000;
    await act(() => { listeners.change('active'); listeners.focus(); });
    expect(result.current.status).toBe('paused');
    // This route was blurred: even explicit resume cannot activate an unfocused game.
    await act(() => { expect(result.current.resume()).toBe(false); });
    await act(() => { mockFocus?.(); });
    expect(result.current.status).toBe('paused');
    await act(() => { expect(result.current.resume()).toBe(true); });
    await settle();
    clock = 9400;
    await act(() => { result.current.pause(); });
    expect(result.current.elapsedMs).toBe(1900);
});

it('restores paused, uses a monotonic clock and rejects callbacks from a previous active token', async () => {
    const { result } = await setup({ restored: { state: 7, elapsedMs: 2000, revision: 3 } });
    expect(result.current.status).toBe('paused');
    expect(result.current.state).toBe(7);
    await act(() => { result.current.resume(); });
    await settle();
    const token = result.current.runToken;
    clock = 500;
    await act(() => { result.current.pause(); });
    expect(result.current.elapsedMs).toBe(2500);
    await settle();
    clock = 400;
    await act(() => { result.current.resume(); });
    await settle();
    await act(() => {
        expect(result.current.change(99, token)).toBe(false);
        expect(result.current.change(previous => previous + 1, result.current.runToken)).toBe(true);
    });
    clock = 800;
    await act(() => { result.current.pause(); });
    expect(result.current.state).toBe(8);
    expect(result.current.elapsedMs).toBe(2800);
});

it('orders state checkpoints before a single terminal dispatch and blocks terminal removal until saved', async () => {
    let release!: () => void;
    const calls: string[] = [];
    const checkpoint = jest.fn(async ({ state }: { state: number }) => {
        calls.push(`save:${state}`);
        if (state === 1) await new Promise<void>(resolve => { release = resolve; });
    });
    const onTerminal = jest.fn(async (outcome: string, saved: { state: number }) => {
        calls.push(`${outcome}:${saved.state}`);
    });
    const { result } = await setup({ checkpoint, onTerminal });
    await act(() => { result.current.start(); });
    await settle();
    let finishing!: Promise<boolean>;
    await act(() => {
        result.current.change(1);
        finishing = result.current.finish('won');
    });
    expect(mockPreventing).toBe(true);
    expect(onTerminal).not.toHaveBeenCalled();
    await act(() => { release(); });
    await act(async () => { expect(await finishing).toBe(true); });
    expect(calls).toEqual(['save:0', 'save:1', 'won:1']);
    expect(mockPreventing).toBe(false);
    await act(async () => {
        expect(await result.current.finish('lost')).toBe(false);
        expect(result.current.change(2)).toBe(false);
    });
    expect(onTerminal).toHaveBeenCalledTimes(1);
});

it('preserves a terminal intent behind a failed checkpoint and retries it explicitly', async () => {
    let reject!: (reason: Error) => void;
    const checkpoint = jest.fn(async () => {
        await new Promise<void>((_, fail) => { reject = fail; });
    });
    const onTerminal = jest.fn(async () => {});
    const { result } = await setup({ checkpoint, onTerminal });
    await act(() => { result.current.start(); });
    await act(() => { result.current.finish('drawn'); });
    await act(() => { reject(new Error('disk full')); });
    await settle();
    expect(result.current.error).not.toBeNull();
    expect(onTerminal).not.toHaveBeenCalled();
    expect(mockPreventing).toBe(true);
    await act(async () => { expect(await result.current.retry()).toBe(true); });
    expect(onTerminal).toHaveBeenCalledTimes(1);
    expect(result.current.error).toBeNull();
});

it('holds a blocked navigation on save failure and retries saving before repeating it', async () => {
    const checkpoint = jest.fn(async () => {});
    const { result } = await setup({ checkpoint });
    await act(() => { result.current.start(); });
    await settle();
    checkpoint.mockRejectedValueOnce(new Error('offline'));
    const repeat = jest.fn();
    await act(() => { mockPrevent?.({ repeat }); });
    await settle();
    expect(repeat).not.toHaveBeenCalled();
    expect(result.current.status).toBe('paused');
    expect(result.current.error?.operation).toBe('navigation');
    await act(async () => { expect(await result.current.retry()).toBe(true); });
    expect(repeat).toHaveBeenCalledTimes(1);
    expect(mockDisable).toHaveBeenCalled();
});

it('exposes navigation dispatch failures for retry without resuming gameplay', async () => {
    const { result } = await setup();
    await act(() => { result.current.start(); });
    await settle();
    const action = jest.fn<() => void>().mockImplementationOnce(() => { throw new Error('router failed'); });
    await act(async () => { await result.current.leave(action); });
    expect(result.current.error?.operation).toBe('navigation');
    expect(result.current.status).toBe('paused');
    await act(async () => { await result.current.retry(); });
    expect(action).toHaveBeenCalledTimes(2);
});

it('invalidates captured dispatch after unmount and removes clock work and native listeners', async () => {
    const remove = jest.fn();
    const setIntervalSpy = jest.spyOn(globalThis, 'setInterval');
    const clearIntervalSpy = jest.spyOn(globalThis, 'clearInterval');
    jest.mocked(AppState.addEventListener).mockReturnValue({ remove });
    const { result, unmount } = await setup();
    await act(() => { result.current.start(); });
    await settle();
    const change = result.current.change;
    const token = result.current.runToken;
    const timer = setIntervalSpy.mock.results.find((_, index) =>
        setIntervalSpy.mock.calls[index][1] === 100)?.value as ReturnType<typeof setInterval>;
    await unmount();
    expect(change(2, token)).toBe(false);
    expect(remove).toHaveBeenCalledTimes(3);
    expect(clearIntervalSpy).toHaveBeenCalledWith(timer);
});

it('does not let Back replace a pending terminal intent after an earlier checkpoint fails', async () => {
    let reject!: (reason: Error) => void;
    const checkpoint = jest.fn(async () => {
        await new Promise<void>((_, fail) => { reject = fail; });
    });
    const onTerminal = jest.fn(async () => {});
    const { result } = await setup({ checkpoint, onTerminal });
    await act(() => { result.current.start(); });
    const repeat = jest.fn();
    await act(() => {
        result.current.finish('won');
        mockPrevent?.({ repeat });
    });
    await act(() => { reject(new Error('disk full')); });
    await settle();
    await act(async () => { await result.current.retry(); });
    expect(onTerminal).toHaveBeenCalledTimes(1);
    expect(repeat).not.toHaveBeenCalled();
    expect(result.current.isTerminalSaved).toBe(true);
});

it('retries a failed checkpoint with the latest accepted state and stays paused', async () => {
    const checkpoint = jest.fn<(saved: unknown) => Promise<void>>().mockResolvedValue(undefined);
    const { result } = await setup({ checkpoint });
    await act(() => { result.current.start(); });
    await settle();
    checkpoint.mockRejectedValueOnce(new Error('disk full'));
    await act(() => {
        result.current.change(1);
        result.current.change(2);
    });
    await settle();
    expect(result.current.status).toBe('paused');
    await act(() => {
        expect(result.current.change(3)).toBe(false);
        expect(result.current.resume()).toBe(false);
    });
    await act(async () => { await result.current.retry(); });
    expect(checkpoint).toHaveBeenLastCalledWith(expect.objectContaining({ state: 2 }));
    expect(result.current.error).toBeNull();
    expect(result.current.status).toBe('paused');
    await act(() => { expect(result.current.resume()).toBe(true); });
});

it('reports rejected asynchronous navigation actions and retries them', async () => {
    const { result } = await setup({ restored: { state: 1, elapsedMs: 200 } });
    const action = jest.fn<() => Promise<void>>()
        .mockRejectedValueOnce(new Error('router rejected')).mockResolvedValue(undefined);
    await act(async () => { await result.current.leave(action); });
    expect(result.current.error?.operation).toBe('navigation');
    await act(async () => { await result.current.retry(); });
    expect(action).toHaveBeenCalledTimes(2);
    expect(result.current.error).toBeNull();
});

it('treats Android notification shade blur/focus as a pause, not an automatic resume', async () => {
    const { result } = await setup();
    await act(() => { result.current.start(); });
    await settle();
    clock = 400;
    await act(() => { listeners.blur(); });
    expect(result.current.status).toBe('paused');
    await act(() => { expect(result.current.resume()).toBe(false); });
    clock = 10000;
    await act(() => { listeners.focus(); });
    expect(result.current.status).toBe('paused');
    expect(result.current.elapsedMs).toBe(400);
    await settle();
    await act(() => { expect(result.current.resume()).toBe(true); });
});

it('provides synchronous latest state and precise active elapsed between display ticks', async () => {
    const { result } = await setup();
    await act(() => { result.current.start(); });
    await settle();
    clock = 37;
    await act(() => {
        expect(result.current.change(5)).toBe(true);
        expect(result.current.getSnapshot()).toEqual({ state: 5, elapsedMs: 37, revision: 2 });
    });
    // Publishing state also samples the clock, without waiting for a display tick.
    expect(result.current.elapsedMs).toBe(37);
    clock = 68;
    expect(result.current.getSnapshot().elapsedMs).toBe(68);
    expect(result.current.elapsedMs).toBe(37);
    await act(() => { result.current.pause(); });
    clock = 10000;
    expect(result.current.getSnapshot().elapsedMs).toBe(68);
});
