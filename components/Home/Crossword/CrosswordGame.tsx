import React, { useState, useEffect } from 'react';
import { StyleSheet, ActivityIndicator, Button } from 'react-native';
import { TouchableOpacity, Text, View } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';
import crosswordBank from '@/data/crosswordBank.json';
import wordsList from '@/data/wordsList.json';
import CrosswordGrid from '@/components/Home/Crossword/CrosswordGrid';
import { createCrossword } from '@/utils/CrosswordGenerator';
import { useLocalSearchParams } from "expo-router";

type Word = {
    id: number;
    word: string;
    clue: string;
}

export default function CrosswordGame2() {
    const { difficulty } = useLocalSearchParams();
    const [grid, setGrid] = useState<string[][]>([]);
    const [placedWords, setPlacedWords] = useState<Word[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [wordsToFind, setWordsToFind] = useState<string[]>([]);  

    useEffect(() => {
        generateCrossword();
    }, []);

    const shuffle = (array: any[]) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    const getWordCount = (difficulty: string) => {
        switch (difficulty) {
            case 'Easy':
                return 10;
            case 'Medium':
                return 15;
            case 'Hard':
                return 20;
            default:
                return 5;
        }
    }
    
    const generateCrossword = () => {
        setIsLoading(true);
    
        const size = 15;

        const bank = crosswordBank;

        const { grid, placedWords } = createCrossword(size, wordsList, getWordCount(difficulty as string));

        setGrid(grid);
        setPlacedWords(placedWords);
        setWordsToFind(shuffle(placedWords));
    
        setIsLoading(false);
    };

    return (
        <View>
            {isLoading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <>
                    <CrosswordGrid grid={grid} />
                    <View>
                        <Text>Words to Find:</Text>
                        {wordsToFind.map((word, index) => (
                            <Text key={index}>{word}</Text>
                        ))}
                    </View>
                    <Button title="Regenerate" onPress={generateCrossword} />
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    row: {
        flexDirection: 'row',
    },
    cell: {
        width: 20,
        height: 20,
        textAlign: 'center',
        borderWidth: 1,
        borderColor: '#000',
    },
});