'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, Phone, MapPin, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';

export default function Contact() {
    return (
        <section id="contact" className="pt-0 pb-4 bg-background relative overflow-hidden">
            <div className="absolute top-1/2 right-0 w-[40rem] h-[40rem] bg-brand-teal/5 rounded-full blur-[150px] pointer-events-none" />

            <div className="w-full md:container mx-auto px-0 md:px-6 relative z-10">
                <div className="max-w-6xl mx-auto glass border-white/5 rounded-2xl md:rounded-[3rem] overflow-hidden shadow-premium">
                    <div className="grid lg:grid-cols-2">

                        {/* Info Side */}
                        <div className="p-4 md:p-12 lg:p-20 bg-white/[0.02] border-b lg:border-b-0 lg:border-r border-white/5">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                            >
                                <span className="text-xs font-black uppercase tracking-[0.4em] text-brand-teal mb-6 block">Contact Us</span>
                                <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-8 tracking-tighter leading-[0.9]">
                                    Start your <br />
                                    <span className="text-gradient-teal">next project.</span>
                                </h2>
                                <p className="text-slate-400 text-base md:text-lg mb-12 leading-relaxed max-w-md">
                                    Ready to scale your operations? Our team is here to help you build the right solution.
                                </p>

                                <div className="space-y-6">
                                    {[
                                        {
                                            icon: <Mail className="text-brand-teal" />,
                                            label: 'Email',
                                            text: 'contact@drpythonsolutions.com',
                                            href: 'mailto:contact@drpythonsolutions.com',
                                        },
                                        {
                                            icon: <Phone className="text-brand-red" />,
                                            label: 'Phone',
                                            text: '+880 1781 355377',
                                            href: 'tel:+8801781355377',
                                        },
                                        {
                                            icon: <MapPin className="text-brand-indigo" />,
                                            label: 'Location',
                                            text: 'Kishoreganj, Dhaka, Bangladesh',
                                            href: null,
                                        },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-6 group">
                                            <div className="w-14 h-14 rounded-2xl glass border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-2xl">
                                                {item.icon}
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{item.label}</p>
                                                {item.href ? (
                                                    <a href={item.href} className="text-white font-bold text-lg hover:text-brand-teal transition-colors">
                                                        {item.text}
                                                    </a>
                                                ) : (
                                                    <p className="text-white font-bold text-lg">{item.text}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}

                                    {/* Dashboard Link for Mobile */}
                                    <div className="md:hidden pt-6 border-t border-white/5">
                                        <Link href="/dashboard" className="flex items-center gap-6 group">
                                            <div className="w-14 h-14 rounded-2xl glass border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-2xl">
                                                <LayoutDashboard className="text-brand-teal" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Dashboard</p>
                                                <p className="text-white font-bold text-lg hover:text-brand-teal transition-colors">
                                                    Client Portal
                                                </p>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Form Side */}
                        <div className="p-4 md:p-12 lg:p-20">
                            {/* Form */}
                            <form className="space-y-5">

                                {/* Name + Email */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                                    {/* Name */}
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-slate-400">
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Your Name"
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white 
                  focus:outline-none focus:ring-2 focus:ring-teal-400/40 focus:border-teal-400/50
                  placeholder:text-slate-500 text-sm"
                                        />
                                    </div>

                                    {/* Email */}
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-slate-400">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            placeholder="Your Email"
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white 
                  focus:outline-none focus:ring-2 focus:ring-teal-400/40 focus:border-teal-400/50
                  placeholder:text-slate-500 text-sm"
                                        />
                                    </div>

                                </div>

                                {/* Message */}
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-slate-400">
                                        Message
                                    </label>
                                    <textarea
                                        rows="5"
                                        placeholder="Tell us what you need..."
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white 
                focus:outline-none focus:ring-2 focus:ring-teal-400/40 focus:border-teal-400/50
                placeholder:text-slate-500 resize-none text-sm"
                                    ></textarea>
                                </div>

                                {/* Button */}
                                <button
                                    type="submit"
                                    className="w-full py-3 sm:py-4 bg-teal-500 hover:bg-teal-500/90 
              text-white rounded-lg font-semibold text-sm uppercase tracking-wide
              transition-all flex items-center justify-center gap-2
              shadow-lg shadow-teal-500/20 active:scale-95"
                                >
                                    Send Message
                                    <Send size={16} />
                                </button>

                                {/* Footer */}
                                <p className="text-center text-xs text-slate-500">
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
