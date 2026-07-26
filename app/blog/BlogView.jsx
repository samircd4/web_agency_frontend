'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Calendar, User, ArrowRight, Search, Clock, Eye, Heart, MessageSquare, Tag, Sparkles, Terminal } from 'lucide-react';
import { api } from '@/lib/api';
import ScrollReveal from '@/components/ScrollReveal';

export default function BlogView() {
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');

  // Load all posts initially to aggregate tags & counts
  useEffect(() => {
    async function loadAllPosts() {
      setLoading(true);
      try {
        const data = await api.getBlogPosts();
        const results = data.results || data;
        setAllPosts(results);
      } catch (err) {
        console.error('Failed to load blog posts:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAllPosts();
  }, []);

  // Compute dynamic tag counts across all posts
  const dynamicTagCounts = useMemo(() => {
    const counts = { All: allPosts.length };
    allPosts.forEach(post => {
      post.tags?.forEach(t => {
        const tagName = typeof t === 'string' ? t : t?.name;
        if (tagName) {
          counts[tagName] = (counts[tagName] || 0) + 1;
        }
      });
    });
    return counts;
  }, [allPosts]);

  // Available tag list with 'All' first
  const tagList = useMemo(() => {
    const keys = Object.keys(dynamicTagCounts).filter(k => k !== 'All');
    return ['All', ...keys];
  }, [dynamicTagCounts]);

  // Filter posts based on search query and selected tag
  const filteredPosts = useMemo(() => {
    return allPosts.filter(post => {
      // 1. Tag match
      const tagMatch = selectedTag === 'All' || post.tags?.some(t => {
        const tagName = typeof t === 'string' ? t : t?.name;
        return tagName && tagName.toLowerCase() === selectedTag.toLowerCase();
      });

      // 2. Search query match
      const queryLower = searchQuery.toLowerCase().trim();
      const searchMatch = !queryLower || (
        post.title?.toLowerCase().includes(queryLower) ||
        post.content_markdown?.toLowerCase().includes(queryLower)
      );

      return tagMatch && searchMatch;
    });
  }, [allPosts, selectedTag, searchQuery]);

  // Separate featured post (first item) and grid posts
  const featuredPost = filteredPosts[0];
  const gridPosts = filteredPosts.slice(1);

  // Schema.org Blog JSON-LD Data for SEO
  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Dr. Python Engineering Journal",
    "description": "Insights, technical briefings, and architecture breakdowns on web scraping, AI automation, and high-velocity backend engineering.",
    "publisher": {
      "@type": "Organization",
      "name": "Dr. Python Solutions",
      "logo": {
        "@type": "ImageObject",
        "url": "https://drpythonsolutions.com/logo/logo.png"
      }
    },
    "blogPost": allPosts.map(post => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "datePublished": post.published_at || post.created_at,
      "author": {
        "@type": "Person",
        "name": post.author_username || "Dr. Python"
      },
      "url": `https://drpythonsolutions.com/blog/${post.slug || post.id}`
    }))
  };

  return (
    <main className="pt-32 pb-24 bg-background min-h-screen">
      {/* Inject SEO JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />

      <div className="container mx-auto px-4">
        
        {/* Header & Tag Explorer */}
        <header className="max-w-4xl mb-12">
          <ScrollReveal>
            <span className="text-xs font-black uppercase tracking-[0.4em] text-brand-teal mb-4 block flex items-center gap-2">
              <Terminal size={14} /> Engineering Journal
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter leading-[0.9]">
              Insights from the <br/>
              <span className="text-gradient-teal">Deep Code.</span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed max-w-2xl mb-8">
              Exploring the frontiers of high-concurrency web scraping, AI automation, and high-velocity Python backend engineering.
            </p>

            {/* Search Input & Tag Explorer Pills */}
            <div className="space-y-4">
              <div className="relative max-w-md">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search technical briefings & code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-surface-900/60 border border-white/10 rounded-2xl text-xs font-bold text-white focus:outline-none focus:border-brand-teal transition-all shadow-inner"
                />
              </div>

              {/* Tag Cloud with Counts */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 mr-2 flex items-center gap-1">
                  <Tag size={12} className="text-brand-teal" /> Filter by Topic:
                </span>
                {tagList.map(tag => {
                  const count = dynamicTagCounts[tag] || 0;
                  const isSelected = selectedTag.toLowerCase() === tag.toLowerCase();

                  return (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(tag)}
                      className={`px-3.5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-brand-teal border-brand-teal text-slate-950 shadow-glow-teal scale-105'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:border-brand-teal/40'
                      }`}
                    >
                      <span>{tag}</span>
                      <span className={`px-1.5 py-0.2 rounded-md text-[9px] ${
                        isSelected ? 'bg-slate-950/20 text-slate-950' : 'bg-white/10 text-slate-300'
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </ScrollReveal>
        </header>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-4 border-brand-teal/30 border-t-brand-teal rounded-full animate-spin" />
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-24 text-slate-500 uppercase font-black text-sm tracking-widest bg-surface-900/20 rounded-3xl border border-dashed border-white/5 p-8">
            No technical briefings found matching &quot;{searchQuery || selectedTag}&quot;.
          </div>
        ) : (
          <div className="space-y-12">
            
            {/* Featured Post Spotlight Banner */}
            {featuredPost && (
              <ScrollReveal>
                <article className="relative rounded-3xl overflow-hidden glass border border-white/10 hover:border-brand-teal/40 transition-all shadow-2xl group">
                  <Link href={`/blog/${featuredPost.slug || featuredPost.id}`}>
                    <div className="grid lg:grid-cols-12 gap-8 items-center p-8 md:p-12">
                      <div className="lg:col-span-7 space-y-6">
                        <div className="flex items-center gap-3">
                          <span className="px-3.5 py-1 rounded-full bg-brand-teal/20 border border-brand-teal/30 text-brand-teal text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                            <Sparkles size={12} /> Featured Spotlight
                          </span>
                          <span className="px-3 py-1 rounded-full bg-slate-950/60 border border-white/10 text-slate-300 text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5">
                            <Clock size={10} className="text-brand-teal" />
                            {featuredPost.read_time_minutes || 4} min read
                          </span>
                        </div>

                        <h2 className="text-3xl md:text-5xl font-black text-white group-hover:text-brand-teal transition-colors tracking-tight leading-tight">
                          {featuredPost.title}
                        </h2>

                        <p className="text-slate-300 text-base leading-relaxed line-clamp-3">
                          {featuredPost.content_markdown?.split('\n').find(l => l.trim() && !l.startsWith('#')) || featuredPost.title}
                        </p>

                        <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-400">
                          <span className="flex items-center gap-1.5 text-white">
                            <User size={12} className="text-brand-teal" />
                            {featuredPost.author_username || 'Dr. Python'}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Calendar size={12} className="text-brand-teal" />
                            {featuredPost.published_at ? new Date(featuredPost.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Eye size={12} className="text-brand-teal" />
                            {featuredPost.views_count || 0} views
                          </span>
                          <span className="flex items-center gap-1.5 text-brand-teal group-hover:translate-x-2 transition-transform ml-auto">
                            Read Full Briefing <ArrowRight size={14} />
                          </span>
                        </div>
                      </div>

                      <div className="lg:col-span-5 relative aspect-[16/10] rounded-2xl overflow-hidden border border-white/10">
                        <img
                          src={featuredPost.featured_image || featuredPost.cover_image_url || 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80&fit=crop'}
                          alt={featuredPost.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
                      </div>
                    </div>
                  </Link>
                </article>
              </ScrollReveal>
            )}

            {/* Remaining Grid Posts */}
            {gridPosts.length > 0 && (
              <div className="grid md:grid-cols-2 gap-8">
                {gridPosts.map((post, i) => {
                  const formattedDate = post.published_at 
                    ? new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    : 'Recent';
                  const category = post.tags?.[0]?.name || 'Engineering';
                  const excerpt = post.content_markdown 
                    ? post.content_markdown.split('\n').find(l => l.trim() && !l.startsWith('#'))?.slice(0, 140) + '...'
                    : 'Exploring technical architectural depths.';
                  const image = post.featured_image || post.cover_image_url || 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80&fit=crop';
                  const readTime = post.read_time_minutes || 4;
                  const targetUrl = post.slug || post.id;

                  return (
                    <ScrollReveal key={post.id} delay={i * 0.1}>
                      <article className="h-full">
                        <Link href={`/blog/${targetUrl}`} className="group block h-full">
                          <div className="relative h-full glass border-white/5 rounded-3xl overflow-hidden hover:border-brand-teal/30 transition-all flex flex-col shadow-xl">
                            {/* Image */}
                            <div className="relative aspect-video overflow-hidden">
                              <img 
                                src={image} 
                                alt={post.title} 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                              
                              {/* Category Tag */}
                              <div className="absolute top-6 left-6 px-4 py-1.5 rounded-full bg-brand-teal/20 backdrop-blur-md border border-brand-teal/20 text-brand-teal text-[10px] font-black uppercase tracking-widest">
                                {category}
                              </div>

                              {/* Read Time Tag */}
                              <div className="absolute top-6 right-6 px-3 py-1 rounded-full bg-slate-950/60 backdrop-blur-md border border-white/10 text-slate-300 text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5">
                                <Clock size={10} className="text-brand-teal" />
                                <span>{readTime} min read</span>
                              </div>
                            </div>

                            {/* Content */}
                            <div className="p-8 flex flex-col flex-grow">
                              <div className="flex items-center gap-6 mb-4">
                                <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                  <Calendar size={12} className="text-brand-teal" />
                                  <time dateTime={post.published_at || post.created_at}>{formattedDate}</time>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                  <User size={12} className="text-brand-teal" />
                                  <span>{post.author_username || 'Dr. Python'}</span>
                                </div>
                              </div>

                              <h2 className="text-2xl font-black text-white mb-4 group-hover:text-brand-teal transition-colors leading-tight tracking-tight">
                                {post.title}
                              </h2>

                              <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-grow">
                                {excerpt}
                              </p>

                              <div className="flex items-center justify-between pt-4 border-t border-white/5 text-white font-black uppercase tracking-widest text-[10px]">
                                <div className="flex items-center gap-4 text-slate-400">
                                  <span className="flex items-center gap-1.5" title="Views">
                                    <Eye size={12} className="text-brand-teal" />
                                    {post.views_count || 0}
                                  </span>
                                  <span className="flex items-center gap-1.5" title="Likes">
                                    <Heart size={12} className="text-rose-400" />
                                    {post.likes_count || 0}
                                  </span>
                                  <span className="flex items-center gap-1.5" title="Comments">
                                    <MessageSquare size={12} className="text-sky-400" />
                                    {post.comments_count || 0}
                                  </span>
                                </div>

                                <span className="flex items-center gap-2 group-hover:gap-4 transition-all">
                                  Read Briefing <ArrowRight size={14} className="text-brand-teal" />
                                </span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </article>
                    </ScrollReveal>
                  );
                })}
              </div>
            )}

          </div>
        )}

      </div>
    </main>
  );
}
