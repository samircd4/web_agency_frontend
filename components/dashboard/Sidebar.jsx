'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, usePathname } from 'next/navigation';
import { ArrowLeft, Zap, Box, MessageSquare, CreditCard, Settings, LogOut, X, Store, Briefcase, ArrowLeftRight, FolderKanban, BookOpen } from 'lucide-react';
import { api } from '@/lib/api';

export default function DashboardSidebar({
    isSidebarOpen,
    setIsSidebarOpen,
    handleLogout,
    pendingInvoiceCount,
    pendingProposalCount,
    hasUnreadComms,
    currentUser,
    onSwitchRole,
}) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const pathTab = pathname?.startsWith('/dashboard/') ? pathname.split('/')[2] : null;
    const currentTab = searchParams?.get('tab') || pathTab || 'projects';

    // Read active_role from localStorage (immediate) then keep in sync with currentUser prop
    const getStoredRole = () => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('active_role') || 'buyer';
        }
        return 'buyer';
    };

    const [activeRole, setActiveRole] = useState(getStoredRole);

    // Sync whenever currentUser prop updates (e.g., after handleSwitchRole resolves)
    useEffect(() => {
        if (currentUser?.active_role) {
            setActiveRole(currentUser.active_role);
            if (typeof window !== 'undefined') {
                localStorage.setItem('active_role', currentUser.active_role);
            }
        }
    }, [currentUser?.active_role]);

    const isSellerMode = activeRole === 'seller';

    const items = isSellerMode
        ? [
            { id: 'projects', name: 'Active Orders', icon: <Briefcase size={16} /> },
            { id: 'services', name: 'My Services', icon: <Store size={16} /> },
            { id: 'portfolio', name: 'My Portfolio', icon: <FolderKanban size={16} /> },
            { id: 'blog', name: 'My Articles', icon: <BookOpen size={16} /> },
            {
                id: 'comms',
                name: 'Messages',
                icon: <MessageSquare size={16} />,
                notificationDot: hasUnreadComms,
            },
            {
                id: 'billing',
                name: 'Seller Invoices',
                icon: <CreditCard size={16} />,
                notificationDot: pendingProposalCount > 0 || pendingInvoiceCount > 0,
            },
            { id: 'vault', name: 'Deliverables Vault', icon: <Box size={16} /> },
            { id: 'settings', name: 'Seller Settings', icon: <Settings size={16} /> },
        ]
        : [
            { id: 'projects', name: 'Projects', icon: <Zap size={16} /> },
            { id: 'vault', name: 'Secure Vault', icon: <Box size={16} /> },
            {
                id: 'comms',
                name: 'Messages',
                icon: <MessageSquare size={16} />,
                notificationDot: hasUnreadComms,
            },
            {
                id: 'billing',
                name: 'Billing',
                icon: <CreditCard size={16} />,
                notificationDot: pendingProposalCount > 0 || pendingInvoiceCount > 0,
            },
            { id: 'settings', name: 'Settings', icon: <Settings size={16} /> },
        ];

    const handleQuickRoleSwitch = async () => {
        const targetRole = isSellerMode ? 'buyer' : 'seller';
        // Immediately flip local state for instant UI feedback
        setActiveRole(targetRole);
        if (typeof window !== 'undefined') {
            localStorage.setItem('active_role', targetRole);
        }
        try {
            if (onSwitchRole) {
                await onSwitchRole(targetRole);
            } else {
                await api.switchRole(targetRole);
            }
        } catch (err) {
            // Revert on error
            const revert = isSellerMode ? 'seller' : 'buyer';
            setActiveRole(revert);
            if (typeof window !== 'undefined') {
                localStorage.setItem('active_role', revert);
            }
            console.error('Role switch failed:', err);
        }
    };

    return (
        <aside className={`fixed left-0 top-0 bottom-0 w-64 bg-slate-950/80 backdrop-blur-xl border border-white/5 z-[101] flex flex-col p-4 transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-[110%] lg:translate-x-0'} shadow-2xl shadow-black/50`}>
            <div className="flex items-center justify-between mb-4">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="relative w-8 h-8 group-hover:scale-110 transition-transform duration-500">
                        <div className={`absolute inset-0 ${isSellerMode ? 'bg-purple-500/20' : 'bg-brand-teal/20'} rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity`} />
                        <div className={`relative w-full h-full glass rounded-lg flex items-center justify-center overflow-hidden border-white/10 ${isSellerMode ? 'group-hover:border-purple-500/30' : 'group-hover:border-brand-teal/30'}`}>
                            <Image
                                src="/images/logo/logo.png"
                                alt="Logo"
                                fill
                                sizes="32px"
                                priority
                                className="object-contain p-1"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-black text-white tracking-tight leading-none uppercase">Dr.Python</span>
                        <span className={`text-[8px] font-bold ${isSellerMode ? 'text-purple-400' : 'text-brand-teal'} uppercase tracking-[0.2em] leading-none mt-1`}>Solutions</span>
                    </div>
                </Link>
                <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-slate-500 hover:text-white">
                    <X size={20} />
                </button>
            </div>

            {/* Active Mode Banner — always visible, always switchable */}
            <div className={`mb-4 px-3 py-2 rounded-lg border text-[10px] font-black uppercase tracking-wider flex items-center justify-between ${
                isSellerMode ? 'bg-purple-950/40 border-purple-500/30 text-purple-300' : 'bg-teal-950/40 border-brand-teal/30 text-brand-teal'
            }`}>
                <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${isSellerMode ? 'bg-purple-400' : 'bg-brand-teal'} animate-pulse`} />
                    <span>{isSellerMode ? '⚡ Seller Mode' : '🛒 Buyer Mode'}</span>
                </div>
                <button
                    onClick={handleQuickRoleSwitch}
                    title={isSellerMode ? 'Switch to Buyer Mode' : 'Switch to Seller Mode'}
                    className={`flex items-center gap-1 px-2 py-0.5 rounded transition-all cursor-pointer text-[8px] font-black uppercase tracking-wider border ${
                        isSellerMode
                            ? 'bg-teal-900/40 border-teal-500/30 text-teal-300 hover:bg-teal-800/50'
                            : 'bg-purple-900/40 border-purple-500/30 text-purple-300 hover:bg-purple-800/50'
                    }`}
                >
                    <ArrowLeftRight size={10} />
                    <span>{isSellerMode ? 'Buyer' : 'Seller'}</span>
                </button>
            </div>


            <nav className="flex-grow space-y-1">
                <Link
                    href="/"
                    className="group flex items-center gap-2 w-full px-3 py-2.5 rounded-lg border border-white/10 bg-white/[0.02] text-slate-400 hover:text-white hover:bg-white/5 hover:border-white/20 transition-all duration-200 shadow-sm hover:shadow-md mb-2"
                    title="Back to Website"
                >
                    <ArrowLeft size={16} className="transition-transform duration-200 group-hover:-translate-x-1" />
                    <span className="text-xs font-semibold uppercase tracking-[0.2em]">Back to Website</span>
                </Link>

                {items.map((item) => {
                    const isActive = currentTab === item.id;
                    return (
                        <Link
                            key={item.id}
                            href={`/dashboard/${item.id}`}
                            onClick={() => setIsSidebarOpen(false)}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all relative ${isActive
                                ? isSellerMode
                                    ? 'text-purple-400 bg-purple-500/10 border border-purple-500/30'
                                    : 'text-brand-teal bg-brand-teal/5 border border-brand-teal/20'
                                : 'text-slate-500 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {item.icon}
                            {item.name}
                            {item.notificationDot && (
                                <span className="absolute right-3 w-2 h-2 rounded-full bg-brand-red animate-pulse" />
                            )}
                        </Link>
                    );
                })}

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-brand-red hover:bg-brand-red/5 border border-transparent hover:border-brand-red/20 transition-all mt-4"
                >
                    <LogOut size={16} />
                    Logout Node
                </button>
            </nav>

            <div className="mt-auto p-3 rounded-lg bg-white/[0.02] border border-white/5">
                <div className="flex items-center justify-between mb-2" suppressHydrationWarning>
                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-50">System</span>
                    <span className={`flex h-1.5 w-1.5 rounded-full ${isSellerMode ? 'bg-purple-400' : 'bg-brand-teal'} animate-pulse`} />
                </div>
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[9px] font-bold">
                        <span>Role Status</span>
                        <span className={isSellerMode ? 'text-purple-300' : 'text-brand-teal'}>
                            {currentUser?.user_role === 'both' ? 'Buyer + Seller' : isSellerMode ? 'Seller Only' : 'Buyer Only'}

                        </span>
                    </div>
                    <div className="flex items-center justify-between text-[9px] font-bold">
                        <span>Uptime</span>
                        <span className="text-white">99.9%</span>
                    </div>
                </div>
            </div>
        </aside>
    );
}

