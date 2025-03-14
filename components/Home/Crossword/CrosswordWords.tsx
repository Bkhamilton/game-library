import React from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View, ScrollView } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';

type PlacedWord = {
    word: string;
    startPosition: {
        row: number;
        col: number;
        direction: 'horizontal' | 'vertical';
    }
}

interface CrosswordWordsProps {
    wordsToFind: PlacedWord[];
}

export default function CrosswordWords({ wordsToFind } : CrosswordWordsProps) {
    
    const getStartingPositionIndex = (row : number, col: number) => {
        return wordsToFind.findIndex(({ startPosition }) => startPosition.row === row && startPosition.col === col);
    };

    return (
        <ScrollView style={{ flex: 1, padding: 10, width: '100%' }} contentContainerStyle={{ flexGrow: 1 }}>
            {wordsToFind.map((word, index) => (
                <View key={index} style={{ marginVertical: 2, padding: 8 }}>
                    <Text style={{ fontWeight: 'bold' }}>{`${index + 1}. `} {word.word}</Text>
                </View>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});