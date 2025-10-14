// Achievement filtering and sorting utilities

export type FilterType = 'all' | 'tier' | 'game' | 'category';

export interface Achievement {
    id: number;
    title: string;
    description: string;
    tier: string;
    points: number;
    icon?: string;
    category: string;
    criteria: {
        threshold: number;
        game?: string;
    };
    progress?: number;
    unlocked: boolean;
    gameTitle?: string;
}

/**
 * Filter achievements based on selected criteria
 */
export const filterAchievements = (
    achievements: Achievement[],
    selectedTier: string,
    selectedGame: string,
    selectedCategory: string
): Achievement[] => {
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

    return filtered;
};

/**
 * Sort achievements so unlocked achievements appear first
 */
export const sortAchievements = (achievements: Achievement[]): Achievement[] => {
    return achievements.sort((a, b) => {
        if (a.unlocked && !b.unlocked) return -1;
        if (!a.unlocked && b.unlocked) return 1;
        return 0;
    });
};
