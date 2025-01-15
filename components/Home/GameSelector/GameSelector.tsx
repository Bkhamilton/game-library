import React from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import useTheme from "@/hooks/useTheme";
import { Link, useRouter } from "expo-router";

interface GameSelectorProps {
  gameTitles: string[];
}

const GameSelector: React.FC<GameSelectorProps> = ({ gameTitles }) => {
  const { text, grayBackground } = useTheme();

  const router = useRouter();

  const handleGamePress = (title: string) => {
    switch (title) {
      case "Sudoku":
        return router.push("/sudoku");
      case "Dino Run":
        return router.push("/dinorun");
      case "Word Search":
        return router.push("/wordSearch");
      default:
        return "";
    }
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scrollView}
    >
      {gameTitles.map((title, index) => (
        <View key={index} style={styles.gameItem}>
          <TouchableOpacity onPress={() => handleGamePress(title)}>
            <View
              style={[styles.gameIcon, { backgroundColor: grayBackground }]}
            />
            <Text style={[styles.gameTitle, { color: text }]}>{title}</Text>
          </TouchableOpacity>
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
    alignItems: "center",
    marginHorizontal: 10,
  },
  gameIcon: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 5,
  },
  gameTitle: {
    textAlign: "center",
  },
});

export default GameSelector;
