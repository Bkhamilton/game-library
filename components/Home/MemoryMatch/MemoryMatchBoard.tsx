import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { View, Text } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';
import { Card, getBoardSize } from '@/utils/MemoryMatchGenerator';

interface MemoryMatchBoardProps {
    cards: Card[];
    onCardPress: (index: number) => void;
    difficulty: string;
}

export default function MemoryMatchBoard({ cards, onCardPress, difficulty }: MemoryMatchBoardProps) {
    const { primary, secondary, text } = useTheme();
    const { rows, cols } = getBoardSize(difficulty);
    
    // Calculate card size based on board dimensions
    const getCardSize = () => {
        const boardWidth = 360; // Max board width
        const spacing = 8;
        const totalSpacing = spacing * (cols + 1);
        const availableWidth = boardWidth - totalSpacing;
        return Math.floor(availableWidth / cols);
    };
    
    const cardSize = getCardSize();
    
    // Group cards into rows
    const groupedCards: Card[][] = [];
    for (let i = 0; i < cards.length; i += cols) {
        groupedCards.push(cards.slice(i, i + cols));
    }
    
    return (
        <View style={styles.container}>
            {groupedCards.map((row, rowIndex) => (
                <View key={rowIndex} style={styles.row}>
                    {row.map((card, colIndex) => {
                        const cardIndex = rowIndex * cols + colIndex;
                        const isFlipped = card.isFlipped || card.isMatched;
                        
                        return (
                            <TouchableOpacity
                                key={card.id}
                                style={[
                                    styles.card,
                                    {
                                        width: cardSize,
                                        height: cardSize,
                                        backgroundColor: isFlipped 
                                            ? (card.isMatched ? secondary : primary)
                                            : '#2c3e50',
                                        borderColor: primary,
                                    }
                                ]}
                                onPress={() => !card.isMatched && !card.isFlipped && onCardPress(cardIndex)}
                                disabled={card.isMatched || card.isFlipped}
                            >
                                <Text style={[
                                    styles.cardText,
                                    { 
                                        fontSize: cardSize * 0.5,
                                        color: isFlipped ? text : 'transparent'
                                    }
                                ]}>
                                    {isFlipped ? card.value : '?'}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
    },
    row: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 8,
    },
    card: {
        borderRadius: 8,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    cardText: {
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
