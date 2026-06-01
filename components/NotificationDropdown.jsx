'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NotificationDropdown() {
    const router = useRouter();
    const [notifications, setNotifications] = useState([
        { type: 'project_activity', message: "New task 'Design Homepage' added to Project Alpha.", link: "/dashboard?tab=projects&project=alpha&task=design-homepage" },
        { type: 'project_status', message: "Project Beta status updated to 'In Progress'.", link: "/dashboard?tab=projects&project=beta" },
        { type: 'invoice_payment', message: "Invoice #2024001 for $1,500 has been paid.", link: "/dashboard?tab=billing&invoice=2024001" },
        { type: 'proposal', message: "New proposal for 'Marketing Campaign' received.", link: "/dashboard?tab=proposals&proposal=marketing-campaign" },
        { type: 'system', message: "System update completed successfully.", link: "/admin?tab=settings" },
        { type: 'message', message: "You have 2 new messages from Sarah.", link: "/dashboard?tab=messages" },
        { type: 'project_activity', message: "Milestone 'Phase 1 Complete' achieved for Project Gamma.", link: "/dashboard?tab=projects&project=gamma" },
    ]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="relative p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white transition-all border border-white/5"
            >
                <Bell size={18} />
                {notifications.length > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-brand-red rounded-full border border-slate-950" />
                )}
            </button>

            <AnimatePresence>
                {isDropdownOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-3 w-64 rounded-xl bg-slate-900/95 backdrop-blur-xl border border-white/10 p-4 shadow-2xl z-50 text-left"
                    >
                        <div className="px-2 py-1">
                            <span className="text-sm font-black text-white leading-tight">Notifications</span>
                        </div>

                        <div className="h-px bg-white/5 my-2.5" />

                        {notifications.length > 0 ? (
                            <div className="space-y-2">
                                {notifications.map((notification, index) => (
                                    <Link
                                        key={index}
                                        href={notification.link}
                                        onClick={() => {
                                            setIsDropdownOpen(false);
                                            router.push(notification.link);
                                        }}
                                        className="block px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                                    >
                                        {notification.message}
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="text-xs text-slate-500 px-2 py-1">No new notifications</div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
