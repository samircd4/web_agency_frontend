'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
    ArrowRight, Check, X, Zap, Database, Code2, Cpu,
    Shield, Globe, MessageSquare, ChevronDown, Star, Award
} from 'lucide-react';
import ScrollReveal from './ScrollReveal';

// ─── Plans Data ───────────────────────────────────────────────────────────────

const plans = [
    {
        id: 'starter',
        name: 'Starter',
        badge: null,
        price: '$499',
        suffix: 'one-time',
        description: 'Perfect for small businesses that need a single focused solution delivered fast.',
        color: 'brand-teal',
        cta: 'Get Started',
        ctaHref: '/start-project',
        features: [
            { text: '1 core service (Scraping, API, or E-commerce)', included: true },
            { text: '2 revision rounds', included: true },
            { text: '14-day delivery estimate', included: true },
            { text: 'Basic technical documentation', included: true },
            { text: 'Email support', included: true },
            { text: 'Code repository handoff', included: false },
            { text: 'Priority support channel', included: false },
            { text: '30-day post-launch support', included: false },
            { text: 'Cloud deployment', included: false },
            { text: 'Custom SLA agreement', included: false },
        ],
    },
    {
        id: 'professional',
        name: 'Professional',
        badge: 'Most Popular',
        price: '$1,999',
        suffix: 'one-time',
        description: 'For growing businesses that need multiple integrated systems and full handoff.',
        color: 'brand-red',
        cta: 'Start Project',
        ctaHref: '/start-project',
        features: [
            { text: 'Up to 3 core services bundled', included: true },
            { text: 'Full REST API integration', included: true },
            { text: '3 revision rounds', included: true },
            { text: '30-day delivery estimate', included: true },
            { text: 'Full technical documentation', included: true },
            { text: 'Code repository handoff', included: true },
            { text: 'Priority email support', included: true },
            { text: '30-day post-launch support', included: true },
            { text: 'Cloud deployment', included: false },
            { text: 'Custom SLA agreement', included: false },
        ],
    },
    {
        id: 'enterprise',
        name: 'Enterprise',
        badge: null,
        price: '$4,999',
        suffix: 'starting from',
        description: 'Industrial-grade systems with dedicated support, SLA, and full cloud deployment.',
        color: 'brand-teal',
        cta: 'Book a Call',
        ctaHref: '/contact',
        features: [
            { text: 'All 6 core services available', included: true },
            { text: 'Unlimited revision rounds', included: true },
            { text: 'Custom delivery timeline', included: true },
            { text: 'Full technical documentation', included: true },
            { text: 'Code repository handoff', included: true },
            { text: 'Dedicated Slack / WhatsApp channel', included: true },
            { text: '60-day post-launch support', included: true },
            { text: 'Cloud deployment included', included: true },
            { text: 'Custom SLA agreement', included: true },
            { text: 'Monthly retainer option', included: true },
        ],
    },
    {
        id: 'custom',
        name: 'Custom',
        badge: null,
        price: "Let's Talk",
        suffix: 'bespoke quote',
        description: 'Have a unique scope or ongoing needs? We\'ll scope, price, and structure it just for you.',
        color: 'brand-red',
        cta: 'Contact Us',
        ctaHref: '/contact',
        features: [
            { text: 'Fully bespoke project scope', included: true },
            { text: 'Retainer & milestone billing', included: true },
            { text: 'NDA signing available', included: true },
            { text: 'Dedicated project manager', included: true },
            { text: 'All Enterprise features included', included: true },
            { text: 'White-label delivery option', included: true },
            { text: 'Long-term partnership pricing', included: true },
            { text: 'Multi-system architecture', included: true },
            { text: 'Team augmentation available', included: true },
            { text: 'On-demand support contract', included: true },
        ],
    },
];

// ─── FAQ Data ─────────────────────────────────────────────────────────────────

