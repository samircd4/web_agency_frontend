'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Plus, BookOpen, Trash2, Calendar, Tag, User, X, Upload, Loader2, ChevronDown, Eye } from 'lucide-react';
import { api } from '@/lib/api';

// ── Image Upload Field ──────────────────────────────────────────────────────
function ImageUploadField({ label, value, onChange, disabled }) {
    const fileRef = useRef();
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(value || '');

    useEffect(() => { setPreview(value || ''); }, [value]);

    const handleFile = async (file) => {
        if (!file) return;
        setUploading(true);
        try {
            const result = api.uploadServiceImage ? await api.uploadServiceImage(file) : null;
            const url = result?.url || result?.file_url || result?.image_url || URL.createObjectURL(file);
            onChange(url);
            setPreview(url);
        } catch {
            const localUrl = URL.createObjectURL(file);
            setPreview(localUrl);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</label>
            <div className="flex gap-2">
                <input
                    type="text"
                    value={value || ''}
                    onChange={e => { onChange(e.target.value); setPreview(e.target.value); }}
                    placeholder="https://... or upload image"
                    disabled={disabled || uploading}
                    className="flex-1 p-3 bg-slate-900 border border-white/10 rounded-xl text-white text-sm focus:border-purple-500 outline-none placeholder:text-slate-600"
                />
                <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={disabled || uploading}
                    className="px-4 py-2.5 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-300 text-xs font-black uppercase tracking-widest hover:bg-purple-600/30 transition-all flex items-center gap-1.5 whitespace-nowrap disabled:opacity-50 cursor-pointer"
                >
                    {uploading ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
                    {uploading ? 'Uploading...' : 'Upload'}
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => handleFile(e.target.files?.[0])} />
            </div>
            {preview && (
                <div className="relative w-full max-w-md aspect-video rounded-xl overflow-hidden border border-white/10 bg-slate-900 mt-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" onError={() => setPreview('')} />
                    <button
                        type="button"
                        onClick={() => { onChange(''); setPreview(''); }}
                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-red-500 transition-colors"
                    >
                        <X size={12} />
                    </button>
                </div>
            )}
        </div>
    );
}

// ── Bullet List Editor ───────────────────────────────────────────────────────
function BulletEditor({ label, hint, items = [], onChange, disabled, placeholder = 'Add item...' }) {
    const [draft, setDraft] = useState('');

    const add = () => {
        const val = draft.trim();
        if (!val) return;
        onChange([...items, val]);
        setDraft('');
    };

    const remove = (idx) => onChange(items.filter((_, i) => i !== idx));

    return (
        <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</label>
            {hint && <p className="text-[10px] text-slate-500">{hint}</p>}
            {items.length > 0 && (
                <ul className="space-y-1.5">
                    {items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white">
                            <span className="text-purple-400 mt-0.5">•</span>
                            <span className="flex-1">{item}</span>
                            <button type="button" onClick={() => remove(idx)} disabled={disabled} className="text-slate-500 hover:text-red-400 transition-colors mt-0.5">
                                <X size={11} />
                            </button>
                        </li>
                    ))}
                </ul>
            )}
            <div className="flex gap-2">
                <input
                    type="text"
                    value={draft}
                    onChange={e => setDraft(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); add(); } }}
                    disabled={disabled}
                    placeholder={placeholder}
                    className="flex-1 p-2.5 bg-slate-900 border border-white/10 rounded-xl text-white text-sm focus:border-purple-500 outline-none placeholder:text-slate-600"
                />
                <button
                    type="button"
                    onClick={add}
                    disabled={disabled || !draft.trim()}
                    className="px-4 py-2.5 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-300 text-xs font-black hover:bg-purple-600/30 transition-all disabled:opacity-40"
                >
                    <Plus size={13} />
                </button>
            </div>
        </div>
    );
}

