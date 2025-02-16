import React, { useState, useEffect } from 'react';
import { StyleSheet, ActivityIndicator, Button } from 'react-native';
import { TouchableOpacity, Text, View } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';
import crosswordBank from '@/data/crosswordBank.json';
import CrosswordGrid from '@/components/Home/Crossword/Crossword2/CrosswordGrid';
import { CrosswordGenerator } from '@/components/Home/Crossword/CrosswordGenerator';
import { createGrid, placeFirstWord, placeSubsequentWords } from '@/utils/CrosswordGenerator';

type Word = {
    id: number;
    word: string;
    clue: string;
}

export default function CrosswordGame2() {

    const [grid, setGrid] = useState<string[][]>([]);
    const [placedWords, setPlacedWords] = useState<Word[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [wordsToFind, setWordsToFind] = useState<Word[]>([]);  

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
    
    const generateCrossword = () => {
        setIsLoading(true);
    
        let updatedGrid = createGrid(15);
        const shuffledWordBank = shuffle(crosswordBank);
    
        // Place the first word
        const { grid: gridWithFirstWord } = placeFirstWord(updatedGrid, shuffledWordBank[0]);
    
        /*
        // Place subsequent words
        updatedGrid = placeSubsequentWords(gridWithFirstWord, shuffledWordBank.slice(1));
        */

        setGrid(gridWithFirstWord);
        setWordsToFind(shuffledWordBank);
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
                            <Text key={index}>{word.word}</Text>
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