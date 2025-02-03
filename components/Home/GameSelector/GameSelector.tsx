import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { View, Text } from "@/components/Themed";
import useTheme from "@/hooks/useTheme";

import { Games } from "@/constants/Types";

interface GameSelectorProps {
    games: Games[];
    handleSelectGame: (game: Games) => void;
}

const GameSelector: React.FC<GameSelectorProps> = ({
    games,
    handleSelectGame,
}) => {
    const { grayBackground } = useTheme();

    const handleGamePress = (title: Games) => {
        handleSelectGame(title);
    };

    return (
        <View style={styles.gameContainer}>
            {
                games.map((game, index) => (
                    <View key={index} style={styles.gameItem}>
                        <TouchableOpacity onPress={() => handleGamePress(game)}>
                            <View
                                style={[styles.gameIcon, { backgroundColor: grayBackground }]}
                            />
                            <Text style={styles.gameTitle}>{game.title}</Text>
                        </TouchableOpacity>
                    </View>
                ))
            }
        </View>
    );
};

const styles = StyleSheet.create({
    scrollViewContent: {
        paddingVertical: 10,
        paddingHorizontal: 10,
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
