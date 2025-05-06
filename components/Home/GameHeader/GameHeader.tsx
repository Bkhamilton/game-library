import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import Timer from '../../Helpers/Timer';

interface GameHeaderProps {
    /**
     * Left side content - can be a count, status, or any React node
     */
    leftContent?: React.ReactNode;
    /**
     * Center content - typically the timer
     */
    centerContent?: React.ReactNode;
    /**
     * Right side content - can be a count, status, or any React node
     */
    rightContent?: React.ReactNode;
    /**
     * Whether the timer is active
     */
    timerActive?: boolean;
    /**
     * Whether to reset the timer
     */
    timerReset?: boolean;
    /**
     * Callback for time updates
     */
    onTimeUpdate?: (seconds: number) => void;
    /**
     * Custom style for the container
     */
    style?: any;
}

export default function GameHeader({
    leftContent,
    centerContent,
    rightContent,
    timerActive = true,
    timerReset = false,
    onTimeUpdate,
    style
}: GameHeaderProps) {
    return (
        <View style={[styles.container, style]}>
            <View style={styles.innerContainer}>
                <View style={styles.sideContent}>
                    {leftContent}
                </View>
                
                {centerContent || (
                    <Timer 
                        isActive={timerActive}
                        reset={timerReset}
                        onTimeUpdate={onTimeUpdate}
                    />
                )}
                
                <View style={styles.sideContent}>
                    {rightContent}
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
    sideContent: {
        minWidth: 60, // Ensures consistent spacing
        alignItems: 'center',
    },
});