'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    Zap, Code2, Database, Terminal, Globe, Shield, ArrowRight,
    Cpu, BarChart3, Layers, Users, Award, Clock, Target
} from 'lucide-react';
import ScrollReveal from './ScrollReveal';

// ─── Data ────────────────────────────────────────────────────────────────────

const stats = [
    { value: '150+', label: 'Projects Delivered', color: 'text-brand-teal' },
    { value: '5+',   label: 'Years Engineering',  color: 'text-brand-red'  },
    { value: '99.9%', label: 'Uptime Guarantee',  color: 'text-white'      },
    { value: '100%', label: 'Client Satisfaction', color: 'text-emerald-400' },
];

const values = [
    {
        icon: <Shield size={24} />,
        title: 'Reliability First',
        desc: 'We ship production-ready systems that run 24/7 without hand-holding. Every component is stress-tested before it ever touches your stack.',
        color: 'brand-teal',
    },
    {
        icon: <Zap size={24} />,
        title: 'Velocity by Design',
        desc: 'Speed is never an afterthought. Our architectures are optimised at every layer — from database indexing to CDN caching to render pipelines.',
        color: 'brand-red',
    },
    {
        icon: <Layers size={24} />,
        title: 'Modular Engineering',
        desc: 'We build composable, decoupled systems so you can extend, swap, and scale individual pieces without rewriting the whole product.',
        color: 'brand-teal',
    },
    {
        icon: <Target size={24} />,
        title: 'Outcome-Obsessed',
        desc: "We measure success by the numbers you care about — revenue, uptime, throughput. Great code that doesn't move metrics isn't good enough.",
        color: 'brand-red',
    },
];

const stack = [
    { name: 'Python / Django', icon: <Terminal size={20} />, level: 98 },
    { name: 'Next.js / React',  icon: <Code2 size={20} />,    level: 96 },
    { name: 'PostgreSQL',       icon: <Database size={20} />, level: 94 },
    { name: 'Cloud & DevOps',   icon: <Globe size={20} />,    level: 91 },
    { name: 'Web Automation',   icon: <Cpu size={20} />,      level: 97 },
    { name: 'API Architecture', icon: <BarChart3 size={20} />, level: 95 },
];

