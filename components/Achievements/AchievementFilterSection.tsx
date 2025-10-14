import React from 'react';
import { FlatList } from 'react-native';
import { Text, View } from '@/components/Themed';
import FilterButton from './FilterButton';
import { FilterType } from '@/utils/achievementFilters';
import { TIERS, CATEGORIES } from '@/utils/achievements';

interface AchievementFilterSectionProps {
    filterType: FilterType;
    setFilterType: (type: FilterType) => void;
    selectedTier: string;
    setSelectedTier: (tier: string) => void;
    selectedGame: string;
    setSelectedGame: (game: string) => void;
    selectedCategory: string;
    setSelectedCategory: (category: string) => void;
    games: any[];
    resetFilters: () => void;
    primary: string;
    background: string;
}

/**
 * Filter section component for achievement filtering UI
 */
export default function AchievementFilterSection({
    filterType,
    setFilterType,
    selectedTier,
    setSelectedTier,
    selectedGame,
    setSelectedGame,
    selectedCategory,
    setSelectedCategory,
    games,
    resetFilters,
    primary,
    background,
}: AchievementFilterSectionProps) {
    return (
        <>
            {/* Filter Type Selector */}
            <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
                <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>Filter By:</Text>
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={[
                        { key: 'all', label: 'All' },
                        { key: 'tier', label: 'Tier' },
                        { key: 'game', label: 'Game' },
                        { key: 'category', label: 'Category' }
                    ]}
                    renderItem={({ item }) => (
                        <FilterButton
                            label={item.label}
                            isActive={filterType === item.key}
                            onPress={() => {
                                if (item.key === 'all') {
                                    setFilterType('all');
                                    resetFilters();
                                } else {
                                    setFilterType(item.key as FilterType);
                                }
                            }}
                            primary={primary}
                            background={background}
                        />
                    )}
                    keyExtractor={item => item.key}
                />
            </View>

            {/* Tier Filter */}
            {filterType === 'tier' && (
                <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
                    <Text style={{ fontSize: 14, fontWeight: '600', marginBottom: 8, opacity: 0.8 }}>Select Tier:</Text>
                    <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        data={[{ key: 'all', label: 'All Tiers' }, ...TIERS.map(t => ({ key: t, label: t }))]}
                        renderItem={({ item }) => (
                            <FilterButton
                                label={item.label}
                                isActive={selectedTier === item.key}
                                onPress={() => setSelectedTier(item.key)}
                                primary={primary}
                                background={background}
                            />
                        )}
                        keyExtractor={item => `tier-${item.key}`}
                    />
                </View>
            )}

            {/* Game Filter */}
            {filterType === 'game' && (
                <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
                    <Text style={{ fontSize: 14, fontWeight: '600', marginBottom: 8, opacity: 0.8 }}>Select Game:</Text>
                    <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        data={[{ id: 'all', title: 'All Games' }, ...games]}
                        renderItem={({ item }) => (
                            <FilterButton
                                label={item.title}
                                isActive={selectedGame === item.title}
                                onPress={() => setSelectedGame(item.title)}
                                primary={primary}
                                background={background}
                            />
                        )}
                        keyExtractor={item => `game-${item.id}`}
                    />
                </View>
            )}

            {/* Category Filter */}
            {filterType === 'category' && (
                <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
                    <Text style={{ fontSize: 14, fontWeight: '600', marginBottom: 8, opacity: 0.8 }}>Select Category:</Text>
                    <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        data={[{ key: 'all', label: 'All Categories' }, ...CATEGORIES.map(c => ({ key: c, label: c }))]}
                        renderItem={({ item }) => (
                            <FilterButton
                                label={item.label}
                                isActive={selectedCategory === item.key}
                                onPress={() => setSelectedCategory(item.key)}
                                primary={primary}
                                background={background}
                            />
                        )}
                        keyExtractor={item => `category-${item.key}`}
                    />
                </View>
            )}
        </>
    );
}
