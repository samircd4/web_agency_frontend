'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight, ChevronRight, Zap, Code2, LayoutDashboard } from 'lucide-react';
import { usePathname } from 'next/navigation';

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
    const pathname = usePathname();

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
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

    if (!mounted) return (
        <nav className="fixed top-0 left-0 w-full z-[100] py-0 md:py-2">
            <div className="w-full md:container mx-auto px-0 md:px-6">
                <div className="glass border-white/10 rounded-none md:rounded-2xl px-4 md:px-6 py-3 md:py-1.5 flex items-center justify-between bg-white/5 h-14 md:h-14" />
            </div>
        </nav>
    );

    return (
        <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${scrolled ? 'py-0 md:py-1' : 'py-0 md:py-2'}`}>
            <div className="w-full md:container mx-auto px-0 md:px-6">
                <div className={`glass border-white/10 rounded-none md:rounded-2xl px-4 md:px-5 py-3 md:py-1.5 flex items-center justify-between transition-all duration-500 ${scrolled ? 'shadow-2xl bg-slate-950/90 backdrop-blur-md border-white/20' : 'bg-white/5'}`}>

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group relative z-10">
                        <div className="relative w-7 h-7 group-hover:scale-110 transition-transform duration-500">
                            <div className="absolute inset-0 bg-brand-teal/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative w-full h-full glass rounded-full flex items-center justify-center overflow-hidden border-white/10 group-hover:border-brand-teal/30">
                                <Image
                                    src="/images/logo/logo.png"
                                    alt="Logo"
                                    fill
                                    sizes="28px"
                                    priority
                                    className="object-contain p-0.5"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col justify-center">
                            <span className="text-[13px] font-black text-white tracking-tight leading-none">Dr.Python</span>
                            <span className="text-[7px] font-bold text-brand-teal uppercase tracking-[0.2em] leading-none mt-0.5">Solutions</span>
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
                        <div className="flex items-center gap-2 ml-1">
                            <Link href="/dashboard" className="p-1.5 bg-white/5 text-slate-400 hover:text-white rounded-full border border-white/5 transition-all group">
                                <LayoutDashboard size={14} className="group-hover:text-brand-teal transition-colors" />
                            </Link>
                            <Link href="/start-project" className="px-4 py-1.5 bg-brand-teal text-white rounded-full font-black text-[10px] uppercase tracking-widest transition-all shadow-glow-teal hover:bg-brand-teal/90 hover:scale-105 active:scale-95">
                                Start Project
                            </Link>
                        </div>
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
                                <div className="w-8 h-8 glass rounded-lg flex items-center justify-center overflow-hidden border-white/10">
                                    <Image src="/images/logo/logo.png" alt="Logo" width={20} height={20} className="object-contain" />
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

                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-4 flex flex-col gap-2">
                                <Link href="/dashboard" onClick={() => setIsMenuOpen(false)} className="w-full flex items-center justify-center gap-2 py-4 glass border-white/10 text-white rounded-lg font-black uppercase tracking-widest text-[10px] active:bg-white/10">
                                    <LayoutDashboard size={14} className="text-brand-teal" /> Client Dashboard
                                </Link>
                                <Link href="/start-project" onClick={() => setIsMenuOpen(false)} className="w-full flex items-center justify-center gap-2 py-4 bg-brand-teal text-white rounded-lg font-black uppercase tracking-widest text-[10px] shadow-glow-teal">
                                    Start Your Project <Zap size={14} />
                                </Link>
                            </motion.div>
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