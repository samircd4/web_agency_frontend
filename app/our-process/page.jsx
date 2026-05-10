'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Search, Cpu, Rocket, CheckCircle2, ArrowRight, MessageSquare, Code2, MonitorCheck } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';

const processSteps = [
  {
    number: "01",
    title: "Discovery & Analysis",
    description: "We deep dive into your business logic, data structures, and pain points to design a roadmap for success.",
    icon: <Search className="text-brand-teal" size={32} />,
    color: "brand-teal",
    details: ["Requirement Gathering", "Feasibility Study", "Architecture Design"]
  },
  {
    number: "02",
    title: "Engineering & Development",
    description: "Our engineers build the proprietary engine, focusing on modularity, scalability, and extreme performance.",
    icon: <Code2 className="text-brand-red" size={32} />,
    color: "brand-red",
    details: ["Core Engine Build", "Frontend Integration", "Unit Testing"]
  },
  {
    number: "03",
    title: "Validation & QA",
    description: "Rigorous testing across distributed environments ensures 99.9% reliability and sub-100ms latency.",
    icon: <MonitorCheck className="text-brand-indigo" size={32} />,
    color: "brand-indigo",
    details: ["Load Testing", "Security Audits", "E2E Validation"]
  },
  {
    number: "04",
    title: "Scale & Support",
    description: "Deployment to production with real-time monitoring and elastic scaling support for your growth.",
    icon: <Rocket className="text-brand-teal" size={32} />,
    color: "brand-teal",
    details: ["Cloud Deployment", "24/7 Monitoring", "Continuous Optimization"]
  }
];

export default function OurProcessPage() {
  return (
    <main className="pt-32 pb-24 bg-background min-h-screen">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-24">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-teal/10 border border-brand-teal/20 text-brand-teal text-[10px] font-black tracking-[0.2em] uppercase mb-6">
              <CheckCircle2 size={12} />
              <span>Proven Methodology</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-[0.9]">
              Our <span className="text-gradient-teal">Process.</span>
            </h1>
            <p className="text-slate-400 text-xl max-w-2xl mx-auto leading-relaxed">
              From raw data to industrial-scale solutions. We follow a strict engineering workflow to ensure excellence.
            </p>
          </ScrollReveal>
        </div>

        {/* Vertical Process Timeline */}
        <div className="max-w-4xl mx-auto relative">
          {/* Vertical Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/5 -translate-x-1/2 hidden md:block" />

          {processSteps.map((step, index) => (
            <div key={index} className="relative mb-24 last:mb-0">
              <ScrollReveal>
                <div className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12`}>
                  {/* Content */}
                  <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full glass border border-white/10 text-white font-black text-xl mb-6`}>
                      {step.number}
                    </div>
                    <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">{step.title}</h2>
                    <p className="text-slate-400 leading-relaxed mb-6">
                      {step.description}
                    </p>
                    <div className={`flex flex-wrap gap-2 ${index % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                      {step.details.map((detail, i) => (
                        <span key={i} className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border border-white/5 px-3 py-1 rounded-lg">
                          {detail}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Icon Node */}
                  <div className="relative z-10">
                    <div className={`w-24 h-24 rounded-3xl glass border border-white/10 flex items-center justify-center bg-surface-900 shadow-2xl transition-transform group hover:scale-110 duration-500`}>
                      <div className={`absolute inset-0 bg-${step.color}/10 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity`} />
                      {step.icon}
                    </div>
                  </div>

                  {/* Spacer for reverse layout */}
                  <div className="hidden md:block w-1/2" />
                </div>
              </ScrollReveal>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-32 text-center">
          <ScrollReveal>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-8">Ready to start the discovery?</h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <a href="/contact" className="px-10 py-5 bg-brand-teal text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-glow-teal hover:-translate-y-1 transition-all">
                Book a Session
              </a>
              <a href="/services" className="px-10 py-5 glass text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-white/10 transition-all flex items-center gap-2">
                Browse Services <ArrowRight size={18} />
              </a>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </main>
  );
}
