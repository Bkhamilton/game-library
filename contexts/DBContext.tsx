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
    curGame: Games | null;
    handleCurGame: (title: string) => void;
}

export const DBContext = createContext<DBContextValue>({
    db: null,
    games: [],
    curGame: null,
    handleCurGame: () => {},
});

interface DBContextValueProviderProps {
    children: ReactNode;
}

export const DBContextProvider = ({ children }: DBContextValueProviderProps) => {
    const db = useSQLiteContext();

    const [games, setGames] = useState<Games[]>([]);

    const [curGame, setCurGame] = useState<Games | null>(null);

    const handleCurGame = (title: string) => {
        const game = games.find((game) => game.title === title);
        setCurGame(game || null);
    };

    useEffect(() => {
        if (db) {
            getGames(db).then((games) => {
                setGames(games);
            });
        }
    }, [db]);

    const value = {
        db,
        games,
        curGame,
        handleCurGame,
    };

    return (
        <DBContext.Provider value={value}>
            {children}
        </DBContext.Provider>
    );
};