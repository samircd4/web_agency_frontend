'use client';

import React from 'react';
import Image from 'next/image';
import { Monitor, CheckCircle2, ChevronRight, Laptop } from 'lucide-react';
import { motion } from 'framer-motion';
import dashboardScreenshot from '@/public/images/mockups/dashboard-screenshot.png';
import mobileScreenshot from '@/public/images/mockups/front_end.png';

export default function DashboardShowcase() {
    return (
        <section className="py-16 md:py-32 relative bg-[#0f172a] overflow-hidden" id="dashboard">
            {/* Background elements */}
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-blue/5 rounded-full blur-[150px] pointer-events-none" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-24">

                    {/* Left Side: Premium Mockup Visual */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="w-full lg:w-3/5 relative group"
                    >
                        {/* Dynamic Aura */}
                        <div className="absolute -inset-10 bg-gradient-to-br from-brand-blue/10 via-emerald-500/5 to-brand-red/10 rounded-full blur-[100px] group-hover:opacity-100 opacity-60 transition-opacity" />

                        {/* Top-tier Laptop Frame */}
                        <div className="relative bg-[#1e293b] rounded-[32px] border border-white/10 p-4 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)]">
                            <div className="bg-[#0f172a] rounded-2xl overflow-hidden border border-white/5 aspect-[16/10] relative">
                                
                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none z-10" />
                                
                                <Image
                                    src={dashboardScreenshot}
                                    alt="E-commerce Dashboard"
                                    fill
                                    className="object-cover group-hover:scale-[1.02] transition-transform duration-700"
                                />

                                {/* Mockup Reflection Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-transparent pointer-events-none" />
                            </div>
                        </div>

                        {/* Floating Feature Card */}
                        <motion.div 
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -bottom-12 -left-8 bg-[#1e293b]/90 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-2xl hidden md:block"
                        >
                            <div className="flex gap-4 items-center">
                                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                                    <Activity size={24} />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Live Engine</p>
                                    <p className="text-white font-black">99.99% Uptime</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Floating Mobile Profile */}
                        <motion.div 
                            animate={{ y: [0, 10, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -top-10 -right-6 hidden lg:block w-36 h-[280px] bg-[#1e293b] rounded-[32px] border-4 border-[#334155] shadow-2xl p-1.5 overflow-hidden"
                        >
                            <div className="bg-[#0f172a] h-full w-full rounded-[26px] overflow-hidden relative">
                                <Image
                                    src={mobileScreenshot}
                                    alt="E-commerce Dashboard"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 bg-slate-800 rounded-full" />
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Right Side: High-Impact Content */}
                    <div className="w-full lg:w-2/5">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-blue mb-6 block">Unified Interface</span>
                            <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight text-white tracking-tighter">
                                Complete Control. <br />
                                <span className="text-emerald-400">Zero Complexity.</span>
                            </h2>
                            <p className="text-slate-400 text-lg mb-10 leading-relaxed">
                                Our custom dashboards allow you to orchestrate complex data pipelines from a single, high-performance interface. Integrated directly with your infrastructure for real-time decision making.
                            </p>

                            <div className="space-y-6 mb-12">
                                {[
                                    { text: "Live Data Synchronization", color: "text-brand-blue" },
                                    { text: "Automated Multi-Channel Sync", color: "text-brand-red" },
                                    { text: "Enterprise-Grade Security", color: "text-emerald-400" }
                                ].map((item, index) => (
                                    <div key={index} className="flex items-center gap-4 group">
                                        <div className={`p-1 rounded-full bg-slate-800 border border-white/5 group-hover:scale-110 transition-transform`}>
                                            <CheckCircle2 className={`${item.color}`} size={18} />
                                        </div>
                                        <span className="text-slate-300 font-medium">{item.text}</span>
                                    </div>
                                ))}
                            </div>

                            <button className="flex items-center gap-2 text-white font-black uppercase tracking-widest text-xs group hover:text-brand-red transition-colors">
                                Explore Enterprise Tools <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
}

// Internal Activity icon to avoid import error if needed
const Activity = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
);
