import React from 'react';
import { StyleSheet, TouchableOpacity as RNTouchableOpacity } from 'react-native';
import { Text } from '@/components/Themed';

interface FilterButtonProps {
    label: string;
    isActive: boolean;
    onPress: () => void;
    primary: string;
    background: string;
}

/**
 * Filter button component for achievement filters
 */
export default function FilterButton({ 
    label, 
    isActive, 
    onPress, 
    primary, 
    background 
}: FilterButtonProps) {
    return (
        <RNTouchableOpacity
            onPress={onPress}
            style={[
                styles.filterButton,
                { borderColor: primary },
                isActive && { backgroundColor: primary }
            ]}
        >
            <Text style={[styles.filterButtonText, isActive && { color: background }]}>
                {label}
            </Text>
        </RNTouchableOpacity>
    );
}

const styles = StyleSheet.create({
    filterButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 2,
        marginRight: 8,
        marginBottom: 4,
    },
    filterButtonText: {
        fontSize: 14,
        fontWeight: '500',
    },
});
