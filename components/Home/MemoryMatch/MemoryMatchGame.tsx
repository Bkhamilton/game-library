import React, { useState, useEffect, useContext, useCallback } from "react";
import { StyleSheet } from "react-native";
import { View } from "@/components/Themed";
import { useLocalSearchParams, useRouter } from "expo-router";
import EndGameMessage from "@/components/Modals/EndGameMessage";
import { DBContext } from "@/contexts/DBContext";
import MemoryMatchBoard from "./MemoryMatchBoard";
import MemoryMatchHeader from "./MemoryMatchHeader";
import { 
    initializeBoard, 
    checkMatch, 
    checkWin, 
    getMaxIncorrectGuesses,
    Card,
    getBoardSize
} from "@/utils/MemoryMatchGenerator";
import { insertWin, insertLoss, insertTimeScore, insertTotalScore } from "@/db/Scores/Scores";

export default function MemoryMatchGame() {
    const router = useRouter();
    const { difficulty } = useLocalSearchParams();
    const [cards, setCards] = useState<Card[]>([]);
    const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
    const [matches, setMatches] = useState(0);
    const [incorrectGuesses, setIncorrectGuesses] = useState(0);
    const [endGameModalVisible, setEndGameModalVisible] = useState(false);
    const [gameWon, setGameWon] = useState(false);
    const [gameTime, setGameTime] = useState(0);
    const [canFlip, setCanFlip] = useState(true);

    const { db, curGame } = useContext(DBContext);

    const maxIncorrectGuesses = getMaxIncorrectGuesses(difficulty as string);
    const { rows, cols } = getBoardSize(difficulty as string);
    const totalPairs = (rows * cols) / 2;

    const handleTimeUpdate = useCallback((seconds: number) => {
        setGameTime(seconds);
    }, []);

    // Initialize the board when component mounts or difficulty changes
    useEffect(() => {
        const newCards = initializeBoard(difficulty as string);
        setCards(newCards);
        setMatches(0);
        setIncorrectGuesses(0);
        setFlippedIndices([]);
        setGameWon(false);
    }, [difficulty]);

    // Handle card flipping logic
    useEffect(() => {
        if (flippedIndices.length === 2 && canFlip) {
            setCanFlip(false);
            const [firstIndex, secondIndex] = flippedIndices;
            const firstCard = cards[firstIndex];
            const secondCard = cards[secondIndex];

            if (checkMatch(firstCard, secondCard)) {
                // Cards match
                setTimeout(() => {
                    const newCards = [...cards];
                    newCards[firstIndex].isMatched = true;
                    newCards[secondIndex].isMatched = true;
                    newCards[firstIndex].isFlipped = false;
                    newCards[secondIndex].isFlipped = false;
                    setCards(newCards);
                    setMatches(matches + 1);
                    setFlippedIndices([]);
                    setCanFlip(true);

                    // Check for win
                    if (checkWin(newCards)) {
                        handleWin();
                    }
                }, 600);
            } else {
                // Cards don't match
                setTimeout(() => {
                    const newCards = [...cards];
                    newCards[firstIndex].isFlipped = false;
                    newCards[secondIndex].isFlipped = false;
                    setCards(newCards);
                    setIncorrectGuesses(incorrectGuesses + 1);
                    setFlippedIndices([]);
                    setCanFlip(true);
                }, 1000);
            }
        }
    }, [flippedIndices, cards, matches, incorrectGuesses, canFlip]);

    // Check for loss condition
    useEffect(() => {
        if (incorrectGuesses >= maxIncorrectGuesses && !gameWon && !endGameModalVisible) {
            handleLoss();
        }
    }, [incorrectGuesses, maxIncorrectGuesses, gameWon, endGameModalVisible]);

    const handleCardPress = (index: number) => {
        if (!canFlip || flippedIndices.length >= 2) return;
        
        const newCards = [...cards];
        newCards[index].isFlipped = true;
        setCards(newCards);
        setFlippedIndices([...flippedIndices, index]);
    };

    const handleWin = () => {
        if (db && curGame) {
            insertWin(db, curGame.id, String(difficulty || 'Easy'));
            insertTimeScore(db, curGame.id, gameTime, String(difficulty || 'Easy'));
            insertTotalScore(db, curGame.id, matches, String(difficulty || 'Easy'));
        }
        setGameWon(true);
        setEndGameModalVisible(true);
    };

    const handleLoss = () => {
        if (db && curGame) {
            insertLoss(db, curGame.id, String(difficulty || 'Easy'));
        }
        setGameWon(false);
        setEndGameModalVisible(true);
    };

    const restartGame = (difficulty: string) => {
        router.replace(`/memorymatch?difficulty=${difficulty}`);
    };

    return (
        <View style={styles.container}>
            <MemoryMatchHeader
                incorrectGuesses={incorrectGuesses}
                maxIncorrectGuesses={maxIncorrectGuesses}
                matches={matches}
                totalPairs={totalPairs}
                onTimeUpdate={handleTimeUpdate}
            />

            <MemoryMatchBoard
                cards={cards}
                onCardPress={handleCardPress}
                difficulty={difficulty as string}
            />

            <EndGameMessage
                visible={endGameModalVisible}
                close={() => setEndGameModalVisible(false)}
                win={gameWon}
                game={curGame}
                initialDifficulty={difficulty}
                restartGame={restartGame}
            />
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
