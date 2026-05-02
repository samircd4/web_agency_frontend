'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Send, Cpu, Database, Zap, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function StartProjectView() {
    return (
        <main className="min-h-screen bg-background text-foreground pt-32 pb-24 overflow-hidden relative">
            {/* Background Glows */}
            <div className="absolute top-0 right-0 w-[50rem] h-[50rem] bg-brand-teal/5 rounded-full blur-[150px] -mr-64 -mt-64 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-brand-red/5 rounded-full blur-[150px] -ml-64 -mb-64 pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-brand-teal transition-colors mb-12 group">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-xs font-black uppercase tracking-widest">Back to Base</span>
                </Link>

                <div className="max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <span className="text-xs font-black uppercase tracking-[0.4em] text-brand-teal mb-6 block">Project Initiation Protocol</span>
                        <h1 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-[0.9]">
                            Let&apos;s build your <br/>
                            <span className="text-gradient-teal">digital engine.</span>
                        </h1>
                        <p className="text-slate-400 text-xl mb-16 max-w-2xl leading-relaxed">
                            Tell us about your technical requirements and business goals. Our engineers will architect the optimal solution for your scale.
                        </p>
                    </motion.div>

                    <form className="space-y-16">
                        {/* Step 1: Core Service */}
                        <div className="space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-brand-teal/10 border border-brand-teal/20 flex items-center justify-center text-brand-teal font-black">01</div>
                                <h3 className="text-2xl font-black text-white uppercase tracking-tight">Select Primary Service</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                    { icon: <Database />, title: "Web Scraping", desc: "Large-scale data extraction" },
                                    { icon: <Cpu />, title: "E-commerce", desc: "Custom engine development" },
                                    { icon: <Zap />, title: "Automation", desc: "Distributed workflow logic" }
                                ].map((service, i) => (
                                    <label key={i} className="relative group cursor-pointer">
                                        <input type="radio" name="service" className="sr-only peer" />
                                        <div className="p-8 rounded-[2rem] glass border border-white/5 transition-all peer-checked:border-brand-teal peer-checked:bg-brand-teal/5 group-hover:border-white/20">
                                            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 text-slate-400 group-hover:text-brand-teal transition-colors">
                                                {service.icon}
                                            </div>
                                            <h4 className="text-white font-bold mb-2">{service.title}</h4>
                                            <p className="text-slate-500 text-xs leading-relaxed">{service.desc}</p>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Step 2: Details */}
                        <div className="space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-brand-red/10 border border-brand-red/20 flex items-center justify-center text-brand-red font-black">02</div>
                                <h3 className="text-2xl font-black text-white uppercase tracking-tight">Technical Specifications</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Full Name</label>
                                    <input 
                                        type="text" 
                                        placeholder="John Doe" 
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-brand-teal/50 transition-all placeholder:text-slate-700 font-bold"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Email Address</label>
                                    <input 
                                        type="email" 
                                        placeholder="john@company.com" 
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-brand-teal/50 transition-all placeholder:text-slate-700 font-bold"
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Project Overview</label>
                                    <textarea 
                                        rows="4" 
                                        placeholder="Describe the problem you want to solve..." 
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-brand-teal/50 transition-all placeholder:text-slate-700 font-bold resize-none"
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="pt-8">
                            <button className="px-12 py-6 bg-brand-teal hover:bg-brand-teal/90 text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-4 shadow-2xl shadow-brand-teal/20 hover:-translate-y-1 active:scale-95 group">
                                Send Requirements
                                <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}
