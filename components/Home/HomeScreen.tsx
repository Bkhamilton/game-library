import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import SudokuGame from './Sudoku/SudokuGame';

export default function HomeScreen() {
    return (
        <View style={styles.container}>
            <View>
                <Text style={{ fontSize: 16 }}>Games</Text>
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