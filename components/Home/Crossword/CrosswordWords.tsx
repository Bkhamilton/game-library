import React from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View, ScrollView } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';

type PlacedWord = {
    word: string;
    startPosition: {
        row: number;
        col: number;
        direction: 'horizontal' | 'vertical';
    }
    clue: string;
}

interface CrosswordWordsProps {
    wordsToFind: PlacedWord[];
    guessedWords: PlacedWord[];
    onCluePress?: (word: PlacedWord) => void;
}

export default function CrosswordWords({ 
    wordsToFind, 
    guessedWords,
    onCluePress 
}: CrosswordWordsProps) {
    const { primary, secondary, text } = useTheme();
    
    const isWordGuessed = (word: PlacedWord) => {
        return guessedWords.some(guessedWord => guessedWord.word === word.word);
    };

    const handleCluePress = (word: PlacedWord) => {
        if (onCluePress && !isWordGuessed(word)) {
            onCluePress(word);
        }
    };

    return (
        <ScrollView 
            style={styles.container}
            contentContainerStyle={styles.scrollContent}
        >
            {wordsToFind.map((word, index) => {
                const isGuessed = isWordGuessed(word);
                
                return (
                    <TouchableOpacity
                        key={index}
                        onPress={() => handleCluePress(word)}
                        style={[
                            styles.wordContainer,
                            { 
                                backgroundColor: isGuessed ? 'rgba(0,0,0,0.05)' : 'transparent',
                                borderLeftWidth: 3,
                                borderLeftColor: isGuessed ? primary : 'transparent'
                            }
                        ]}
                    >
                        <View style={styles.clueContainer}>
                            <Text style={styles.indexText}>{index + 1}.</Text>
                            {isGuessed ? (
                                <View style={styles.guessedContainer}>
                                    <Text style={[styles.clueText, styles.strikethrough]}>
                                        {word.clue}
                                    </Text>
                                    <Text style={styles.wordText}>
                                        {word.word.toUpperCase()}
                                    </Text>
                                </View>
                            ) : (
                                <Text style={styles.clueText}>
                                    {word.clue}
                                </Text>
                            )}
                        </View>
                    </TouchableOpacity>
                );
            })}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        paddingHorizontal: 10,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    wordContainer: {
        marginVertical: 6,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 4,
    },
    clueContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    indexText: {
        fontWeight: 'bold',
        marginRight: 6,
        minWidth: 24,
    },
    clueText: {
        flex: 1,
        fontSize: 14,
    },
    wordText: {
        fontSize: 12,
        marginTop: 4,
        color: '#666',
        fontStyle: 'italic',
    },
    guessedContainer: {
        flex: 1,
    },
    strikethrough: {
        textDecorationLine: 'line-through',
        color: '#888',
    },
});