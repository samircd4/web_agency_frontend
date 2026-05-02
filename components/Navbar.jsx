'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight, ChevronRight, Zap } from 'lucide-react';
import { usePathname } from 'next/navigation';

const navLinks = [
    { name: 'Services', href: '/services' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'About', href: '/#about' },
    { name: 'Contact', href: '/contact' }
];

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${scrolled ? 'py-4' : 'py-8'}`}>
            <div className="container mx-auto px-6">
                <div className={`glass border-white/10 rounded-[2rem] px-8 py-4 flex items-center justify-between transition-all duration-500 ${scrolled ? 'shadow-2xl bg-background/80' : 'bg-white/5'}`}>
                    
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative w-10 h-10 group-hover:scale-110 transition-transform duration-500">
                            <div className="absolute inset-0 bg-brand-teal/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative w-full h-full glass rounded-xl flex items-center justify-center overflow-hidden border-white/10 group-hover:border-brand-teal/30">
                                <Image 
                                    src="/images/logo/logo.png" 
                                    alt="Dr. Python Solutions" 
                                    fill 
                                    sizes="40px"
                                    className="object-contain p-1.5"
                                />
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
                                <Link 
                                    key={link.name}
                                    href={link.href} 
                                    className={`text-xs font-bold uppercase tracking-widest transition-all hover:text-brand-teal relative py-2 ${pathname === link.href ? 'text-brand-teal' : 'text-slate-400'}`}
                                >
                                    {link.name}
                                    {pathname === link.href && (
                                        <motion.span 
                                            layoutId="activeNav"
                                            className="absolute -bottom-1 left-0 w-full h-0.5 bg-brand-teal rounded-full"
                                        />
                                    )}
                                </Link>
                            ))}
                        </div>
                        
                        <Link href="/start-project" className="group px-6 py-3 bg-brand-teal hover:bg-brand-teal/90 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg shadow-brand-teal/20 hover:shadow-brand-teal/40 hover:-translate-y-0.5 active:scale-95">
                            Start Project
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button 
                        className="md:hidden w-12 h-12 flex flex-col items-center justify-center gap-1.5 glass rounded-xl border-white/10"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <motion.div 
                            animate={isMenuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                            className="w-6 h-0.5 bg-white rounded-full"
                        />
                        <motion.div 
                            animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                            className="w-4 h-0.5 bg-white rounded-full ml-auto"
                        />
                        <motion.div 
                            animate={isMenuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                            className="w-6 h-0.5 bg-white rounded-full"
                        />
                    </button>
                </div>
            </div>

            {/* Mobile Navigation */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 z-[90] bg-background/95 backdrop-blur-xl md:hidden flex flex-col items-center justify-center pt-24 px-6"
                    >
                        <div className="flex flex-col items-center gap-8 w-full max-w-sm">
                            {navLinks.map((link, i) => (
                                <motion.div
                                    key={link.name}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="w-full"
                                >
                                    <Link 
                                        href={link.href}
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex items-center justify-between group p-6 glass rounded-2xl border-white/5 hover:border-brand-teal/30 transition-all"
                                    >
                                        <span className="text-2xl font-black text-white uppercase tracking-tighter group-hover:text-brand-teal transition-colors">{link.name}</span>
                                        <ChevronRight className="text-slate-600 group-hover:text-brand-teal group-hover:translate-x-2 transition-all" />
                                    </Link>
                                </motion.div>
                            ))}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="w-full"
                            >
                                <Link 
                                    href="/start-project"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="w-full flex items-center justify-center gap-3 py-6 bg-brand-teal text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-2xl shadow-brand-teal/20 active:scale-95 transition-all"
                                >
                                    Start Project
                                    <Zap size={18} />
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}