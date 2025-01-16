import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';
import { MaterialIcons } from '@expo/vector-icons';

export default function SudokuNumbers({ selectNumber }: { selectNumber: (value: number) => void }) {

    const { primary } = useTheme();
    
    return (
        <View style={styles.container}>
            {[...Array(9)].map((_, index) => (
                <TouchableOpacity 
                    key={index} 
                    style={[styles.numberButton, { backgroundColor: primary }]}
                    onPress={() => selectNumber(index + 1)}    
                >
                    <Text>{index + 1}</Text>
                </TouchableOpacity>
            ))}
            <TouchableOpacity style={[styles.numberButton, { backgroundColor: primary }]}>
                <MaterialIcons name="backspace" size={17} color="black" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: '15%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
    },
    numberButton: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        marginHorizontal: 2,
    },
});