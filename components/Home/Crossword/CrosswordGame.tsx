import React, { useState, useEffect } from 'react';
import { StyleSheet, ActivityIndicator, Button } from 'react-native';
import { TouchableOpacity, Text, View } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';
import crosswordBank from '@/data/crosswordBank.json';
import wordsList from '@/data/wordsList.json';
import CrosswordGrid from '@/components/Home/Crossword/CrosswordGrid';
import { createCrossword } from '@/utils/CrosswordGenerator';
import { useLocalSearchParams } from "expo-router";
import CrosswordHeader from './CrosswordHeader';

type PlacedWord = {
    word: string;
    startPosition: {
        row: number;
        col: number;
        direction: 'horizontal' | 'vertical';
    }
}

export default function CrosswordGame2() {
    const { difficulty } = useLocalSearchParams();
    const [grid, setGrid] = useState<string[][]>([]);
    const [placedWords, setPlacedWords] = useState<PlacedWord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [wordsToFind, setWordsToFind] = useState<PlacedWord[]>([]);  

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
                return 6;
            case 'Medium':
                return 9;
            case 'Hard':
                return 14;
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
        setWordsToFind(placedWords);
    
        setIsLoading(false);
    };

    return (
        <View style={styles.container}>
            {isLoading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <>
                    <CrosswordHeader
                        wordsFound={0}
                        totalWords={wordsToFind.length}
                        reset={false}
                    />
                    <CrosswordGrid 
                        grid={grid}
                        placedWords={placedWords} 
                    />
                    <View>
                        <Text>Words to Find:</Text>
                        {wordsToFind.map((word, index) => (
                            <Text key={index}>{word.word} {JSON.stringify(word.startPosition)}</Text>
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
        alignItems: "center",
        paddingTop: 24,
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