'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, ShieldCheck, Store, Settings, LogOut } from 'lucide-react';
import { getFullAvatarUrl } from '@/lib/api';

export default function UserAvatarDropdown({ currentUser, userDisplayName, userInitials, handleLogout, router }) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Handle outside clicks to close the avatar dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!currentUser) return null;

    return (
        <div className="flex items-center gap-2 ml-1 relative" ref={dropdownRef}>
            {/* Avatar Button */}
            <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-9 h-9 rounded-full bg-brand-teal flex items-center justify-center font-black text-white text-xs border border-white/20 shadow-glow-teal hover:scale-105 transition-transform cursor-pointer"
                title={userDisplayName}
            >
                {currentUser.avatar ? (
                    <img src={getFullAvatarUrl(currentUser.avatar)} alt="User Avatar" width={36} height={36} className="rounded-full object-cover" />
                ) : (
                    userInitials
                )}
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
                {isDropdownOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-3 w-64 rounded-xl bg-slate-900/95 backdrop-blur-xl border border-white/10 p-4 shadow-2xl z-50 text-left"
                    >
                        {/* Profile Name & Role */}
                        <div className="px-2 py-1 flex flex-col">
                            <span className="text-sm font-black text-white leading-tight">{userDisplayName}</span>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{currentUser.is_staff ? 'ADMIN' : 'BUYER'}</span>
                        </div>

                        <div className="h-px bg-white/5 my-2.5" />

                        {/* Options List */}
                        <div className="space-y-1">
                            <Link
                                href="/services"
                                onClick={() => setIsDropdownOpen(false)}
                                className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold text-slate-300 hover:text-white hover:bg-white/5 transition-all group"
                            >
                                <Store size={14} className="text-slate-400 group-hover:text-brand-teal transition-colors" />
                                Marketplace
                            </Link>
                            <Link
                                href={currentUser.is_staff ? "/admin" : "/dashboard/settings"}
                                onClick={() => setIsDropdownOpen(false)}
                                className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold text-slate-300 hover:text-white hover:bg-white/5 transition-all group"
                            >
                                <Settings size={14} className="text-slate-400 group-hover:text-brand-teal transition-colors" />
                                Settings
                            </Link>
                            <Link
                                href={currentUser.is_staff ? "/admin" : "/dashboard"}
                                onClick={() => setIsDropdownOpen(false)}
                                className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-black uppercase tracking-wider text-brand-teal hover:text-brand-teal/80 hover:bg-brand-teal/5 transition-all group"
                            >
                                <LayoutDashboard size={14} className="text-brand-teal" />
                                {currentUser.is_staff ? 'Admin Dashboard' : 'Buyer Dashboard'}
                            </Link>
                        </div>

                        <div className="h-px bg-white/5 my-2.5" />

                        {/* Sign out */}
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold text-brand-red hover:bg-brand-red/5 transition-all group cursor-pointer text-left"
                        >
                            <LogOut size={14} className="text-brand-red" />
                            Sign out
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
