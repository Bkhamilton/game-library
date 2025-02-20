import React from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View } from '@/components/Themed';
import { MonoText } from '@/components/StyledText';
import useTheme from '@/hooks/useTheme';

export default function CrosswordGrid({ grid }) {

    const { primary, grayBackground, grayBorder, background, text } = useTheme();

    return (
        <View style={styles.gridContainer}>
            {grid.map((row, rowIndex) => (
                <View key={rowIndex} style={styles.row}>
                    {row.map((cell, colIndex) => (
                        <View key={colIndex} style={[styles.cell, { backgroundColor: cell === '' ? '#000' : '#FFF', borderColor: cell === '' ? '#000' : '#FFF' }]}>
                            <MonoText style={styles.cellText}>{cell}</MonoText>
                        </View>
                    ))}
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    gridContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      },
      row: {
        flexDirection: 'row',
      },
      cell: {
        width: 24,
        height: 24,
        borderWidth: 1,
        borderColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
      },
      cellText: {
        fontSize: 16,
        marginTop: -2,
        color: '#000',
      },
});