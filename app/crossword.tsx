import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';

import CrosswordGame from '@/components/Home/Crossword/CrosswordGame';

export default function SudokuScreen() {
    return (
        <View style={styles.container}>
            <CrosswordGame />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
});
