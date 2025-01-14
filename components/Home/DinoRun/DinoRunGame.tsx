import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';

const DinoRunGame: React.FC = () => {
  const [isJumping, setIsJumping] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const dinoY = useRef(new Animated.Value(0)).current;
  const cactusX = useRef(new Animated.Value(0)).current;
  const gameInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleJump = () => {
      if (!isJumping) {
        setIsJumping(true);
        Animated.timing(dinoY, {
          toValue: -100,
          duration: 300,
          useNativeDriver: true,
          easing: Easing.linear,
        }).start(() => {
          Animated.timing(dinoY, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
            easing: Easing.linear,
          }).start(() => setIsJumping(false));
        });
      }
    };

    const interval = setInterval(() => {
      setScore((prevScore) => prevScore + 1);
      checkCollision();
    }, 100);

    gameInterval.current = interval;

    return () => {
      clearInterval(interval);
    };
  }, [isJumping]);

  useEffect(() => {
    if (!isGameOver) {
      Animated.loop(
        Animated.timing(cactusX, {
          toValue: -300,
          duration: 2000,
          useNativeDriver: true,
          easing: Easing.linear,
        })
      ).start();
    } else {
      cactusX.stopAnimation();
    }
  }, [isGameOver]);

  const checkCollision = () => {
    // Simplified collision detection
    if (dinoY._value === 0 && cactusX._value < 50 && cactusX._value > 0) {
      setIsGameOver(true);
      if (gameInterval.current) {
        clearInterval(gameInterval.current);
      }
    }
  };

  const restartGame = () => {
    setIsGameOver(false);
    setScore(0);
    cactusX.setValue(0);
  };

  return (
    <View style={styles.gameContainer}>
      <Animated.View style={[styles.dino, { transform: [{ translateY: dinoY }] }]} />
      <Animated.View style={[styles.cactus, { transform: [{ translateX: cactusX }] }]} />
      {isGameOver && (
        <View style={styles.gameOver}>
          <Text>Game Over</Text>
          <TouchableOpacity onPress={restartGame}>
            <Text>Restart</Text>
          </TouchableOpacity>
        </View>
      )}
      <Text style={styles.score}>Score: {score}</Text>
      <TouchableOpacity style={styles.jumpButton} onPress={() => handleJump()}>
        <Text>Jump</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  gameContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
  },
  dino: {
    position: 'absolute',
    bottom: 0,
    left: 50,
    width: 50,
    height: 50,
    backgroundColor: '#000',
  },
  cactus: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 20,
    height: 50,
    backgroundColor: '#000',
  },
  gameOver: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    textAlign: 'center',
  },
  score: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  jumpButton: {
    position: 'absolute',
    bottom: 50,
    padding: 10,
    backgroundColor: '#ccc',
    borderRadius: 5,
  },
});

export default DinoRunGame;