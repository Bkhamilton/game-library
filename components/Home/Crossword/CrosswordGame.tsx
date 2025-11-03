import React, { useState, useEffect, useContext, useCallback } from 'react';
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
import { insertWin, insertLoss, insertTimeScore, insertCorrectWords, insertHintsUsed } from '@/db/Scores/Scores';

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
    const { difficulty, mode } = useLocalSearchParams();
    const [grid, setGrid] = useState<string[][]>([]);
    const [placedWords, setPlacedWords] = useState<PlacedWord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [wordsToFind, setWordsToFind] = useState<PlacedWord[]>([]); 
    const [guessedWords, setGuessedWords] = useState<PlacedWord[]>([]);
    const [activeCell, setActiveCell] = useState<{row: number, col: number} | null>(null);

    const [endGameModalVisible, setEndGameModalVisible] = useState(false);
    const [endGameResult, setEndGameResult] = useState<boolean>(false);

    const [gameTime, setGameTime] = useState(0); // Track game time

    const [wrongCount, setWrongCount] = useState(0);
    const [hintsUsed, setHintsUsed] = useState(0); // Track hints used
    
    const [currentLevel, setCurrentLevel] = useState(1); // Track current level for Endless mode
    const [totalScore, setTotalScore] = useState(0); // Track total score for Endless mode
    const [isEndlessMode, setIsEndlessMode] = useState(false); // Track if in Endless mode

    const { db, curGame } = useContext(DBContext);

    const handleTimeUpdate = useCallback((seconds: number) => {
        setGameTime(seconds);
    }, []);

    const handleWin = () => {
        if (isEndlessMode) {
            // In Endless mode, award points and continue to next level
            const levelScore = 100 * currentLevel; // Points increase with level
            setTotalScore(prev => prev + levelScore);
            setCurrentLevel(prev => prev + 1);
            
            // Reset game after a brief delay
            setTimeout(() => {
                setWrongCount(0);
                setGuessedWords([]);
                setActiveCell(null);
                generateCrossword();
            }, 1500);
        } else {
            // Classic mode - end the game
            insertWin(db, curGame && curGame.id, difficulty);
            insertTimeScore(db, curGame && curGame.id, gameTime, difficulty);
            insertCorrectWords(db, curGame && curGame.id, guessedWords.length, difficulty);
            insertHintsUsed(db, curGame && curGame.id, hintsUsed, difficulty);
            setEndGameResult(true);
            setEndGameModalVisible(true);
        }
    }

    const handleLoss = () => {
        if (isEndlessMode) {
            // In Endless mode, losing ends the game and records the level
            insertLoss(db, curGame && curGame.id, difficulty);
            insertCorrectWords(db, curGame && curGame.id, currentLevel - 1, difficulty);
            setEndGameResult(false);
            setEndGameModalVisible(true);
        } else {
            // Classic mode
            insertLoss(db, curGame && curGame.id, difficulty);
            setEndGameResult(false);
            setEndGameModalVisible(true);
        }
    }

    useEffect(() => {
        setIsEndlessMode(mode === 'Endless');
        generateCrossword();
    }, [mode]);

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
        if (wrongCount >= 3) {
            handleLoss();
        }

        
        setActiveCell(null);
    };

    const handleCluePress = (word: PlacedWord) => {
        // Find the first cell of the word to focus on
        const { row, col } = word.startPosition;
        setActiveCell({ row, col });
    };

    const restartGame = () => {
        setGrid([]);
        setPlacedWords([]);
        setGuessedWords([]);
        setActiveCell(null);
        generateCrossword();
    };

    const handleStopEndless = () => {
        // Record the level reached and show end game modal
        insertWin(db, curGame && curGame.id, difficulty);
        insertTimeScore(db, curGame && curGame.id, gameTime, difficulty);
        // In endless mode, record the level as the score
        insertCorrectWords(db, curGame && curGame.id, currentLevel - 1, difficulty);
        insertHintsUsed(db, curGame && curGame.id, hintsUsed, difficulty);
        setEndGameResult(true);
        setEndGameModalVisible(true);
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
                        onTimeUpdate={handleTimeUpdate}
                        isEndlessMode={isEndlessMode}
                        currentLevel={currentLevel}
                        totalScore={totalScore}
                        onStopEndless={handleStopEndless}
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
                        onCluePress={handleCluePress}
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