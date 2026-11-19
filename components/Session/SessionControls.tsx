import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { Text } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';
import type { SessionError, SessionStatus } from '@/hooks/useGameSession';

type Props = {
    status: SessionStatus;
    isSaving?: boolean;
    error?: SessionError | null;
    onStart: () => unknown;
    onPause: () => unknown;
    onResume: () => unknown;
    onRetry: () => unknown;
    onLeave?: () => unknown;
    onHelp?: () => unknown;
    onRestart?: () => unknown;
};

/** Place beside the board; disable game input using the session's isActive flag. */
export function SessionControls(props: Props) {
    const colors = useTheme();
    const button = (label: string, action: () => unknown, disabled = false) => (
        <Pressable accessibilityRole="button" accessibilityLabel={label}
            accessibilityState={{ disabled }} disabled={disabled}
            onPress={() => { void action(); }}
            style={[styles.button, { borderColor: colors.text, opacity: disabled ? 0.5 : 1 }]}>
            <Text>{label}</Text>
        </Pressable>
    );
    return (
        <View style={styles.container}>
            {props.status === 'paused' && (
                <Text accessibilityRole="header">Paused — resume when you are ready</Text>
            )}
            {props.isSaving && (
                <View accessibilityLiveRegion="polite" style={styles.row}>
                    <ActivityIndicator accessibilityLabel="Saving progress" color={colors.text} />
                    <Text>Saving…</Text>
                </View>
            )}
            {props.error && (
                <View accessibilityRole="alert">
                    <Text>Unable to {props.error.operation === 'terminal' ? 'save the result' :
                        props.error.operation === 'navigation' ? 'leave the game' : 'save progress'}.
                        Your run has not been discarded.</Text>
                    {button('Retry', props.onRetry, props.isSaving)}
                </View>
            )}
            <View style={styles.row}>
                {props.status === 'ready' && button('Start', props.onStart, !!props.error)}
                {props.status === 'playing' && button('Pause', props.onPause)}
                {props.status === 'paused' && button('Resume', props.onResume, !!props.error || props.isSaving)}
                {props.onHelp && button('How to play', () => {
                    void props.onPause();
                    props.onHelp?.();
                })}
                {props.onRestart && props.status !== 'terminal' && button('Restart', async () => {
                    if (await props.onPause() !== false) props.onRestart?.();
                }, props.isSaving || !!props.error)}
                {props.onLeave && button('Save and leave', props.onLeave, props.isSaving || !!props.error)}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { gap: 12, padding: 12 },
    row: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 12 },
    button: { minHeight: 44, minWidth: 44, padding: 12, borderWidth: 1, borderRadius: 8,
        justifyContent: 'center', alignItems: 'center' },
});

export default SessionControls;
