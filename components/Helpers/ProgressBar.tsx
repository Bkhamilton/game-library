import React from 'react';
import { StyleSheet } from 'react-native';
import { View } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';

interface ProgressBarProps {
    segment: number;
    total: number;
}

export default function ProgressBar({ segment, total } : ProgressBarProps) {
    // Calculate the progress percentage
    const progress = (segment / total) * 100;

    return (
        <View style={styles.container}>
            <View style={[styles.progress, { width: `${progress}%` }]} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 10,
        width: '90%',
        backgroundColor: '#e0e0e0',
        borderRadius: 5,
        overflow: 'hidden',
    },
    progress: {
        height: '100%',
        backgroundColor: '#76c7c0', // You can change the color
        borderRadius: 5,
    },
});