import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';
import Timer from '../Helpers/Timer';

interface MineSweeperHeaderProps {
    minesCount: number;
    gameState: string;
    trigger: boolean;
}

export default function MineSweeperHeader({ minesCount, gameState, trigger }: MineSweeperHeaderProps) {

    const [isActive, setIsActive] = useState(true);

    useEffect(() => {
        if (gameState === 'lost' || gameState === 'won') {
            setIsActive(false);
        }
    }, [gameState]);

    return (
        <View style={styles.container}>
            <View style={styles.innerContainer}>
                <View>

                </View>
                <Timer 
                    isActive={isActive}
                    reset={trigger}
                />
                <View>
                    <Text style={{ fontSize: 16 }}>{minesCount}</Text>
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