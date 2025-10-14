import React from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
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
    activeFilterCount: number;
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
    activeFilterCount,
}: AchievementFilterSectionProps) {
    return (
        <>
            {/* Filter Type Selector */}
            <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <Text style={{ fontSize: 16, fontWeight: '600' }}>Filter By:</Text>
                    {activeFilterCount > 0 && (
                        <TouchableOpacity
                            onPress={resetFilters}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingHorizontal: 12,
                                paddingVertical: 6,
                                backgroundColor: primary,
                                borderRadius: 16,
                            }}
                        >
                            <Text style={{ fontSize: 12, fontWeight: '600', color: background, marginRight: 4 }}>
                                {activeFilterCount}
                            </Text>
                            <Text style={{ fontSize: 12, fontWeight: '600', color: background }}>
                                Clear All
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
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
                        renderItem={({ item }) => {
                            const gameValue = item.id === 'all' ? 'all' : item.title;
                            return (
                                <FilterButton
                                    label={item.title}
                                    isActive={selectedGame === gameValue}
                                    onPress={() => setSelectedGame(gameValue)}
                                    primary={primary}
                                    background={background}
                                />
                            );
                        }}
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