// ── Tag Editor ───────────────────────────────────────────────────────────────
function TagEditor({ label, items = [], onChange, disabled, placeholder }) {
    const [draft, setDraft] = useState('');

    const add = () => {
        const val = draft.trim();
        if (!val) return;
        onChange([...items, val]);
        setDraft('');
    };

    const remove = (idx) => onChange(items.filter((_, i) => i !== idx));

    return (
        <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</label>
            {items.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-purple-500/15 border border-purple-500/25 text-xs text-purple-200">
                            <Tag size={9} />
                            <span>{item}</span>
                            <button type="button" onClick={() => remove(idx)} disabled={disabled} className="text-purple-400 hover:text-red-400 transition-colors">
                                <X size={11} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
            <div className="flex gap-2">
                <input
                    type="text"
                    value={draft}
                    onChange={e => setDraft(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); add(); } }}
                    disabled={disabled}
                    placeholder={placeholder || 'Add tag...'}
                    className="flex-1 p-2.5 bg-slate-900 border border-white/10 rounded-xl text-white text-sm focus:border-purple-500 outline-none placeholder:text-slate-600"
                />
                <button
                    type="button"
                    onClick={add}
                    disabled={disabled || !draft.trim()}
                    className="px-4 py-2.5 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-300 text-xs font-black hover:bg-purple-600/30 transition-all disabled:opacity-40"
                >
                    <Plus size={13} />
                </button>
            </div>
        </div>
    );
}

const EMPTY_FORM = {
    title: '',
    sub_headline: '',
    slug: '',
    excerpt: '',
    content: '',
    cover_image_url: '',
    category: 'engineering',
    skill_level: 'intermediate',
    read_time: '5',
    tags: [],
    key_takeaways: [],
    is_published: true,
};

const autoSlug = (title) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const CATEGORIES = [
    { value: 'engineering', label: 'Engineering Deep-Dive' },
    { value: 'tutorial', label: 'Tutorial & How-To' },
    { value: 'automation', label: 'Automation & Scripting' },
    { value: 'data', label: 'Data & Analytics' },
    { value: 'ai_ml', label: 'AI / Machine Learning' },
    { value: 'devops', label: 'DevOps & Infrastructure' },
    { value: 'web_scraping', label: 'Web Scraping' },
    { value: 'career', label: 'Career & Industry Insights' },
];

