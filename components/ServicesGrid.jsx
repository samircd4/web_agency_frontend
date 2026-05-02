'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Database, Code2, Cpu, Globe, Shield, Zap } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

const services = [
    {
        title: "Industrial Scraping",
        description: "Large-scale extraction systems designed for distributed networks and high-concurrency throughput.",
        icon: <Database className="text-brand-teal" size={28} />,
        color: "brand-teal"
    },
    {
        title: "Proprietary Engines",
        description: "Custom-built e-commerce cores and algorithmic systems engineered for maximum velocity.",
        icon: <Cpu className="text-brand-red" size={28} />,
        color: "brand-red"
    },
    {
        title: "API Ecosystems",
        description: "Robust, secure, and scalable API architectures for seamless enterprise integration.",
        icon: <Code2 className="text-brand-teal" size={28} />,
        color: "brand-teal"
    },
    {
        title: "Cloud Automation",
        description: "Automated distributed workflows and cloud infrastructure management for mission-critical apps.",
        icon: <Zap className="text-brand-red" size={28} />,
        color: "brand-red"
    },
    {
        title: "Cyber Security",
        description: "Advanced security protocols and encrypted data pipelines for financial-grade applications.",
        icon: <Shield className="text-brand-teal" size={28} />,
        color: "brand-teal"
    },
    {
        title: "Global Scalability",
        description: "Optimizing legacy systems for modern cloud performance and international user bases.",
        icon: <Globe className="text-brand-red" size={28} />,
        color: "brand-red"
    }
];

export default function ServicesGrid() {
    return (
        <section id="services" className="py-24 bg-background relative">
            <div className="container mx-auto px-6">
                <div className="text-center mb-20">
                    <ScrollReveal>
                        <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
                            Mission Critical <span className="text-gradient-red">Services.</span>
                        </h2>
                    </ScrollReveal>
                    <ScrollReveal delay={0.2}>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                            We don&apos;t just provide services; we engineer the competitive advantages that drive your business forward.
                        </p>
                    </ScrollReveal>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <ScrollReveal key={index} delay={index * 0.1}>
                            <div className="p-8 rounded-[2.5rem] glass border border-white/5 h-full hover:border-brand-teal/30 transition-all group">
                                <div className={`w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                                    {service.icon}
                                </div>
                                <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">{service.title}</h3>
                                <p className="text-slate-400 leading-relaxed">{service.description}</p>
                            </div>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
