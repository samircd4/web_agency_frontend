'use client';

import { useState, useEffect } from 'react';

export default function useSettings(currentUser) {
  const [settingsView, setSettingsView] = useState('personal');
  const [sysConfigName, setSysConfigName] = useState('');
  const [sysConfigEmail, setSysConfigEmail] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

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

  const handleSaveSettings = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    
    try {
      // TODO: Add API call to save settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
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
  };
}
