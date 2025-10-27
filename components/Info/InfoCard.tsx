import React, { useState, useRef, useContext, useEffect } from 'react';
import { StyleSheet, Animated, Image } from 'react-native';
import { TouchableOpacity, Text, View } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';
import { GameLogos } from '@/constants/GameLogos';
import Difficulties from '@/constants/Difficulties';
import { DBContext } from '@/contexts/DBContext';

interface InfoCardProps {
    game: {
        id: number;
        title: string;
        description: string;
    };
}

export default function InfoCard({ game }: InfoCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const height = useRef(new Animated.Value(0)).current;
    const { grayBackground, primary, secondary } = useTheme();
    const { db } = useContext(DBContext);
    const [achievementCount, setAchievementCount] = useState(0);

    useEffect(() => {
        // Fetch achievement count for this game
        const fetchAchievements = async () => {
            if (db) {
                try {
                    const achievements = await db.getAllAsync(
                        `SELECT COUNT(*) as count FROM Achievements WHERE json_extract(criteria, '$.game') = ?`,
                        [game.title]
                    );
                    setAchievementCount(achievements[0]?.count || 0);
                } catch (error) {
                    console.error('Error fetching achievements:', error);
                    setAchievementCount(0);
                }
            }
        };
        fetchAchievements();
    }, [db, game.title]);

    const toggleCard = () => {
        setIsExpanded(!isExpanded);
        Animated.timing(height, {
            toValue: isExpanded ? 0 : 1,
            duration: 300,
            useNativeDriver: false,
        }).start();
    };

    const difficulties = (Difficulties as any)[game.title] || [];
    const logo = (GameLogos as any)[game.title];

    const animatedHeight = height.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 300],
    });

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[styles.cardHeader, { backgroundColor: grayBackground }]}
                onPress={toggleCard}
                activeOpacity={0.7}
            >
                <View style={[styles.headerContent, { backgroundColor: grayBackground }]}>
                    {logo && (
                        <Image 
                            source={logo} 
                            style={styles.logo}
                            resizeMode="cover"
                        />
                    )}
                    <View style={[styles.titleContainer, { backgroundColor: grayBackground }]}>
                        <Text style={styles.title}>{game.title}</Text>
                        <Text style={styles.subtitle}>
                            Tap to {isExpanded ? 'collapse' : 'expand'}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
            
            <Animated.View style={{ height: animatedHeight, overflow: 'hidden' }}>
                <View style={styles.expandedContent}>
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Description</Text>
                        <Text style={styles.description}>{game.description}</Text>
                    </View>

                    {difficulties.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Difficulty Levels</Text>
                            <View style={styles.difficultiesContainer}>
                                {difficulties.map((difficulty: string, index: number) => (
                                    <View
                                        key={index}
                                        style={[
                                            styles.difficultyBadge,
                                            { borderColor: primary, backgroundColor: secondary }
                                        ]}
                                    >
                                        <Text style={styles.difficultyText}>{difficulty}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Achievements</Text>
                        <Text style={styles.achievementCount}>
                            {achievementCount} achievement{achievementCount !== 1 ? 's' : ''} available
                        </Text>
                    </View>
                </View>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardHeader: {
        padding: 16,
        borderRadius: 12,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logo: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 16,
    },
    titleContainer: {
        flex: 1,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 12,
        opacity: 0.6,
    },
    expandedContent: {
        padding: 16,
        paddingTop: 0,
    },
    section: {
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
        lineHeight: 20,
        opacity: 0.8,
    },
    difficultiesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    difficultyBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 1,
    },
    difficultyText: {
        fontSize: 14,
        fontWeight: '500',
    },
    achievementCount: {
        fontSize: 14,
        opacity: 0.8,
    },
});
