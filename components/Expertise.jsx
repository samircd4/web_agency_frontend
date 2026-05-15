'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, Cpu, Database, Code2, Zap, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import ScrollReveal from './ScrollReveal';

const skills = [
    { 
        name: "Web Development", 
        level: 98, 
        icon: <Code2 size={22} />, 
        color: "brand-red",
        desc: "Modern Next.js & React Apps"
    },
    { 
        name: "System Architecture", 
        level: 95, 
        icon: <Cpu size={22} />, 
        color: "brand-teal",
        desc: "Scalable Cloud Infrastructure"
    },
    { 
        name: "E-commerce Solutions", 
        level: 92, 
        icon: <Terminal size={22} />, 
        color: "brand-teal",
        desc: "Proprietary Sales Engines"
    },
    { 
        name: "Data Pipelines", 
        level: 96, 
        icon: <Database size={22} />, 
        color: "brand-red",
        desc: "Enterprise-Scale Integration"
    }
];

export default function Expertise() {
    return (
        <section id="expertise" className="pt-0 pb-12 bg-background relative overflow-hidden">
            <div className="w-full md:container mx-auto px-0 md:px-6">
                <div className="grid lg:grid-cols-2 gap-12 items-center px-6 md:px-0">
                    
                    {/* Content Section */}
                    <div>
                        <ScrollReveal>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-brand-red/10 border border-brand-red/20 text-brand-red text-[9px] font-black tracking-[0.2em] uppercase mb-4">
                                <Zap size={11} fill="currentColor" />
                                <span>Our Core</span>
                            </div>
                            <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tighter leading-[1.1]">
                                Built for <br />
                                <span className="text-gradient-red">Performance.</span>
                            </h2>
                        </ScrollReveal>
                        <ScrollReveal delay={0.2}>
                            <p className="text-slate-400 text-lg mb-8 leading-relaxed max-w-md">
                                We turn complex business ideas into lightning-fast digital solutions that are easy to use and scale with your growth.
                            </p>
                        </ScrollReveal>
                        <ScrollReveal delay={0.3}>
                            <div className="flex gap-4">
                                <Link href="/tech-stack" className="px-8 py-4 bg-brand-red text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all hover:shadow-glow-red hover:-translate-y-1">
                                    View Stack
                                </Link>
                                <Link href="/our-process" className="px-8 py-4 glass text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all hover:bg-white/10">
                                    Process
                                </Link>
                            </div>
                        </ScrollReveal>
                    </div>

                    {/* Bento Skills Grid */}
                    <div id="tech-stack" className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {skills.map((skill, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: false }}
                                transition={{ delay: index * 0.1 }}
                                className="group p-5 rounded-xl glass border-white/5 hover:border-brand-red/30 transition-all duration-500"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className={`p-2.5 rounded-lg bg-white/5 text-${skill.color} group-hover:scale-110 transition-transform duration-500`}>
                                        {skill.icon}
                                    </div>
                                    <div className={`text-[9px] font-black text-${skill.color} opacity-50 group-hover:opacity-100 transition-opacity`}>
                                        {skill.level}%
                                    </div>
                                </div>
                                <h3 className="text-white font-bold text-xs uppercase tracking-widest mb-1 group-hover:text-brand-red transition-colors">
                                    {skill.name}
                                </h3>
                                <p className="text-slate-500 text-[9px] font-medium leading-tight mb-3">
                                    {skill.desc}
                                </p>
                                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileInView={{ width: `${skill.level}%` }}
                                        viewport={{ once: false }}
                                        transition={{ duration: 1.5, delay: 0.5, ease: "circOut" }}
                                        className={`h-full bg-${skill.color}`}
                                    />
                                </div>
                            </motion.div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
}
