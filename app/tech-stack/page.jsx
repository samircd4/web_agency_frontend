'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, Cpu, Database, Globe, Shield, Zap, Box, Layers, Code2 } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';

const techStack = [
  {
    category: "Backend Engine",
    icon: <Database className="text-brand-red" size={32} />,
    title: "Python & Distributed Systems",
    description: "High-concurrency data engines built for extreme throughput and stability.",
    techs: ["Python", "Django", "FastAPI", "Celery", "Redis"]
  },
  {
    category: "Frontend UI/UX",
    icon: <Globe className="text-brand-teal" size={32} />,
    title: "Next.js & Modern React",
    description: "Ultra-fast, SEO-optimized interfaces that provide a premium user experience.",
    techs: ["Next.js", "React", "Tailwind CSS", "Framer Motion", "TypeScript"]
  },
  {
    category: "Infrastructure",
    icon: <Cpu className="text-brand-indigo" size={32} />,
    title: "Cloud & Automation",
    description: "Automated, elastic infrastructure that scales with your growth.",
    techs: ["AWS", "Docker", "Kubernetes", "Terraform", "CI/CD"]
  },
  {
    category: "Security & Trust",
    icon: <Shield className="text-brand-red" size={32} />,
    title: "Cyber Security",
    description: "Military-grade encryption and secure data pipelines for financial apps.",
    techs: ["E2E Encryption", "OAuth2", "SSL/TLS", "Compliance Auditing"]
  }
];

export default function TechStackPage() {
  return (
    <main className="pt-32 pb-24 bg-background min-h-screen">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-24">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-red/10 border border-brand-red/20 text-brand-red text-[10px] font-black tracking-[0.2em] uppercase mb-6">
              <Layers size={12} fill="currentColor" />
              <span>Industrial Grade</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-[0.9]">
              Our <span className="text-gradient-red">Stack.</span>
            </h1>
            <p className="text-slate-400 text-xl max-w-2xl mx-auto leading-relaxed">
              We architect high-performance systems using only the most reliable, battle-tested technologies.
            </p>
          </ScrollReveal>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {techStack.map((stack, index) => (
            <ScrollReveal key={index} delay={index * 0.1} className="h-full">
              <div className="p-10 rounded-[3rem] glass border border-white/5 hover:border-brand-red/30 transition-all group h-full flex flex-col">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-4 rounded-2xl bg-white/5 group-hover:scale-110 transition-transform duration-500">
                    {stack.icon}
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{stack.category}</p>
                    <h2 className="text-2xl font-black text-white">{stack.title}</h2>
                  </div>
                </div>
                <p className="text-slate-400 mb-8 leading-relaxed">
                  {stack.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {stack.techs.map((tech, i) => (
                    <span key={i} className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-xs font-bold text-white/70">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-24 text-center">
          <ScrollReveal>
            <div className="p-12 rounded-[4rem] glass border border-white/10 bg-gradient-to-br from-brand-red/10 to-transparent">
              <h2 className="text-3xl md:text-4xl font-black text-white mb-6">Need a custom technical assessment?</h2>
              <p className="text-slate-400 mb-8 max-w-xl mx-auto">Our architects are ready to evaluate your existing stack or design a new one from the ground up.</p>
              <a href="/contact" className="inline-flex items-center gap-3 px-10 py-5 bg-brand-red text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-2xl hover:shadow-brand-red/20 transition-all">
                Let&apos;s Architect <Zap size={18} fill="currentColor" />
              </a>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </main>
  );
}