export default function SellerBlogTab({ currentUser }) {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [activeSection, setActiveSection] = useState('basics');
    const [showPreview, setShowPreview] = useState(false);
    const [form, setForm] = useState(EMPTY_FORM);

    const loadPosts = async () => {
        setLoading(true);
        try {
            const data = await api.getSellerBlog();
            setPosts(data.results || data || []);
        } catch (err) {
            console.error("Failed to load seller blog posts:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadPosts(); }, []);

    const handleCreatePost = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const payload = {
                title: form.title,
                sub_headline: form.sub_headline,
                slug: form.slug || autoSlug(form.title),
                excerpt: form.excerpt,
                content: form.content,
                cover_image_url: form.cover_image_url || null,
                category: form.category,
                skill_level: form.skill_level,
                read_time: parseInt(form.read_time, 10) || 5,
                tags: form.tags,
                key_takeaways: form.key_takeaways,
                is_published: form.is_published,
            };

            await api.createSellerBlog(payload);
            setShowModal(false);
            setForm(EMPTY_FORM);
            setActiveSection('basics');
            await loadPosts();
        } catch (err) {
            console.error("Failed to create blog post:", err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeletePost = async (id) => {
        if (!confirm("Are you sure you want to delete this article?")) return;
        try {
            await api.deleteSellerBlog(id);
            setPosts(prev => prev.filter(p => p.id !== id));
        } catch (err) {
            console.error("Failed to delete blog post:", err);
        }
    };

    const authorName = currentUser?.first_name && currentUser?.last_name
        ? `${currentUser.first_name} ${currentUser.last_name}`
        : currentUser?.username || 'You';

    const SECTIONS = [
        { id: 'basics', label: 'Basics' },
        { id: 'content', label: 'Content' },
        { id: 'structure', label: 'Structure' },
        { id: 'media', label: 'Cover & Tags' },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-purple-950/20 border border-purple-500/20 backdrop-blur-xl">
                <div>
                    <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                        <BookOpen className="text-purple-400" size={24} /> My Technical Articles
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">Publish technical deep-dives, tutorials, and industry insights authored by you.</p>
                </div>
                <button
                    onClick={() => { setForm(EMPTY_FORM); setActiveSection('basics'); setShowPreview(false); setShowModal(true); }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-purple-600/30 cursor-pointer"
                >
                    <Plus size={16} /> + Write Article
                </button>
            </div>

            {/* Articles Grid */}
            {loading ? (
                <div className="p-8 text-center text-slate-500 text-xs font-bold uppercase tracking-widest">Loading articles...</div>
            ) : posts.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-slate-900/50 border border-white/5 space-y-3">
                    <BookOpen size={36} className="mx-auto text-purple-400/50" />
                    <div className="text-sm font-bold text-white">No articles published yet</div>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">Share your expertise with technical articles, tutorials, and engineering insights to build your authority.</p>
                    <button
                        onClick={() => { setForm(EMPTY_FORM); setActiveSection('basics'); setShowModal(true); }}
                        className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold cursor-pointer"
                    >
                        Write First Article
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.map((post) => (
                        <div key={post.id} className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 hover:border-purple-500/30 transition-all flex flex-col justify-between space-y-4">
                            {post.cover_image_url && (
                                <div className="w-full aspect-video rounded-xl overflow-hidden border border-white/5">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={post.cover_image_url} alt={post.title} className="w-full h-full object-cover" />
                                </div>
                            )}
                            <div>
                                <div className="flex flex-wrap gap-1.5 mb-3">
                                    {(post.tags || []).slice(0, 2).map((tag, i) => (
                                        <span key={i} className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                                            <Tag size={8} /> {tag}
                                        </span>
                                    ))}
                                    {post.category && (
                                        <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-white/5">
                                            {CATEGORIES.find(c => c.value === post.category)?.label || post.category}
                                        </span>
                                    )}
                                </div>

                                <h3 className="text-base font-black text-white leading-snug line-clamp-2">{post.title}</h3>
                                {post.sub_headline && <p className="text-xs text-purple-300 mt-1 line-clamp-1 font-medium">{post.sub_headline}</p>}
                                <p className="text-xs text-slate-400 mt-2 line-clamp-2">{post.excerpt}</p>

                                {(post.key_takeaways || []).length > 0 && (
                                    <div className="mt-3 p-2.5 rounded-lg bg-white/[0.03] border border-white/8 space-y-1">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Key Takeaways</p>
                                        {(post.key_takeaways || []).slice(0, 2).map((kt, i) => (
                                            <p key={i} className="text-[10px] text-slate-400 flex items-start gap-1.5">
                                                <span className="text-purple-400 mt-0.5">•</span> {kt}
                                            </p>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="pt-4 border-t border-white/5 space-y-2">
                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                                    <User size={10} className="text-purple-400" />
                                    Author: {post.author_full_name || authorName}
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500">
                                        <span className="flex items-center gap-1">
                                            <Calendar size={10} />
                                            {post.published_at
                                                ? new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                                : 'Draft'}
                                        </span>
                                        <span>{post.read_time || 5} min read</span>
                                        {post.skill_level && <span className="capitalize">{post.skill_level}</span>}
                                    </div>
                                    <button
                                        onClick={() => handleDeletePost(post.id)}
                                        className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all cursor-pointer"
                                        title="Delete Article"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create/Write Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="w-full max-w-3xl bg-slate-900 border border-white/10 rounded-2xl shadow-2xl max-h-[92vh] flex flex-col">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between border-b border-white/10 p-6 pb-4">
                            <h3 className="text-lg font-black text-white flex items-center gap-2">
                                <BookOpen className="text-purple-400" size={20} /> Write New Article
                            </h3>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowPreview(p => !p)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${showPreview ? 'bg-purple-600/30 text-purple-300 border border-purple-500/30' : 'bg-white/5 text-slate-400 hover:text-white'}`}
                                >
                                    <Eye size={12} /> {showPreview ? 'Edit' : 'Preview'}
                                </button>
                                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Section Tabs */}
                        <div className="flex gap-1 px-6 pt-4 border-b border-white/10 overflow-x-auto">
                            {SECTIONS.map(tab => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setActiveSection(tab.id)}
                                    className={`px-4 py-2.5 text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer border-b-2 ${
                                        activeSection === tab.id
                                            ? 'border-purple-500 text-purple-300'
                                            : 'border-transparent text-slate-500 hover:text-slate-300'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <form onSubmit={handleCreatePost} className="flex-1 overflow-y-auto p-6">
                            {/* Preview mode */}
                            {showPreview ? (
                                <div className="space-y-4">
                                    {form.cover_image_url && (
                                        <div className="w-full aspect-video rounded-xl overflow-hidden border border-white/10">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={form.cover_image_url} alt="Cover" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                    <h2 className="text-2xl font-black text-white">{form.title || 'Article Title'}</h2>
                                    {form.sub_headline && <p className="text-purple-300 font-medium">{form.sub_headline}</p>}
                                    {form.excerpt && <p className="text-slate-400 text-sm border-l-2 border-purple-500 pl-4">{form.excerpt}</p>}
                                    {form.key_takeaways.length > 0 && (
                                        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/8">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-purple-400 mb-2">Key Takeaways</p>
                                            <ul className="space-y-1">
                                                {form.key_takeaways.map((kt, i) => (
                                                    <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                                                        <span className="text-purple-400 mt-0.5">✓</span> {kt}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-white/5 text-xs text-slate-400 font-mono whitespace-pre-wrap">
                                        {form.content || 'Article content will appear here...'}
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-5">
                                    {/* ── BASICS ── */}
                                    {activeSection === 'basics' && (
                                        <>
                                            <div>
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Article Title *</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={form.title}
                                                    onChange={e => setForm({ ...form, title: e.target.value })}
                                                    placeholder="e.g., How to Scrape 10M Records Daily Without Getting Blocked"
                                                    className="w-full mt-1 p-3 rounded-xl bg-slate-950 border border-white/10 text-white text-sm focus:border-purple-500 outline-none"
                                                />
                                            </div>

                                            <div>
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Sub-headline</label>
                                                <input
                                                    type="text"
                                                    value={form.sub_headline}
                                                    onChange={e => setForm({ ...form, sub_headline: e.target.value })}
                                                    placeholder="A compelling one-liner that expands on the title..."
                                                    className="w-full mt-1 p-3 rounded-xl bg-slate-950 border border-white/10 text-white text-sm focus:border-purple-500 outline-none"
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                <div>
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Category</label>
                                                    <div className="relative mt-1">
                                                        <select
                                                            value={form.category}
                                                            onChange={e => setForm({ ...form, category: e.target.value })}
                                                            className="w-full p-3 pr-9 rounded-xl bg-slate-950 border border-white/10 text-white text-sm focus:border-purple-500 outline-none appearance-none"
                                                        >
                                                            {CATEGORIES.map(c => (
                                                                <option key={c.value} value={c.value}>{c.label}</option>
                                                            ))}
                                                        </select>
                                                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Skill Level</label>
                                                    <div className="relative mt-1">
                                                        <select
                                                            value={form.skill_level}
                                                            onChange={e => setForm({ ...form, skill_level: e.target.value })}
                                                            className="w-full p-3 pr-9 rounded-xl bg-slate-950 border border-white/10 text-white text-sm focus:border-purple-500 outline-none appearance-none"
                                                        >
                                                            <option value="beginner">Beginner</option>
                                                            <option value="intermediate">Intermediate</option>
                                                            <option value="advanced">Advanced</option>
                                                            <option value="expert">Expert</option>
                                                        </select>
                                                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Read Time (min)</label>
                                                    <input
                                                        type="number"
                                                        value={form.read_time}
                                                        onChange={e => setForm({ ...form, read_time: e.target.value })}
                                                        min="1" max="60"
                                                        className="w-full mt-1 p-3 rounded-xl bg-slate-950 border border-white/10 text-white text-sm focus:border-purple-500 outline-none"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Slug (auto-generated if blank)</label>
                                                <input
                                                    type="text"
                                                    value={form.slug}
                                                    onChange={e => setForm({ ...form, slug: e.target.value })}
                                                    placeholder={form.title ? autoSlug(form.title) : 'my-article-slug'}
                                                    className="w-full mt-1 p-3 rounded-xl bg-slate-950 border border-white/10 text-white text-sm focus:border-purple-500 outline-none font-mono"
                                                />
                                            </div>

                                            <div>
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Excerpt / Summary *</label>
                                                <textarea
                                                    rows={3}
                                                    required
                                                    value={form.excerpt}
                                                    onChange={e => setForm({ ...form, excerpt: e.target.value })}
                                                    placeholder="A brief teaser that appears on article preview cards..."
                                                    className="w-full mt-1 p-3 rounded-xl bg-slate-950 border border-white/10 text-white text-sm focus:border-purple-500 outline-none resize-none"
                                                />
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    id="blog-published"
                                                    checked={form.is_published}
                                                    onChange={e => setForm({ ...form, is_published: e.target.checked })}
                                                    className="w-4 h-4 accent-purple-500"
                                                />
                                                <label htmlFor="blog-published" className="text-xs font-bold text-slate-300 cursor-pointer">Publish immediately</label>
                                            </div>
                                        </>
                                    )}

                                    {/* ── CONTENT ── */}
                                    {activeSection === 'content' && (
                                        <>
                                            <div>
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Article Body (Markdown supported)</label>
                                                <p className="text-[10px] text-slate-500 mt-0.5">Use ## for headings, **bold**, `code`, and ``` for code blocks.</p>
                                                <textarea
                                                    rows={18}
                                                    value={form.content}
                                                    onChange={e => setForm({ ...form, content: e.target.value })}
                                                    placeholder={"## Introduction\n\nStart with a hook that explains why this topic matters...\n\n## The Problem\n\nDescribe the engineering challenge...\n\n## The Solution\n\n```python\n# Your code example here\n```\n\n## Conclusion\n\nWrap up key takeaways."}
                                                    className="w-full mt-1 p-3 rounded-xl bg-slate-950 border border-white/10 text-white text-sm focus:border-purple-500 outline-none font-mono resize-none leading-relaxed"
                                                />
                                            </div>
                                        </>
                                    )}

                                    {/* ── STRUCTURE ── */}
                                    {activeSection === 'structure' && (
                                        <>
                                            <BulletEditor
                                                label="Key Takeaways"
                                                hint="Bullet-point lessons readers will learn — shown as a preview card on article listings"
                                                items={form.key_takeaways}
                                                onChange={key_takeaways => setForm({ ...form, key_takeaways })}
                                                placeholder="e.g. How to handle CAPTCHAs at scale"
                                            />
                                        </>
                                    )}

                                    {/* ── MEDIA & TAGS ── */}
                                    {activeSection === 'media' && (
                                        <>
                                            <ImageUploadField
                                                label="Hero / Cover Image"
                                                value={form.cover_image_url}
                                                onChange={url => setForm({ ...form, cover_image_url: url })}
                                            />

                                            <div className="border-t border-white/10 pt-5">
                                                <TagEditor
                                                    label="Tags"
                                                    items={form.tags}
                                                    onChange={tags => setForm({ ...form, tags })}
                                                    placeholder="Python, Web Scraping, Automation"
                                                />
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}

                            {/* Footer Actions */}
                            <div className="pt-6 mt-4 border-t border-white/10 flex items-center justify-between gap-3">
                                <div className="flex gap-1">
                                    {SECTIONS.map((s) => (
                                        <button
                                            key={s.id}
                                            type="button"
                                            onClick={() => setActiveSection(s.id)}
                                            className={`w-2 h-2 rounded-full transition-all ${activeSection === s.id ? 'bg-purple-500' : 'bg-white/20'}`}
                                        />
                                    ))}
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-4 py-2.5 rounded-xl bg-white/5 text-slate-300 text-xs font-bold hover:bg-white/10 cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-black shadow-lg shadow-purple-600/30 cursor-pointer disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {submitting && <Loader2 size={13} className="animate-spin" />}
                                        {submitting ? 'Publishing...' : form.is_published ? 'Publish Article' : 'Save Draft'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
