import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';

import SudokuGame from '@/components/Home/Sudoku/SudokuGame';

export default function SudokuScreen() {
    return (
        <View style={styles.container}>
            <SudokuGame />
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
