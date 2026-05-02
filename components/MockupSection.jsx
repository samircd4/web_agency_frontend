'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { CheckCircle2, TrendingUp, Cpu, Database } from 'lucide-react';

export default function MockupSection() {
    return (
        <section className="relative py-16 md:py-32 bg-[#020617] overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                    {/* Visual Column - The Mockups */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="relative group"
                    >
                        {/* Laptop Frame Shadow/Glow */}
                        <div className="absolute -inset-4 bg-emerald-500/20 rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                        {/* Laptop Frame */}
                        <div className="relative z-10 bg-slate-900/80 p-3 rounded-2xl border border-white/10 shadow-2xl transition-transform duration-700 group-hover:-translate-y-2">
                            <div className="overflow-hidden rounded-xl border border-white/5 bg-slate-950 aspect-[16/10] relative">
                                <Image
                                    src="/dashboard_mockup_preview.png"
                                    alt="Dashboard Preview"
                                    className="object-contain opacity-90 group-hover:opacity-100 transition-opacity duration-700"
                                    priority
                                />
                                {/* Glass Overlay Reflection */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
                            </div>

                            {/* Laptop Base Lip */}
                            <div className="mt-2 h-1.5 w-1/3 mx-auto bg-slate-800 rounded-full border-t border-white/5" />
                        </div>

                        {/* Floating Mobile Mockup */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-32 md:w-48 aspect-[9/19] bg-slate-900 rounded-3xl p-2 border border-white/10 shadow-2xl z-20 group-hover:-translate-y-4 transition-transform duration-700"
                        >
                            <div className="h-full w-full rounded-2xl bg-slate-950 overflow-hidden relative border border-white/5">
                                <Image
                                    src="/dashboard_mockup_preview.png"
                                    alt="Mobile Mockup"
                                    className="object-contain object-left opacity-90"
                                />
                                {/* AI Glow Pulse */}
                                <div className="absolute inset-0 bg-indigo-500/5 animate-pulse" />
                            </div>

                            {/* Device Dot */}
                            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-8 h-1 bg-slate-800 rounded-full" />
                        </motion.div>
                    </motion.div>

                    {/* Content Column */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-8">
                            <Cpu size={14} />
                            <span>Next-Gen Analytics</span>
                        </div>

                        <h2 className="text-4xl md:text-5xl font-black text-white mb-8 leading-tight">
                            Custom Dashboards for <br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-emerald-600">
                                Data Control.
                            </span>
                        </h2>

                        <p className="text-slate-400 text-lg mb-10 leading-relaxed max-w-lg">
                            Empower your team with real-time intelligence. Our custom dashboards transform
                            raw scraped data into actionable insights for inventory tracking,
                            pricing volatility, and deep competitor analysis.
                        </p>

                        <div className="space-y-6 mb-12">
                            {[
                                "Real-time market volatility alerts",
                                "Automated inventory sync across multiple channels",
                                "Deep historical price trend visualizations",
                                "Custom AI-driven market prediction models"
                            ].map((feature, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 * i }}
                                    className="flex items-center gap-4 text-slate-300 font-medium"
                                >
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                                        <CheckCircle2 size={16} />
                                    </div>
                                    <span>{feature}</span>
                                </motion.div>
                            ))}
                        </div>

                        <button className="px-10 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20 active:scale-95 group flex items-center gap-3">
                            <span>Explore Visualization</span>
                            <TrendingUp size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
