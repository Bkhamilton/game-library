import React, { useContext } from "react";
import { Image, StyleSheet, TouchableOpacity } from "react-native";
import { View, Text } from "@/components/Themed";
import useTheme from "@/hooks/useTheme";
import { DBContext } from "@/contexts/DBContext";
import { Games } from "@/constants/Types";
import { GameLogos } from "@/constants/Types";

interface GameSelectorProps {
    handleSelectGame: (game: Games) => void;
}

const GameSelector: React.FC<GameSelectorProps> = ({ handleSelectGame }) => {
    const { grayBackground } = useTheme();

    const { games } = useContext(DBContext);

    const handleGamePress = (title: Games) => {
        handleSelectGame(title);
    };

    return (
        <View style={styles.gameContainer}>
            {games.map((game, index) => (
                <View key={index} style={styles.gameItem}>
                    <TouchableOpacity onPress={() => handleGamePress(game)}>
                        <View style={[styles.gameIcon, { backgroundColor: grayBackground }]}>
                            <Image source={GameLogos[game.title as keyof typeof GameLogos]} style={styles.gameLogo} />
                        </View>
                        <Text style={styles.gameTitle}>{game.title}</Text>
                    </TouchableOpacity>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    scrollViewContent: {
        paddingVertical: 10,
        paddingHorizontal: 10,
    },
    gameLogo: {
        height: 100,
        width: 100,
        borderRadius: 8,
    },
    gameContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    gameItem: {
        width: "48%", // Adjust the width to fit two items per row with some spacing
        alignItems: "center",
        marginVertical: 10,
    },
    gameIcon: {
        width: 100,
        height: 100,
        borderRadius: 10,
    },
    gameTitle: {
        marginTop: 10,
        fontSize: 16,
        textAlign: "center",
    },
});

export default GameSelector;
