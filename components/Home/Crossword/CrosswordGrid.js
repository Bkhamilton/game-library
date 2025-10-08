import React, { useState, useEffect } from 'react';
import { StyleSheet, Modal, TextInput } from 'react-native';
import { Text, View, Pressable, ScrollView } from '@/components/Themed';
import { MonoText } from '@/components/StyledText';
import useTheme from '@/hooks/useTheme';

export default function CrosswordGrid({ 
    grid, 
    placedWords, 
    guessedWords, 
    activeCell, 
    onCellPress, 
    onGuessSubmit 
}) {
    const { primary, grayBackground, grayBorder, background, text } = useTheme();
    const [currentGuess, setCurrentGuess] = useState('');
    const [showInputModal, setShowInputModal] = useState(false);

    useEffect(() => {
        setShowInputModal(activeCell !== null);
        setCurrentGuess('');
    }, [activeCell]);

    const getStartingPositionIndex = (row, col) => {
        return placedWords.findIndex(({ startPosition }) => 
            startPosition.row === row && startPosition.col === col
        );
    };

    const isCellInGuessedWord = (row, col) => {
        return guessedWords.some(word => {
            const { row: startRow, col: startCol, direction } = word.startPosition;
            const wordLength = word.word.length;
            
            if (direction === 'horizontal') {
                return row === startRow && 
                       col >= startCol && 
                       col < startCol + wordLength;
            } else {
                return col === startCol && 
                       row >= startRow && 
                       row < startRow + wordLength;
            }
        });
    };

    const getCellValue = (row, col) => {
        if (isCellInGuessedWord(row, col)) {
            // Find the word this cell belongs to
            const word = guessedWords.find(w => {
                const { row: startRow, col: startCol, direction } = w.startPosition;
                if (direction === 'horizontal') {
                    return row === startRow && col >= startCol && col < startCol + w.word.length;
                } else {
                    return col === startCol && row >= startRow && row < startRow + w.word.length;
                }
            });
            
            if (word) {
                const index = word.startPosition.direction === 'horizontal' 
                    ? col - word.startPosition.col 
                    : row - word.startPosition.row;
                return word.word[index]?.toUpperCase() || '';
            }
        }
        return '';
    };

    const handleSubmit = () => {
        if (currentGuess && activeCell) {
            onGuessSubmit(currentGuess);
        }
        setShowInputModal(false);
    };

    const handleCellPress = (rowIndex, colIndex, cell, isGuessed) => {
        if (cell !== '' && !isGuessed) {
            onCellPress(rowIndex, colIndex);
        }
    };

    return (
        <View style={styles.gridContainer}>
            {grid.map((row, rowIndex) => (
                <View key={rowIndex} style={styles.row}>
                    {row.map((cell, colIndex) => {
                        const startIndex = getStartingPositionIndex(rowIndex, colIndex);
                        const isActive = activeCell?.row === rowIndex && activeCell?.col === colIndex;
                        const isGuessed = isCellInGuessedWord(rowIndex, colIndex);
                        const cellValue = getCellValue(rowIndex, colIndex);

                        return (
                            <Pressable
                                key={colIndex}
                                onPress={() => handleCellPress(rowIndex, colIndex, cell, isGuessed)}
                                style={[
                                    styles.cell,
                                    { 
                                        backgroundColor: cell === '' ? '#000' : isGuessed ? '#E8F5E9' : '#FFF',
                                        borderColor: isActive ? primary : cell === '' ? '#000' : '#DDD',
                                        borderWidth: isActive ? 2 : 1,
                                    }
                                ]}
                            >
                                <Text style={[styles.cellNumber, { color: primary }]}>
                                    {startIndex !== -1 ? startIndex + 1 : ''}
                                </Text>
                                <MonoText style={styles.cellText}>
                                    {cellValue}
                                </MonoText>
                            </Pressable>
                        );
                    })}
                </View>
            ))}

            {/* Input Modal */}
            <Modal
                visible={showInputModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowInputModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Enter Your Guess</Text>
                        <TextInput
                            style={styles.input}
                            value={currentGuess}
                            onChangeText={setCurrentGuess}
                            autoFocus={true}
                            autoCapitalize="characters"
                            maxLength={20}
                            placeholder="Type your guess..."
                            onSubmitEditing={handleSubmit}
                        />
                        <View style={styles.buttonContainer}>
                            <Pressable 
                                style={[styles.button, styles.cancelButton]}
                                onPress={() => setShowInputModal(false)}
                            >
                                <Text style={styles.buttonText}>Cancel</Text>
                            </Pressable>
                            <Pressable 
                                style={[styles.button, styles.submitButton]}
                                onPress={handleSubmit}
                            >
                                <Text style={styles.buttonText}>Submit</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    gridContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    row: {
        flexDirection: 'row',
    },
    cell: {
        width: 32,
        height: 32,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    cellNumber: {
        position: 'absolute',
        top: 1,
        left: 2,
        fontSize: 8,
    },
    cellText: {
        fontSize: 18,
        color: '#000',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: '80%',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    input: {
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderColor: '#DDD',
        backgroundColor: '#FFF',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 15,
        fontSize: 18,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    button: {
        padding: 10,
        borderRadius: 5,
        minWidth: 100,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#E0E0E0',
    },
    submitButton: {
        backgroundColor: '#4CAF50',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});