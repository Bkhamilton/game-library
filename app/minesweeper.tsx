import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';
import CrosswordGame from '@/components/Home/Crossword/CrosswordGame';

import MineSweeperGame from '@/components/Home/MineSweeper/MineSweeperGame';

export default function MineSweeperScreen() {
    return (
        <View style={styles.container}>
            <MineSweeperGame />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
});
