import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';

interface WordSearchWordsProps {
    wordBank: string[];
    foundWords: string[];
    wordColors: { [key: string]: string };
}

export default function WordSearchWords({ wordBank, foundWords, wordColors }: WordSearchWordsProps) {
    return (
        <View style={styles.container}>
            {wordBank.map((word) => (
                <Text
                    key={word}
                    style={[
                        styles.word,
                        foundWords.includes(word) && {
                            ...styles.foundWord,
                            color: wordColors[word] || "green",
                        },
                    ]}
                >
                    {word}
                </Text>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        flexWrap: "wrap",
        padding: 10,
        justifyContent: 'center',
    },
    word: {
        fontSize: 18,
        marginVertical: 5,
        marginHorizontal: 5,
    },
    foundWord: {
        textDecorationLine: "line-through",
        color: "green",
    },
});