'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    Briefcase,
    Zap,
    FileEdit,
    DollarSign,
    Settings,
    MessageSquare,
    LogOut,
    X,
    ArrowLeft,
} from 'lucide-react';

export default function AdminSidebar({
    sidebarOpen,
    setSidebarOpen,
    handleLogout,
}) {
    const pathname = usePathname();

    const items = [
        { id: 'dashboard', href: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
        { id: 'leads', href: '/admin/leads', label: 'Leads', icon: <Zap size={16} /> },
        { id: 'projects', href: '/admin/projects', label: 'Projects', icon: <Briefcase size={16} /> },
        { id: 'clients', href: '/admin/clients', label: 'Clients', icon: <Users size={16} /> },
        { id: 'billing', href: '/admin/billing', label: 'Billing', icon: <DollarSign size={16} /> },
        { id: 'cms', href: '/admin/cms', label: 'Content (CMS)', icon: <FileEdit size={16} /> },
        { id: 'communications', href: '/admin/communications', label: 'Communications', icon: <MessageSquare size={16} /> },
        { id: 'settings', href: '/admin/settings', label: 'Settings', icon: <Settings size={16} /> },
    ];

    const isActive = (href) => pathname === href || pathname.startsWith(href + '/');

    return (
        <aside className={`fixed left-0 top-0 bottom-0 w-64 bg-slate-950/80 backdrop-blur-xl border border-white/5 z-[101] flex flex-col p-4 transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-[110%] lg:translate-x-0'} shadow-2xl shadow-black/50`}>
            <div className="flex items-center justify-between mb-6">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="relative w-8 h-8 group-hover:scale-110 transition-transform duration-500">
                        <div className="absolute inset-0 bg-brand-teal/20 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative w-full h-full glass rounded-lg flex items-center justify-center overflow-hidden border-white/10 group-hover:border-brand-teal/30">
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
                        <span className="text-[8px] font-bold text-brand-teal uppercase tracking-[0.2em] leading-none mt-1">Admin</span>
                    </div>
                </Link>
                <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 text-slate-500 hover:text-white">
                    <X size={20} />
                </button>
            </div>

            <nav className="flex-grow space-y-1">
                <Link
                    href="/"
                    className="group flex items-center gap-2 w-full px-3 py-2.5 rounded-lg border border-white/10 bg-white/[0.02] text-slate-400 hover:text-white hover:bg-white/5 hover:border-white/20 transition-all duration-200 shadow-sm hover:shadow-md"
                    title="Back to Website"
                >
                    <ArrowLeft size={16} className="transition-transform duration-200 group-hover:-translate-x-1" />
                    <span className="text-xs font-semibold uppercase tracking-[0.2em]">Back to Website</span>
                </Link>

                {items.map((item) => (
                    <Link
                        key={item.id}
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all relative ${isActive(item.href)
                            ? 'text-brand-teal bg-brand-teal/5 border border-brand-teal/20'
                            : 'text-slate-500 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        {item.icon}
                        {item.label}
                    </Link>
                ))}

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-brand-red hover:bg-brand-red/5 border border-transparent hover:border-brand-red/20 transition-all"
                >
                    <LogOut size={16} />
                    Logout
                </button>
            </nav>

            <div className="mt-auto p-3 rounded-lg bg-white/[0.02] border border-white/5">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-50">System</span>
                    <span className="flex h-1.5 w-1.5 rounded-full bg-brand-teal animate-pulse" />
                </div>
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[9px] font-bold">
                        <span>Uptime</span>
                        <span className="text-white">99.9%</span>
                    </div>
                    <div className="flex items-center justify-between text-[9px] font-bold">
                        <span>Ping</span>
                        <span className="text-white">14ms</span>
                    </div>
                </div>
            </div>
        </aside>
    );
}
