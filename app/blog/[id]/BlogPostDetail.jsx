'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowLeft, Share2, Bookmark } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { posts } from '@/data/blog';
import ScrollReveal from '@/components/ScrollReveal';

export default function BlogPostDetail() {
  const { id } = useParams();
  const router = useRouter();
  const post = posts.find(p => p.id === id);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-white">
        <div className="text-center">
          <h1 className="text-4xl font-black mb-4 tracking-tight">Mission Not Found</h1>
          <button onClick={() => router.push('/blog')} className="text-brand-teal font-bold hover:underline uppercase tracking-widest text-xs">
            Return to Journal
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="pt-32 pb-24 bg-background min-h-screen">
      <div className="container mx-auto px-6">
        
        {/* Navigation & Actions */}
        <div className="max-w-4xl mx-auto mb-12 flex items-center justify-between">
          <button 
            onClick={() => router.push('/blog')}
            className="flex items-center gap-3 text-slate-500 hover:text-white transition-colors font-black uppercase tracking-widest text-[10px]"
          >
            <ArrowLeft size={16} /> Back to Journal
          </button>
          <div className="flex gap-4">
            <button className="p-3 rounded-full bg-white/5 text-slate-400 hover:text-white transition-all border border-white/5">
              <Share2 size={18} />
            </button>
            <button className="p-3 rounded-full bg-white/5 text-slate-400 hover:text-white transition-all border border-white/5">
              <Bookmark size={18} />
            </button>
          </div>
        </div>

        {/* Hero Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <ScrollReveal>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-teal mb-6 block">
              {post.category}
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-10 tracking-tighter leading-[0.9]">
              {post.title}
            </h1>
            
            <div className="flex items-center gap-8 py-8 border-y border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-teal to-brand-blue flex items-center justify-center font-bold text-white text-sm">
                  DP
                </div>
                <div>
                  <div className="text-white font-bold text-sm">Dr. Python</div>
                  <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Lead Engineer</div>
                </div>
              </div>
              <div className="h-10 w-px bg-white/10" />
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                <Calendar size={14} className="text-brand-teal" />
                <span>{post.date}</span>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Cover Image */}
        <div className="max-w-5xl mx-auto mb-16 px-0 md:px-12">
          <div className="relative aspect-[21/9] rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl">
            <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
          </div>
        </div>

        {/* Article Content */}
        <div className="max-w-3xl mx-auto">
          <div className="prose prose-invert prose-brand max-w-none">
            <ReactMarkdown
              components={{
                h1: ({node, ...props}) => <h1 className="text-4xl font-black text-white mb-8 mt-16 first:mt-0 uppercase tracking-tight" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-3xl font-black text-white mb-6 mt-12 uppercase tracking-tight" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-xl font-bold text-brand-teal mb-4 mt-8" {...props} />,
                p: ({node, ...props}) => <p className="text-slate-400 text-lg leading-relaxed mb-8" {...props} />,
                ul: ({node, ...props}) => <ul className="space-y-4 mb-10 list-none pl-0" {...props} />,
                li: ({node, ...props}) => (
                  <li className="flex items-start gap-4 text-slate-300 text-lg" {...props}>
                    <div className="w-2 h-2 rounded-full bg-brand-teal mt-3 flex-shrink-0 shadow-[0_0_10px_rgba(45,212,191,0.5)]" />
                    <span>{props.children}</span>
                  </li>
                ),
                code: ({node, inline, ...props}) => (
                  inline 
                    ? <code className="bg-white/10 px-1.5 py-0.5 rounded text-brand-teal font-mono text-sm" {...props} />
                    : <code className="block bg-surface-900 p-8 rounded-3xl border border-white/5 text-slate-300 font-mono text-sm leading-relaxed overflow-x-auto my-8" {...props} />
                ),
                hr: ({node, ...props}) => <hr className="border-white/5 my-16" {...props} />,
                strong: ({node, ...props}) => <strong className="text-white font-black" {...props} />,
                blockquote: ({node, ...props}) => (
                  <blockquote className="border-l-4 border-brand-teal pl-8 py-2 my-10 italic text-xl text-slate-300 bg-white/[0.02] rounded-r-3xl" {...props} />
                )
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>

          {/* Footer CTA */}
          <div className="mt-24 p-12 rounded-[3rem] glass border border-white/5 text-center">
            <h3 className="text-2xl font-black text-white mb-4 tracking-tight uppercase">Have a technical challenge?</h3>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">
              Our engineering team specializes in solving high-stakes automation and data problems.
            </p>
            <button 
              onClick={() => router.push('/contact')}
              className="px-10 py-5 bg-brand-teal text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:-translate-y-1 transition-all shadow-glow-teal"
            >
              Start Mission Briefing
            </button>
          </div>
        </div>

      </div>
    </main>
  );
}
