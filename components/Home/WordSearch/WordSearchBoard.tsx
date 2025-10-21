import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { getStrikethroughStyle } from "@/utils/wordSearch";
import useTheme from "@/hooks/useTheme";
import AnimatedStrikethrough from "./AnimatedStrikethrough";

interface Cell {
    letter: string;
    selected: boolean;
    partOfWord: boolean;
    isFound: boolean;
    partOfFoundWord: boolean;
    wordDirection?: "horizontal" | "vertical" | "diagonal-right" | "diagonal-left";
    foundColor?: string;
    wordDirections?: Array<"horizontal" | "vertical" | "diagonal-right" | "diagonal-left">;
    foundColors?: string[];
}

interface WordSearchBoardProps {
    grid: Cell[][];
    handleCellPress: (row: number, col: number) => void;
}

const WordSearchBoard: React.FC<WordSearchBoardProps> = ({ grid, handleCellPress }) => {

    const { primary, text } = useTheme();

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
                            <Text style={[styles.letter, cell.partOfFoundWord && { color: cell.foundColor }, { color: cell.selected ? primary : text }]}>
                                {cell.letter}
                            </Text>
                            {cell.partOfFoundWord && cell.wordDirections && cell.foundColors && (
                                <>
                                    {cell.wordDirections.map((direction, index) => (
                                        <AnimatedStrikethrough
                                            key={index}
                                            direction={direction}
                                            color={cell.foundColors?.[index] || "#4CAF50"}
                                            delay={index * 200}
                                        />
                                    ))}
                                </>
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