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
        <ScrollView
            showsHorizontalScrollIndicator={false}
            style={styles.scrollView}
        >
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
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollView: {
        paddingVertical: 10,
    },
    gameItem: {
        alignItems: "center",
        marginHorizontal: 10,
    },
    gameIcon: {
        width: 100,
        height: 100,
        borderRadius: 10,
        marginBottom: 5,
    },
    gameTitle: {
        textAlign: "center",
    },
});

export default GameSelector;
