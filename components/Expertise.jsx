'use client';

import React from 'react';
import { Globe, Zap, BarChart3, Shield, Cpu, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const expertiseItems = [
    {
        title: "Precision Scraping",
        description: "High-scale data extraction from complex websites. Bypassing anti-bots and providing structured data in real-time.",
        icon: <Globe className="text-brand-blue" size={28} />,
        color: "blue",
        glow: "rgba(29, 78, 216, 0.15)"
    },
    {
        title: "Workflow Automation",
        description: "Automating repetitive business tasks. From inventory sync to lead generation, making your business 10x faster.",
        icon: <Zap className="text-brand-red" size={28} />,
        color: "red",
        glow: "rgba(220, 38, 38, 0.15)"
    },
    {
        title: "Real-time Analytics",
        description: "Custom dashboards to visualize and manage your scraped data and sales with industrial-grade precision.",
        icon: <BarChart3 className="text-emerald-500" size={28} />,
        color: "emerald",
        glow: "rgba(16, 185, 129, 0.15)"
    }
];

export default function Expertise() {
    return (
        <section className="container mx-auto px-4 py-16 md:px-6 md:py-32 relative" id="expertise">
            {/* Background pattern */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-5 pointer-events-none [background-image:radial-gradient(#1e293b_1px,transparent_1px)] [background-size:30px_30px]" />

            <div className="text-center mb-12 md:mb-24 relative z-10">
                <motion.span 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-blue mb-4 block"
                >
                    Scientific Approach
                </motion.span>
                <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-6xl font-black mb-6 tracking-tighter text-white"
                >
                    Core <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-emerald-400">Expertise</span>
                </motion.h2>
                <div className="w-20 h-1 bg-brand-red mx-auto rounded-full mb-8" />
                <p className="text-slate-400 max-w-xl mx-auto text-lg">
                    We combine algorithmic efficiency with enterprise reliability to deliver the world's most stable data solutions.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 relative z-10">
                {expertiseItems.map((item, index) => (
                    <motion.div
                        key={item.title}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        viewport={{ once: true }}
                        whileHover={{ y: -10 }}
                        className="group relative p-6 md:p-10 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/[0.07] hover:border-white/20 transition-all duration-500 overflow-hidden"
                    >
                        {/* Interactive Glow */}
                        <div 
                            className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[80px] transition-opacity duration-500 opacity-0 group-hover:opacity-100"
                            style={{ backgroundColor: item.glow }}
                        />

                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 relative transition-transform duration-500 group-hover:scale-110 shadow-2xl overflow-hidden`}>
                            <div className="absolute inset-0 bg-slate-800 opacity-50" />
                            <div className="relative z-10">{item.icon}</div>
                        </div>

                        <h3 className="text-2xl font-black mb-4 text-white tracking-tight">{item.title}</h3>
                        <p className="text-slate-400 text-sm leading-relaxed mb-8">
                            {item.description}
                        </p>

                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 group-hover:text-white transition-colors">
                            <Activity size={12} className={item.color === 'blue' ? 'text-brand-blue' : item.color === 'red' ? 'text-brand-red' : 'text-emerald-500'} />
                            <span>System Active</span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
