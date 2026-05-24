'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, Users, Briefcase, FolderKanban,
    FileEdit, Bell, Search, Menu, X, LogOut, ChevronRight,
    Zap, Globe, Shield
} from 'lucide-react';

const NAV_ITEMS = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { href: '/admin/leads', label: 'Leads', icon: Zap },
    { href: '/admin/projects', label: 'Projects', icon: Briefcase },
    { href: '/admin/clients', label: 'Clients', icon: Users },
    { href: '/admin/cms', label: 'Content (CMS)', icon: FileEdit },
];

function NavItem({ item, active, onClick }) {
    const Icon = item.icon;
    return (
        <Link
            href={item.href}
            onClick={onClick}
            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all group ${
                active
                    ? 'bg-admin-accent/10 text-admin-accent border border-admin-accent/20'
                    : 'text-text-muted hover:text-text-primary hover:bg-white/5 border border-transparent'
            }`}
        >
            <Icon size={16} className={active ? 'text-admin-accent' : 'text-text-muted group-hover:text-text-primary transition-colors'} />
            {item.label}
            {active && <ChevronRight size={12} className="ml-auto" />}
        </Link>
    );
}

export default function AdminLayout({ children }) {
    const pathname = usePathname();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    const isActive = (item) =>
        item.exact ? pathname === item.href : pathname.startsWith(item.href);

    const handleLogout = () => {
        document.cookie = 'admin_session=; path=/; max-age=0';
        router.push('/admin/login');
    };

    // Don't render admin shell on login page
    if (pathname === '/admin/login') return <>{children}</>;

    return (
        <div className="min-h-screen bg-background text-text-secondary overflow-x-hidden">

            {/* Mobile sidebar overlay */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setSidebarOpen(false)}
                        className="fixed inset-0 bg-surface-900/80 backdrop-blur-sm z-[100] lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* ─── Sidebar ─── */}
            <aside className={`fixed left-4 top-4 bottom-4 w-60 bg-surface-900/80 backdrop-blur-xl border border-border-subtle z-[101] flex flex-col p-5 rounded-2xl transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-[110%] lg:translate-x-0'} shadow-2xl shadow-black/50`}>

                {/* Logo */}
                <div className="flex items-center justify-between mb-8">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative w-8 h-8 group-hover:scale-110 transition-transform duration-300">
                            <div className="absolute inset-0 bg-brand-teal/20 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative w-full h-full glass rounded-lg flex items-center justify-center overflow-hidden border border-white/10">
                                <Image src="/images/logo/logo.png" alt="Logo" fill sizes="32px" priority className="object-contain p-1" />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-black text-text-primary tracking-tight leading-none uppercase">Dr.Python</span>
                            <span className="text-[10px] font-bold text-admin-danger uppercase tracking-[0.2em] leading-none mt-1">Admin</span>
                        </div>
                    </Link>
                    <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1.5 text-text-dim hover:text-text-primary">
                        <X size={16} />
                    </button>
                </div>

                {/* Section label */}
                <div className="text-[9px] font-black text-text-dim uppercase tracking-[0.3em] mb-3 ml-2">Navigation</div>

                {/* Nav links */}
                <nav className="flex-grow space-y-1">
                    {NAV_ITEMS.map((item) => (
                        <NavItem
                            key={item.href}
                            item={item}
                            active={isActive(item)}
                            onClick={() => setSidebarOpen(false)}
                        />
                    ))}
                </nav>

                {/* Footer utilities */}
                <div className="space-y-2 mt-4">
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                        <div className="flex items-center gap-2 mb-2">
                            <Shield size={12} className="text-admin-accent" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-text-muted">System Status</span>
                            <span className="ml-auto flex h-1.5 w-1.5 rounded-full bg-admin-accent animate-pulse" />
                        </div>
                        <div className="flex justify-between text-[10px] font-bold">
                            <span className="text-text-muted">Uptime</span>
                            <span className="text-text-primary">99.9%</span>
                        </div>
                    </div>

                    <Link href="/" className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-black uppercase tracking-widest text-text-muted hover:text-text-primary hover:bg-white/5 transition-all">
                        <Globe size={14} /> View Site
                    </Link>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-black uppercase tracking-widest text-text-muted hover:text-admin-danger hover:bg-admin-danger/5 transition-all"
                    >
                        <LogOut size={14} /> Logout
                    </button>
                </div>
            </aside>

            {/* ─── Main Content ─── */}
            <div className="lg:pl-[272px] min-h-screen flex flex-col">

                {/* Top Header */}
                <header className="sticky top-0 sm:top-4 mx-0 sm:mx-4 mt-0 sm:mt-4 z-40 h-14 bg-surface-900/70 backdrop-blur-xl border border-border-light rounded-none sm:rounded-xl flex items-center justify-between px-3 sm:px-5 shadow-xl shadow-black/30">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2 -ml-1 text-text-secondary hover:text-text-primary transition-colors"
                        >
                            <Menu size={18} />
                        </button>

                        {/* Search */}
                        <div className="hidden sm:flex items-center gap-2 bg-white/5 border border-white/5 rounded-lg px-3 py-1 w-72">
                            <Search size={14} className="text-text-muted shrink-0" />
                            <input
                                id="admin-search"
                                type="text"
                                placeholder="Search leads, projects, clients..."
                                className="bg-transparent border-none outline-none text-xs text-text-primary placeholder:text-text-dim w-full font-bold"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button className="relative p-2 rounded-lg bg-white/5 text-text-muted hover:text-text-primary transition-all border border-white/5">
                            <Bell size={14} />
                            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-admin-danger rounded-full border border-slate-950" />
                        </button>
                        <div className="h-4 w-px bg-white/10 mx-1" />
                        <div className="flex items-center gap-2.5">
                            <div className="text-right hidden sm:block">
                                <div className="text-xs font-black text-text-primary uppercase tracking-tight">Samir</div>
                                <div className="text-[9px] font-bold text-admin-danger uppercase tracking-widest">Superadmin</div>
                            </div>
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-red to-brand-indigo flex items-center justify-center font-black text-text-primary text-xs border border-white/10">
                                SA
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-grow p-2 sm:p-4 lg:p-6 pt-3 sm:pt-5">
                    {mounted ? children : null}
                </main>
            </div>
        </div>
    );
}
