'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export default function useSettings(currentUser, onUserUpdate) {
  const [settingsView, setSettingsView] = useState('personal');
  const [sysConfigName, setSysConfigName] = useState('');
  const [sysConfigEmail, setSysConfigEmail] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [pendingAvatar, setPendingAvatar] = useState(null);

  // Initialize settings when currentUser loads
  useEffect(() => {
    if (currentUser) {
      setSysConfigEmail(currentUser.email || '');
      setSysConfigName(
        `${currentUser.first_name || ''} ${currentUser.last_name || ''}`.trim() ||
          currentUser.username
      );
    }
  }, [currentUser]);

  const handleAvatarChange = (file) => {
    setPendingAvatar(file);
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    
    try {
      const updateData = {};
      
      // Update name parts
      const nameParts = sysConfigName.split(' ');
      updateData.first_name = nameParts[0] || '';
      updateData.last_name = nameParts.slice(1).join(' ') || '';
      
      // Update email
      if (sysConfigEmail !== currentUser?.email) {
        updateData.email = sysConfigEmail;
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
    sysConfigName,
    setSysConfigName,
    sysConfigEmail,
    setSysConfigEmail,
    isSaving,
    saveSuccess,
    handleSaveSettings,
    handleAvatarChange,
  };
}
