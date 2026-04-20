'use client';

import React, { useState, useEffect } from 'react';
import { Database, ArrowRight, Sparkles, ShoppingCart, Code2, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const slidingTexts = [
    { text: "E-commerce Websites", icon: <ShoppingCart size={24} /> },
    { text: "Scalable API Solutions", icon: <Code2 size={24} /> },
    { text: "Web Automation & Scraping", icon: <Database size={24} /> }
];

export default function Hero() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % slidingTexts.length);
        }, 3500);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="relative pt-24 pb-20 md:pt-28 md:pb-40 overflow-hidden bg-[#0f172a]">
            {/* Dynamic Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-red-600/5 rounded-full blur-[140px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/5 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-10 pointer-events-none [background-image:radial-gradient(#1e293b_1px,transparent_1px)] [background-size:40px_40px]" />

            <div className="container mx-auto px-4 md:px-6 relative z-10 overflow-x-hidden">
                <div className="flex flex-col items-center text-center">
                    
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-brand-blue text-sm mb-10 backdrop-blur-sm shadow-xl"
                    >
                        <Sparkles size={16} className="text-emerald-400" />
                        <span className="font-bold tracking-wide uppercase text-[10px]">Premium Software Engineering</span>
                    </motion.div>

                    <h1 className="text-3xl sm:text-5xl md:text-8xl font-black tracking-tight mb-6 leading-[1.1] max-w-5xl">
                        <span className="block text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.05)]">
                            Engineering Scalable <br className="hidden md:block"/> Solutions for
                        </span>
                        
                        <div className="h-32 md:h-28 relative mt-2 overflow-hidden flex items-center justify-center translate-y-2">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={index}
                                    initial={{ y: 30, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -30, opacity: 0 }}
                                    transition={{ duration: 0.5, ease: "circOut" }}
                                    className="absolute inset-0 flex items-center justify-center gap-3 text-2xl sm:text-3xl md:text-7xl text-transparent bg-clip-text bg-gradient-to-r from-brand-red via-emerald-400 to-brand-blue font-black px-4"
                                >
                                    {slidingTexts[index].text}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </h1>

                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="max-w-2xl text-slate-400 text-base md:text-xl mb-12 leading-relaxed"
                    >
                        We translate complex business requirements into high-performance 
                        digital infrastructure. From robust e-commerce architectures to 
                        industrial-scale data extraction.
                    </motion.p>

                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 }}
                        className="flex flex-col sm:flex-row gap-6"
                    >
                        <button className="group relative px-10 py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold flex items-center gap-3 transition-all duration-300 shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_40px_rgba(16,185,129,0.5)] hover:-translate-y-1">
                            <span className="relative z-10">Start a Project</span>
                            <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                        </button>
                        
                        <button className="px-10 py-5 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-bold border border-white/10 backdrop-blur-sm transition-all flex items-center gap-3 active:scale-95 group">
                            <Zap size={18} className="text-emerald-400 group-hover:animate-pulse" />
                            <span>View Portfolio</span>
                        </button>
                    </motion.div>
                </div>
            </div>

            {/* Decorative Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0f172a]/20 to-[#0f172a] pointer-events-none" />
        </section>
    );
}
