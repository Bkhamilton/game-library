import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';

type Props = {
    title: string;
    children?: React.ReactNode;
    onReplay?: () => unknown;
    onHome: () => unknown;
    /** Keep actions disabled until finalization has succeeded. */
    disabled?: boolean;
};

export function SessionResult({ title, children, onReplay, onHome, disabled = false }: Props) {
    const colors = useTheme();
    return (
        <View style={styles.container}>
            <Text accessibilityRole="header">{title}</Text>
            {children}
            {([['Play again', onReplay], ['Home', onHome]] as const).map(([label, action]) => action && (
                <Pressable key={label} accessibilityRole="button" accessibilityLabel={label}
                    accessibilityState={{ disabled }} disabled={disabled}
                    onPress={() => { void action(); }}
                    style={[styles.button, { borderColor: colors.text, opacity: disabled ? 0.5 : 1 }]}>
                    <Text>{label}</Text>
                </Pressable>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { padding: 16, gap: 12 },
    button: { minHeight: 44, minWidth: 44, padding: 12, borderRadius: 8, borderWidth: 1,
        alignItems: 'center', justifyContent: 'center' },
});

export default SessionResult;