const faqs = [
    {
        q: 'How does payment work?',
        a: 'We work with a 50% upfront deposit and 50% on delivery for Starter and Professional plans. Enterprise and Custom projects use milestone-based payment schedules agreed upon before work begins.',
    },
    {
        q: 'Can I upgrade my plan mid-project?',
        a: 'Yes. If your scope grows during development, we\'ll recalculate and issue an addendum. You only pay the difference — no penalty for upgrading.',
    },
    {
        q: 'Do you offer refunds?',
        a: 'The upfront deposit is non-refundable once development begins. If we fail to deliver within the agreed scope and timeline, we\'ll issue a full credit or partial refund depending on project stage.',
    },
    {
        q: 'Do you sign NDAs?',
        a: 'Absolutely. We routinely sign NDAs for all client engagements upon request, especially for proprietary automation systems and e-commerce engines.',
    },
    {
        q: 'What technologies do you use?',
        a: 'Our core stack is Python / Django for backend systems, Next.js / React for frontends, and PostgreSQL for data. We use Playwright, Scrapy, and custom proxy networks for industrial scraping.',
    },
    {
        q: 'How long does a project take?',
        a: 'Starter projects typically ship in 14 days. Professional in 30 days. Enterprise timelines are scoped per project. We always agree on a timeline before any deposit is taken.',
    },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function FAQItem({ item, index }) {
    const [open, setOpen] = useState(false);
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ delay: index * 0.07 }}
            className="border-b border-white/5 last:border-0"
        >
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between py-6 text-left gap-4 group"
            >
                <span className="text-white font-black text-base md:text-lg group-hover:text-brand-teal transition-colors">
                    {item.q}
                </span>
                <motion.div
                    animate={{ rotate: open ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="shrink-0 w-8 h-8 rounded-full glass border-white/10 flex items-center justify-center text-slate-400 group-hover:text-brand-teal group-hover:border-brand-teal/30 transition-all"
                >
                    <ChevronDown size={16} />
                </motion.div>
            </button>
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <p className="text-slate-400 text-base leading-relaxed pb-6 max-w-3xl">
                            {item.a}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Pricing() {
    return (
        <div className="bg-background text-foreground overflow-hidden">

            {/* ── HERO ──────────────────────────────────────────────────── */}
            <section className="relative min-h-[60vh] flex items-center pt-24 pb-12 overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[55%] h-[55%] bg-brand-teal/5 rounded-full blur-[130px] animate-pulse-slow" />
                <div className="absolute bottom-0 left-[-10%] w-[45%] h-[45%] bg-brand-red/5 rounded-full blur-[130px] animate-pulse-slow" style={{ animationDelay: '3s' }} />
                <div className="absolute inset-0 opacity-[0.07] pointer-events-none [background-image:radial-gradient(var(--color-surface-700)_1px,transparent_1px)] [background-size:40px_40px]" />

                <div className="container mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-brand-teal text-[10px] font-black tracking-[0.3em] uppercase mb-8 backdrop-blur-md"
                    >
                        <Zap size={14} className="text-brand-red animate-pulse" />
                        <span>Transparent Pricing</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                        className="text-4xl md:text-7xl font-black text-white tracking-tight leading-[1.05] mb-6"
                    >
                        No Surprises. <br />
                        <span className="text-gradient-teal">Just Results.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35, duration: 0.8 }}
                        className="max-w-2xl mx-auto text-slate-400 text-base md:text-xl mb-4 leading-relaxed"
                    >
                        Fixed-scope plans for projects of every size. Every quote is scoped before
                        a single line of code is written.
                    </motion.p>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-slate-600 text-sm font-bold uppercase tracking-widest"
                    >
                        All prices are one-time project fees — no hidden subscriptions
                    </motion.p>
                </div>

                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
            </section>

            {/* ── PLAN CARDS ────────────────────────────────────────────── */}
            <section className="pb-16 relative">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                        {plans.map((plan, i) => (
                            <motion.div
                                key={plan.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: false }}
                                transition={{ delay: i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                                className={`relative flex flex-col rounded-[2rem] glass border transition-all duration-500 group
                                    ${plan.badge
                                        ? 'border-brand-red/40 shadow-glow-red'
                                        : 'border-white/5 hover:border-white/15'
                                    }`}
                            >
                                {/* Popular badge */}
                                {plan.badge && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 bg-brand-red text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-full shadow-glow-red whitespace-nowrap flex items-center gap-1.5">
                                        <Star size={11} fill="currentColor" /> {plan.badge}
                                    </div>
                                )}

                                <div className="p-8 flex flex-col flex-1">
                                    {/* Header */}
                                    <div className="mb-8">
                                        <p className={`text-[10px] font-black uppercase tracking-[0.3em] text-${plan.color} mb-3`}>
                                            {plan.name}
                                        </p>
                                        <div className="flex items-end gap-2 mb-1">
                                            <span className="text-3xl md:text-5xl font-black text-white tracking-tighter">
                                                {plan.price}
                                            </span>
                                        </div>
                                        <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest mb-4">
                                            {plan.suffix}
                                        </p>
                                        <p className="text-slate-400 text-sm leading-relaxed">
                                            {plan.description}
                                        </p>
                                    </div>

                                    {/* Divider */}
                                    <div className="h-px bg-white/5 mb-8" />

                                    {/* Features */}
                                    <ul className="space-y-3 flex-1 mb-10">
                                        {plan.features.map((f, fi) => (
                                            <li key={fi} className="flex items-start gap-3">
                                                {f.included ? (
                                                    <div className={`mt-0.5 shrink-0 w-5 h-5 rounded-full bg-${plan.color}/10 flex items-center justify-center`}>
                                                        <Check size={11} className={`text-${plan.color}`} />
                                                    </div>
                                                ) : (
                                                    <div className="mt-0.5 shrink-0 w-5 h-5 rounded-full bg-white/5 flex items-center justify-center">
                                                        <X size={11} className="text-slate-700" />
                                                    </div>
                                                )}
                                                <span className={`text-sm ${f.included ? 'text-slate-300' : 'text-slate-600'}`}>
                                                    {f.text}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* CTA */}
                                    <Link
                                        href={plan.ctaHref}
                                        className={`w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300 group/btn
                                            ${plan.badge
                                                ? 'bg-brand-red text-white hover:bg-brand-red/90 shadow-glow-red hover:-translate-y-1'
                                                : `glass border-${plan.color}/20 text-white hover:border-${plan.color}/50 hover:bg-${plan.color}/5`
                                            }`}
                                    >
                                        {plan.cta}
                                        <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Guarantee strip */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-8 text-center sm:text-left"
                    >
                        {[
                            { icon: <Shield size={16} />, text: '50% deposit, 50% on delivery' },
                            { icon: <Award size={16} />, text: 'Scope agreed before payment' },
                            { icon: <MessageSquare size={16} />, text: 'NDA signing available' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-widest">
                                <span className="text-brand-teal">{item.icon}</span>
                                {item.text}
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ── WHAT'S INCLUDED ───────────────────────────────────────── */}
            <section className="py-12 md:py-20 bg-slate-950 relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

                <div className="container mx-auto px-6 relative z-10">
                    <ScrollReveal>
                        <div className="text-center mb-16">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-red/10 border border-brand-red/20 text-brand-red text-[10px] font-black tracking-[0.2em] uppercase mb-6">
                                <Code2 size={12} />
                                <span>Every Project Includes</span>
                            </div>
                            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter">
                                Built-in <span className="text-gradient-red">standards.</span>
                            </h2>
                        </div>
                    </ScrollReveal>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
                        {[
                            { icon: <Database size={22} />, title: 'Clean Architecture', desc: 'Every system is built with separation of concerns, clear folder structures, and commented code.' },
                            { icon: <Shield size={22} />, title: 'Security First', desc: 'All deliverables are hardened against common attack vectors — SQL injection, XSS, CSRF, and rate limiting.' },
                            { icon: <Globe size={22} />, title: 'Deployment Ready', desc: 'We ship Docker-ready, environment-variable-driven code that deploys with a single command.' },
                            { icon: <Cpu size={22} />, title: 'Performance Optimised', desc: 'Database indexes, query optimisation, and caching strategies baked in from day one.' },
                            { icon: <Code2 size={22} />, title: 'Git Repository', desc: 'All code is delivered via a clean, organised Git repository with meaningful commit history.' },
                            { icon: <MessageSquare size={22} />, title: 'Direct Communication', desc: 'You work directly with the engineer building your system — no account managers, no delays.' },
                        ].map((item, i) => (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: false }}
                                transition={{ delay: i * 0.08 }}
                                className="group p-6 rounded-3xl glass border-white/5 hover:border-brand-teal/20 transition-all duration-500"
                            >
                                <div className="w-11 h-11 rounded-2xl bg-white/5 flex items-center justify-center text-brand-teal mb-4 group-hover:scale-110 transition-transform duration-500">
                                    {item.icon}
                                </div>
                                <h3 className="text-white font-black text-sm uppercase tracking-widest mb-2">
                                    {item.title}
                                </h3>
                                <p className="text-slate-500 text-xs leading-relaxed">
                                    {item.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── FAQ ───────────────────────────────────────────────────── */}
            <section className="py-16 md:py-24 relative overflow-hidden">
                <div className="absolute right-0 top-0 w-1/2 h-full bg-brand-teal/3 blur-[160px] rounded-full pointer-events-none" />

                <div className="container mx-auto px-6 relative z-10">
                    <ScrollReveal>
                        <div className="text-center mb-16">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-teal/10 border border-brand-teal/20 text-brand-teal text-[10px] font-black tracking-[0.2em] uppercase mb-6">
                                <MessageSquare size={12} />
                                <span>Common Questions</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
                                Everything you <span className="text-gradient-teal">need to know.</span>
                            </h2>
                        </div>
                    </ScrollReveal>

                    <div className="max-w-3xl mx-auto glass border-white/5 rounded-[2.5rem] p-8 md:p-12">
                        {faqs.map((item, i) => (
                            <FAQItem key={i} item={item} index={i} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ───────────────────────────────────────────────────── */}
            <section className="py-16 md:py-24 bg-slate-950 relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-brand-teal/5 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" />

                <div className="container mx-auto px-6 relative z-10 text-center">
                    <ScrollReveal>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-teal/10 border border-brand-teal/20 text-brand-teal text-[10px] font-black tracking-[0.2em] uppercase mb-8">
                            <Zap size={12} fill="currentColor" />
                            <span>Not Sure Which Plan?</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-[1.05] mb-6">
                            Let's scope it <br />
                            <span className="text-gradient-teal">together.</span>
                        </h2>
                        <p className="max-w-xl mx-auto text-slate-400 text-lg mb-12 leading-relaxed">
                            Tell us what you need and we'll recommend the right plan — or build a custom quote from scratch.
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
