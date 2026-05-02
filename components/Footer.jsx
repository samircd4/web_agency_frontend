'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Globe, Send, MessageSquare, Mail, Code2, Cpu, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Footer() {
    return (
        <footer className="bg-surface-900 border-t border-white/5 pt-24 pb-12">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
                    <div className="lg:col-span-2">
                        <Link href="/" className="flex items-center gap-3 mb-8 group">
                            <div className="relative w-12 h-12 group-hover:scale-110 transition-transform duration-500">
                                <div className="absolute inset-0 bg-brand-teal/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="relative w-full h-full glass rounded-xl flex items-center justify-center overflow-hidden border-white/10 group-hover:border-brand-teal/30">
                                    <Image 
                                        src="/images/logo/logo.png" 
                                        alt="Dr. Python Solutions" 
                                        fill 
                                        sizes="48px"
                                        className="object-contain p-2"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-black text-white tracking-tight leading-none">Dr.Python</span>
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] leading-none mt-1">Solutions</span>
                            </div>
                        </Link>
                        <p className="text-slate-400 max-w-sm mb-10 text-lg leading-relaxed">
                            Engineering the future of data extraction and e-commerce through algorithmic excellence and enterprise reliability.
                        </p>
                        <div className="flex gap-4">
                            {[
                                { icon: <Code2 size={20} />, label: "Development", color: "brand-teal" },
                                { icon: <Share2 size={20} />, label: "Social", color: "brand-red" },
                                { icon: <Globe size={20} />, label: "Web", color: "brand-blue" },
                                { icon: <Mail size={20} />, label: "Email", color: "brand-indigo" }
                            ].map((social, i) => (
                                <motion.a 
                                    key={i}
                                    title={social.label}
                                    href="#" 
                                    whileHover={{ y: -5, scale: 1.1 }}
                                    className={`w-12 h-12 glass rounded-xl flex items-center justify-center text-slate-400 hover:text-${social.color} hover:border-${social.color}/30 transition-all`}
                                >
                                    {social.icon}
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-sm font-black uppercase tracking-[0.2em] text-white mb-8">Capabilities</h4>
                        <ul className="space-y-4">
                            {[
                                { name: 'Industrial Scraping', href: '/services' },
                                { name: 'API Architectures', href: '/services' },
                                { name: 'E-commerce Engines', href: '/services' },
                                { name: 'Automation Logic', href: '/services' }
                            ].map((item) => (
                                <li key={item.name}>
                                    <Link href={item.href} className="text-slate-400 hover:text-brand-teal transition-colors font-medium">{item.name}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-sm font-black uppercase tracking-[0.2em] text-white mb-8">System</h4>
                        <ul className="space-y-4">
                            {[
                                { name: 'Our Methodology', href: '/services#process' },
                                { name: 'Core Expertise', href: '/services#expertise' },
                                { name: 'Recent Works', href: '/portfolio' },
                                { name: 'Initialize Project', href: '/start-project' }
                            ].map((item) => (
                                <li key={item.name}>
                                    <Link href={item.href} className="text-slate-400 hover:text-brand-red transition-colors font-medium">{item.name}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-slate-500 text-sm font-bold">
                    <p>© 2026 Dr. Python Solutions. All rights reserved.</p>
                    <div className="flex gap-8">
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy Protocol</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}