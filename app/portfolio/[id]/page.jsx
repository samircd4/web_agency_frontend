'use client';

import React from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ExternalLink, Terminal, CheckCircle2, ArrowLeft, Zap, Layers, ShieldCheck, Code2, Globe, Calendar, Clock, DollarSign } from 'lucide-react';
import Link from 'next/link';
import { projects } from '@/data/portfolio';
import ScrollReveal from '@/components/ScrollReveal';

export default function PortfolioDetailPage() {
  const { id } = useParams();
  const project = projects.find(p => p.id === id) || projects[0];

  const infoItems = [
    { label: 'Completion', value: project.completionDate, icon: Calendar },
    { label: 'Duration', value: project.duration, icon: Clock },
    { label: 'Budget Range', value: project.budget, icon: DollarSign }
  ];

  return (
    <main className="pt-32 pb-24 bg-background min-h-screen">
      <div className="container mx-auto px-6">
        
        {/* Back Link */}
        <Link href="/#portfolio" className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-12 group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-black uppercase tracking-widest">Back to Portfolio</span>
        </Link>

        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">
          <div>
            <ScrollReveal>
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${project.isTeal ? 'bg-brand-teal/10 border-brand-teal/20 text-brand-teal' : 'bg-brand-red/10 border-brand-red/20 text-brand-red'} text-[10px] font-black tracking-[0.2em] uppercase mb-6`}>
                <Terminal size={12} />
                <span>{project.category}</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-[0.9]">
                {project.title.split(' ').slice(0, -1).join(' ')} <br />
                <span className={project.isTeal ? 'text-gradient-teal' : 'text-gradient-red'}>
                  {project.title.split(' ').pop()}.
                </span>
              </h1>
              <p className="text-slate-400 text-xl leading-relaxed mb-10 max-w-xl">
                {project.fullDescription}
              </p>
              
              {/* Project Info Bar */}
              <div className="flex flex-wrap gap-8 mb-12 p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5">
                {infoItems.map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl ${project.isTeal ? 'bg-brand-teal/10 text-brand-teal' : 'bg-brand-red/10 text-brand-red'} flex items-center justify-center`}>
                      <item.icon size={18} />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-0.5">{item.label}</p>
                      <p className="text-sm font-bold text-white">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <a 
                  href={project.liveUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-3 px-8 py-4 ${project.isTeal ? 'bg-brand-teal shadow-glow-teal' : 'bg-brand-red shadow-glow-red'} text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all hover:-translate-y-1`}
                >
                  Live Demo <Globe size={16} />
                </a>
                
                <a 
                  href={project.sourceCodeUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-8 py-4 glass text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all hover:bg-white/10 hover:-translate-y-1"
                >
                  Source Code <Code2 size={16} />
                </a>
              </div>
            </ScrollReveal>
          </div>

          <div className="relative aspect-[4/3] rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl">
            <img 
              src={project.image} 
              alt={project.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            
            {/* Metric Overlay */}
            <div className="absolute bottom-8 left-8 right-8 p-8 glass rounded-[2rem] border border-white/10 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{project.metrics.label}</p>
                <p className={`text-3xl font-black ${project.isTeal ? 'text-brand-teal' : 'text-brand-red'}`}>{project.metrics.value}</p>
              </div>
              <div className={`p-4 rounded-2xl ${project.isTeal ? 'bg-brand-teal/10 text-brand-teal' : 'bg-brand-red/10 text-brand-red'}`}>
                <Zap size={24} fill="currentColor" />
              </div>
            </div>
          </div>
        </div>

        {/* Deep Dive Sections */}
        <div className="grid md:grid-cols-3 gap-8 mb-24">
          <ScrollReveal delay={0.1}>
            <div className="p-10 rounded-[3rem] glass border border-white/5 h-full">
              <div className="w-12 h-12 rounded-2xl bg-brand-red/10 flex items-center justify-center text-brand-red mb-6">
                <Zap size={24} fill="currentColor" />
              </div>
              <h3 className="text-xl font-black text-white mb-4 uppercase tracking-tight">The Challenge</h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                {project.challenge}
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="p-10 rounded-[3rem] glass border border-white/5 h-full">
              <div className="w-12 h-12 rounded-2xl bg-brand-teal/10 flex items-center justify-center text-brand-teal mb-6">
                <Layers size={24} />
              </div>
              <h3 className="text-xl font-black text-white mb-4 uppercase tracking-tight">The Solution</h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                {project.solution}
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <div className="p-10 rounded-[3rem] glass border border-white/5 h-full">
              <div className="w-12 h-12 rounded-2xl bg-brand-indigo/10 flex items-center justify-center text-brand-indigo mb-6">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-xl font-black text-white mb-4 uppercase tracking-tight">Technical Stack</h3>
              <ul className="space-y-3">
                {project.stack.map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-400 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-indigo" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
        </div>

        {/* Project Overview */}
        <ScrollReveal>
          <div className="mb-24">
            <h2 className="text-3xl font-black text-white mb-8 uppercase tracking-tighter">Project Overview</h2>
            <div className="p-12 rounded-[4rem] glass border border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent">
              <p className="text-slate-300 text-lg leading-relaxed font-medium">
                {project.detailedDescription || project.fullDescription}
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* Call to Action */}
        <div className="text-center">
          <ScrollReveal>
            <h2 className="text-3xl font-black text-white mb-8">Ready to engineer your success?</h2>
            <Link href="/contact" className="inline-flex items-center gap-3 px-10 py-5 glass text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-white/10 transition-all">
              Start Your Project <ArrowLeft size={18} className="rotate-180" />
            </Link>
          </ScrollReveal>
        </div>

      </div>
    </main>
  );
}
