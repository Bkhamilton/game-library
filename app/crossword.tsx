import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';

import CrosswordGame from '@/components/Home/Crossword/CrosswordGame';
import CrosswordGame2 from '@/components/Home/Crossword/CrosswordGame2';

export default function SudokuScreen() {
    return (
        <View style={styles.container}>
            <CrosswordGame2 />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
});
