import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import { View, Text } from "@/components/Themed";
import { useLocalSearchParams } from "expo-router";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
const groundLevel = screenHeight - 250; // Adjusted ground level to be at the bottom of the screen
const gravity = 1;
const jumpVelocity = -15; // Negative value to make the ostrich jump upwards

export default function OstrichHaulGame() {
  const { difficulty } = useLocalSearchParams();
  const [ostrichY, setOstrichY] = useState(new Animated.Value(0)); // Start at the top of the screen
  const [velocity, setVelocity] = useState(0);
  const [isGameRunning, setIsGameRunning] = useState(false);

  useEffect(() => {
    if (isGameRunning) {
      const gameLoop = setInterval(() => {
        setVelocity((prevVelocity) => prevVelocity + gravity);
        setOstrichY((prevOstrichY) => {
          const newY = prevOstrichY.__getValue() + velocity;
          if (newY >= groundLevel) {
            setVelocity(0);
            return new Animated.Value(groundLevel);
          }
          return new Animated.Value(Math.max(newY, 0)); // Ensure the ostrich doesn't go above the top of the screen
        });
      }, 30);

      return () => clearInterval(gameLoop);
    }
  }, [isGameRunning, velocity]);

  const startGame = () => {
    setIsGameRunning(true);
    setOstrichY(new Animated.Value(0)); // Start at the top of the screen
    setVelocity(0);
  };

  const jump = () => {
    setVelocity(jumpVelocity);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.score}>Ostrich Haul</Text>
      <View style={styles.sky} />
      <View style={styles.ground} />
      <TouchableOpacity style={styles.screen} onPress={jump} activeOpacity={1}>
        <Animated.View style={[styles.ostrich, { top: ostrichY }]} />
      </TouchableOpacity>
      {!isGameRunning && (
        <TouchableOpacity style={styles.startButton} onPress={startGame}>
          <Text style={styles.startText}>Start</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#87CEEB",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  sky: {
    position: "absolute",
    width: "100%",
    height: "70%",
    backgroundColor: "#87CEEB",
  },
  ground: {
    position: "absolute",
    width: "100%",
    top: screenHeight - 200,
    backgroundColor: "#8B4513",
    bottom: 0,
  },
  screen: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  ostrich: {
    position: "absolute",
    width: 50,
    height: 50,
    backgroundColor: "black",
  },
  score: {
    position: "absolute",
    top: 50,
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  startButton: {
    position: "absolute",
    bottom: 100,
    padding: 20,
    backgroundColor: "green",
    borderRadius: 10,
  },
  startText: {
    fontSize: 24,
    color: "white",
  },
});
