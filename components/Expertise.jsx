'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, Cpu, Database, Code2 } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

const skills = [
    { name: "System Architecture", level: 95, icon: <Cpu size={20} />, color: "brand-red" },
    { name: "Web Scraping (Scale)", level: 98, icon: <Database size={20} />, color: "brand-teal" },
    { name: "E-commerce Engines", level: 92, icon: <Terminal size={20} />, color: "brand-red" },
    { name: "API Infrastructure", level: 96, icon: <Code2 size={20} />, color: "brand-teal" }
];

export default function Expertise() {
    return (
        <section id="expertise" className="py-24 bg-background relative overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-20 items-center">

                    <div>
                        <ScrollReveal>
                            <span className="text-xs font-black uppercase tracking-[0.4em] text-brand-red mb-6 block">Technical Core</span>
                            <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-[0.9]">
                                Algorithmic <br />
                                <span className="text-gradient-red">Dominance.</span>
                            </h2>
                        </ScrollReveal>
                        <ScrollReveal delay={0.2}>
                            <p className="text-slate-400 text-lg mb-10 leading-relaxed max-w-md">
                                Our engineering team specializes in high-concurrency systems and proprietary business logic that scales with your growth.
                            </p>
                        </ScrollReveal>
                        <ScrollReveal delay={0.3}>
                            <div className="flex gap-4">
                                <button className="px-8 py-4 bg-brand-red text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-brand-red/20 transition-all hover:-translate-y-1">
                                    View Stack
                                </button>
                                <button className="px-8 py-4 glass text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all hover:bg-white/10">
                                    Whitepaper
                                </button>
                            </div>
                        </ScrollReveal>
                    </div>

                    <div className="space-y-8">
                        {skills.map((skill, index) => (
                            <ScrollReveal key={index} delay={index * 0.15}>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg bg-${skill.color}/10 text-${skill.color}`}>
                                                {skill.icon}
                                            </div>
                                            <span className="text-white font-bold uppercase tracking-widest text-xs">{skill.name}</span>
                                        </div>
                                        <span className={`text-[10px] font-black text-${skill.color}`}>{skill.level}%</span>
                                    </div>
                                    <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            whileInView={{ width: `${skill.level}%` }}
                                            viewport={{ once: false }}
                                            transition={{ duration: 1.5, delay: 0.5, ease: "circOut" }}
                                            className={`h-full bg-${skill.color} shadow-[0_0_15px_rgba(214,0,0,0.3)]`}
                                        />
                                    </div>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
}
