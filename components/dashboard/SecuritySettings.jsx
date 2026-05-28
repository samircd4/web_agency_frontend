'use client';

import React from 'react';

export default function SecuritySettings() {
  return (
    <div className="max-w-2xl glass border-white/5 rounded-xl p-6">
      <div className="space-y-6">
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <div className="text-xs font-black text-amber-200 uppercase tracking-widest mb-1">Security Settings</div>
              <div className="text-xs text-amber-200/80">For security reasons, password and 2FA settings can only be modified through the admin panel or by contacting support.</div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-black text-white uppercase tracking-widest mb-1">Change Password</div>
                <div className="text-xs text-muted">Update your account password</div>
              </div>
              <button className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-black uppercase tracking-[0.14em] text-muted hover:text-white hover:bg-white/10 transition-all" disabled>
                Coming Soon
              </button>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-black text-white uppercase tracking-widest mb-1">Two-Factor Authentication</div>
                <div className="text-xs text-muted">Add an extra layer of security to your account</div>
              </div>
              <button className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-black uppercase tracking-[0.14em] text-muted hover:text-white hover:bg-white/10 transition-all" disabled>
                Coming Soon
              </button>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-black text-white uppercase tracking-widest mb-1">Active Sessions</div>
                <div className="text-xs text-muted">View and manage your active login sessions</div>
              </div>
              <button className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-black uppercase tracking-[0.14em] text-muted hover:text-white hover:bg-white/10 transition-all" disabled>
                Coming Soon
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
