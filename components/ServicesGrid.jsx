'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Database, Code2, Cpu, Globe, Shield, Zap } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

const services = [
    {
        title: "Industrial Web Scraping",
        description: "High-volume data extraction networks with automated proxy rotation, CAPTCHA bypass, and TLS fingerprint evasion with zero IP bans.",
        icon: <Database className="text-brand-teal" size={28} />,
        color: "brand-teal"
    },
    {
        title: "Custom Shopify & Commerce",
        description: "Tailored Shopify Liquid themes, private custom apps, headless Next.js storefronts, and multi-channel inventory sync engines.",
        icon: <Cpu className="text-brand-red" size={28} />,
        color: "brand-red"
    },
    {
        title: "High-Concurrency Python APIs",
        description: "Asynchronous, type-safe FastAPI and Django architectures engineered for heavy database loads, high throughput, and third-party integrations.",
        icon: <Code2 className="text-brand-teal" size={28} />,
        color: "brand-teal"
    },
    {
        title: "Full-Stack Web Applications",
        description: "Modern, performant web platforms built with Next.js, React, and TypeScript paired with clean, accessible design systems.",
        icon: <Globe className="text-brand-red" size={28} />,
        color: "brand-red"
    },
    {
        title: "AI & Workflow Automation",
        description: "Intelligent document processing, custom LLM integrations, automated job aggregation portals, and background worker queues.",
        icon: <Zap className="text-brand-teal" size={28} />,
        color: "brand-teal"
    },
    {
        title: "Cloud Infrastructure & DevOps",
        description: "Production Docker containerization, automated CI/CD deployment pipelines, serverless scaling, and 99.9% uptime SLA management.",
        icon: <Shield className="text-brand-red" size={28} />,
        color: "brand-red"
    }
];

export default function ServicesGrid() {
    return (
        <section id="services" className="py-8 bg-background relative overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="text-center mb-10">
                    <ScrollReveal>
                        <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight">
                            Mission Critical <span className="text-gradient-red">Services.</span>
                        </h2>
                    </ScrollReveal>
                    <ScrollReveal delay={0.2}>
                        <p className="text-slate-400 text-base max-w-2xl mx-auto">
                            We don&apos;t just provide services; we engineer the competitive advantages that drive your business forward.
                        </p>
                    </ScrollReveal>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {services.map((service, index) => (
                        <ScrollReveal key={index} delay={index * 0.1}>
                            <div className="p-6 rounded-xl glass border border-white/5 h-full hover:border-brand-teal/30 transition-all group">
                                <div className={`w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500`}>
                                    {service.icon}
                                </div>
                                <h3 className="text-xl font-black text-white mb-3 uppercase tracking-tight">{service.title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">{service.description}</p>
                            </div>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
