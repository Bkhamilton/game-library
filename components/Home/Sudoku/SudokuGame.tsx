import React, { useState, useEffect, useContext, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { View } from '@/components/Themed';
import { generateSudokuPuzzle, checkMove } from '@/utils/SudokuGenerator';
import { useLocalSearchParams, useRouter } from 'expo-router';
import SudokuBoard from './SudokuBoard';
import SudokuHeader from './SudokuHeader';
import EndGameMessage from '@/components/Modals/EndGameMessage';
import { DBContext } from '@/contexts/DBContext';
import { insertWin, insertLoss, insertTimeScore, insertMistakes } from '@/db/Scores/Scores';
import { ShakeView, GameVictoryConfetti, LoadingSpinner } from '@/components/animations';

export default function SudokuGame() {
    const { difficulty, mode } = useLocalSearchParams();
    const gameMode = typeof mode === 'string' ? mode : 'Classic'; // Default to Classic if not specified
    const [board, setBoard] = useState<number[][]>([]);
    const [solvedBoard, setSolvedBoard] = useState<number[][]>([]);
    const [initialNumbers, setInitialNumbers] = useState<{ [key: string]: boolean }>({});
    const [selectedNumber, setSelectedNumber] = useState<number | null>(null);

    const [endGameModalVisible, setEndGameModalVisible] = useState(false);
    const [endGameResult, setEndGameResult] = useState<boolean>(false);

    const [wrongCount, setWrongCount] = useState(0);
    const [lossModalShown, setLossModalShown] = useState(false);
    
    const [errorShakeTrigger, setErrorShakeTrigger] = useState(0);
    const [showVictoryConfetti, setShowVictoryConfetti] = useState(false);
    
    const [isLoading, setIsLoading] = useState(true);

    const [gameTime, setGameTime] = useState(0); // Track game time
    const [timerReset, setTimerReset] = useState(false); // For resetting timer on correct moves in Frenzy mode

    const { db, curGame } = useContext(DBContext);

    const handleTimeUpdate = useCallback((seconds: number) => {
        setGameTime(seconds);
    }, []);

    const handleTimeExpired = useCallback(() => {
        if (gameMode === 'Frenzy' && !lossModalShown) {
            handleLoss();
        }
    }, [gameMode, lossModalShown]);

    const handleWin = () => {
        insertWin(db, curGame!.id, difficulty);
        insertTimeScore(db, curGame!.id, gameTime, difficulty);
        insertMistakes(db, curGame!.id, wrongCount, difficulty);
        setShowVictoryConfetti(true);
        // Delay showing the modal slightly to let confetti play
        setTimeout(() => {
            setEndGameResult(true);
            setEndGameModalVisible(true);
        }, 500);
    }

    const handleLoss = () => {
        insertLoss(db, curGame!.id, difficulty);
        insertMistakes(db, curGame!.id, wrongCount, difficulty);
        setEndGameResult(false);
        setEndGameModalVisible(true);
        setLossModalShown(true);
    }

    const handleInputChange = (row: number, col: number, value: string) => {
        if (initialNumbers[`${row}-${col}`]) return; // Prevent changing initial numbers
        const newBoard = [...board];
        const intValue = parseInt(value) || 0;
        // If the value is -1, clear the cell
        if (intValue === -1) {
            newBoard[row][col] = 0;
            setBoard(newBoard);
            return;
        }
        if (checkMove(solvedBoard, row, col, intValue)) {
            newBoard[row][col] = intValue;
            setBoard(newBoard);
            // In Frenzy mode, reset the timer on correct move
            if (gameMode === 'Frenzy') {
                setTimerReset(prev => !prev); // Toggle to trigger reset
            }
        } else {
            setWrongCount(prevCount => prevCount + 1);
            setErrorShakeTrigger(prev => prev + 1); // Trigger shake animation
        }
        // Check if the board is solved
        if (JSON.stringify(newBoard) === JSON.stringify(solvedBoard)) {
            handleWin();
        }
        // Check if the board is lost (only for Classic mode - 4 mistakes rule)
        if (gameMode === 'Classic' && wrongCount >= 3 && !lossModalShown) {
            handleLoss();
        }
    };

    const handleSelectNumber = (value: any) => {
        setSelectedNumber(value);
    };

    useEffect(() => {
        setIsLoading(true);
        // Simulate loading time to show spinner
        setTimeout(() => {
            const { completeBoard, puzzleBoard } = generateSudokuPuzzle(difficulty);
            setBoard(puzzleBoard);
            setSolvedBoard(completeBoard);
            const initialNums: { [key: string]: boolean } = {};
            puzzleBoard.forEach((row: any[], rowIndex: any) => {
                row.forEach((cell: number, colIndex: any) => {
                    if (cell !== 0) {
                        initialNums[`${rowIndex}-${colIndex}`] = true;
                    }
                });
            });
            setInitialNumbers(initialNums);
            setIsLoading(false);
        }, 300);
    }, [difficulty]);

    const router = useRouter();

    const restartGame = (difficulty: string) => {
        setWrongCount(0);
        setLossModalShown(false);
        router.replace(`/sudoku?difficulty=${difficulty}&mode=${gameMode}`);
    }

    return (
        <View style={styles.container}>
            <SudokuHeader 
                wrongCount={wrongCount}
                onTimeUpdate={handleTimeUpdate}
                mode={gameMode}
                difficulty={difficulty as string}
                timerReset={timerReset}
                onTimeExpired={handleTimeExpired}
            />
            {isLoading ? (
                <LoadingSpinner size="large" />
            ) : (
                <ShakeView 
                    trigger={errorShakeTrigger}
                >
                    <SudokuBoard 
                        board={board} 
                        handleInputChange={handleInputChange} 
                        selectedNumber={selectedNumber} 
                        initialNumbers={initialNumbers}
                        selectNumber={handleSelectNumber}
                    />
                </ShakeView>
            )}
            <EndGameMessage 
                visible={endGameModalVisible} 
                close={() => setEndGameModalVisible(false)} 
                win={endGameResult} 
                game={curGame} 
                initialDifficulty={difficulty} 
                restartGame={restartGame}
            />
            <GameVictoryConfetti
                visible={showVictoryConfetti}
                onComplete={() => setShowVictoryConfetti(false)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 24,
    },
});