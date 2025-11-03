import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from '@/components/Themed';
import GameHeader from '../GameHeader/GameHeader';
import useTheme from '@/hooks/useTheme';

interface CrosswordHeaderProps {
    wrongCount: number;
    wordsFound: number;
    totalWords: number;
    onTimeUpdate?: (seconds: number) => void;
    isEndlessMode?: boolean;
    currentLevel?: number;
    totalScore?: number;
    onStopEndless?: () => void;
}

export default function CrosswordHeader({ 
    wrongCount, 
    wordsFound, 
    totalWords, 
    onTimeUpdate,
    isEndlessMode = false,
    currentLevel = 1,
    totalScore = 0,
    onStopEndless
}: CrosswordHeaderProps) {
    const { primary } = useTheme();

    if (isEndlessMode) {
        return (
            <GameHeader
                leftContent={
                    <TouchableOpacity 
                        style={[styles.stopButton, { backgroundColor: primary }]}
                        onPress={onStopEndless}
                    >
                        <Text style={styles.stopButtonText}>Stop</Text>
                    </TouchableOpacity>
                }
                centerContent={
                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Level {currentLevel}</Text>
                }
                rightContent={<Text style={{ fontSize: 16 }}>{wordsFound}/{totalWords}</Text>}
                onTimeUpdate={onTimeUpdate}
            />
        );
    }

    return (
        <GameHeader
            leftContent={<Text style={{ fontSize: 16 }}>{wrongCount}/4</Text>}
            rightContent={<Text style={{ fontSize: 16 }}>{wordsFound}/{totalWords}</Text>}
            onTimeUpdate={onTimeUpdate}
        />
    );
}

const styles = StyleSheet.create({
    stopButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    stopButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
});
