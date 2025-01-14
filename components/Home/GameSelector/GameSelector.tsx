import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import useTheme from '@/hooks/useTheme';

interface GameSelectorProps {
    gameTitles: string[];
}

const GameSelector: React.FC<GameSelectorProps> = ({ gameTitles }) => {

    const { text, grayBackground } = useTheme();

    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
            {gameTitles.map((title, index) => (
                <View key={index} style={styles.gameItem}>
                    <View style={[styles.gameIcon, { backgroundColor: grayBackground }]} />
                    <Text style={[styles.gameTitle, { color: text }]}>{title}</Text>
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
        alignItems: 'center',
        marginHorizontal: 10,
    },
    gameIcon: {
        width: 100,
        height: 100,
        borderRadius: 10,
        marginBottom: 5,
    },
    gameTitle: {
        textAlign: 'center',
    },
});

export default GameSelector;