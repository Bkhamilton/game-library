import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Text, View } from "@/components/Themed";
import GameSelector from "./GameSelector/GameSelector";
import SelectGame from "@/components/Modals/SelectGame";
import { useRouter } from "expo-router";

import { GameTitle, Difficulty } from "@/constants/Types";
import Difficulties from '@/constants/Difficulties';

export default function HomeScreen() {

    const gameTitles: GameTitle[] = [
        "Sudoku",
        "Ostrich Haul",
        "Word Search",
        "Crossword",
        "Minesweeper",
        "GoGoBird",
    ];

    const [showSelectGame, setShowSelectGame] = useState(false);
    const [selectedGame, setSelectedGame] = useState<GameTitle | null>(null);

    const router = useRouter();

    const handleSelectGame = (game: GameTitle) => {
        setSelectedGame(game);
        setShowSelectGame(true);
    };

    const handleCloseModal = () => {
        setShowSelectGame(false);
    };

    const confirmSelectGame = (title: string, difficulty: Difficulty) => {
        handleCloseModal();
        switch (title) {
            case "Sudoku":
                return router.push(`/sudoku?difficulty=${difficulty}`);
            case "Ostrich Haul":
                return router.push(`/ostrichhaul?difficulty=${difficulty}`);
            case "Word Search":
                return router.push(`/wordSearch?difficulty=${difficulty}`);
            case "Crossword":
                return router.push(`/crossword?difficulty=${difficulty}`);
            case "Minesweeper":
                return router.push(`/minesweeper?difficulty=${difficulty}`);
            case "GoGoBird":
                return router.push(`/gogobird?difficulty=${difficulty}`);
            default:
                return "";
        }
    };

    return (
        <View style={styles.container}>
            <View>
                <Text style={{ fontSize: 16 }}>Games</Text>
                <GameSelector
                    gameTitles={gameTitles}
                    handleSelectGame={handleSelectGame}
                />
            </View>
            {selectedGame && (
                <SelectGame
                    visible={showSelectGame}
                    title={selectedGame}
                    close={handleCloseModal}
                    difficulties={Difficulties[selectedGame]}
                    selectGame={confirmSelectGame}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 8,
    },
});
