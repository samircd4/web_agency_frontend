'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Menu } from 'lucide-react';

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isMenuOpen]);

    const navLinks = [
        { name: 'Services', href: '#services' },
        { name: 'Portfolio', href: '#portfolio' },
        { name: 'Process', href: '#process' },
    ];

    return (
        <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#0f172a]/70 backdrop-blur-xl transition-all duration-300">
            <div className="container mx-auto px-4 md:px-6 h-20 flex items-center justify-between relative z-[60]">
                {/* Logo Section */}
                <div className="flex items-center gap-3 group cursor-pointer text-white">
                    <div className="relative w-10 h-10 group-hover:scale-110 transition-transform duration-500 shadow-2xl">
                        <Image 
                            src="/images/logo/logo.png" 
                            alt="Dr. Python Solutions" 
                            fill 
                            className="object-contain"
                            priority
                        />
                        <div className="absolute inset-0 bg-brand-blue/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <span className="text-xl font-black tracking-tighter flex items-baseline gap-1">
                        <span className="text-brand-blue">Dr.Python</span>
                        <span className="ml-1 text-sm font-semibold text-slate-400 tracking-widest uppercase">Solutions</span>
                    </span>
                </div>

                {/* Desktop Navigation Links */}
                <div className="hidden md:flex items-center gap-10 text-sm font-semibold uppercase tracking-wider">
                    {navLinks.map((link) => (
                        <a 
                            key={link.name}
                            href={link.href} 
                            className="relative text-slate-400 hover:text-white transition-colors group"
                        >
                            {link.name}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-blue transition-all group-hover:w-full" />
                        </a>
                    ))}
                    
                    <button className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all duration-300 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-0.5 active:scale-95">
                        Start Project
                    </button>
                </div>

                {/* Enhanced Brand-Matched Burger Menu Toggle */}
                <div 
                    className="md:hidden w-12 h-12 flex flex-col items-center justify-center gap-1.5 cursor-pointer group bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <motion.div 
                        animate={isMenuOpen ? { rotate: 45, y: 8, backgroundColor: "#ffffff" } : { rotate: 0, y: 0, backgroundColor: "#1d4ed8" }}
                        className="w-7 h-1 rounded-full transition-colors" 
                    />
                    <motion.div 
                        animate={isMenuOpen ? { opacity: 0, x: -20 } : { opacity: 1, x: 0, backgroundColor: "#dc2626" }}
                        className="w-7 h-1 rounded-full transition-colors" 
                    />
                    <motion.div 
                        animate={isMenuOpen ? { rotate: -45, y: -8, backgroundColor: "#ffffff" } : { rotate: 0, y: 0, backgroundColor: "#10b981" }}
                        className="w-7 h-1 rounded-full transition-colors" 
                    />
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 top-0 left-0 w-full h-screen bg-[#0f172a] z-50 md:hidden flex flex-col pt-32 px-6"
                    >
                        <div className="flex flex-col gap-10">
                            {navLinks.map((link, i) => (
                                <motion.a 
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    key={link.name}
                                    href={link.href} 
                                    className="text-4xl font-black text-white hover:text-brand-blue transition-colors tracking-tighter"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {link.name}
                                </motion.a>
                            ))}
                            <motion.button 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="w-full py-5 bg-brand-red text-white rounded-2xl text-xl font-bold shadow-2xl shadow-red-900/40 active:scale-95 mt-4"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Start a Project
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}