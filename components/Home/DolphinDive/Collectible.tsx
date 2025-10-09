// Collectible Component (Placeholder)

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Collectible as CollectibleType } from './types';

interface CollectibleProps {
    collectible: CollectibleType;
}

export const Collectible: React.FC<CollectibleProps> = ({ collectible }) => {
    return null; // Placeholder for future implementation
};

const styles = StyleSheet.create({
    collectible: {
        position: 'absolute',
    },
});
