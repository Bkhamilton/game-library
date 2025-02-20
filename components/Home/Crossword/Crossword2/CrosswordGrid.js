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
                        <View key={colIndex} style={[styles.cell, { backgroundColor: cell === '' ? text : background, borderColor: primary }]}>
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
        width: 20,
        height: 20,
        borderWidth: 1,
        borderColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
      },
      cellText: {
        fontSize: 15,
        marginTop: -2,
      },
});