'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Search, Cpu, Rocket, CheckCircle2 } from 'lucide-react';

const steps = [
    {
        title: "Discovery",
        description: "In-depth analysis of your data requirements and business logic.",
        icon: <Search size={24} className="text-brand-teal" />,
        color: "brand-teal"
    },
    {
        title: "Engineering",
        description: "Architecting the proprietary engine using our battle-tested stack.",
        icon: <Cpu size={24} className="text-brand-red" />,
        color: "brand-red"
    },
    {
        title: "Scale",
        description: "Deploying and scaling your solution across distributed networks.",
        icon: <Rocket size={24} className="text-brand-indigo" />,
        color: "brand-indigo"
    }
];

export default function Process() {
    return (
        <section id="process" className="py-24 bg-background relative">
            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-20">
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-red/10 border border-brand-red/20 text-brand-red text-[10px] font-black uppercase tracking-[0.2em] mb-6"
                    >
                        <CheckCircle2 size={12} />
                        <span>Our Methodology</span>
                    </motion.div>
                    <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight">
                        From Concept to <span className="text-gradient-red">Industrial Scale.</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            className="relative"
                        >
                            <div className="p-8 rounded-[2rem] glass border border-white/5 h-full hover:border-brand-teal/20 transition-all group">
                                <div className={`w-16 h-16 rounded-2xl bg-${step.color}/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                                    {step.icon}
                                </div>
                                <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">{step.title}</h3>
                                <p className="text-slate-400 leading-relaxed">{step.description}</p>
                                
                                <div className="absolute -top-4 -right-4 w-12 h-12 glass rounded-full flex items-center justify-center text-xs font-black text-slate-500 border-white/10">
                                    0{index + 1}
                                </div>
                            </div>
                            
                            {index < steps.length - 1 && (
                                <div className="hidden md:block absolute top-1/2 -right-6 w-12 h-px bg-gradient-to-r from-white/10 to-transparent" />
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
