'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, ShieldCheck, Store, Settings, LogOut, ArrowLeftRight, Briefcase, UserCheck, RefreshCw } from 'lucide-react';
import { api, getFullAvatarUrl } from '@/lib/api';

export default function UserAvatarDropdown({ currentUser, userDisplayName, userInitials, handleLogout, router, onRoleSwitch }) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [switching, setSwitching] = useState(false);
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

    const isStaff = currentUser?.is_staff;
    const isBoth = currentUser?.is_both || currentUser?.user_role === 'both';
    const isBuyer = currentUser?.is_buyer;
    const isSeller = currentUser?.is_seller;
    const activeRole = currentUser?.active_role || 'buyer';

    const handleSwitchRoleToggle = async () => {
        const nextRole = activeRole === 'seller' ? 'buyer' : 'seller';
        try {
            setSwitching(true);
            await api.switchRole(nextRole);
            if (onRoleSwitch) onRoleSwitch(nextRole);
            window.location.reload();
        } catch (err) {
            console.error('Role switch failed:', err);
        } finally {
            setSwitching(false);
        }
    };

    const handleBecomeSellerClick = async () => {
        try {
            setSwitching(true);
            await api.becomeSeller();
            window.location.reload();
        } catch (err) {
            console.error('Become seller failed:', err);
        } finally {
            setSwitching(false);
        }
    };

    const handleBecomeBuyerClick = async () => {
        try {
            setSwitching(true);
            await api.becomeBuyer();
            window.location.reload();
        } catch (err) {
            console.error('Become buyer failed:', err);
        } finally {
            setSwitching(false);
        }
    };

    const getRoleBadgeLabel = () => {
        if (isStaff) return 'ADMIN';
        if (isBoth) return `BUYER & SELLER (${activeRole.toUpperCase()} MODE)`;
        if (isSeller) return 'SELLER';
        if (isBuyer) return 'BUYER';
        return 'NORMAL USER';
    };

    return (
        <div className="flex items-center gap-2 ml-1 relative" ref={dropdownRef}>
            {/* Avatar Button */}
            <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`w-9 h-9 rounded-full ${activeRole === 'seller' ? 'bg-purple-600' : 'bg-brand-teal'} flex items-center justify-center font-black text-white text-xs border border-white/20 shadow-glow-teal hover:scale-105 transition-transform cursor-pointer`}
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
                        className="absolute right-0 top-full mt-3 w-72 rounded-xl bg-slate-900/95 backdrop-blur-xl border border-white/10 p-4 shadow-2xl z-50 text-left"
                    >
                        {/* Profile Name & Role */}
                        <div className="px-2 py-1 flex flex-col">
                            <span className="text-sm font-black text-white leading-tight">{userDisplayName}</span>
                            <div className="flex items-center gap-1.5 mt-1">
                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                                    isStaff ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                                    isBoth ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                                    isSeller ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                                    isBuyer ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                                    'bg-slate-700 text-slate-300'
                                } uppercase tracking-wider`}>
                                    {getRoleBadgeLabel()}
                                </span>
                            </div>
                        </div>

                        {/* Dual Role Switcher Action */}
                        {!isStaff && isBoth && (
                            <div className="mt-3 px-1">
                                <button
                                    onClick={handleSwitchRoleToggle}
                                    disabled={switching}
                                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-brand-teal/10 hover:bg-brand-teal/20 text-brand-teal text-xs font-bold transition-all border border-brand-teal/20 cursor-pointer"
                                >
                                    <span>Switch to {activeRole === 'seller' ? 'Buyer Mode' : 'Seller Mode'}</span>
                                    {switching ? <RefreshCw size={14} className="animate-spin" /> : <ArrowLeftRight size={14} />}
                                </button>
                            </div>
                        )}

                        {/* Become Seller / Become Buyer Action Buttons */}
                        {!isStaff && !isBoth && (
                            <div className="mt-3 px-1 space-y-1.5">
                                {!isSeller && (
                                    <button
                                        onClick={handleBecomeSellerClick}
                                        disabled={switching}
                                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 text-xs font-bold transition-all border border-purple-500/20 cursor-pointer"
                                    >
                                        <span>Become a Seller</span>
                                        {switching ? <RefreshCw size={14} className="animate-spin" /> : <Briefcase size={14} />}
                                    </button>
                                )}
                                {!isBuyer && (
                                    <button
                                        onClick={handleBecomeBuyerClick}
                                        disabled={switching}
                                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 text-xs font-bold transition-all border border-blue-500/20 cursor-pointer"
                                    >
                                        <span>Activate Buyer Profile</span>
                                        {switching ? <RefreshCw size={14} className="animate-spin" /> : <UserCheck size={14} />}
                                    </button>
                                )}
                            </div>
                        )}

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
                                {currentUser.is_staff ? 'Admin Dashboard' : activeRole === 'seller' ? 'Seller Dashboard' : 'Buyer Dashboard'}
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

