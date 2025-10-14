// Achievement utility functions and constants

export const TIERS = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'] as const;

export const CATEGORIES = [
    'Completion',
    'Streak',
    'Collection',
    'Time-Based',
    'Score',
    'Skill',
    'Social'
] as const;

export type Tier = typeof TIERS[number];
export type Category = typeof CATEGORIES[number];

/**
 * Get the color associated with a specific achievement tier
 */
export const getTierColor = (tier: string): string => {
    switch (tier) {
        case 'Bronze':
            return '#CD7F32';
        case 'Silver':
            return '#C0C0C0';
        case 'Gold':
            return '#FFD700';
        case 'Platinum':
            return '#E5E4E2';
        case 'Diamond':
            return '#B9F2FF';
        default:
            return '#CD7F32';
    }
};
