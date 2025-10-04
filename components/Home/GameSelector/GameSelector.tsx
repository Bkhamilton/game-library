import React, { useContext } from "react";
import { Image, StyleSheet, TouchableOpacity, ImageBackground, Dimensions } from "react-native";
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
    
    const screenWidth = Dimensions.get('window').width;
    // Use 3 columns for wider screens (tablets), 2 for mobile
    const columns = screenWidth > 600 ? 3 : 2;
    const itemWidth = columns === 3 ? "31%" : "48%";

    const handleGamePress = (title: Games) => {
        handleSelectGame(title);
    };

    return (
        <View style={styles.gameContainer}>
            {games.map((game, index) => (
                <View key={index} style={[styles.gameItem, { width: itemWidth }]}>
                    <TouchableOpacity 
                        onPress={() => handleGamePress(game)}
                        activeOpacity={0.7}
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
        paddingHorizontal: 16,
        paddingTop: 12,
    },
    gameItem: {
        marginBottom: 20,
    },
    gameCard: {
        borderRadius: 16,
        overflow: "hidden",
        borderWidth: 1.5,
        elevation: 6, // Android shadow
        shadowColor: "#000", // iOS shadow
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
    },
    gameImageBackground: {
        width: "100%",
        height: 200,
        justifyContent: "flex-end",
    },
    gameImage: {
        borderRadius: 16,
        resizeMode: "cover",
    },
    gradientOverlay: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.65,
    },
    gameInfo: {
        padding: 14,
        backgroundColor: "transparent",
    },
    gameTitle: {
        fontSize: 19,
        fontWeight: "bold",
        marginBottom: 6,
        letterSpacing: 0.3,
    },
    gameDescription: {
        fontSize: 13,
        opacity: 0.85,
        lineHeight: 18,
    },
});

export default GameSelector;
