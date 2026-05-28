'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
    LayoutDashboard,
    Users,
    Briefcase,
    FolderKanban,
    FileEdit,
    LogOut,
    X,
    ChevronRight,
    Zap,
    Globe,
    Shield,
    DollarSign,
    Settings,
    MessageSquare,
} from 'lucide-react';

const NAV_ITEMS = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { href: '/admin/leads', label: 'Leads', icon: Zap },
    { href: '/admin/projects', label: 'Projects', icon: Briefcase },
    { href: '/admin/clients', label: 'Clients', icon: Users },
    { href: '/admin/billing', label: 'Billing', icon: DollarSign },
    { href: '/admin/cms', label: 'Content (CMS)', icon: FileEdit },
    { href: '/admin/communications', label: 'Communications', icon: MessageSquare },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
];

function NavItem({ item, active, onClick }) {
    const Icon = item.icon;
    return (
        <Link
            href={item.href}
            onClick={onClick}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all relative ${active
                ? 'bg-brand-teal/10 text-brand-teal border border-brand-teal/20 shadow-glow-teal/5'
                : 'text-slate-500 hover:text-white hover:bg-white/5'
                }`}
        >
            <Icon size={16} />
            {item.label}
            {active && <ChevronRight size={12} className="ml-auto" />}
        </Link>
    );
}

export default function AdminSidebar({
    pathname,
    sidebarOpen,
    setSidebarOpen,
    handleLogout,
}) {
    const isActive = (item) =>
        item.exact ? pathname === item.href : pathname.startsWith(item.href);

    return (
        <aside className={`fixed left-4 top-4 bottom-4 w-60 bg-slate-950/80 backdrop-blur-xl border border-white/5 z-[101] flex flex-col p-5 rounded-xl transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-[110%] lg:translate-x-0'} shadow-2xl shadow-black/50`}>
            <div className="flex items-center justify-between mb-8">
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

            <nav className="flex-grow space-y-1 overflow-y-auto pr-1">
                {NAV_ITEMS.map((item) => (
                    <NavItem
                        key={item.href}
                        item={item}
                        active={isActive(item)}
                        onClick={() => setSidebarOpen(false)}
                    />
                ))}
            </nav>

            <div className="mt-auto space-y-2">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">System</span>
                        <span className="flex h-1.5 w-1.5 rounded-full bg-brand-teal animate-pulse" />
                    </div>
                    <div className="space-y-2">
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

                <Link
                    href="/"
                    className="flex items-center gap-2 w-full px-4 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-white hover:bg-white/5 transition-all"
                >
                    <Globe size={16} />
                    View Site
                </Link>

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-brand-red hover:bg-brand-red/5 border border-transparent hover:border-brand-red/20 transition-all"
                >
                    <LogOut size={16} />
                    Logout Node
                </button>
            </div>
        </aside>
    );
}
