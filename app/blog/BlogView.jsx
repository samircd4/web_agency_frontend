'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight, Terminal } from 'lucide-react';
import { posts } from '@/data/blog';
import ScrollReveal from '@/components/ScrollReveal';

export default function BlogView() {
  return (
    <main className="pt-32 pb-24 bg-background min-h-screen">
      <div className="container mx-auto px-6">
        
        {/* Header */}
        <div className="max-w-4xl mb-16">
          <ScrollReveal>
            <span className="text-xs font-black uppercase tracking-[0.4em] text-brand-teal mb-6 block">Engineering Journal</span>
            <h1 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-[0.9]">
              Insights from the <br/>
              <span className="text-gradient-teal">Deep Code.</span>
            </h1>
            <p className="text-slate-400 text-xl leading-relaxed max-w-2xl">
              Exploring the frontiers of web scraping, AI automation, and high-velocity backend engineering.
            </p>
          </ScrollReveal>
        </div>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {posts.map((post, i) => (
            <ScrollReveal key={post.id} delay={i * 0.1}>
              <Link href={`/blog/${post.id}`} className="group block h-full">
                <div className="relative h-full glass border-white/5 rounded-[3rem] overflow-hidden hover:border-brand-teal/30 transition-all flex flex-col">
                  {/* Image */}
                  <div className="relative aspect-video overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                    
                    {/* Category Tag */}
                    <div className="absolute top-6 left-6 px-4 py-1.5 rounded-full bg-brand-teal/20 backdrop-blur-md border border-brand-teal/20 text-brand-teal text-[10px] font-black uppercase tracking-widest">
                      {post.category}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-10 flex flex-col flex-grow">
                    <div className="flex items-center gap-6 mb-6">
                      <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        <Calendar size={12} className="text-brand-teal" />
                        <span>{post.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        <User size={12} className="text-brand-teal" />
                        <span>{post.author}</span>
                      </div>
                    </div>

                    <h2 className="text-3xl font-black text-white mb-6 group-hover:text-brand-teal transition-colors leading-tight tracking-tight">
                      {post.title}
                    </h2>

                    <p className="text-slate-400 text-sm leading-relaxed mb-8 flex-grow">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center gap-3 text-white font-black uppercase tracking-widest text-[10px] group-hover:gap-5 transition-all">
                      Read Technical Briefing <ArrowRight size={14} className="text-brand-teal" />
                    </div>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>

      </div>
    </main>
  );
}
