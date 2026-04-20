'use client';

import React from 'react';
import { Mail, MessageSquare, Send, Globe, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Contact() {
    return (
        <section className="py-16 md:py-32 relative bg-[#0f172a]" id="contact">
            {/* Background elements */}
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-brand-red/5 rounded-full blur-[180px] pointer-events-none" />
            
            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="max-w-5xl mx-auto">
                    
                    <div className="text-center mb-12 md:mb-20">
                        <motion.span 
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-red mb-6 block"
                        >
                            Get in Touch
                        </motion.span>
                        <h2 className="text-4xl md:text-7xl font-black mb-8 text-white tracking-tighter">
                            Initialize a <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red to-brand-blue">Solution.</span>
                        </h2>
                    </div>

                    <div className="bg-slate-900/40 border border-white/5 rounded-[40px] overflow-hidden backdrop-blur-xl shadow-2xl flex flex-col md:flex-row">
                        
                        {/* System Status / Info (Left Side) */}
                        <div className="md:w-2/5 p-6 md:p-12 bg-white/[0.02] border-r border-white/5">
                            <h3 className="text-2xl font-black text-white mb-8 tracking-tight">Project Inbound</h3>
                            <p className="text-slate-400 mb-12 text-sm leading-relaxed">
                                Our engineering team is currently accepting high-impact projects in E-commerce, API Development, and Industrial Automation.
                            </p>

                            <div className="space-y-8">
                                <div className="flex items-center gap-5 group">
                                    <div className="w-12 h-12 rounded-2xl bg-brand-blue/10 flex items-center justify-center text-brand-blue group-hover:scale-110 transition-transform">
                                        <Mail size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Direct Channel</p>
                                        <p className="text-white font-bold text-sm">initialize@drpython.tech</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-5 group">
                                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                                        <Globe size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Service Region</p>
                                        <p className="text-white font-bold text-sm">Global Operations</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-16 p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">System Ready</span>
                                </div>
                                <p className="text-[11px] text-slate-500 font-medium">Response baseline: 12-24 hours</p>
                            </div>
                        </div>

                        {/* Control Interface / Form (Right Side) */}
                        <div className="md:w-3/5 p-6 md:p-12 bg-white/[0.01]">
                            <form className="space-y-8">
                                <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                                    <div className="group">
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 group-focus-within:text-brand-blue transition-colors">Client Identity</label>
                                        <input type="text" className="w-full bg-slate-800/50 border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-brand-blue outline-none transition-all placeholder:text-slate-600 font-medium" placeholder="Full Name" />
                                    </div>
                                    <div className="group">
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 group-focus-within:text-brand-blue transition-colors">Transmission Address</label>
                                        <input type="email" className="w-full bg-slate-800/50 border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-brand-blue outline-none transition-all placeholder:text-slate-600 font-medium" placeholder="Email@work.com" />
                                    </div>
                                </div>
                                <div className="group">
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 group-focus-within:text-brand-blue transition-colors">Service Protocol</label>
                                    <select className="w-full bg-slate-800/50 border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-brand-blue outline-none transition-all cursor-pointer font-medium appearance-none">
                                        <option>Premium E-commerce Website</option>
                                        <option>Scalable API Development</option>
                                        <option>Web Automation / Scraping</option>
                                        <option>Industrial Consultation</option>
                                    </select>
                                </div>
                                <div className="group">
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 group-focus-within:text-brand-blue transition-colors">Project Brief</label>
                                    <textarea rows={4} className="w-full bg-slate-800/50 border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-brand-blue outline-none transition-all placeholder:text-slate-600 font-medium resize-none" placeholder="Describe the system requirements..."></textarea>
                                </div>
                                <button className="group w-full bg-emerald-600 hover:bg-emerald-500 py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-white flex items-center justify-center gap-3 transition-all shadow-2xl shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:-translate-y-1 active:scale-95">
                                    Transmit Message <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </button>
                            </form>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}
