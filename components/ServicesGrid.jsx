'use client';

import React from 'react';
import { Database, Layout, ShieldCheck, Rocket, Layers, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

const services = [
    {
        title: "Industrial Scraping",
        subtitle: "Enterprise Data Extraction",
        description: "Customized distributed scraping networks designed to bypass sophisticated bot protection and deliver high-velocity data points.",
        icon: <Database className="text-brand-blue" />,
        accent: "bg-blue-500/10"
    },
    {
        title: "API Ecosystems",
        subtitle: "High-Performance Backends",
        description: "Building robust, multi-tenant API architectures that power seamless data exchange and high-traffic e-commerce experiences.",
        icon: <Cpu className="text-brand-red" />,
        accent: "bg-red-500/10"
    }
];

export default function ServicesGrid() {
    return (
        <section className="py-16 md:py-32 relative overflow-hidden bg-slate-950 border-y border-white/5">
            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400 mb-6 block">Industrial Grade</span>
                        <h2 className="text-4xl md:text-6xl font-black mb-8 leading-[1.1] text-white tracking-tight">
                            Built for <br/> 
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red via-brand-blue to-emerald-400">Scale.</span>
                        </h2>
                        <p className="text-slate-400 text-lg mb-10 leading-relaxed max-w-lg">
                            We don't just build websites; we engineer high-frequency digital assets that maintain 99.9% uptime under extreme load.
                        </p>
                        
                        <div className="grid grid-cols-2 gap-8">
                            <div className="flex gap-4 items-start">
                                <div className="p-2 bg-emerald-500/10 rounded-lg"><ShieldCheck className="text-emerald-500" size={20}/></div>
                                <div>
                                    <h4 className="text-white font-bold text-sm mb-1 uppercase tracking-wider">Secure</h4>
                                    <p className="text-slate-500 text-xs">End-to-end encryption</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <div className="p-2 bg-brand-blue/10 rounded-lg"><Rocket className="text-brand-blue" size={20}/></div>
                                <div>
                                    <h4 className="text-white font-bold text-sm mb-1 uppercase tracking-wider">Fast</h4>
                                    <p className="text-slate-500 text-xs">Millisecond latency</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <div className="grid gap-6">
                        {services.map((service, index) => (
                            <motion.div
                                key={service.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                                className="group p-6 md:p-8 rounded-3xl bg-slate-900/40 border border-white/5 hover:border-white/10 transition-all duration-500"
                            >
                                <div className="flex items-start gap-6">
                                    <div className={`p-4 rounded-2xl ${service.accent} group-hover:scale-110 transition-transform duration-500`}>
                                        {service.icon}
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">{service.subtitle}</span>
                                        <h3 className="text-2xl font-black text-white mb-3 tracking-tight">{service.title}</h3>
                                        <p className="text-slate-400 text-sm leading-relaxed">{service.description}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                </div>
            </div>
            
            {/* Background elements */}
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-brand-blue/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-1/2 right-[-10%] w-80 h-80 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
        </section>
    );
}
