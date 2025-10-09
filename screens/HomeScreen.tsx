import React, { useState, useContext } from "react";
import { StyleSheet } from "react-native";
import { ScrollView } from "@/components/Themed";
import GameSelector from "@/components/Home/GameSelector/GameSelector";
import SelectGame from "@/components/Modals/SelectGame";
import { useRouter } from "expo-router";
import { DBContext } from "@/contexts/DBContext";
import { GameTitle, Difficulty, Games } from "@/constants/Types";
import Difficulties from '@/constants/Difficulties';
import { FadeInView } from "@/components/animations";

export default function HomeScreen() {

    const [showSelectGame, setShowSelectGame] = useState(false);
    const [selectedGame, setSelectedGame] = useState<Games | null>(null);
    const { handleCurGame } = useContext(DBContext);

    const router = useRouter();

    const handleSelectGame = (game: Games) => {
        setSelectedGame(game);
        setShowSelectGame(true);
    };

    const handleCloseModal = () => {
        setShowSelectGame(false);
    };

    const confirmSelectGame = (title: string, difficulty: Difficulty) => {
        handleCloseModal();
        handleCurGame(title);
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
            case "2048":
                return router.push(`/2048?difficulty=${difficulty}`);
            case "Memory Match":
                return router.push(`/memorymatch?difficulty=${difficulty}`);
            case "Simon Says":
                return router.push(`/simonsays?difficulty=${difficulty}`);
            case "Connect Four":
                return router.push(`/connectfour?difficulty=${difficulty}`);
            case "DolphinDive":
                return router.push(`/dolphindive?difficulty=${difficulty}`);
            default:
                return "";
        }
    };

    return (
        <ScrollView style={styles.container}>
            <FadeInView duration={600}>
                <GameSelector
                    handleSelectGame={handleSelectGame}
                />
                {selectedGame && (
                    <SelectGame
                        visible={showSelectGame}
                        game={selectedGame}
                        close={handleCloseModal}
                        difficulties={Difficulties[selectedGame.title as GameTitle]}
                        selectGame={confirmSelectGame}
                    />
                )}
            </FadeInView>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 8,
    },
});
