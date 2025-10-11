// DolphinDive Main Game Component

import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, TouchableOpacity, Dimensions } from 'react-native';
import { Text } from '@/components/Themed';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { DBContext } from '@/contexts/DBContext';
import { DolphinState } from './types';
import { Dolphin } from './Dolphin';
import { WaterSurface } from './WaterSurface';
import { updatePhysics, calculateJumpVelocity } from './utils';
import {
    WATER_SURFACE_Y,
    OCEAN_BLUE,
    SKY_BLUE,
    SCREEN_HEIGHT,
    MAX_DIVE_DEPTH,
    RESTING_DEPTH,
} from './constants';

export default function DolphinDiveGame() {
    const router = useRouter();
    const { difficulty } = useLocalSearchParams();
    const { db, curGame } = useContext(DBContext);

    const [isGameRunning, setIsGameRunning] = useState(false);
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState<DolphinState>({
        y: WATER_SURFACE_Y + RESTING_DEPTH,
        velocity: 0,
        maxDepthReached: 0,
        isUnderwater: true,
        isDiving: false,
    });

    // Start game
    const startGame = () => {
        setIsGameRunning(true);
        setScore(0);
        setGameState({
            y: WATER_SURFACE_Y + RESTING_DEPTH,
            velocity: 0,
            maxDepthReached: 0,
            isUnderwater: true,
            isDiving: false,
        });
    };

    // Handle tap down - start diving
    const handlePressIn = () => {
        if (!isGameRunning) {
            startGame();
        }
        setGameState(prev => ({
            ...prev,
            isDiving: true,
        }));
    };

    // Handle tap release - stop diving
    const handlePressOut = () => {
        setGameState(prev => ({
            ...prev,
            isDiving: false,
        }));
    };

    // Main game loop
    useEffect(() => {
        if (!isGameRunning) return;

        const gameLoop = setInterval(() => {
            setGameState(prev => {
                // Update physics
                const newState = updatePhysics(prev, prev.isDiving);
                let newY = prev.y + newState.velocity;
                
                // Constrain to screen bounds
                if (newY < 50) {
                    newY = 50;
                }
                if (newY > SCREEN_HEIGHT - 50) {
                    newY = SCREEN_HEIGHT - 50;
                }

                // Check if crossing water surface
                const wasUnderwater = prev.isUnderwater;
                const isNowUnderwater = newY > WATER_SURFACE_Y;

                // Track max depth
                let maxDepth = prev.maxDepthReached;
                if (isNowUnderwater) {
                    const currentDepth = newY - WATER_SURFACE_Y;
                    if (currentDepth > maxDepth) {
                        maxDepth = currentDepth;
                    }
                }

                // Apply jump velocity when surfacing
                let finalVelocity = newState.velocity;
                if (wasUnderwater && !isNowUnderwater && maxDepth > 0) {
                    finalVelocity = calculateJumpVelocity(maxDepth, newState.velocity);
                    maxDepth = 0; // Reset max depth after jump
                }

                // Dampen velocity when landing in water
                if (!wasUnderwater && isNowUnderwater) {
                    finalVelocity *= 0.4; // Reduce downward speed sharply
                }                

                return {
                    y: newY,
                    velocity: finalVelocity,
                    maxDepthReached: maxDepth,
                    isUnderwater: isNowUnderwater,
                    isDiving: prev.isDiving,
                };
            });
        }, 16); // ~60 FPS

        return () => clearInterval(gameLoop);
    }, [isGameRunning]);

    return (
        <TouchableOpacity
            style={styles.container}
            activeOpacity={1}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
        >
            {/* Sky */}
            <View style={[styles.sky, { backgroundColor: SKY_BLUE }]} />
            
            {/* Ocean */}
            <View style={[styles.ocean, { backgroundColor: OCEAN_BLUE, top: WATER_SURFACE_Y }]} />
            
            {/* Water Surface Line */}
            <WaterSurface />

            {/* Dolphin */}
            <Dolphin y={gameState.y} />

            {/* Start Message */}
            {!isGameRunning && (
                <View style={styles.startMessage}>
                    <Text style={styles.startText}>Tap to Start!</Text>
                    <Text style={styles.instructionText}>Hold to dive, release to rise</Text>
                </View>
            )}

            {/* Score */}
            {isGameRunning && (
                <View style={styles.scoreContainer}>
                    <Text style={styles.scoreText}>Score: {score}</Text>
                </View>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    sky: {
        position: 'absolute',
        top: 0,
        width: '100%',
        height: WATER_SURFACE_Y,
    },
    ocean: {
        position: 'absolute',
        width: '100%',
        height: SCREEN_HEIGHT - WATER_SURFACE_Y,
    },
    startMessage: {
        position: 'absolute',
        top: '40%',
        width: '100%',
        alignItems: 'center',
        zIndex: 20,
    },
    startText: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#fff',
        textShadowColor: '#000',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 3,
    },
    instructionText: {
        fontSize: 18,
        color: '#fff',
        marginTop: 10,
        textShadowColor: '#000',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    scoreContainer: {
        position: 'absolute',
        top: 50,
        right: 20,
        zIndex: 20,
    },
    scoreText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        textShadowColor: '#000',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 3,
    },
});
