'use client';

import React from 'react';
import AvatarUpload from './AvatarUpload';

export default function PersonalInfoSettings({
    currentUser,
    userInitials,
    sysConfigName,
    setSysConfigName,
    sysConfigEmail,
    setSysConfigEmail,
    handleSaveSettings,
    isSaving,
    saveSuccess,
}) {
    return (
        <div className="max-w-2xl glass border-white/5 rounded-xl p-6">
            <div className="space-y-6">
                <AvatarUpload currentUser={currentUser} userInitials={userInitials} />

                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-[8px] font-black uppercase tracking-widest text-muted ml-2">First Name</label>
                        <input
                            type="text"
                            value={currentUser?.first_name || ''}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-xs text-white focus:outline-none focus:border-brand-teal/50"
                            disabled
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[8px] font-black uppercase tracking-widest text-muted ml-2">Last Name</label>
                        <input
                            type="text"
                            value={currentUser?.last_name || ''}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-xs text-white focus:outline-none focus:border-brand-teal/50"
                            disabled
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-[8px] font-black uppercase tracking-widest text-muted ml-2">Username</label>
                    <input
                        type="text"
                        value={currentUser?.username || ''}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-xs text-white focus:outline-none focus:border-brand-teal/50"
                        disabled
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-[8px] font-black uppercase tracking-widest text-muted ml-2">Display Name</label>
                    <input
                        type="text"
                        value={sysConfigName}
                        onChange={(e) => setSysConfigName(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-xs text-white focus:outline-none focus:border-brand-teal/50"
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-[8px] font-black uppercase tracking-widest text-muted ml-2">Email Address</label>
                    <input
                        type="email"
                        value={sysConfigEmail}
                        onChange={(e) => setSysConfigEmail(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-xs text-white focus:outline-none focus:border-brand-teal/50"
                    />
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                    <div className="text-[8px] font-black uppercase tracking-widest text-muted mb-1">Account Specifications</div>
                    <div className="flex justify-between text-xs">
                        <span className="text-muted">Role Status:</span>
                        <span className="text-white font-bold">{currentUser?.is_staff ? 'Staff Member' : 'Associated Client'}</span>
                    </div>
                    {currentUser?.date_joined && (
                        <div className="flex justify-between text-xs">
                            <span className="text-muted">Member Since:</span>
                            <span className="text-white">{new Date(currentUser.date_joined).toLocaleDateString()}</span>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleSaveSettings}
                        disabled={isSaving}
                        className="px-5 py-2 bg-brand-teal text-primary rounded-lg text-[9px] font-black uppercase tracking-widest shadow-glow-teal hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSaving ? 'Saving...' : 'Save Settings'}
                    </button>
                    {saveSuccess && (
                        <span className="text-emerald-300 text-xs font-bold">✓ Saved successfully!</span>
                    )}
                </div>
            </div>
        </div>
    );
}
