'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Terminal, ArrowLeft, Zap, Layers, ShieldCheck, 
  Globe, Calendar, Clock, DollarSign, Code2 
} from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api';
import ScrollReveal from '@/components/ScrollReveal';
import ShareModal from '@/components/ShareModal';

import ReactMarkdown from 'react-markdown';
import { Share2, Check } from 'lucide-react';

export default function PortfolioDetailPage() {
  const { id: slug } = useParams();
  const router = useRouter();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  useEffect(() => {
    async function loadProject() {
      try {
        const data = await api.getPortfolioItemDetail(slug);
        setProject(data);
      } catch (err) {
        console.error('Failed to load portfolio item:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    if (slug) {
      loadProject();
    }
  }, [slug]);

  const handleShare = () => {
    setIsShareOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-white">
        <div className="w-8 h-8 border-4 border-brand-teal/30 border-t-brand-teal rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-white">
        <div className="text-center">
          <h1 className="text-4xl font-black mb-4 tracking-tight">Project Not Found</h1>
          <Link href="/portfolio" className="text-brand-teal font-bold hover:underline uppercase tracking-widest text-xs">
            Return to Case Studies
          </Link>
        </div>
      </div>
    );
  }

  const isTeal = project.id?.endsWith('1') || project.id?.endsWith('3') || project.id?.endsWith('5');
  const tagNames = project.tags?.map(t => t.name) || project.technologies || ["Python", "Django"];
  const category = project.category ? project.category.replace('_', ' ').toUpperCase() : "CASE STUDY";
  const image = project.cover_image_url || project.image || "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80&fit=crop";

  const completionDate = project.created_at ? new Date(project.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : "Jan 2026";
  const clientName = project.client_name || "Confidential Client";
  const impactMetric = project.impact_metric || (isTeal ? "5.2M / day throughput" : "< 85ms latency");

  const infoItems = [
    { label: 'Client', value: clientName, icon: Globe },
    { label: 'Completion', value: completionDate, icon: Calendar },
    { label: 'Impact', value: impactMetric, icon: Zap }
  ];

  const challenge = project.challenge || project.description;
  const solution = project.solution || `We implemented an industrial-scale production deployment utilizing automated state reconciliation protocols to achieve maximum integrity under varying workloads.`;
  const stack = tagNames;

  return (
    <main className="pt-32 pb-24 bg-background min-h-screen">
      <div className="container mx-auto px-6">
        
        {/* Back Link & Share */}
        <div className="flex items-center justify-between mb-12">
          <Link href="/portfolio" className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-black uppercase tracking-widest">Back to Case Studies</span>
          </Link>

          <div className="relative">
            <button 
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-white hover:border-brand-teal/40 transition-all"
            >
              <Share2 size={14} className="text-brand-teal" />
              <span>{copiedToast ? 'Copied!' : 'Share Case Study'}</span>
            </button>

            {copiedToast && (
              <div className="absolute top-full right-0 mt-2 px-3 py-1.5 bg-brand-teal text-slate-950 font-black text-[9px] uppercase tracking-widest rounded-lg shadow-lg z-30 flex items-center gap-1.5">
                <Check size={12} />
                <span>Link copied to clipboard!</span>
              </div>
            )}
          </div>
        </div>

        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">
          <div>
            <ScrollReveal>
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${isTeal ? 'bg-brand-teal/10 border-brand-teal/20 text-brand-teal' : 'bg-brand-red/10 border-brand-red/20 text-brand-red'} text-[10px] font-black tracking-[0.2em] uppercase mb-6`}>
                <Terminal size={12} />
                <span>{category}</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter leading-tight">
                {project.title}
              </h1>
              <p className="text-slate-400 text-lg leading-relaxed mb-10 max-w-xl">
                {project.description}
              </p>
              
              {/* Project Info Bar */}
              <div className="flex flex-wrap gap-6 mb-12 p-6 rounded-3xl bg-white/[0.02] border border-white/5">
                {infoItems.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${isTeal ? 'bg-brand-teal/10 text-brand-teal' : 'bg-brand-red/10 text-brand-red'} flex items-center justify-center`}>
                      <item.icon size={18} />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-0.5">{item.label}</p>
                      <p className="text-xs font-bold text-white">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                {project.live_url && (
                  <a 
                    href={project.live_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-3 px-8 py-4 ${isTeal ? 'bg-brand-teal text-slate-950 shadow-glow-teal' : 'bg-brand-red text-white shadow-glow-red'} rounded-2xl font-black uppercase tracking-widest text-xs transition-all hover:-translate-y-1`}
                  >
                    Live Demo <Globe size={16} />
                  </a>
                )}

                {project.github_url && (
                  <a 
                    href={project.github_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-8 py-4 glass text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all hover:bg-white/10 hover:border-brand-teal/40 hover:-translate-y-1"
                  >
                    GitHub Source <Code2 size={16} className="text-brand-teal" />
                  </a>
                )}
                
                <Link 
                  href="/start-project" 
                  className="inline-flex items-center gap-3 px-8 py-4 glass text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all hover:bg-white/10 hover:-translate-y-1"
                >
                  Request Similar System <Zap size={16} className="text-brand-teal" />
                </Link>
              </div>
            </ScrollReveal>
          </div>

          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
            <img 
              src={image} 
              alt={project.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            
            {/* Metric Overlay */}
            <div className="absolute bottom-8 left-8 right-8 p-6 glass rounded-2xl border border-white/10 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Key Impact Metric</p>
                <p className={`text-2xl font-black ${isTeal ? 'text-brand-teal' : 'text-brand-red'}`}>{impactMetric}</p>
              </div>
              <div className={`p-3.5 rounded-2xl ${isTeal ? 'bg-brand-teal/10 text-brand-teal' : 'bg-brand-red/10 text-brand-red'}`}>
                <Zap size={22} fill="currentColor" />
              </div>
            </div>
          </div>
        </div>

        {/* Deep Dive Sections */}
        <div className="grid md:grid-cols-3 gap-8 mb-24">
          <ScrollReveal delay={0.1}>
            <div className="p-8 rounded-3xl glass border border-white/5 h-full">
              <div className="w-12 h-12 rounded-2xl bg-brand-red/10 flex items-center justify-center text-brand-red mb-6">
                <Zap size={24} fill="currentColor" />
              </div>
              <h3 className="text-xl font-black text-white mb-4 uppercase tracking-tight">The Challenge</h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                {challenge}
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="p-8 rounded-3xl glass border border-white/5 h-full">
              <div className="w-12 h-12 rounded-2xl bg-brand-teal/10 flex items-center justify-center text-brand-teal mb-6">
                <Layers size={24} />
              </div>
              <h3 className="text-xl font-black text-white mb-4 uppercase tracking-tight">The Solution</h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                {solution}
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <div className="p-8 rounded-3xl glass border border-white/5 h-full">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-brand-teal mb-6">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-xl font-black text-white mb-4 uppercase tracking-tight">Technical Stack</h3>
              <div className="flex flex-wrap gap-2">
                {stack.map((item, i) => (
                  <span key={i} className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-slate-300">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Project Overview / Markdown Content */}
        {project.content_markdown && (
          <ScrollReveal>
            <div className="mb-24">
              <h2 className="text-2xl font-black text-white mb-6 uppercase tracking-tight">Technical Case Briefing</h2>
              <div className="p-10 rounded-3xl glass border border-white/5 prose prose-invert max-w-none text-slate-300 leading-relaxed">
                <ReactMarkdown
                  components={{
                    h1: ({node, ...props}) => <h1 className="text-2xl font-black text-white mb-4 mt-8 first:mt-0 uppercase tracking-tight" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-xl font-black text-brand-teal mb-3 mt-6 uppercase tracking-tight" {...props} />,
                    p: ({node, ...props}) => <div className="text-slate-300 text-base leading-relaxed mb-4" {...props} />,
                    pre: ({node, children, ...props}) => <div className="my-6">{children}</div>,
                    code: ({node, inline, className, children, ...props}) => {
                      if (inline) {
                        return (
                          <code className="bg-brand-teal/10 text-brand-teal border border-brand-teal/20 px-2 py-0.5 rounded-md font-mono text-xs font-bold" {...props}>
                            {children}
                          </code>
                        );
                      }
                      const match = /language-(\w+)/.exec(className || '');
                      const language = match ? match[1] : 'code';
                      const codeString = String(children).replace(/\n$/, '');

                      return (
                        <div className="my-6 rounded-2xl overflow-hidden border border-white/10 bg-[#090d16] shadow-xl">
                          <div className="px-4 py-2.5 bg-slate-900/80 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                              <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                              <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                              <span className="ml-2 text-[9px] font-black uppercase tracking-widest text-brand-teal">
                                {language}
                              </span>
                            </div>
                          </div>
                          <pre className="p-5 overflow-x-auto font-mono text-xs text-slate-200 leading-relaxed">
                            <code>{codeString}</code>
                          </pre>
                        </div>
                      );
                    }
                  }}
                >
                  {project.content_markdown}
                </ReactMarkdown>
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* Call to Action */}
        <div className="text-center">
          <ScrollReveal>
            <h2 className="text-3xl font-black text-white mb-6">Ready to engineer your success?</h2>
            <Link href="/start-project" className="inline-flex items-center gap-3 px-10 py-5 bg-brand-teal text-slate-950 rounded-2xl font-black uppercase tracking-widest text-xs shadow-glow-teal hover:scale-105 transition-all">
              Start Your Project <ArrowLeft size={18} className="rotate-180" />
            </Link>
          </ScrollReveal>
        </div>

      </div>

      {/* Professional Share Modal System */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        title={project?.title}
        description={project?.description}
        category={category}
        image={image}
      />
    </main>
  );
}
