import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';
import Timer from '../Helpers/Timer';

interface SudokuHeaderProps {
    wrongCount: number;
    onTimeUpdate?: (seconds: number) => void; // Add this prop
}

export default function SudokuHeader({ wrongCount, onTimeUpdate }: SudokuHeaderProps) {
    return (
        <View style={styles.container}>
            <View style={styles.innerContainer}>
                <View></View>
                <Timer 
                    isActive={true}
                    reset={false}
                    onTimeUpdate={onTimeUpdate} // Pass through the callback
                />
                <View>
                    <Text style={{ fontSize: 16 }}>{wrongCount}/4</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 16,
    },
    innerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 16,
    },
});