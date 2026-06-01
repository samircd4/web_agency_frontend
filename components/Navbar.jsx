'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Menu, X, ArrowRight, ChevronRight, Zap, Code2,
    LayoutDashboard, ShieldCheck, Store, Settings, LogOut, User
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { api, getFullAvatarUrl } from '@/lib/api';
import UserAvatarDropdown from './UserAvatarDropdown';

const navLinks = [
    { name: 'Services', href: '/services' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Journal', href: '/blog' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' }
];

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);

        const fetchUser = async () => {
            const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
            if (token) {
                try {
                    const user = await api.getMe();
                    setCurrentUser(user);
                } catch (err) {
                    console.error("Failed to fetch user in Navbar:", err);
                }
            }
        };
        fetchUser();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isMenuOpen]);



    const handleLogout = async () => {
        await api.logout();
        setCurrentUser(null);
        setIsMenuOpen(false);
        router.push('/');
    };

    const userInitials = currentUser
        ? (currentUser.first_name && currentUser.last_name
            ? `${currentUser.first_name[0]}${currentUser.last_name[0]}`.toUpperCase()
            : currentUser.username.slice(0, 2).toUpperCase())
        : '';

    const userDisplayName = currentUser
        ? (currentUser.first_name && currentUser.last_name
            ? `${currentUser.first_name} ${currentUser.last_name}`
            : currentUser.username)
        : '';

    if (!mounted) return (
        <nav className="fixed top-0 left-0 w-full z-[100] py-0 lg:py-2">
            <div className="w-full lg:container mx-auto px-0 lg:px-6">
                <div className="glass border-white/10 rounded-none lg:rounded-2xl px-4 md:px-6 py-3 flex items-center justify-between bg-white/5 h-14" />
            </div>
        </nav>
    );

    return (
        <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${scrolled ? 'py-0 lg:py-1' : 'py-0 lg:py-2'}`}>
            <div className="w-full lg:container mx-auto px-0 lg:px-6">
                <div className={`glass border-white/10 rounded-none lg:rounded-2xl px-4 md:px-5 py-3 flex items-center justify-between transition-all duration-500 ${scrolled ? 'shadow-2xl bg-slate-950/90 backdrop-blur-md border-white/20' : 'bg-white/5'}`}>

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group relative z-10">
                        <div className="relative w-10 h-10 group-hover:scale-105 transition-transform duration-500">
                            <Image
                                src="/images/logo/logo.png"
                                alt="Logo"
                                fill
                                sizes="40px"
                                priority
                                className="object-contain drop-shadow-lg"
                            />
                        </div>
                        <div className="flex flex-col justify-center">
                            <span className="text-[16px] font-black text-white tracking-tight leading-none">Dr. Python</span>
                            <span className="text-[10px] font-bold text-brand-teal uppercase tracking-[0.2em] leading-none mt-2">Solutions</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-3">
                        <div className="flex items-center gap-1 px-1.5 py-1 rounded-full glass border-white/5 bg-slate-900/50">
                            {navLinks.map((link) => (
                                <Link key={link.name} href={link.href} className={`text-[10px] font-bold uppercase tracking-wider transition-colors hover:text-white relative px-3 py-1.5 z-10 ${pathname === link.href ? 'text-white' : 'text-slate-400'}`}>
                                    {pathname === link.href && <motion.div layoutId="activeNavBg" className="absolute inset-0 bg-white/10 rounded-full -z-10" transition={{ type: "spring", stiffness: 380, damping: 30 }} />}
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                        {currentUser ? (
                            <UserAvatarDropdown
                                currentUser={currentUser}
                                userDisplayName={userDisplayName}
                                userInitials={userInitials}
                                handleLogout={handleLogout}
                                router={router}
                            />
                        ) : (
                            <div className="flex items-center gap-2 ml-1 relative">
                                <Link href="/start-project" className="px-4 py-1.5 bg-brand-teal text-white rounded-full font-black text-[10px] uppercase tracking-widest transition-all shadow-glow-teal hover:bg-brand-teal/90 hover:scale-105 active:scale-95">
                                    Start Project
                                </Link>
                                <Link href="/admin/login" className="px-4 py-1.5 bg-white/5 hover:bg-white/10 text-white rounded-full font-black text-[10px] uppercase tracking-widest transition-all border border-white/10 hover:scale-105 active:scale-95">
                                    Sign In
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden w-7 h-7 flex items-center justify-center glass rounded-md border-white/10 text-white"
                        onClick={() => setIsMenuOpen(true)}
                    >
                        <Menu size={16} />
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        key="mobile-menu"
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        transition={{ duration: 0.2, ease: "circOut" }}
                        className="fixed inset-0 z-[1000] bg-background md:hidden flex flex-col"
                    >
                        {/* Overlay Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-slate-950/50">
                            <div className="flex items-center gap-2">
                                <div className="relative w-10 h-10">
                                    <Image
                                        src="/images/logo/logo.png"
                                        alt="Dr. Python Solutions"
                                        fill
                                        sizes="48px"
                                        className="object-contain"
                                    />
                                </div>
                                <span className="text-white font-black text-xs uppercase tracking-widest">Menu</span>
                            </div>
                            <button
                                onClick={() => setIsMenuOpen(false)}
                                className="w-10 h-10 flex items-center justify-center glass rounded-lg border-white/10 text-white bg-white/5 hover:text-brand-red transition-all duration-300"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Menu Items */}
                        <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col gap-2">
                            {navLinks.map((link, i) => (
                                <motion.div key={link.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                                    <Link href={link.href} onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between p-4 glass rounded-lg border-white/5 text-white active:bg-white/10">
                                        <span className="text-sm font-black uppercase tracking-widest">{link.name}</span>
                                        <ChevronRight size={14} className="text-slate-500" />
                                    </Link>
                                </motion.div>
                            ))}

                            {currentUser ? (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-4 flex flex-col gap-3">
                                    {/* Mobile User Profile Section */}
                                    <div className="flex items-center gap-4 p-4 glass rounded-lg border-white/5 text-left">
                                        <div className="w-10 h-10 rounded-full bg-brand-teal flex items-center justify-center font-black text-white text-sm border border-white/20">
                                            {currentUser.avatar ? (
                                                <img src={getFullAvatarUrl(currentUser.avatar)} alt="User Avatar" width={40} height={40} className="rounded-full object-cover" />
                                            ) : (
                                                userInitials
                                            )}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-black text-white leading-none">{userDisplayName}</span>
                                            <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1.5">{currentUser.is_staff ? 'ADMIN' : 'BUYER'}</span>
                                        </div>
                                    </div>

                                    {/* Mobile Links */}
                                    <Link href="/services" onClick={() => setIsMenuOpen(false)} className="w-full flex items-center gap-3 p-4 glass border-white/5 text-white rounded-lg font-black uppercase tracking-widest text-[10px] active:bg-white/10">
                                        <Store size={14} className="text-brand-teal" /> Marketplace
                                    </Link>
                                    <Link href={currentUser.is_staff ? "/admin" : "/dashboard?tab=settings"} onClick={() => setIsMenuOpen(false)} className="w-full flex items-center gap-3 p-4 glass border-white/5 text-white rounded-lg font-black uppercase tracking-widest text-[10px] active:bg-white/10">
                                        <Settings size={14} className="text-brand-teal" /> Settings
                                    </Link>
                                    <Link href={currentUser.is_staff ? "/admin" : "/dashboard"} onClick={() => setIsMenuOpen(false)} className="w-full flex items-center gap-3 p-4 glass border-white/10 text-white rounded-lg font-black uppercase tracking-widest text-[10px] active:bg-white/10">
                                        <LayoutDashboard size={14} className="text-brand-teal" /> {currentUser.is_staff ? 'Admin Dashboard' : 'Buyer Dashboard'}
                                    </Link>
                                    <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 py-4 bg-brand-red/10 border border-brand-red/25 hover:bg-brand-red/20 text-brand-red rounded-lg font-black uppercase tracking-widest text-[10px] cursor-pointer mt-2">
                                        <LogOut size={14} /> Sign out
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-4 flex flex-col gap-2">
                                    <Link href="/start-project" onClick={() => setIsMenuOpen(false)} className="w-full flex items-center justify-center gap-2 py-4 bg-brand-teal text-white rounded-lg font-black uppercase tracking-widest text-[10px] shadow-glow-teal">
                                        Start Your Project <Zap size={14} />
                                    </Link>
                                    <Link href="/admin/login" onClick={() => setIsMenuOpen(false)} className="w-full flex items-center justify-center gap-2 py-4 glass border-white/10 text-white rounded-lg font-black uppercase tracking-widest text-[10px] active:bg-white/10">
                                        <User size={14} className="text-brand-teal" /> Sign In
                                    </Link>
                                </motion.div>
                            )}
                        </div>

                        {/* Overlay Footer */}
                        <div className="p-8 text-center bg-slate-950/50">
                            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-600 mb-1">Dr. Python Solutions</p>
                            <p className="text-[7px] font-bold text-slate-700 uppercase tracking-widest">Engineering for the future</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}