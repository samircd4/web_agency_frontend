'use client';

import { motion, AnimatePresence } from 'framer-motion';
import useAdminDashboard from '@/hooks/useAdminDashboard';
import PersonalInfoSettings from '@/components/dashboard/PersonalInfoSettings';
import SecuritySettings from '@/components/dashboard/SecuritySettings';

const fadeIn = (delay = 0) => ({
    initial: { opacity: 0, y: 5 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay },
});

export default function AdminSettings() {
    const {
        currentUser,
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
    } = useAdminDashboard();

    const userInitials =
        currentUser?.first_name && currentUser?.last_name
            ? `${currentUser.first_name[0]}${currentUser.last_name[0]}`.toUpperCase()
            : (currentUser?.username || 'SA').slice(0, 2).toUpperCase();

    return (
        <div className="space-y-6">
            <motion.div
                {...fadeIn()}
                className="mb-6"
            >
                <h1 className="text-2xl font-black text-white mb-1 tracking-tight uppercase">
                    System Config
                </h1>
                <p className="text-muted text-xs">Manage your account and security settings.</p>
            </motion.div>

            <div className="flex items-center gap-2 mb-6">
                <button
                    type="button"
                    onClick={() => setSettingsView('personal')}
                    className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border flex items-center gap-2 ${settingsView === 'personal'
                        ? 'bg-brand-teal/10 border-brand-teal/20 text-brand-teal'
                        : 'bg-white/5 border-white/10 text-muted hover:text-white hover:bg-white/10'
                        }`}
                >
                    Personal Info
                </button>
                <button
                    type="button"
                    onClick={() => setSettingsView('security')}
                    className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border flex items-center gap-2 ${settingsView === 'security'
                        ? 'bg-brand-teal/10 border-brand-teal/20 text-brand-teal'
                        : 'bg-white/5 border-white/10 text-muted hover:text-white hover:bg-white/10'
                        }`}
                >
                    Security
                </button>
            </div>

            <AnimatePresence mode="wait">
                {settingsView === 'personal' && (
                    <PersonalInfoSettings
                        key="personal"
                        currentUser={currentUser}
                        userInitials={userInitials}
                        firstName={firstName}
                        setFirstName={setFirstName}
                        lastName={lastName}
                        setLastName={setLastName}
                        username={username}
                        setUsername={setUsername}
                        email={email}
                        setEmail={setEmail}
                        handleSaveSettings={handleSaveSettings}
                        isSaving={isSaving}
                        saveSuccess={saveSuccess}
                        handleAvatarChange={handleAvatarChange}
                        usernameStatus={usernameStatus}
                        usernameCheckLoading={usernameCheckLoading}
                    />
                )}
                {settingsView === 'security' && (
                    <SecuritySettings key="security" currentUser={currentUser} />
                )}
            </AnimatePresence>
        </div>
    );
}
