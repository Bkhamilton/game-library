import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';
import Timer from '../Helpers/Timer';

export default function DinoRunHeader({ score }: { score: number }) {
    return (
        <View style={styles.container}>
            <View style={styles.innerContainer}>
                <View>

                </View>
                <Text>Score: {score}</Text>
                <View>
                    
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