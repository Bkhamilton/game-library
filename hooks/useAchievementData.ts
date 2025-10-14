import { useState, useEffect, useContext } from 'react';
import { DBContext } from '@/contexts/DBContext';
import { getUserAchievementsWithGames, getUserTotalPoints } from '@/db/Achievements/Achievements';
import { getGames } from '@/db/Games/Games';

/**
 * Custom hook to manage achievement data loading and state
 */
export const useAchievementData = () => {
    const { db } = useContext(DBContext);
    const [achievements, setAchievements] = useState<any[]>([]);
    const [totalPoints, setTotalPoints] = useState(0);
    const [games, setGames] = useState<any[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    const loadData = async () => {
        if (db) {
            try {
                const userAchievements = await getUserAchievementsWithGames(db, 1);
                setAchievements(userAchievements);
                
                const points = await getUserTotalPoints(db, 1);
                setTotalPoints(points);

                const gamesList = await getGames(db);
                setGames(gamesList);
            } catch (error) {
                console.error('Error loading achievements:', error);
            }
        }
    };

    useEffect(() => {
        loadData();
    }, [db]);

    const onRefresh = async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    };

    return {
        achievements,
        totalPoints,
        games,
        refreshing,
        onRefresh,
    };
};
