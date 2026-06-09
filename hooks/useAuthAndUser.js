'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import useSettings from './useSettings'; // Assuming useSettings is also a shared hook

export default function useAuthAndUser() {
    const router = useRouter();
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true); // Initial loading for user data
    const mountedRef = useRef(false);

    const handleUserUpdate = (updatedUser) => {
        setCurrentUser(updatedUser);
    };

    const {
        settingsView,
        setSettingsView,
        firstName,
        setFirstName,
        lastName,
        setLastName,
        username,
        setUsername,
        email,
        setEmail,
        isSaving,
        saveSuccess,
        handleSaveSettings,
        handleAvatarChange,
        usernameStatus,
        usernameCheckLoading,
    } = useSettings(currentUser, handleUserUpdate);

    const handleLogout = async () => {
        try {
            await api.logout();
        } catch (error) {
            console.error('Logout error:', error);
        }
        router.push('/admin/login');
    };

    // Initial data fetch for user
    useEffect(() => {
        if (mountedRef.current) return;
        mountedRef.current = true;

        const initUser = async () => {
            const token =
                typeof window !== 'undefined'
                    ? localStorage.getItem('access_token')
                    : null;
            if (!token) {
                router.push('/admin/login?from=/dashboard');
                setLoading(false); // Ensure loading is false if redirecting
                return;
            }

            try {
                const me = await api.getMe();
                setCurrentUser(me);
            } catch (err) {
                console.error('Failed to fetch user data:', err);
                router.push('/admin/login?from=/dashboard');
            } finally {
                setLoading(false);
            }
        };

        initUser();
    }, [router]);

    return {
        currentUser,
        loading,
        handleLogout,
        settingsView,
        setSettingsView,
        firstName,
        setFirstName,
        lastName,
        setLastName,
        username,
        setUsername,
        email,
        setEmail,
        isSaving,
        saveSuccess,
        handleSaveSettings,
        handleAvatarChange,
        usernameStatus,
        usernameCheckLoading,
    };
}
