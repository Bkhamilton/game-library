import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, ActivityIndicator } from 'react-native';
import { View } from '@/components/Themed';
import wordsList from '@/data/wordsList.json';
import crosswordData from '@/data/crosswordData.json';
import CrosswordGrid from '@/components/Home/Crossword/CrosswordGrid';
import { buildCrossword } from '@/utils/CrosswordGenerator';
import { useLocalSearchParams } from "expo-router";
import CrosswordHeader from './CrosswordHeader';
import CrosswordWords from './CrosswordWords';
import EndGameMessage from '@/components/Modals/EndGameMessage';
import { DBContext } from '@/contexts/DBContext';
import { insertWin, insertLoss } from '@/db/Scores/Scores';

type PlacedWord = {
    word: string;
    startPosition: {
        row: number;
        col: number;
        direction: 'horizontal' | 'vertical';
    }
    clue: string;
}

export default function CrosswordGame() {
    const { difficulty } = useLocalSearchParams();
    const [grid, setGrid] = useState<string[][]>([]);
    const [placedWords, setPlacedWords] = useState<PlacedWord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [wordsToFind, setWordsToFind] = useState<PlacedWord[]>([]); 
    const [guessedWords, setGuessedWords] = useState<PlacedWord[]>([]);
    const [activeCell, setActiveCell] = useState<{row: number, col: number} | null>(null);

    const [endGameModalVisible, setEndGameModalVisible] = useState(false);
    const [endGameResult, setEndGameResult] = useState<boolean>(false);

    const [wrongCount, setWrongCount] = useState(0);

    const { db, curGame } = useContext(DBContext);

    const handleWin = () => {
        insertWin(db, curGame && curGame.id, difficulty);
        setEndGameResult(true);
        setEndGameModalVisible(true);
    }

    const handleLoss = () => {
        insertLoss(db, curGame && curGame.id, difficulty);
        setEndGameResult(false);
        setEndGameModalVisible(true);
    }

    useEffect(() => {
        generateCrossword();
    }, []);

    const getWordCount = (difficulty: string) => {
        switch (difficulty) {
            case 'Easy': return 6;
            case 'Medium': return 9;
            case 'Hard': return 14;
            default: return 5;
        }
    }
    
    const generateCrossword = () => {
        setIsLoading(true);
        const size = 15;

        const { grid, placedWords } = buildCrossword(size, wordsList, getWordCount(difficulty as string));

        for (const word of placedWords) {
            const wordData = crosswordData.find((data) => data.word === word.word);
            if (wordData) {
                word.clue = wordData.clue;
            }
        }

        setGrid(grid);
        setPlacedWords(placedWords);
        setWordsToFind(placedWords);
        setIsLoading(false);
    };

    const handleCellPress = (row: number, col: number) => {
        setActiveCell({ row, col });
    };

    const handleGuessSubmit = (guess: string) => {
        if (!activeCell) return;

        // Find if the guess matches any word in the grid
        const matchedWord = placedWords.find(word => {
            const { row, col, direction } = word.startPosition;
            const wordLength = word.word.length;
            
            if (direction === 'horizontal') {
                return col <= activeCell.col && activeCell.col < col + wordLength && 
                       row === activeCell.row;
            } else {
                return row <= activeCell.row && activeCell.row < row + wordLength && 
                       col === activeCell.col;
            }
        });

        if (matchedWord && guess.toLowerCase() === matchedWord.word.toLowerCase()) {
            // Add to guessed words if not already there
            if (!guessedWords.some(w => w.word === matchedWord.word)) {
                setGuessedWords([...guessedWords, matchedWord]);
            }
        }

        // Check if all words have been guessed
        if (guessedWords.length + 1 === wordsToFind.length) {
            handleWin();
        }

        // Check if the guess is incorrect
        if (matchedWord && guess.toLowerCase() !== matchedWord.word.toLowerCase()) {
            setWrongCount(prevCount => prevCount + 1);
        }

        // Check if the wrong count exceeds 4
        if (wrongCount >= 4) {
            handleLoss();
        }

        
        setActiveCell(null);
    };

    const restartGame = () => {
        setGrid([]);
        setPlacedWords([]);
        setGuessedWords([]);
        setActiveCell(null);
        generateCrossword();
    };

    return (
        <View style={styles.container}>
            <EndGameMessage 
                visible={endGameModalVisible} 
                close={() => setEndGameModalVisible(false)} 
                win={endGameResult} 
                game={curGame} 
                initialDifficulty={difficulty} 
                restartGame={restartGame}
            />
            {isLoading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <>
                    <CrosswordHeader
                        wrongCount={wrongCount}
                        wordsFound={guessedWords.length}
                        totalWords={wordsToFind.length}
                        reset={false}
                    />
                    <CrosswordGrid 
                        grid={grid}
                        placedWords={placedWords} 
                        guessedWords={guessedWords}
                        activeCell={activeCell}
                        onCellPress={handleCellPress}
                        onGuessSubmit={handleGuessSubmit}
                    />
                    <CrosswordWords
                        wordsToFind={wordsToFind}
                        guessedWords={guessedWords}
                    />
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
});