// app/contexts/BetContext/BetContext.tsx
import React, { createContext, ReactNode, useState, useEffect } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import { getGames } from '@/db/Games/Games';

interface Games {
    id: number;
    title: string;
    description: string;
}

interface DBContextValue {
    db: any;
    games: Games[];
}

export const DBContext = createContext<DBContextValue>({
    db: null,
    games: [],
});

interface DBContextValueProviderProps {
    children: ReactNode;
}

export const DBContextProvider = ({ children }: DBContextValueProviderProps) => {
    const db = useSQLiteContext();

    const [games, setGames] = useState<Games[]>([]);

    useEffect(() => {
        if (db) {
            getGames(db).then((games) => {
                setGames(games);
            });
        }
    }, [db]);

    const value = {
        db,
        games
    };

    return (
        <DBContext.Provider value={value}>
            {children}
        </DBContext.Provider>
    );
};