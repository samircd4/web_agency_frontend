'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Terminal, Search, Cpu, Shield, Zap } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api';

const categories = ["All", "Web Scraping", "E-commerce", "API Systems"];

function getIcon(category) {
    switch (category?.toLowerCase()) {
        case 'web scraping':
            return Search;
        case 'e-commerce':
            return Cpu;
        case 'api systems':
            return Shield;
        default:
            return Zap;
    }
}

export default function Portfolio() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState("All");

    useEffect(() => {
        async function loadProjects() {
            try {
                // If there's an active category filter, we can query by it
                const filterTag = activeFilter !== 'All' ? activeFilter : '';
                const data = await api.getPortfolioItems();
                const results = data.results || data;
                setProjects(results);
            } catch (err) {
                console.error('Failed to load portfolio items:', err);
            } finally {
                setLoading(false);
            }
        }
        loadProjects();
    }, []);

    // Frontend categorization filter based on loaded items
    const filteredProjects = activeFilter === "All"
        ? projects
        : projects.filter(p => {
            // Check if tags or description matches the category
            // Standard category can be mapped based on title or tags
            const catLower = activeFilter.toLowerCase();
            const tagMatch = p.tags?.some(t => t.name.toLowerCase() === catLower);
            const descMatch = p.description?.toLowerCase().includes(catLower) || p.title?.toLowerCase().includes(catLower);
            return tagMatch || descMatch;
        });

    return (
        <section id="portfolio" className="py-8 bg-background relative overflow-hidden">
            {/* Ambient glows */}
            <div className="absolute top-1/4 left-0 w-96 h-96 bg-brand-teal/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-brand-red/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">

                {/* ── Header ── */}
                <div className="flex flex-col items-center mb-8 text-center">
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
                        className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight"
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

                {/* ── Loading / Grid ── */}
                {loading ? (
                    <div className="flex items-center justify-center py-24">
                        <div className="w-8 h-8 border-4 border-brand-teal/30 border-t-brand-teal rounded-full animate-spin" />
                    </div>
                ) : filteredProjects.length === 0 ? (
                    <div className="text-center py-24 text-slate-500 uppercase font-black text-sm tracking-widest">
                        No portfolio entries loaded in buffer.
                    </div>
                ) : (
                    <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
                        <AnimatePresence mode="popLayout">
                            {filteredProjects.map((project, index) => {
                                const isTeal = index % 2 === 0;
                                const tagNames = project.tags?.map(t => t.name) || ["Python", "Django"];
                                const category = tagNames.includes("Next.js") ? "API Systems" : tagNames.includes("Django") ? "E-commerce" : "Web Scraping";
                                const Icon = getIcon(category);
                                const image = project.cover_image_url || "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80&fit=crop";
                                const metricLabel = isTeal ? "Throughput" : "Latency";
                                const metricValue = isTeal ? "5.2M / day" : "< 85ms";

                                return (
                                    <motion.div
                                        key={project.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.92 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.92 }}
                                        transition={{ duration: 0.35 }}
                                        className="group relative cursor-pointer"
                                    >
                                        <Link href={`/portfolio/${project.slug}`}>
                                            <div className={`rounded-xl border transition-all duration-500 bg-white/[0.03] backdrop-blur-sm ${
                                                isTeal
                                                    ? 'border-white/10 hover:border-brand-teal/40 hover:shadow-[0_0_40px_0_rgba(0,200,150,0.10)]'
                                                    : 'border-white/10 hover:border-brand-red/40  hover:shadow-[0_0_40px_0_rgba(232,69,69,0.10)]'
                                            }`}>

                                                {/* Image Container */}
                                                <div className="relative w-full aspect-[16/9] overflow-hidden rounded-t-xl">
                                                    <img
                                                        src={image}
                                                        alt={project.title}
                                                        className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-70 group-hover:scale-105 transition-all duration-700 ease-out"
                                                    />
                                                    {/* Bottom fade */}
                                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50 pointer-events-none" />

                                                    {/* Category badge */}
                                                    <div className="absolute top-4 left-4">
                                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.15em] backdrop-blur-md border ${
                                                            isTeal
                                                                ? 'bg-brand-teal/20 border-brand-teal/40 text-brand-teal'
                                                                : 'bg-brand-red/20  border-brand-red/40  text-brand-red'
                                                        }`}>
                                                            <Icon size={12} />
                                                            {category}
                                                        </span>
                                                    </div>

                                                    {/* Metric badge */}
                                                    <div className="absolute top-4 right-4 text-right">
                                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-0.5">
                                                            {metricLabel}
                                                        </p>
                                                        <p className={`text-base font-black leading-none ${
                                                            isTeal ? 'text-brand-teal' : 'text-brand-red'
                                                        }`}>
                                                            {metricValue}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Text block */}
                                                <div className="p-5 flex flex-col gap-3 rounded-b-xl">
                                                    <h3 className="text-xl font-black text-white leading-tight tracking-tight group-hover:text-white transition-colors">
                                                        {project.title}
                                                    </h3>

                                                    <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">
                                                        {project.description}
                                                    </p>

                                                    {/* Tags + CTA row */}
                                                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {tagNames.slice(0, 3).map((tag) => (
                                                                <span
                                                                    key={tag}
                                                                    className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[8px] font-black text-slate-400 uppercase tracking-wider"
                                                                >
                                                                    {tag}
                                                                </span>
                                                            ))}
                                                        </div>

                                                        <div
                                                            className={`flex-shrink-0 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider whitespace-nowrap transition-all duration-300 group-hover:scale-105 ${
                                                                isTeal
                                                                    ? 'bg-brand-teal text-white shadow-lg shadow-brand-teal/20'
                                                                    : 'bg-brand-red  text-white shadow-lg shadow-brand-red/20'
                                                            }`}
                                                        >
                                                            Case Study
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>
        </section>
    );
}