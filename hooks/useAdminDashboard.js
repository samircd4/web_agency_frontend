'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { api } from '@/lib/api';

export default function useAdminDashboard() {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Settings state
  const [settingsView, setSettingsView] = useState('personal');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [pendingAvatar, setPendingAvatar] = useState(null);
  const [usernameStatus, setUsernameStatus] = useState(null);
  const [usernameCheckLoading, setUsernameCheckLoading] = useState(false);
  const debounceTimeoutRef = useRef(null);

  // Initialize settings when currentUser loads
  useEffect(() => {
    if (currentUser) {
      setFirstName(currentUser.first_name || '');
      setLastName(currentUser.last_name || '');
      setUsername(currentUser.username || '');
      setEmail(currentUser.email || '');
      setUsernameStatus(null);
    }
  }, [currentUser]);

  // Check username availability with debounce
  const checkUsernameAvailability = useCallback(async (value) => {
    if (!value) {
      setUsernameStatus(null);
      return;
    }

    // If it's the current user's username, it's available
    if (value === currentUser?.username) {
      setUsernameStatus({ available: true, message: 'Username is available.' });
      return;
    }

    try {
      setUsernameCheckLoading(true);
      const result = await api.checkUsername(value);
      setUsernameStatus(result);
    } catch (error) {
      console.error('Error checking username:', error);
      setUsernameStatus({ available: false, message: 'Error checking username.' });
    } finally {
      setUsernameCheckLoading(false);
    }
  }, [currentUser]);

  // Debounced username check
  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    if (username && username !== currentUser?.username) {
      debounceTimeoutRef.current = setTimeout(() => {
        checkUsernameAvailability(username);
      }, 300);
    } else {
      setUsernameStatus(null);
    }

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [username, checkUsernameAvailability, currentUser]);

  const handleAvatarChange = (file) => {
    setPendingAvatar(file);
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const updateData = {};

      // Update first name, last name
      if (firstName !== currentUser?.first_name) {
        updateData.first_name = firstName;
      }
      if (lastName !== currentUser?.last_name) {
        updateData.last_name = lastName;
      }

      // Update username
      if (username !== currentUser?.username) {
        updateData.username = username;
      }

      // Update email
      if (email !== currentUser?.email) {
        updateData.email = email;
      }

      // Update avatar if pending
      if (pendingAvatar !== null) {
        updateData.avatar = pendingAvatar;
      }

      const updatedUser = await api.updateMe(updateData);
      setCurrentUser(updatedUser);
      setPendingAvatar(null);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    async function initAdmin() {
      try {
        const me = await api.getMe();
        setCurrentUser(me);
      } catch (err) {
        console.error('Failed to get admin user:', err);
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    }

    if (mounted) {
      initAdmin();
    }
  }, [mounted, router]);

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    router.push('/admin/login');
  };

  return {
    pathname,
    sidebarOpen,
    setSidebarOpen,
    mounted,
    searchQuery,
    setSearchQuery,
    currentUser,
    setCurrentUser,
    loading,
    handleLogout,
    // Settings
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
