const hiddenGameTitles = new Set([
    'GoGoBird',
    'Ostrich Haul',
    'DolphinDive',
    'Dolphin Dive',
]);

export const isGameVisible = (title: string): boolean => !hiddenGameTitles.has(title);

export const isAchievementVisible = (
    achievement: { criteria?: { game?: string } }
): boolean => {
    const game = achievement.criteria?.game;
    return game === undefined || isGameVisible(game);
};
