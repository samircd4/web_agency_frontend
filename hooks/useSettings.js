'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '@/lib/api';

export default function useSettings(currentUser, onUserUpdate) {
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
      
      if (onUserUpdate) {
        onUserUpdate(updatedUser);
      }
      
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

  return {
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
