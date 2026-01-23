/* eslint-disable no-debugger */
// context/AuthContext.tsx
import React, { createContext, useContext, useState, type ReactNode } from 'react';
import type { User } from '../models/user';
import UserHttpClient from '../clients/userHttpClient';

export type UserRole = 'guest' | 'client' | 'employee';

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [httpClient] = useState(() => new UserHttpClient({
        url: `${import.meta.env.VITE_API_URL}/api/users`,
    }));

    const [user, setUser] = useState<User | null>(() => {
        const saved = localStorage.getItem('user');
        return saved ? JSON.parse(saved) : null;
    });
    const [isLoading, setIsLoading] = useState(false);

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            // Запрос к API
            const response = await httpClient.login({
                login: email,
                password: password
            });

            setUser(response);
            localStorage.setItem('user', JSON.stringify(response));
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{
            user,
            login,
            logout,
            isLoading,
            isAuthenticated: !!user
        }}>
            {children}
        </AuthContext.Provider>
    );
};