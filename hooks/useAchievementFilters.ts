import { useState, useCallback, useMemo } from 'react';
import { FilterType, filterAchievements, sortAchievements, Achievement } from '@/utils/achievementFilters';

/**
 * Custom hook to manage achievement filter state and logic
 */
export const useAchievementFilters = (achievements: Achievement[]) => {
    const [filterType, setFilterType] = useState<FilterType>('all');
    const [selectedTier, setSelectedTier] = useState<string>('all');
    const [selectedGame, setSelectedGame] = useState<string>('all');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    const resetFilters = useCallback(() => {
        setSelectedTier('all');
        setSelectedGame('all');
        setSelectedCategory('all');
        setFilterType('all');
    }, []);

    // Memoize filtered and sorted achievements for better performance
    const filteredAchievements = useMemo(() => {
        const filtered = filterAchievements(
            achievements,
            selectedTier,
            selectedGame,
            selectedCategory
        );
        return sortAchievements(filtered);
    }, [achievements, selectedTier, selectedGame, selectedCategory]);

    return {
        filterType,
        setFilterType,
        selectedTier,
        setSelectedTier,
        selectedGame,
        setSelectedGame,
        selectedCategory,
        setSelectedCategory,
        resetFilters,
        filteredAchievements,
    };
};
