import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { getStrikethroughStyle } from "@/utils/wordSearch";
import useTheme from "@/hooks/useTheme";

interface Cell {
    letter: string;
    selected: boolean;
    partOfWord: boolean;
    isFound: boolean;
    partOfFoundWord: boolean;
    wordDirection?: "horizontal" | "vertical" | "diagonal-right" | "diagonal-left";
    foundColor?: string;
}

interface WordSearchBoardProps {
    grid: Cell[][];
    handleCellPress: (row: number, col: number) => void;
}

const WordSearchBoard: React.FC<WordSearchBoardProps> = ({ grid, handleCellPress }) => {

    const { primary } = useTheme();

    return (
        <View style={[styles.grid, { borderWidth: 5, borderColor: primary }]}>
            {grid.map((row, i) => (
                <View key={i} style={[styles.row, { borderWidth: 1, borderColor: primary }]}>
                    {row.map((cell, j) => (
                        <TouchableOpacity
                            key={`${i}-${j}`}
                            style={[
                                styles.cell,
                                { borderWidth: 1, borderColor: primary },
                                cell.selected && styles.selectedCell,
                                cell.isFound && { backgroundColor: cell.foundColor + "40" }, // 40 adds transparency
                            ]}
                            onPress={() => handleCellPress(i, j)}
                        >
                            <Text style={[styles.letter, cell.partOfFoundWord && { color: cell.foundColor }]}>
                                {cell.letter}
                            </Text>
                            {cell.partOfFoundWord && (
                                <View style={getStrikethroughStyle(cell.wordDirection, cell.foundColor)} />
                            )}
                        </TouchableOpacity>
                    ))}
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    grid: {
        alignItems: "center",
        justifyContent: "center",
    },
    row: {
        flexDirection: "row",
    },
    cell: {
        width: 40,
        height: 40,
        borderWidth: 1,
        borderColor: "#ccc",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
    },
    selectedCell: {
        backgroundColor: "#e6e6e6",
    },
    letter: {
        fontSize: 20,
        fontWeight: "bold",
    },
});

export default WordSearchBoard;