// app/contexts/UserContext.tsx
import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import { getUser } from '@/db/Users/Users';

interface User {
    id: number;
    name: string;
    username: string;
}

interface UserContextValue {
    user: User | null;
}

export const UserContext = createContext<UserContextValue>({
    user: null,
});

interface UserContextProviderProps {
    children: ReactNode;
}

export const UserContextProvider = ({ children }: UserContextProviderProps) => {
    
    const [user, setUser] = useState<User | null>(null);

    const db = useSQLiteContext();

    useEffect(() => {
        const fetchUser = async () => {
            const user = await getUser(db);
            setUser(user);
        };

        fetchUser();
    }, []);

    const value = {
        user,
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};