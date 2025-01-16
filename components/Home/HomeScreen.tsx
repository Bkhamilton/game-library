import React, { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import { Text, View } from "@/components/Themed";
import GameSelector from "./GameSelector/GameSelector";
import SelectGame from '@/components/Modals/SelectGame';
import { useRouter } from "expo-router";

export default function HomeScreen() {
    const gameTitles = ["Sudoku", "Dino Run", "Word Search"];
    const difficulties = ["Easy", "Medium", "Hard"];

    const [showSelectGame, setShowSelectGame] = useState(false);
    const [selectedGame, setSelectedGame] = useState<string | null>(null);

    const router = useRouter();

    const handleSelectGame = (game: string) => {
        setSelectedGame(game);
        setShowSelectGame(true);
    };

    const handleCloseModal = () => {
        setShowSelectGame(false);
    }

    const confirmSelectGame = (title: string, difficulty: string) => {
        handleCloseModal();
        switch (title) {
            case "Sudoku":
                return router.push(`/sudoku?difficulty=${difficulty}`);
            case "Dino Run":
                return router.push(`/dinorun?difficulty=${difficulty}`);
            case "Word Search":
                return router.push(`/wordSearch?difficulty=${difficulty}`);
            default:
                return "";
        }
    }

    return (
        <View style={styles.container}>
            <View>
                <Text style={{ fontSize: 16 }}>Games</Text>
                <GameSelector gameTitles={gameTitles} handleSelectGame={handleSelectGame}/>
            </View>
            <SelectGame 
                visible={showSelectGame} 
                title={selectedGame} 
                close={handleCloseModal}
                difficulties={difficulties}
                selectGame={confirmSelectGame}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 8,
    },
});
