import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity as RNTouchableOpacity } from 'react-native';
import { Text, View, TouchableOpacity } from '@/components/Themed';
import { FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import { DBContext } from '@/contexts/DBContext';
import ProgressBar from '@/components/Helpers/ProgressBar';
import { getUserAchievementsWithGames, getUserTotalPoints } from '@/db/Achievements/Achievements';
import { getGames } from '@/db/Games/Games';
import { useRouter } from 'expo-router';
import useTheme from '@/hooks/useTheme';

interface AchievementBoxProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    tier: string;
    points: number;
    segment: number;
    total: number;
    unlocked: boolean;
    gameTitle?: string;
}

type FilterType = 'all' | 'tier' | 'game' | 'category';

export default function AchievementScreen() {
    const { db } = useContext(DBContext);
    const [achievements, setAchievements] = useState<any[]>([]);
    const [filteredAchievements, setFilteredAchievements] = useState<any[]>([]);
    const [totalPoints, setTotalPoints] = useState(0);
    const [games, setGames] = useState<any[]>([]);
    const router = useRouter();
    const { primary, text, background } = useTheme();

    // Filter states
    const [filterType, setFilterType] = useState<FilterType>('all');
    const [selectedTier, setSelectedTier] = useState<string>('all');
    const [selectedGame, setSelectedGame] = useState<string>('all');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    const tiers = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'];
    const categories = ['Completion', 'Streak', 'Collection', 'Time-Based', 'Score', 'Skill', 'Social'];

    useEffect(() => {
        const loadData = async () => {
            if (db) {
                try {
                    const userAchievements = await getUserAchievementsWithGames(db, 1);
                    setAchievements(userAchievements);
                    setFilteredAchievements(userAchievements);
                    
                    const points = await getUserTotalPoints(db, 1);
                    setTotalPoints(points);

                    const gamesList = await getGames(db);
                    setGames(gamesList);
                } catch (error) {
                    console.error('Error loading achievements:', error);
                }
            }
        };
        
        loadData();
    }, [db]);

    // Apply filters whenever filter values change
    useEffect(() => {
        let filtered = [...achievements];

        if (selectedTier !== 'all') {
            filtered = filtered.filter(a => a.tier === selectedTier);
        }

        if (selectedGame !== 'all') {
            filtered = filtered.filter(a => a.criteria?.game === selectedGame);
        }

        if (selectedCategory !== 'all') {
            filtered = filtered.filter(a => a.category === selectedCategory);
        }

        setFilteredAchievements(filtered);
    }, [selectedTier, selectedGame, selectedCategory, achievements]);

    const getTierColor = (tier: string) => {
        switch (tier) {
            case 'Bronze': return '#CD7F32';
            case 'Silver': return '#C0C0C0';
            case 'Gold': return '#FFD700';
            case 'Platinum': return '#E5E4E2';
            case 'Diamond': return '#B9F2FF';
            default: return '#CD7F32';
        }
    };

    const AchievementBox = ({ icon, title, description, tier, points, segment, total, unlocked, gameTitle }: AchievementBoxProps) => {
        return (
            <View style={[styles.achievementBox, unlocked && styles.achievementBoxUnlocked]}>
                <View style={styles.achievementIcon}>
                    {icon}
                </View>
                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={styles.achievementTitle}>{title}</Text>
                        <Text style={[styles.tierBadge, { backgroundColor: getTierColor(tier) }]}>{tier}</Text>
                    </View>
                    {gameTitle && (
                        <Text style={styles.gameTitle}>🎮 {gameTitle}</Text>
                    )}
                    <Text style={styles.achievementDescription}>{description}</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingRight: 24, marginTop: 4 }}>
                        <ProgressBar segment={segment} total={total} />
                        <Text style={{ paddingLeft: 12, fontSize: 12 }}>{segment}/{total}</Text>
                    </View>
                    <Text style={styles.pointsText}>{points} points</Text>
                </View>
            </View>
        );
    };

    const FilterButton = ({ label, isActive, onPress }: { label: string; isActive: boolean; onPress: () => void }) => (
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

    const resetFilters = () => {
        setSelectedTier('all');
        setSelectedGame('all');
        setSelectedCategory('all');
        setFilterType('all');
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={{ padding: 8 }}
                    >
                        <FontAwesome5 name="chevron-left" size={24} color={text} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 22, fontWeight: '500', marginLeft: 14 }}>All Achievements</Text>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Stats Section */}
                <View style={{ padding: 16, paddingBottom: 8 }}>
                    <Text style={{ fontSize: 18, fontWeight: '600', opacity: 0.8 }}>
                        Total Points: {totalPoints}
                    </Text>
                    <Text style={{ fontSize: 16, marginTop: 4, opacity: 0.7 }}>
                        {achievements.filter(a => a.unlocked).length} / {achievements.length} unlocked
                    </Text>
                </View>

                {/* Filter Type Selector */}
                <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
                    <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>Filter By:</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <FilterButton
                            label="All"
                            isActive={filterType === 'all'}
                            onPress={() => {
                                setFilterType('all');
                                resetFilters();
                            }}
                        />
                        <FilterButton
                            label="Tier"
                            isActive={filterType === 'tier'}
                            onPress={() => setFilterType('tier')}
                        />
                        <FilterButton
                            label="Game"
                            isActive={filterType === 'game'}
                            onPress={() => setFilterType('game')}
                        />
                        <FilterButton
                            label="Category"
                            isActive={filterType === 'category'}
                            onPress={() => setFilterType('category')}
                        />
                    </ScrollView>
                </View>

                {/* Tier Filter */}
                {filterType === 'tier' && (
                    <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
                        <Text style={{ fontSize: 14, fontWeight: '600', marginBottom: 8, opacity: 0.8 }}>Select Tier:</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <FilterButton
                                label="All Tiers"
                                isActive={selectedTier === 'all'}
                                onPress={() => setSelectedTier('all')}
                            />
                            {tiers.map(tier => (
                                <FilterButton
                                    key={tier}
                                    label={tier}
                                    isActive={selectedTier === tier}
                                    onPress={() => setSelectedTier(tier)}
                                />
                            ))}
                        </ScrollView>
                    </View>
                )}

                {/* Game Filter */}
                {filterType === 'game' && (
                    <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
                        <Text style={{ fontSize: 14, fontWeight: '600', marginBottom: 8, opacity: 0.8 }}>Select Game:</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <FilterButton
                                label="All Games"
                                isActive={selectedGame === 'all'}
                                onPress={() => setSelectedGame('all')}
                            />
                            {games.map(game => (
                                <FilterButton
                                    key={game.id}
                                    label={game.title}
                                    isActive={selectedGame === game.title}
                                    onPress={() => setSelectedGame(game.title)}
                                />
                            ))}
                        </ScrollView>
                    </View>
                )}

                {/* Category Filter */}
                {filterType === 'category' && (
                    <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
                        <Text style={{ fontSize: 14, fontWeight: '600', marginBottom: 8, opacity: 0.8 }}>Select Category:</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <FilterButton
                                label="All Categories"
                                isActive={selectedCategory === 'all'}
                                onPress={() => setSelectedCategory('all')}
                            />
                            {categories.map(category => (
                                <FilterButton
                                    key={category}
                                    label={category}
                                    isActive={selectedCategory === category}
                                    onPress={() => setSelectedCategory(category)}
                                />
                            ))}
                        </ScrollView>
                    </View>
                )}

                {/* Achievements List */}
                <View style={{ paddingTop: 8 }}>
                    {filteredAchievements.length > 0 ? (
                        filteredAchievements.map((achievement, index) => {
                            const iconName = achievement.icon || 'trophy';
                            const iconColor = achievement.unlocked ? getTierColor(achievement.tier) : '#666';
                            
                            return (
                                <AchievementBox
                                    key={index}
                                    icon={<FontAwesome5 name={iconName} size={36} color={iconColor} />}
                                    title={achievement.title}
                                    description={achievement.description}
                                    tier={achievement.tier}
                                    points={achievement.points}
                                    segment={achievement.progress || 0}
                                    total={achievement.criteria.threshold}
                                    unlocked={achievement.unlocked}
                                    gameTitle={achievement.gameTitle}
                                />
                            );
                        })
                    ) : (
                        <View style={{ padding: 32, alignItems: 'center' }}>
                            <Text style={{ fontSize: 16, opacity: 0.6 }}>No achievements found</Text>
                        </View>
                    )}
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingTop: 50,
        paddingHorizontal: 20,
        paddingBottom: 12,
    },
    achievementBox: {
        flexDirection: 'row',
        padding: 16,
        borderWidth: 1,
        borderRadius: 8,
        marginHorizontal: 12,
        marginVertical: 8,
        opacity: 0.6,
    },
    achievementBoxUnlocked: {
        opacity: 1,
        borderColor: '#4CAF50',
        borderWidth: 2,
    },
    achievementIcon: {
        marginRight: 16,
    },
    achievementTitle: {
        fontSize: 16,
        fontWeight: '500',
        flex: 1,
        marginRight: 8,
    },
    gameTitle: {
        fontSize: 13,
        opacity: 0.8,
        marginTop: 2,
        fontWeight: '500',
    },
    achievementDescription: {
        fontSize: 14,
        opacity: 0.7,
        marginTop: 2,
    },
    tierBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        fontSize: 12,
        fontWeight: '600',
        color: '#000',
    },
    pointsText: {
        fontSize: 12,
        marginTop: 4,
        opacity: 0.6,
        fontWeight: '500',
    },
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
