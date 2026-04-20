'use client';

import React from 'react';
import { motion } from 'framer-motion';

const stats = [
    { label: "Projects Completed", value: "150+", color: "text-brand-blue" },
    { label: "Uptime Guarantee", value: "99.9%", color: "text-emerald-400" },
    { label: "Workflows Automated", value: "24/7", color: "text-brand-red" },
    { label: "Client Satisfaction", value: "100%", color: "text-white" }
];

export default function Stats() {
    return (
        <section className="py-12 md:py-24 relative overflow-hidden bg-slate-950">
            {/* Engineering Grid Background */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
            
            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <h3 className={`text-5xl md:text-6xl font-black mb-4 ${stat.color} tracking-tighter drop-shadow-2xl`}>
                                {stat.value}
                            </h3>
                            <div className="w-10 h-0.5 bg-slate-800 mx-auto mb-4" />
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">
                                {stat.label}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
