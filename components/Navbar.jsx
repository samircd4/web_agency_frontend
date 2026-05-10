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
        <nav className="fixed top-0 left-0 w-full z-[100] py-4">
            <div className="w-full md:container mx-auto px-0 md:px-6">
                <div className="glass border-white/10 rounded-none md:rounded-[2rem] px-6 md:px-8 py-4 flex items-center justify-between bg-white/5 h-16" />
            </div>
        </nav>
    );

    return (
        <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${scrolled ? 'py-0 md:py-4' : 'py-4 md:py-8'}`}>
            <div className="w-full md:container mx-auto px-0 md:px-6">
                <div className={`glass border-white/10 rounded-none md:rounded-[2rem] px-6 md:px-8 py-4 flex items-center justify-between transition-all duration-500 ${scrolled ? 'shadow-2xl bg-slate-950/90 backdrop-blur-md' : 'bg-white/5'}`}>
                    
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group relative z-10">
                        <div className="relative w-10 h-10 group-hover:scale-110 transition-transform duration-500">
                            <div className="absolute inset-0 bg-brand-teal/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative w-full h-full glass rounded-xl flex items-center justify-center overflow-hidden border-white/10 group-hover:border-brand-teal/30">
                                <Image src="/images/logo/logo.png" alt="Logo" fill sizes="40px" className="object-contain p-1.5" />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-lg font-black text-white tracking-tight leading-none">Dr.Python</span>
                            <span className="text-[9px] font-bold text-brand-teal uppercase tracking-[0.2em] leading-none mt-1">Solutions</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        <div className="flex items-center gap-6 px-6 py-2 rounded-full glass border-white/5">
                            {navLinks.map((link) => (
                                <Link key={link.name} href={link.href} className={`text-xs font-bold uppercase tracking-widest transition-all hover:text-brand-teal relative py-2 ${pathname === link.href ? 'text-brand-teal' : 'text-slate-400'}`}>
                                    {link.name}
                                    {pathname === link.href && <motion.span layoutId="activeNav" className="absolute -bottom-1 left-0 w-full h-0.5 bg-brand-teal rounded-full" />}
                                </Link>
                            ))}
                        </div>
                        <div className="flex items-center gap-4">
                            <Link href="/dashboard" className="p-3 bg-white/5 text-slate-400 hover:text-white rounded-xl border border-white/5 transition-all group">
                                <LayoutDashboard size={18} className="group-hover:text-brand-teal transition-colors" />
                            </Link>
                            <Link href="/start-project" className="px-6 py-3 bg-brand-teal text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-brand-teal/20">
                                Start Project
                            </Link>
                        </div>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button 
                        className="md:hidden w-10 h-10 flex items-center justify-center glass rounded-xl border-white/10 text-white"
                        onClick={() => setIsMenuOpen(true)}
                    >
                        <Menu size={20} />
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div 
                        key="mobile-menu"
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.1 }}
                        transition={{ duration: 0.3, ease: "circOut" }}
                        className="fixed inset-0 z-[1000] bg-background md:hidden flex flex-col"
                    >
                        {/* Overlay Header */}
                        <div className="flex items-center justify-between px-6 py-6 border-b border-white/5 bg-slate-950/50">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 glass rounded-xl flex items-center justify-center overflow-hidden border-white/10">
                                    <Image src="/images/logo/logo.png" alt="Logo" width={24} height={24} className="object-contain" />
                                </div>
                                <span className="text-white font-black uppercase tracking-widest">Menu</span>
                            </div>
                            <button 
                                onClick={() => setIsMenuOpen(false)}
                                className="w-12 h-12 flex items-center justify-center glass rounded-full border-white/10 text-white bg-white/5 hover:bg-brand-red/20 hover:border-brand-red/50 hover:text-brand-red hover:scale-110 transition-all duration-300 group"
                            >
                                <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                            </button>
                        </div>

                        {/* Menu Items */}
                        <div className="flex-1 overflow-y-auto px-6 py-12 flex flex-col gap-4">
                            {navLinks.map((link, i) => (
                                <motion.div key={link.name} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                                    <Link href={link.href} onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between p-6 glass rounded-2xl border-white/5 text-white active:bg-white/10">
                                        <span className="text-xl font-black uppercase tracking-widest">{link.name}</span>
                                        <ChevronRight size={20} className="text-slate-500" />
                                    </Link>
                                </motion.div>
                            ))}
                            
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-8">
                                <Link href="/start-project" onClick={() => setIsMenuOpen(false)} className="w-full flex items-center justify-center gap-3 py-6 bg-brand-teal text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-2xl">
                                    Start Your Project <Zap size={18} />
                                </Link>
                            </motion.div>
                        </div>

                        {/* Overlay Footer */}
                        <div className="p-12 text-center bg-slate-950/50">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 mb-2">Dr. Python Solutions</p>
                            <p className="text-[8px] font-bold text-slate-700 uppercase tracking-widest">Engineering for the future</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}