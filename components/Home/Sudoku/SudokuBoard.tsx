import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { View, Text } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, withSequence } from 'react-native-reanimated';

interface SudokuBoardProps {
    board: number[][],
    handleInputChange: (row: number, col: number, value: string) => void,
    selectedNumber: number | null,
    initialNumbers: { [key: string]: boolean },
    selectNumber: (value: number | null) => void,
}

// Animated number button component
interface AnimatedNumberButtonProps {
    value: number | string;
    onPress: () => void;
    backgroundColor: string;
    isBackspace?: boolean;
    text: string;
}

const AnimatedNumberButton: React.FC<AnimatedNumberButtonProps> = ({ value, onPress, backgroundColor, isBackspace, text }) => {
    const scale = useSharedValue(1);
    
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));
    
    const handlePressIn = () => {
        scale.value = withSpring(0.9, {
            damping: 15,
            stiffness: 150,
        });
    };
    
    const handlePressOut = () => {
        scale.value = withSpring(1, {
            damping: 15,
            stiffness: 150,
        });
    };
    
    return (
        <TouchableOpacity 
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={onPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            activeOpacity={0.8}
        >
            <Animated.View style={[styles.numberButton, { backgroundColor }, animatedStyle]}>
                {isBackspace ? (
                    <MaterialIcons name="backspace" size={20} color={text} />
                ) : (
                    <Text style={styles.numberButtonText}>{value}</Text>
                )}
            </Animated.View>
        </TouchableOpacity>
    );
};

// Animated cell component for number placement animation
interface AnimatedCellProps {
    value: number;
    rowIndex: number;
    colIndex: number;
    onPress: () => void;
    cellStyle: any[];
    isInitial: boolean;
}

const AnimatedCell: React.FC<AnimatedCellProps> = ({ value, rowIndex, colIndex, onPress, cellStyle, isInitial }) => {
    const scale = useSharedValue(value === 0 ? 1 : 0);
    const opacity = useSharedValue(value === 0 ? 1 : 0);
    
    useEffect(() => {
        if (value !== 0 && !isInitial) {
            // Animate number entry
            scale.value = withSpring(1, {
                damping: 10,
                stiffness: 100,
            });
            opacity.value = withTiming(1, { duration: 200 });
        }
    }, [value]);
    
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: opacity.value,
    }));
    
    return (
        <TouchableOpacity
            style={cellStyle}
            onPress={onPress}
        >
            {value === 0 ? (
                <Text style={styles.cellText}></Text>
            ) : (
                <Animated.View style={animatedStyle}>
                    <Text style={[styles.cellText, isInitial ? styles.initialCellText : styles.placedCellText]}>
                        {value}
                    </Text>
                </Animated.View>
            )}
        </TouchableOpacity>
    );
};

export default function SudokuBoard({ board, handleInputChange, selectedNumber, initialNumbers, selectNumber }: SudokuBoardProps) {
    const [selectedTile, setSelectedTile] = useState<{ row: number, col: number } | null>(null);

    const handleTilePress = (row: number, col: number) => {
        if (selectedTile) {
            // clear the selected tile
            if (selectedTile.row === row && selectedTile.col === col) {
                setSelectedTile(null);
                return;
            }
        }
        setSelectedTile({ row, col });
    };

    const handlePress = (value: number) => {
        selectNumber(value);
    };

    const { primary, text, secondary } = useTheme();

    useEffect(() => {
        if (selectedTile && selectedNumber !== null) {
            handleInputChange(selectedTile.row, selectedTile.col, selectedNumber.toString());
            setSelectedTile(null); // Deselect the tile after updating
            selectNumber(null); // Deselect the number after updating
        }
    }, [selectedNumber]);

    const getCellStyle = (rowIndex: number, colIndex: number) => {
        const style = [styles.cell, { borderColor: primary }];
        if (rowIndex % 3 === 0) style.push(styles.thickTopBorder);
        if (colIndex % 3 === 0) style.push(styles.thickLeftBorder);
        if (rowIndex === 8) style.push(styles.thickBottomBorder);
        if (colIndex === 8) style.push(styles.thickRightBorder);
        if (selectedTile?.row === rowIndex && selectedTile?.col === colIndex) {
            style.push({ backgroundColor: secondary });
        }
        return style;
    };

    return (
        <>
            <View style={[styles.container, { borderColor: primary }]}>
                {board.map((row: number[], rowIndex: number) => (
                    <View key={rowIndex} style={styles.row}>
                        {row.map((cell: number, colIndex: number) => (
                            <AnimatedCell
                                key={colIndex}
                                value={cell}
                                rowIndex={rowIndex}
                                colIndex={colIndex}
                                onPress={() => handleTilePress(rowIndex, colIndex)}
                                cellStyle={getCellStyle(rowIndex, colIndex)}
                                isInitial={initialNumbers[`${rowIndex}-${colIndex}`] || false}
                            />
                        ))}
                    </View>
                ))}
            </View>
            <View style={styles.numberContainer}>
                {[...Array(9)].map((_, index) => (
                    <AnimatedNumberButton
                        key={index}
                        value={index + 1}
                        onPress={() => handlePress(index + 1)}
                        backgroundColor={primary}
                        text={text}
                    />
                ))}
                <AnimatedNumberButton
                    value=""
                    onPress={() => handlePress(-1)}
                    backgroundColor={primary}
                    isBackspace
                    text={text}
                />
            </View>
        </>

    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderRadius: 2,
    },
    row: {
        flexDirection: 'row',
    },
    cell: {
        width: 40,
        height: 40,
        borderWidth: 1,
        borderColor: 'gold',
        textAlign: 'center',
        color: 'blue',
        justifyContent: 'center',
        alignItems: 'center',
    } as any,
    cellText: {
        textAlign: 'center',
        fontSize: 19,
    },
    initialCellText: {
        fontWeight: '800',
    },
    placedCellText: {
        opacity: 0.8,
    },
    numberContainer: {
        marginTop: '15%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
    },
    numberButton: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        marginVertical: 4,
        marginHorizontal: 2,
        borderRadius: 8,
    },
    thickTopBorder: {
        borderTopWidth: 3,
    },
    thickLeftBorder: {
        borderLeftWidth: 3,
    },
    thickBottomBorder: {
        borderBottomWidth: 3,
    },
    thickRightBorder: {
        borderRightWidth: 3,
    },
    numberButtonText: {
        fontSize: 16,
    },
});