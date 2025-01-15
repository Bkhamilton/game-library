import React from "react";
import { StyleSheet } from "react-native";
import { Text, View } from "@/components/Themed";
import SudokuGame from "./Sudoku/SudokuGame";
import DinoGame from "./DinoRun/DinoRunGame";
import WordSearchGame from "./WordSearch/WordSearchGame";
import GameSelector from "./GameSelector/GameSelector";

export default function HomeScreen() {
  const gameTitles = ["Sudoku", "Dino Run", "Word Search"];

  return (
    <View style={styles.container}>
      <View>
        <Text style={{ fontSize: 16 }}>Games</Text>
        <GameSelector gameTitles={gameTitles} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 8,
  },
});
