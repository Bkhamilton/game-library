import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';
import Timer from '../Helpers/Timer';

interface CrosswordHeaderProps {
    wordsFound: number;
    totalWords: number;
    reset: boolean;
}

export default function CrosswordHeader({ wordsFound, totalWords, reset }: CrosswordHeaderProps) {
    return (
        <View style={styles.container}>
            <View style={styles.innerContainer}>
                <View>

                </View>
                <Timer 
                    isActive={true}
                    reset={reset}
                />
                <View>
                    <Text style={{ fontSize: 16 }}>{wordsFound}/{totalWords}</Text>
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