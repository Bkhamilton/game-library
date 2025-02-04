import React, { useState, useEffect } from "react";
import { StyleSheet, TouchableOpacity, Animated, Dimensions, Easing } from "react-native";
import { View, Text } from "@/components/Themed";
import { useLocalSearchParams } from "expo-router";

const DIFFICULTY_SETTINGS = {
    Easy: { obstacleSpeed: 2000, minSpawnRate: 1500, maxSpawnRate: 2500 },
    Medium: { obstacleSpeed: 1500, minSpawnRate: 1000, maxSpawnRate: 2000 },
    Hard: { obstacleSpeed: 1000, minSpawnRate: 1000, maxSpawnRate: 1500 },
};

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
const groundLevel = screenHeight - 250; // Adjusted ground level to be at the bottom of the screen
const jumpVelocity = -15; // Negative value to make the ostrich jump upwards

export default function OstrichHaulGame() {
    const { difficulty } = useLocalSearchParams();
    const [ostrichY, setOstrichY] = useState(new Animated.Value(groundLevel - 10)); // Start at the top of the screen
    const [ostrichX, setOstrichX] = useState(new Animated.Value(15)); // Initial horizontal position
    const [velocity, setVelocity] = useState(0);
    const [obstacles, setObstacles] = useState([]);
    const [isGameRunning, setIsGameRunning] = useState(false);
    const [score, setScore] = useState(0);
    const [isJumping, setIsJumping] = useState(false); // Track if the ostrich is jumping
    const [gravity, setGravity] = useState(1);

    const settings = DIFFICULTY_SETTINGS[difficulty || "Easy"];

    const checkCollision = (obstacle) => {
        const ostrichTop = ostrichY.__getValue();
        const ostrichBottom = ostrichTop + 50; // Ostrich height
        const ostrichLeft = ostrichX.__getValue();
        const ostrichRight = ostrichLeft + 50; // Ostrich width
        const obstacleLeft = obstacle.x.__getValue();
        const obstacleRight = obstacleLeft + 50; // Obstacle width
        const obstacleTop = obstacle.gapTop;
        const obstacleBottom = groundLevel;

        if (
            ostrichRight > obstacleLeft &&
            ostrichLeft < obstacleRight &&
            (ostrichTop < obstacleTop || ostrichBottom > obstacleBottom)
        ) {
            return true;
        }
        return false;
    };

    useEffect(() => {
        if (isGameRunning) {
            const gameLoop = setInterval(() => {
                setVelocity((prevVelocity) => prevVelocity + gravity);
                setOstrichY((prevOstrichY) => {
                    const newY = prevOstrichY.__getValue() + velocity;
                    if (newY >= groundLevel) {
                        setVelocity(0);
                        setIsJumping(false); // Ostrich has landed, so it's no longer jumping
                        return new Animated.Value(groundLevel);
                    }
                    return new Animated.Value(Math.max(newY, 0)); // Ensure the ostrich doesn't go above the top of the screen
                });

                // Check for collisions with obstacles
                obstacles.forEach((obstacle, index) => {
                    if (checkCollision(obstacle)) {
                        setIsGameRunning(false);
                    } else if (ostrichX.__getValue() > obstacle.x.__getValue() + 50) {
                        // Ostrich has passed the obstacle, update the score
                        setScore((prevScore) => prevScore + 1);
                        // Remove the obstacle from the array to avoid counting it again
                        setObstacles((prevObstacles) => prevObstacles.filter((_, i) => i !== index));
                    }
                });
            }, 1000 / 120); // 60 FPS

            return () => clearInterval(gameLoop);
        }
    }, [isGameRunning, velocity, obstacles]);

    useEffect(() => {
        if (isGameRunning) {
            let spawnTimeout;

            const spawnObstacle = () => {
                const newObstacle = {
                    key: Math.random().toString(),
                    x: new Animated.Value(screenWidth),
                };
                setObstacles((prevObstacles) => [...prevObstacles, newObstacle]);

                Animated.timing(newObstacle.x, {
                    toValue: -50,
                    duration: settings.obstacleSpeed,
                    easing: Easing.linear,
                    useNativeDriver: false,
                }).start(({ finished }) => {
                    if (finished) {
                        setObstacles((prevObstacles) =>
                        prevObstacles.filter((obstacle) => obstacle.key !== newObstacle.key)
                        );
                    }
                });

                // Schedule the next obstacle spawn with a random delay
                const randomSpawnRate = Math.random() * (settings.maxSpawnRate - settings.minSpawnRate) + settings.minSpawnRate;
                spawnTimeout = setTimeout(spawnObstacle, randomSpawnRate);
            };

            // Start the first obstacle spawn
            spawnObstacle();

            return () => clearTimeout(spawnTimeout);
        }
    }, [isGameRunning]);

    useEffect(() => {
        // Reduce ostrich gravity temporarily when jumping and velocity is in between 5 and -5
        if (isJumping && velocity > -5 && velocity < 5) {
            setGravity(0.2);
        } else {
            setGravity(1);
        }
    }, [isJumping, velocity]);

    const startGame = () => {
        setIsGameRunning(true);
        setOstrichY(new Animated.Value(groundLevel - 10)); // Start at the top of the screen
        setVelocity(0);
        setObstacles([]);
        setScore(0);
        setIsJumping(false); // Reset jumping state when the game starts
    };
    
    const jump = () => {
        if (!isJumping) {
            setVelocity(jumpVelocity);
            setIsJumping(true); // Set jumping state to true when the ostrich jumps
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.score}>Score: {score}</Text>
            <View style={styles.sky} />
            <View style={styles.ground} />
            <TouchableOpacity style={styles.screen} onPress={jump} activeOpacity={1}>
                <Animated.View style={[styles.ostrich, { top: ostrichY, left: ostrichX }]} />
                {obstacles.map((obstacle) => (
                    <React.Fragment key={obstacle.key}>
                        <Animated.View
                            style={[
                                styles.obstacle,
                                {
                                left: obstacle.x,
                                height: 50,
                                top: groundLevel,
                                },
                            ]}
                        />
                    </React.Fragment>
                ))}
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
  obstacle: {
    position: "absolute",
    width: 50,
    backgroundColor: "#228B22",
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