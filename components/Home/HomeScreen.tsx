import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Text, View } from "@/components/Themed";
import GameSelector from "./GameSelector/GameSelector";
import SelectGame from '@/components/Modals/SelectGame';
import { useRouter } from "expo-router";

type GameTitle = "Sudoku" | "Dino Run" | "Word Search" | "Crossword";

export default function HomeScreen() {
    const gameTitles: GameTitle[] = ["Sudoku", "Dino Run", "Word Search", "Crossword"];
    const gameDifficulties: Record<GameTitle, string[]> = {
        "Sudoku": ["Easy", "Medium", "Hard", "Extreme"],
        "Dino Run": ["Easy", "Hard"],
        "Word Search": ["Easy", "Medium", "Hard"],
        "Crossword": ["Easy", "Medium", "Hard"],
    };

    const [showSelectGame, setShowSelectGame] = useState(false);
    const [selectedGame, setSelectedGame] = useState<GameTitle | null>(null);

    const router = useRouter();

    const handleSelectGame = (game: GameTitle) => {
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
            case "Crossword":
                return router.push(`/crossword?difficulty=${difficulty}`);
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
            {
                selectedGame && (
                    <SelectGame 
                        visible={showSelectGame} 
                        title={selectedGame} 
                        close={handleCloseModal}
                        difficulties={gameDifficulties[selectedGame]}
                        selectGame={confirmSelectGame}
                    />
                )
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 8,
    },
});
