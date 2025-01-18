import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { View, Text } from "@/components/Themed";
import useTheme from "@/hooks/useTheme";

interface GameSelectorProps {
    gameTitles: string[];
    handleSelectGame: (game: string) => void;
}

const GameSelector: React.FC<GameSelectorProps> = ({ gameTitles, handleSelectGame }) => {
    const { grayBackground } = useTheme();

    const handleGamePress = (title: string) => {
        handleSelectGame(title);
    };

    return (
        <View style={styles.gameContainer}>
            {gameTitles.map((title, index) => (
                <View key={index} style={styles.gameItem}>
                    <TouchableOpacity onPress={() => handleGamePress(title)}>
                        <View
                            style={[styles.gameIcon, { backgroundColor: grayBackground }]}
                        />
                        <Text style={styles.gameTitle}>{title}</Text>
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
    gameContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    gameItem: {
        width: '48%', // Adjust the width to fit two items per row with some spacing
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
        textAlign: 'center',
    },
});

export default GameSelector;