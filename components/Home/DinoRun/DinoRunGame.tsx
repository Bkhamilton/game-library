import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Animated, TouchableWithoutFeedback, StyleSheet } from 'react-native';

const GRAVITY = 1.5;
const JUMP_FORCE = -15;
const GROUND_HEIGHT = 50;

export default function DinoGame() {
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const dinoY = useRef(new Animated.Value(0)).current;
  const velocity = useRef(0);
  const obstacleX = useRef(new Animated.Value(400)).current;
  const gameLoop = useRef(null);

  useEffect(() => {
    startGame();
    return () => cancelAnimationFrame(gameLoop.current);
  }, []);

  const startGame = () => {
    gameLoop.current = requestAnimationFrame(update);
  };

  const update = () => {
    // Apply gravity
    velocity.current += GRAVITY;
    let newY = dinoY._value + velocity.current;

    // Ground collision
    if (newY > 0) {
      newY = 0;
      velocity.current = 0;
    }

    dinoY.setValue(newY);
    
    // Move obstacle
    obstacleX.setValue(obstacleX._value - 5);
    if (obstacleX._value < -50) {
      obstacleX.setValue(400);
      setScore(prev => prev + 1);
    }

    // Collision detection
    if (checkCollision()) {
      setGameOver(true);
      cancelAnimationFrame(gameLoop.current);
      return;
    }

    gameLoop.current = requestAnimationFrame(update);
  };

  const jump = () => {
    if (dinoY._value === 0) {
      velocity.current = JUMP_FORCE;
    }
  };

  const checkCollision = () => {
    const dinoBox = {
      left: 50,
      right: 90,
      top: dinoY._value + 150,
      bottom: dinoY._value + 200,
    };

    const obstacleBox = {
      left: obstacleX._value,
      right: obstacleX._value + 30,
      top: 150,
      bottom: 200,
    };

    return !(dinoBox.right < obstacleBox.left || 
             dinoBox.left > obstacleBox.right || 
             dinoBox.bottom < obstacleBox.top || 
             dinoBox.top > obstacleBox.bottom);
  };

  return (
    <TouchableWithoutFeedback onPress={jump}>
      <View style={styles.container}>
        <Text style={styles.score}>Score: {score}</Text>
        {gameOver && <Text style={styles.gameOver}>Game Over!</Text>}
        <Animated.View
          style={[
            styles.dino,
            { transform: [{ translateY: dinoY }] }
          ]}
        />
        <Animated.View
          style={[
            styles.obstacle,
            { transform: [{ translateX: obstacleX }] }
          ]}
        />
        <View style={styles.ground} />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  dino: {
    position: 'absolute',
    left: 50,
    top: 150,
    width: 40,
    height: 50,
    backgroundColor: 'green',
  },
  obstacle: {
    position: 'absolute',
    top: 150,
    width: 30,
    height: 50,
    backgroundColor: 'red',
  },
  ground: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: GROUND_HEIGHT,
    backgroundColor: '#000',
  },
  score: {
    position: 'absolute',
    top: 20,
    right: 20,
    fontSize: 24,
  },
  gameOver: {
    position: 'absolute',
    top: '50%',
    alignSelf: 'center',
    fontSize: 48,
    fontWeight: 'bold',
  },
});