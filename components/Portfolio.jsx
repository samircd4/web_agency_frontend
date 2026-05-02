'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Terminal, Search, Cpu, Shield, Zap } from 'lucide-react';

const categories = ["All", "Web Scraping", "E-commerce", "API Systems"];

// Using regular <img> tags to avoid Next.js domain config requirements for external URLs

const projects = [
    {
        id: 1,
        title: "Aegis Data Engine",
        category: "Web Scraping",
        description: "High-concurrency extraction system processing 5M+ records daily with intelligent anti-bot bypass.",
        tags: ["Python", "Kafka", "Proxy Mesh"],
        metrics: { label: "Throughput", value: "5.2M / day" },
        Icon: Search,
        isTeal: true,
        liveUrl: "https://drpython.solutions",
        // Server room / data infrastructure
        image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80&fit=crop"
    },
    {
        id: 2,
        title: "Nexus Core Engine",
        category: "E-commerce",
        description: "Proprietary multi-vendor marketplace core with sub-100ms latency and AI-driven inventory sync.",
        tags: ["React", "Django", "Redis"],
        metrics: { label: "Latency", value: "< 85ms" },
        Icon: Cpu,
        isTeal: false,
        liveUrl: "https://drpython.solutions",
        // E-commerce / shopping UI
        image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80&fit=crop"
    },
    {
        id: 3,
        title: "Cipher Gateway",
        category: "API Systems",
        description: "Ultra-secure financial data pipeline with end-to-end encryption and automated compliance auditing.",
        tags: ["Go", "gRPC", "Vault"],
        metrics: { label: "Security", value: "AES-256-GCM" },
        Icon: Shield,
        isTeal: true,
        liveUrl: "https://drpython.solutions",
        // Cybersecurity / lock / shield
        image: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800&q=80&fit=crop"
    },
    {
        id: 4,
        title: "Titan Workflow",
        category: "API Systems",
        description: "Enterprise-grade automation engine coordinating distributed microservices across global clusters.",
        tags: ["Node.js", "Kubernetes", "AWS"],
        metrics: { label: "Scale", value: "10k+ nodes" },
        Icon: Zap,
        isTeal: false,
        liveUrl: "https://drpython.solutions",
        // Cloud / network infrastructure
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80&fit=crop"
    }
];

export default function Portfolio() {
    const [activeFilter, setActiveFilter] = useState("All");

    const filteredProjects = activeFilter === "All"
        ? projects
        : projects.filter(p => p.category === activeFilter);

    return (
        <section id="portfolio" className="py-24 bg-background relative overflow-hidden">
            {/* Ambient glows */}
            <div className="absolute top-1/4 left-0 w-96 h-96 bg-brand-teal/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-brand-red/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">

                {/* ── Header ── */}
                <div className="flex flex-col items-center mb-16 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-teal/10 border border-brand-teal/20 text-brand-teal text-xs font-bold uppercase tracking-widest mb-4"
                    >
                        <Terminal size={14} />
                        <span>System Portfolio</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight"
                    >
                        Engineered <span className="text-gradient-teal">Excellence.</span>
                    </motion.h2>

                    {/* Filter Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-wrap justify-center gap-3 mt-4"
                    >
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveFilter(cat)}
                                className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 border ${
                                    activeFilter === cat
                                        ? 'bg-brand-teal border-brand-teal text-white shadow-glow-teal'
                                        : 'bg-white/5 border-white/10 text-slate-500 hover:border-brand-teal/50 hover:text-white'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </motion.div>
                </div>

                {/* ── Grid ── */}
                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
                    <AnimatePresence mode="popLayout">
                        {filteredProjects.map((project) => (
                            <motion.div
                                key={project.id}
                                layout
                                initial={{ opacity: 0, scale: 0.92 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.92 }}
                                transition={{ duration: 0.35 }}
                                className="group relative"
                            >
                                {/*
                                 * OVERFLOW FIX:
                                 * - NO overflow-hidden on the outer card wrapper.
                                 *   overflow-hidden was what clipped the text on hover.
                                 * - overflow-hidden lives ONLY on the image container.
                                 * - Dynamic Tailwind classes replaced with static conditional strings
                                 *   so Tailwind's purger can detect them at build time.
                                 */}
                                <div className={`rounded-[2rem] border transition-all duration-500 bg-white/[0.03] backdrop-blur-sm ${
                                    project.isTeal
                                        ? 'border-white/10 hover:border-brand-teal/40 hover:shadow-[0_0_40px_0_rgba(0,200,150,0.10)]'
                                        : 'border-white/10 hover:border-brand-red/40  hover:shadow-[0_0_40px_0_rgba(232,69,69,0.10)]'
                                }`}>

                                    {/* Image — overflow-hidden isolated here only */}
                                    <div className="relative w-full aspect-[16/9] overflow-hidden rounded-t-[2rem]">
                                        <img
                                            src={project.image}
                                            alt={project.title}
                                            className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-70 group-hover:scale-105 transition-all duration-700 ease-out"
                                        />
                                        {/* Bottom fade */}
                                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50 pointer-events-none" />

                                        {/* Category badge */}
                                        <div className="absolute top-4 left-4">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.15em] backdrop-blur-md border ${
                                                project.isTeal
                                                    ? 'bg-brand-teal/20 border-brand-teal/40 text-brand-teal'
                                                    : 'bg-brand-red/20  border-brand-red/40  text-brand-red'
                                            }`}>
                                                <project.Icon size={12} />
                                                {project.category}
                                            </span>
                                        </div>

                                        {/* Metric badge */}
                                        <div className="absolute top-4 right-4 text-right">
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-0.5">
                                                {project.metrics.label}
                                            </p>
                                            <p className={`text-base font-black leading-none ${
                                                project.isTeal ? 'text-brand-teal' : 'text-brand-red'
                                            }`}>
                                                {project.metrics.value}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Text block — completely outside the image container */}
                                    <div className="p-6 flex flex-col gap-4 rounded-b-[2rem]">
                                        <h3 className="text-2xl font-black text-white leading-tight tracking-tight">
                                            {project.title}
                                        </h3>

                                        <p className="text-slate-400 text-sm leading-relaxed">
                                            {project.description}
                                        </p>

                                        {/* Tags + CTA row */}
                                        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                                            <div className="flex flex-wrap gap-2">
                                                {project.tags.map((tag) => (
                                                    <span
                                                        key={tag}
                                                        className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[9px] font-black text-slate-400 uppercase tracking-wider"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>

                                            <a
                                                href={project.liveUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`flex-shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all duration-300 hover:scale-105 active:scale-95 ${
                                                    project.isTeal
                                                        ? 'bg-brand-teal text-white shadow-lg shadow-brand-teal/20 hover:shadow-brand-teal/40'
                                                        : 'bg-brand-red  text-white shadow-lg shadow-brand-red/20  hover:shadow-brand-red/40'
                                                }`}
                                            >
                                                <ExternalLink size={14} />
                                                Live Demo
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </div>
        </section>
    );
}