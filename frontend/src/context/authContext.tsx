/* eslint-disable no-debugger */
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
    updateUser: (user: User) => void;
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
            const response = await httpClient.login({
                login: email,
                password: password
            });

            setUser(response);
            localStorage.setItem('user', JSON.stringify(response));
            window.dispatchEvent(new Event('auth-changed'));
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('auth-changed'));
    };

    const updateUser = (user: User) => {
        if (user) {
            setUser(user);
            localStorage.setItem('user', JSON.stringify(user));
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            login,
            logout,
            isLoading,
            isAuthenticated: !!user,
            updateUser
        }}>
            {children}
        </AuthContext.Provider>
    );
};