const milestones = [
    { year: '2019', title: 'Founded',          desc: 'Started as a solo Python freelancing operation, automating tedious data workflows for early clients.' },
    { year: '2020', title: 'First SaaS',       desc: 'Launched the first proprietary scraping SaaS, processing millions of records per day for e-commerce brands.' },
    { year: '2022', title: 'Commerce Engine',  desc: 'Delivered a full-stack Django + Next.js e-commerce platform serving 50k+ active users at peak.' },
    { year: '2024', title: 'Industrial Scale', desc: 'Crossed 150 shipped projects and expanded into multi-region cloud deployments and real-time analytics pipelines.' },
    { year: '2025', title: 'AI Integration',   desc: 'Pioneered the integration of Large Language Models into high-concurrency data pipelines, enabling autonomous decision-making.' },
    { year: '2026', title: 'Agentic Systems',  desc: 'Setting the new standard with autonomous agent frameworks and self-healing infrastructure for global enterprise operations.' },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function AboutUs() {
    return (
        <div className="bg-background text-foreground overflow-hidden">

            {/* ── HERO ────────────────────────────────────────────────────── */}
            <section className="relative min-h-[72vh] flex items-center pt-24 pb-16 overflow-hidden">
                {/* Background blobs */}
                <div className="absolute top-[-10%] right-[-10%] w-[55%] h-[55%] bg-brand-teal/5 rounded-full blur-[130px] animate-pulse-slow" />
                <div className="absolute bottom-0 left-[-10%] w-[45%] h-[45%] bg-brand-red/5 rounded-full blur-[130px] animate-pulse-slow" style={{ animationDelay: '3s' }} />
                <div className="absolute inset-0 opacity-[0.07] pointer-events-none [background-image:radial-gradient(var(--color-surface-700)_1px,transparent_1px)] [background-size:40px_40px]" />

                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-4xl">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-brand-teal text-[10px] font-black tracking-[0.3em] uppercase mb-8 backdrop-blur-md"
                        >
                            <Users size={14} className="text-brand-red animate-pulse" />
                            <span>Who We Are</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                            className="text-4xl md:text-7xl font-black text-white tracking-tight leading-[1.05] mb-8"
                        >
                            Engineering <br />
                            <span className="text-gradient-teal">Digital Assets</span> <br />
                            at Industrial Scale
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.35, duration: 0.8 }}
                            className="max-w-2xl text-slate-400 text-base md:text-xl mb-12 leading-relaxed"
                        >
                            Dr. Python Solutions is a boutique software engineering firm that builds
                            proprietary scraping networks, high-velocity commerce engines, and scalable
                            API infrastructures for ambitious businesses worldwide.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.45 }}
                            className="flex flex-col sm:flex-row gap-4"
                        >
                            <Link
                                href="/start-project"
                                className="group px-10 py-5 bg-brand-teal hover:bg-brand-teal/90 text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all duration-300 shadow-glow-teal hover:-translate-y-1"
                            >
                                Start a Project
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                href="/portfolio"
                                className="px-10 py-5 glass border-white/10 text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all hover:bg-white/10 active:scale-95"
                            >
                                View Our Work
                            </Link>
                        </motion.div>
                    </div>
                </div>

                {/* Bottom fade */}
                <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-background to-transparent pointer-events-none" />
            </section>

            {/* ── STATS BAR ───────────────────────────────────────────────── */}
            <section className="py-8 bg-slate-950 relative">
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

                <div className="container mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                        {stats.map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <h3 className={`text-4xl md:text-6xl font-black mb-3 ${stat.color} tracking-tighter drop-shadow-2xl`}>
                                    {stat.value}
                                </h3>
                                <div className="w-10 h-0.5 bg-slate-800 mx-auto mb-3" />
                                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">
                                    {stat.label}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── MISSION ─────────────────────────────────────────────────── */}
            <section className="py-16 md:py-24 relative overflow-hidden">
                <div className="absolute right-0 top-0 w-1/2 h-full bg-brand-teal/3 blur-[160px] rounded-full pointer-events-none" />

                <div className="container mx-auto px-6 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">

                        {/* Left – copy */}
                        <div>
                            <ScrollReveal>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-teal/10 border border-brand-teal/20 text-brand-teal text-[10px] font-black tracking-[0.2em] uppercase mb-6">
                                    <Zap size={12} fill="currentColor" />
                                    <span>Our Mission</span>
                                </div>
                                <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter leading-[1.1]">
                                    Code that <br />
                                    <span className="text-gradient-teal">creates value.</span>
                                </h2>
                            </ScrollReveal>

                            <ScrollReveal delay={0.15}>
                                <p className="text-slate-400 text-lg leading-relaxed mb-6 max-w-lg">
                                    We exist to bridge the gap between complex technical capability and
                                    real business outcomes. Every system we build is engineered to run
                                    faster, scale further, and earn more — with zero fluff.
                                </p>
                                <p className="text-slate-500 text-base leading-relaxed max-w-lg">
                                    We work with founders, operators, and engineering teams who need
                                    senior-level execution without the overhead of a large agency. That
                                    means tight feedback loops, direct communication, and code shipped on
                                    time.
                                </p>
                            </ScrollReveal>
                        </div>

                        {/* Right – values bento grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {values.map((v, i) => (
                                <motion.div
                                    key={v.title}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: false }}
                                    transition={{ delay: i * 0.1 }}
                                    className={`group p-6 rounded-3xl glass border-white/5 hover:border-${v.color}/30 transition-all duration-500`}
                                >
                                    <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-${v.color} mb-4 group-hover:scale-110 transition-transform duration-500`}>
                                        {v.icon}
                                    </div>
                                    <h3 className={`text-white font-black text-sm uppercase tracking-widest mb-2 group-hover:text-${v.color} transition-colors`}>
                                        {v.title}
                                    </h3>
                                    <p className="text-slate-500 text-xs leading-relaxed">
                                        {v.desc}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── TECH STACK ──────────────────────────────────────────────── */}
            <section className="py-16 md:py-24 bg-slate-950 relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.04] pointer-events-none [background-image:radial-gradient(var(--color-surface-700)_1px,transparent_1px)] [background-size:36px_36px]" />

                <div className="container mx-auto px-6 relative z-10">
                    <ScrollReveal>
                        <div className="text-center mb-16">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-red/10 border border-brand-red/20 text-brand-red text-[10px] font-black tracking-[0.2em] uppercase mb-6">
                                <Code2 size={12} />
                                <span>Our Stack</span>
                            </div>
                            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-[1.1]">
                                Built on <span className="text-gradient-red">Proven Tech.</span>
                            </h2>
                            <p className="mt-4 text-slate-500 max-w-xl mx-auto text-base leading-relaxed">
                                We use battle-tested technologies at every layer of the stack — and we push them to their limits.
                            </p>
                        </div>
                    </ScrollReveal>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {stack.map((item, i) => (
                            <motion.div
                                key={item.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: false }}
                                transition={{ delay: i * 0.08 }}
                                className="group p-6 rounded-3xl glass border-white/5 hover:border-brand-teal/30 transition-all duration-500"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 rounded-2xl bg-white/5 text-brand-teal group-hover:scale-110 transition-transform duration-500">
                                            {item.icon}
                                        </div>
                                        <span className="text-white font-black text-sm uppercase tracking-widest">
                                            {item.name}
                                        </span>
                                    </div>
                                    <span className="text-[10px] font-black text-brand-teal opacity-50 group-hover:opacity-100 transition-opacity">
                                        {item.level}%
                                    </span>
                                </div>
                                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileInView={{ width: `${item.level}%` }}
                                        viewport={{ once: false }}
                                        transition={{ duration: 1.5, delay: 0.4, ease: 'circOut' }}
                                        className="h-full bg-brand-teal"
                                    />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── TIMELINE ────────────────────────────────────────────────── */}
            <section className="py-16 md:py-24 relative overflow-hidden">
                <div className="absolute left-0 top-0 w-1/2 h-full bg-brand-red/3 blur-[160px] rounded-full pointer-events-none" />

                <div className="container mx-auto px-6 relative z-10">
                    <ScrollReveal>
                        <div className="mb-16">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-teal/10 border border-brand-teal/20 text-brand-teal text-[10px] font-black tracking-[0.2em] uppercase mb-6">
                                <Clock size={12} />
                                <span>Our Story</span>
                            </div>
                            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-[1.1]">
                                How we <span className="text-gradient-teal">got here.</span>
                            </h2>
                        </div>
                    </ScrollReveal>

                    <div className="relative">
                        {/* Vertical line */}
                        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-brand-teal/40 via-brand-red/20 to-transparent" />

                        <div className="flex flex-col gap-12">
                            {milestones.map((m, i) => (
                                <motion.div
                                    key={m.year}
                                    initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: false }}
                                    transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                                    className={`relative flex items-start gap-8 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} flex-row`}
                                >
                                    {/* Dot */}
                                    <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-brand-teal border-2 border-background shadow-glow-teal z-10 mt-1.5" />

                                    {/* Year badge */}
                                    <div className={`hidden md:flex w-1/2 ${i % 2 === 0 ? 'justify-end pr-12' : 'justify-start pl-12'}`}>
                                        <div className="inline-flex items-center px-4 py-2 rounded-full glass border-brand-teal/20 text-brand-teal text-xs font-black tracking-[0.3em] uppercase">
                                            {m.year}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className={`w-full md:w-1/2 pl-20 md:pl-0 ${i % 2 === 0 ? 'md:pl-12' : 'md:pr-12'}`}>
                                        <div className="p-6 rounded-3xl glass border-white/5 hover:border-brand-teal/20 transition-all duration-500">
                                            <div className="md:hidden inline-flex items-center px-3 py-1 rounded-full bg-brand-teal/10 border border-brand-teal/20 text-brand-teal text-[10px] font-black tracking-[0.2em] uppercase mb-3">
                                                {m.year}
                                            </div>
                                            <h3 className="text-white font-black text-lg uppercase tracking-widest mb-2">
                                                {m.title}
                                            </h3>
                                            <p className="text-slate-500 text-sm leading-relaxed">
                                                {m.desc}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── CTA ─────────────────────────────────────────────────────── */}
            <section className="py-16 md:py-24 bg-slate-950 relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-brand-teal/5 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" />

                <div className="container mx-auto px-6 relative z-10 text-center">
                    <ScrollReveal>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-teal/10 border border-brand-teal/20 text-brand-teal text-[10px] font-black tracking-[0.2em] uppercase mb-8">
                            <Award size={12} />
                            <span>Let's Build Together</span>
                        </div>
                        <h2 className="text-4xl md:text-7xl font-black text-white tracking-tight leading-[1.05] mb-6">
                            Ready to ship <br />
                            <span className="text-gradient-teal">something great?</span>
                        </h2>
                        <p className="max-w-xl mx-auto text-slate-400 text-lg mb-12 leading-relaxed">
                            Tell us what you're building. We'll scope it, price it, and deliver it — on time, every time.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/start-project"
                                className="group px-12 py-5 bg-brand-teal hover:bg-brand-teal/90 text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all duration-300 shadow-glow-teal hover:-translate-y-1"
                            >
                                Start a Project
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                href="/contact"
                                className="px-12 py-5 glass border-white/10 text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all hover:bg-white/10 active:scale-95"
                            >
                                Get in Touch
                            </Link>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

        </div>
    );
}
