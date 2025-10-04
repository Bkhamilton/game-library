import React, { useContext } from "react";
import { Image, StyleSheet, TouchableOpacity, ImageBackground } from "react-native";
import { View, Text } from "@/components/Themed";
import useTheme from "@/hooks/useTheme";
import { DBContext } from "@/contexts/DBContext";
import { Games } from "@/constants/Types";
import { GameLogos } from "@/constants/GameLogos";

interface GameSelectorProps {
    handleSelectGame: (game: Games) => void;
}

const GameSelector: React.FC<GameSelectorProps> = ({ handleSelectGame }) => {
    const { grayBackground, grayBorder, text, background } = useTheme();

    const { games } = useContext(DBContext);

    const handleGamePress = (title: Games) => {
        handleSelectGame(title);
    };

    return (
        <View style={styles.gameContainer}>
            {games.map((game, index) => (
                <View key={index} style={styles.gameItem}>
                    <TouchableOpacity 
                        onPress={() => handleGamePress(game)}
                        activeOpacity={0.8}
                        style={[
                            styles.gameCard,
                            { 
                                backgroundColor: grayBackground,
                                borderColor: grayBorder,
                            }
                        ]}
                    >
                        <ImageBackground 
                            source={GameLogos[game.title as keyof typeof GameLogos]} 
                            style={styles.gameImageBackground}
                            imageStyle={styles.gameImage}
                        >
                            <View style={[styles.gradientOverlay, { backgroundColor: `${background}CC` }]} />
                            <View style={styles.gameInfo}>
                                <Text style={[styles.gameTitle, { color: text }]}>{game.title}</Text>
                                <Text style={[styles.gameDescription, { color: text }]} numberOfLines={2}>
                                    {game.description}
                                </Text>
                            </View>
                        </ImageBackground>
                    </TouchableOpacity>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    gameContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        paddingHorizontal: 12,
        paddingTop: 8,
    },
    gameItem: {
        width: "48%",
        marginBottom: 16,
    },
    gameCard: {
        borderRadius: 12,
        overflow: "hidden",
        borderWidth: 1,
        elevation: 4, // Android shadow
        shadowColor: "#000", // iOS shadow
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    gameImageBackground: {
        width: "100%",
        height: 180,
        justifyContent: "flex-end",
    },
    gameImage: {
        borderRadius: 12,
        resizeMode: "cover",
    },
    gradientOverlay: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.6,
    },
    gameInfo: {
        padding: 12,
        backgroundColor: "transparent",
    },
    gameTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 4,
    },
    gameDescription: {
        fontSize: 12,
        opacity: 0.8,
    },
});

export default GameSelector;
