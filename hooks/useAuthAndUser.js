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
        router.push('/');
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
                if (typeof window !== 'undefined' && me?.active_role) {
                    localStorage.setItem('active_role', me.active_role);
                }
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

    const handleSwitchRole = async (targetRole) => {
        try {
            const res = await api.switchRole(targetRole);
            if (res && res.user) {
                // Persist immediately to localStorage so Sidebar reads it right away
                if (typeof window !== 'undefined') {
                    localStorage.setItem('active_role', res.user.active_role || targetRole);
                }
                setCurrentUser(res.user);
            } else {
                const me = await api.getMe();
                if (typeof window !== 'undefined') {
                    localStorage.setItem('active_role', me.active_role || targetRole);
                }
                setCurrentUser(me);
            }
            return true;
        } catch (err) {
            console.error('Failed to switch role:', err);
            throw err;
        }
    };


    const handleBecomeSeller = async (data = {}) => {
        try {
            const res = await api.becomeSeller(data);
            if (res && res.user) {
                setCurrentUser(res.user);
            } else {
                const me = await api.getMe();
                setCurrentUser(me);
            }
            return res;
        } catch (err) {
            console.error('Failed to activate seller profile:', err);
            throw err;
        }
    };

    const handleBecomeBuyer = async (data = {}) => {
        try {
            const res = await api.becomeBuyer(data);
            if (res && res.user) {
                setCurrentUser(res.user);
            } else {
                const me = await api.getMe();
                setCurrentUser(me);
            }
            return res;
        } catch (err) {
            console.error('Failed to activate buyer profile:', err);
            throw err;
        }
    };

    return {
        currentUser,
        setCurrentUser,
        loading,
        handleLogout,
        handleSwitchRole,
        handleBecomeSeller,
        handleBecomeBuyer,
        activeRole: currentUser?.active_role || 'buyer',
        userRole: currentUser?.user_role || 'normal',
        isBuyer: currentUser?.is_buyer || false,
        isSeller: currentUser?.is_seller || false,
        isBoth: currentUser?.is_both || false,
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

