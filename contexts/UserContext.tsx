// contexts/UserContext.tsx
'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type User = {
    email: string;
    name: string;
    avatar?: string;
    plan?: {
        name: string;
        nextBilling: string;
    };
};

type UserContextType = {
    user: User | null;
    isLoading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    updateUser: (data: Partial<User>) => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    // Check for existing session on mount
    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setIsLoading(false);
    }, []);

    const signIn = async (email: string, password: string) => {
        try {
            const userData: User = {
                email,
                name: email.split('@')[0].split('.')[0].charAt(0).toUpperCase() + email.split('@')[0].split('.')[0].slice(1),
                avatar: '/images/bill.jpg',
                plan: {
                    name: 'Pro Plan',
                    nextBilling: 'Apr 1, 2024',
                },
            };

            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));

            // Use Next.js router instead of window.location
            router.push('/dashboard');
        } catch (error) {
            console.error('Sign in failed:', error);
            throw error;
        }
    };

    const signUp = async (email: string, password: string) => {
        try {
            const userData: User = {
                email,
                name: email.split('@')[0],
                avatar: '/images/bill.jpg',
                plan: {
                    name: 'Free Plan',
                    nextBilling: 'N/A',
                },
            };

            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));

            // Use Next.js router instead of window.location
            router.push('/dashboard');
        } catch (error) {
            console.error('Sign up failed:', error);
            throw error;
        }
    };

    const signOut = async () => {
        try {
            setUser(null);
            localStorage.removeItem('user');
            // Use Next.js router instead of window.location
            router.push('/');
        } catch (error) {
            console.error('Sign out failed:', error);
            throw error;
        }
    };

    const updateUser = async (data: Partial<User>) => {
        try {
            if (!user) throw new Error('No user logged in');

            const updatedUser = { ...user, ...data };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
        } catch (error) {
            console.error('Update user failed:', error);
            throw error;
        }
    };

    return (
        <UserContext.Provider value={{ user, isLoading, signIn, signUp, signOut, updateUser }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}