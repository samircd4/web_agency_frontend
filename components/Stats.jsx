'use client';

import React from 'react';
import { motion } from 'framer-motion';

const stats = [
    { 
        label: "Data Ingested", 
        value: "10M+", 
        subtext: "Across active scraping clusters",
        color: "text-brand-teal" 
    },
    { 
        label: "Production Uptime", 
        value: "99.9%", 
        subtext: "High-concurrency cloud SLA",
        color: "text-emerald-400" 
    },
    { 
        label: "Average API Latency", 
        value: "<100ms", 
        subtext: "FastAPI & Next.js backends",
        color: "text-brand-red" 
    },
    { 
        label: "Milestone Delivery", 
        value: "100%", 
        subtext: "Tracked in Command Center",
        color: "text-white" 
    }
];

export default function Stats() {
    return (
        <section className="py-8 md:py-12 relative overflow-hidden bg-slate-950 border-y border-white/5">
            {/* Engineering Grid Background */}
            <div 
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{ 
                    backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', 
                    backgroundSize: '30px 30px' 
                }} 
            />

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="flex flex-col items-center"
                        >
                            <h3 className={`text-4xl md:text-5xl font-black mb-1.5 ${stat.color} tracking-tighter drop-shadow-2xl`}>
                                {stat.value}
                            </h3>
                            <div className="w-8 h-0.5 bg-slate-800 mx-auto mb-2" />
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.25em] mb-1">
                                {stat.label}
                            </p>
                            {stat.subtext && (
                                <span className="text-slate-600 text-[11px] font-medium leading-tight max-w-[180px]">
                                    {stat.subtext}
                                </span>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}