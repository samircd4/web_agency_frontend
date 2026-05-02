'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, ShoppingCart, Code2, Database, Zap, Terminal, Activity, Cpu } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue } from 'framer-motion';

const slidingTexts = [
    "E-commerce Ecosystems",
    "Scalable API Infrastructures",
    "Industrial Web Automation"
];

export default function Hero() {
    const [index, setIndex] = useState(0);
    const containerRef = useRef(null);

    // Mouse interaction for glow
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = ({ clientX, clientY, currentTarget }) => {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % slidingTexts.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    const { scrollY } = useScroll();
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);

    return (
        <section
            ref={containerRef}
            onMouseMove={handleMouseMove}
            className="relative min-h-[90vh] flex items-center pt-20 pb-12 md:pt-32 md:pb-24 overflow-hidden bg-background"
        >
            {/* Interactive Glow */}
            <motion.div
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                    background: useTransform(
                        [mouseX, mouseY],
                        ([x, y]) => `radial-gradient(600px circle at ${x}px ${y}px, rgba(42, 157, 143, 0.06), transparent 40%)`
                    ),
                }}
            />

            {/* Background Aesthetics */}
            <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-brand-teal/5 rounded-full blur-[120px] animate-pulse-slow" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-red/5 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
            <div className="absolute inset-0 opacity-[0.1] pointer-events-none [background-image:radial-gradient(var(--color-surface-700)_1px,transparent_1px)] [background-size:40px_40px]" />

            <motion.div style={{ opacity }} className="container mx-auto px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* Left Content */}
                    <div className="flex flex-col items-start text-left">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-brand-teal text-[10px] font-black tracking-[0.3em] uppercase mb-8 backdrop-blur-md"
                        >
                            <Sparkles size={14} className="text-brand-red animate-pulse" />
                            <span>v4.2.0 Industrial Engine</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                            className="text-5xl md:text-7xl font-black text-white tracking-tight leading-[1.05] mb-8"
                        >
                            Engineering <br />
                            <span className="text-gradient-teal">High-Velocity</span> <br />
                            Digital Assets
                        </motion.h1>

                        <div className="h-12 relative mb-10 overflow-hidden w-full">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={index}
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -20, opacity: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="absolute inset-0 flex items-center gap-3 text-xl md:text-2xl font-bold text-slate-300"
                                >
                                    <Terminal size={20} className="text-brand-red" />
                                    {slidingTexts[index]}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="max-w-xl text-slate-400 text-lg md:text-xl mb-12 leading-relaxed"
                        >
                            We build proprietary scraping networks and commerce engines that turn complex business logic into scalable digital assets.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto"
                        >
                            <Link href="/start-project" className="group relative px-10 py-5 bg-brand-teal hover:bg-brand-teal/90 text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all duration-300 shadow-glow-teal hover:-translate-y-1">
                                Start Project
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </Link>

                            <button className="px-10 py-5 glass border-white/10 text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all hover:bg-white/10 active:scale-95 group">
                                <Code2 size={18} className="text-slate-400 group-hover:text-brand-teal transition-colors" />
                                View Systems
                            </button>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="mt-16 pt-8 border-t border-white/5 w-full flex items-center gap-8 text-slate-500"
                        >
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-1">Availability</span>
                                <span className="text-xs font-bold text-slate-400 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse" />
                                    Q3 2026 Ready
                                </span>
                            </div>
                            <div className="w-px h-8 bg-white/5" />
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-1">Architecture</span>
                                <span className="text-xs font-bold text-slate-400">Micro-engine V2</span>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Visual Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className="relative hidden lg:block"
                    >
                        <div className="relative w-full aspect-square max-w-[600px] mx-auto">
                            {/* Animated Rings */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 border border-brand-teal/10 rounded-full"
                            />
                            <motion.div
                                animate={{ rotate: -360 }}
                                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-10 border border-brand-red/10 rounded-full"
                            />

                            {/* Main Visual Image */}
                            <div className="absolute inset-4 rounded-[3rem] overflow-hidden glass border-white/10 shadow-premium">
                                <Image
                                    src="/images/hero/tech-visual.png"
                                    alt="Technical System Visual"
                                    fill
                                    sizes="(max-width: 1024px) 100vw, 600px"
                                    className="object-cover opacity-80"
                                />
                                <div className="absolute inset-0 bg-gradient-to-tr from-background via-transparent to-transparent opacity-60" />

                                {/* Floating Overlay Badge */}
                                <motion.div
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute bottom-8 left-8 p-6 glass border-white/10 rounded-2xl shadow-2xl backdrop-blur-2xl"
                                >
                                    <div className="flex items-center gap-4 mb-3">
                                        <div className="w-10 h-10 bg-brand-red/20 rounded-xl flex items-center justify-center text-brand-red">
                                            <Zap size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-0.5">Performance</p>
                                            <p className="text-white font-bold">99.9% Efficiency</p>
                                        </div>
                                    </div>
                                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: "85%" }}
                                            transition={{ delay: 1, duration: 2 }}
                                            className="h-full bg-brand-red shadow-glow-red"
                                        />
                                    </div>
                                </motion.div>
                            </div>

                            {/* Floating Decorative Elements */}
                            <motion.div
                                animate={{ y: [0, 20, 0], x: [0, 10, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -top-10 -right-10 w-24 h-24 glass border-white/10 rounded-3xl flex items-center justify-center text-brand-teal shadow-2xl backdrop-blur-xl"
                            >
                                <Database size={32} />
                            </motion.div>

                            <motion.div
                                animate={{ y: [0, -20, 0], x: [0, -10, 0] }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                className="absolute -bottom-6 -right-6 w-20 h-20 glass border-white/10 rounded-3xl flex items-center justify-center text-brand-red shadow-2xl backdrop-blur-xl"
                            >
                                <ShoppingCart size={28} />
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Bottom Gradient Fade */}
            <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-background to-transparent pointer-events-none" />
        </section>
    );
}