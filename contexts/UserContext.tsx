// app/contexts/UserContext.tsx
import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import { getUser, updateUser } from '@/db/Users/Users';

interface User {
    id?: number | undefined;
    name: string;
    username: string;
}

interface UserContextValue {
    user: User | null;
    updateUserInfo: (user: User) => void;
}

export const UserContext = createContext<UserContextValue>({
    user: null,
    updateUserInfo: () => {},
});

interface UserContextProviderProps {
    children: ReactNode;
}

export const UserContextProvider = ({ children }: UserContextProviderProps) => {
    
    const [user, setUser] = useState<User | null>(null);

    const db = useSQLiteContext();

    const updateUserInfo = (user: User) => {
        updateUser(db, user);
        setUser(user);
    };

    useEffect(() => {
        const fetchUser = async () => {
            const user = await getUser(db);
            setUser(user);
        };

        fetchUser();
    }, []);

    const value = {
        user,
        updateUserInfo,
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};