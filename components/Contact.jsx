'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, MessageSquare, Globe } from 'lucide-react';

export default function Contact() {
    return (
        <section id="contact" className="py-24 bg-background relative overflow-hidden">
            <div className="absolute top-1/2 right-0 w-[40rem] h-[40rem] bg-brand-teal/5 rounded-full blur-[150px] pointer-events-none" />
            
            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-6xl mx-auto glass border-white/5 rounded-[3rem] overflow-hidden shadow-premium">
                    <div className="grid lg:grid-cols-2">
                        
                        {/* Info Side */}
                        <div className="p-12 lg:p-20 bg-white/[0.02] border-r border-white/5">
                            <motion.div 
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                            >
                                <span className="text-xs font-black uppercase tracking-[0.4em] text-brand-teal mb-6 block">Contact Us</span>
                                <h2 className="text-5xl md:text-6xl font-black text-white mb-8 tracking-tighter leading-[0.9]">
                                    Start your <br/>
                                    <span className="text-gradient-teal">next project.</span>
                                </h2>
                                <p className="text-slate-400 text-lg mb-12 leading-relaxed max-w-md">
                                    Ready to scale your operations? Our team is here to help you build the right solution.
                                </p>
                                
                                <div className="space-y-6">
                                    {[
                                        { icon: <Mail className="text-brand-teal" />, text: "hello@drpython.solutions", label: "Email" },
                                        { icon: <MessageSquare className="text-brand-red" />, text: "+1 (555) DR-PYTHON", label: "Phone" },
                                        { icon: <Globe className="text-brand-indigo" />, text: "Silicon Valley, CA", label: "Location" }
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-6 group">
                                            <div className="w-14 h-14 rounded-2xl glass border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-2xl">
                                                {item.icon}
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{item.label}</p>
                                                <p className="text-white font-bold text-lg">{item.text}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>

                        {/* Form Side */}
                        <div className="p-12 lg:p-20">
                            <form className="space-y-8">
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Name</label>
                                        <input 
                                            type="text" 
                                            placeholder="Your Name" 
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-brand-teal/50 transition-all placeholder:text-slate-600 font-bold"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Email</label>
                                        <input 
                                            type="email" 
                                            placeholder="Your Email" 
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-brand-teal/50 transition-all placeholder:text-slate-600 font-bold"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Message</label>
                                    <textarea 
                                        rows="4" 
                                        placeholder="How can we help you?" 
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-brand-teal/50 transition-all placeholder:text-slate-600 font-bold resize-none"
                                    ></textarea>
                                </div>
                                <button className="w-full py-6 bg-brand-teal hover:bg-brand-teal/90 text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-2xl shadow-brand-teal/20 hover:-translate-y-1 active:scale-95 group">
                                    Send Message
                                    <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </button>
                                <p className="text-center text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                                    We usually respond within 24 hours
                                </p>
                            </form>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}
