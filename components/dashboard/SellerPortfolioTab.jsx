'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Plus, FolderKanban, Trash2, User, ExternalLink, Upload, X, Loader2, ChevronDown } from 'lucide-react';
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
            const result = await api.uploadServiceImage ? await api.uploadServiceImage(file) : null;
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

// ── Tag / Bullet List Editor ─────────────────────────────────────────────────
function TagEditor({ label, hint, items = [], onChange, disabled, placeholder = 'Add item...' }) {
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
                <div className="flex flex-wrap gap-2">
                    {items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/15 border border-purple-500/25 text-xs text-purple-200">
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

const EMPTY_FORM = {
    title: '',
    category: 'web_scraping',
    client_name: 'Confidential Client',
    description: '',
    challenge: '',
    solution: '',
    architecture: '',
    impact_metric: '',
    impact_list: [],
    live_url: '',
    github_url: '',
    technologies: [],
    cover_image_url: '',
    is_published: true,
};

export default function SellerPortfolioTab({ currentUser }) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [activeSection, setActiveSection] = useState('overview');
    const [form, setForm] = useState(EMPTY_FORM);

    const loadPortfolio = async () => {
        setLoading(true);
        try {
            const data = await api.getSellerPortfolio();
            setItems(data.results || data || []);
        } catch (err) {
            console.error("Failed to load seller portfolio:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadPortfolio(); }, []);

    const handleCreatePortfolio = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const payload = {
                title: form.title,
                category: form.category,
                client_name: form.client_name,
                description: form.description,
                challenge: form.challenge,
                solution: form.solution,
                architecture: form.architecture,
                impact_metric: form.impact_metric,
                impact_list: form.impact_list,
                live_url: form.live_url || null,
                github_url: form.github_url || null,
                technologies: form.technologies,
                cover_image_url: form.cover_image_url || null,
                is_published: form.is_published,
            };

            await api.createSellerPortfolio(payload);
            setShowModal(false);
            setForm(EMPTY_FORM);
            setActiveSection('overview');
            await loadPortfolio();
        } catch (err) {
            console.error("Failed to create portfolio item:", err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeletePortfolio = async (id) => {
        if (!confirm("Are you sure you want to delete this case study?")) return;
        try {
            await api.deleteSellerPortfolio(id);
            setItems(prev => prev.filter(item => item.id !== id));
        } catch (err) {
            console.error("Failed to delete portfolio item:", err);
        }
    };

    const authorName = currentUser?.first_name && currentUser?.last_name
        ? `${currentUser.first_name} ${currentUser.last_name}`
        : currentUser?.username || 'You';

    const CATEGORY_LABELS = {
        web_scraping: 'Industrial Web Scraping',
        ecommerce: 'E-Commerce Architecture',
        api_automation: 'API & Automation',
        ai_ml: 'AI / Machine Learning',
        data_pipeline: 'Data Pipeline & ETL',
        devops: 'DevOps & Infrastructure',
        fullstack: 'Full-Stack Development',
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-purple-950/20 border border-purple-500/20 backdrop-blur-xl">
                <div>
                    <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                        <FolderKanban className="text-purple-400" size={24} /> My Portfolio Case Studies
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">Showcase engineering milestones and industrial deployments created by you.</p>
                </div>
                <button
                    onClick={() => { setForm(EMPTY_FORM); setActiveSection('overview'); setShowModal(true); }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-purple-600/30 cursor-pointer"
                >
                    <Plus size={16} /> + Add Case Study
                </button>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="p-8 text-center text-slate-500 text-xs font-bold uppercase tracking-widest">Loading case studies...</div>
            ) : items.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-slate-900/50 border border-white/5 space-y-3">
                    <FolderKanban size={36} className="mx-auto text-purple-400/50" />
                    <div className="text-sm font-bold text-white">No portfolio case studies published yet</div>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">Add your technical case studies to build credibility and demonstrate your engineering expertise.</p>
                    <button
                        onClick={() => { setForm(EMPTY_FORM); setActiveSection('overview'); setShowModal(true); }}
                        className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold cursor-pointer"
                    >
                        Add First Case Study
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((pf) => (
                        <div key={pf.id} className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 hover:border-purple-500/30 transition-all space-y-4 flex flex-col justify-between">
                            {pf.cover_image_url && (
                                <div className="w-full aspect-video rounded-xl overflow-hidden border border-white/5">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={pf.cover_image_url} alt={pf.title} className="w-full h-full object-cover" />
                                </div>
                            )}
                            <div>
                                <div className="flex items-center justify-between gap-2 mb-2">
                                    <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                        {CATEGORY_LABELS[pf.category] || pf.category}
                                    </span>
                                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                                        <User size={10} className="text-purple-400" />
                                        <span>{pf.author_full_name || authorName}</span>
                                    </div>
                                </div>

                                <h3 className="text-base font-black text-white leading-snug line-clamp-2">{pf.title}</h3>
                                <p className="text-xs text-slate-400 mt-2 line-clamp-3">{pf.description || pf.challenge}</p>

                                {pf.impact_metric && (
                                    <div className="mt-3 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                                        🎯 {pf.impact_metric}
                                    </div>
                                )}

                                {(pf.technologies || []).length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 mt-3">
                                        {(pf.technologies || []).slice(0, 4).map((t, i) => (
                                            <span key={i} className="text-[9px] font-bold px-2 py-0.5 rounded bg-slate-800 border border-white/5 text-slate-400">{t}</span>
                                        ))}
                                        {(pf.technologies || []).length > 4 && (
                                            <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-slate-800 border border-white/5 text-slate-500">+{pf.technologies.length - 4}</span>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                                <span className="text-[10px] font-bold text-slate-500">{pf.client_name}</span>
                                <div className="flex items-center gap-2">
                                    {pf.live_url && (
                                        <a href={pf.live_url} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                                            <ExternalLink size={13} />
                                        </a>
                                    )}
                                    {pf.github_url && (
                                        <a href={pf.github_url} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all" title="GitHub">
                                            <ExternalLink size={13} />
                                        </a>
                                    )}
                                    <button
                                        onClick={() => handleDeletePortfolio(pf.id)}
                                        className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all cursor-pointer"
                                        title="Delete Case Study"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="w-full max-w-3xl bg-slate-900 border border-white/10 rounded-2xl shadow-2xl max-h-[92vh] flex flex-col">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between border-b border-white/10 p-6 pb-4">
                            <h3 className="text-lg font-black text-white flex items-center gap-2">
                                <FolderKanban className="text-purple-400" size={20} /> Add New Case Study
                            </h3>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Section Tabs */}
                        <div className="flex gap-1 px-6 pt-4 border-b border-white/10 pb-0 overflow-x-auto">
                            {[
                                { id: 'overview', label: 'Overview' },
                                { id: 'technical', label: 'Technical Details' },
                                { id: 'impact', label: 'Impact & Results' },
                                { id: 'media', label: 'Media & Links' },
                            ].map(tab => (
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

                        <form onSubmit={handleCreatePortfolio} className="flex-1 overflow-y-auto p-6">
                            <div className="space-y-5">
                                {/* ── OVERVIEW ── */}
                                {activeSection === 'overview' && (
                                    <>
                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Project Title *</label>
                                            <input
                                                type="text"
                                                required
                                                value={form.title}
                                                onChange={e => setForm({ ...form, title: e.target.value })}
                                                placeholder="e.g., High-Scale Amazon Scraper Architecture"
                                                className="w-full mt-1 p-3 rounded-xl bg-slate-950 border border-white/10 text-white text-sm focus:border-purple-500 outline-none"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Category</label>
                                                <div className="relative mt-1">
                                                    <select
                                                        value={form.category}
                                                        onChange={e => setForm({ ...form, category: e.target.value })}
                                                        className="w-full p-3 pr-9 rounded-xl bg-slate-950 border border-white/10 text-white text-sm focus:border-purple-500 outline-none appearance-none"
                                                    >
                                                        {Object.entries(CATEGORY_LABELS).map(([val, label]) => (
                                                            <option key={val} value={val}>{label}</option>
                                                        ))}
                                                    </select>
                                                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Client Name</label>
                                                <input
                                                    type="text"
                                                    value={form.client_name}
                                                    onChange={e => setForm({ ...form, client_name: e.target.value })}
                                                    placeholder="Confidential Client"
                                                    className="w-full mt-1 p-3 rounded-xl bg-slate-950 border border-white/10 text-white text-sm focus:border-purple-500 outline-none"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Short Description *</label>
                                            <textarea
                                                rows={3}
                                                required
                                                value={form.description}
                                                onChange={e => setForm({ ...form, description: e.target.value })}
                                                placeholder="A concise 2-3 sentence overview of this project..."
                                                className="w-full mt-1 p-3 rounded-xl bg-slate-950 border border-white/10 text-white text-sm focus:border-purple-500 outline-none resize-none"
                                            />
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                id="pf-published"
                                                checked={form.is_published}
                                                onChange={e => setForm({ ...form, is_published: e.target.checked })}
                                                className="w-4 h-4 accent-purple-500"
                                            />
                                            <label htmlFor="pf-published" className="text-xs font-bold text-slate-300 cursor-pointer">Publish immediately (visible to clients)</label>
                                        </div>
                                    </>
                                )}

                                {/* ── TECHNICAL DETAILS ── */}
                                {activeSection === 'technical' && (
                                    <>
                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Engineering Challenge</label>
                                            <textarea
                                                rows={4}
                                                value={form.challenge}
                                                onChange={e => setForm({ ...form, challenge: e.target.value })}
                                                placeholder="Describe the core technical obstacles and constraints you faced..."
                                                className="w-full mt-1 p-3 rounded-xl bg-slate-950 border border-white/10 text-white text-sm focus:border-purple-500 outline-none resize-none"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Engineering Solution</label>
                                            <textarea
                                                rows={4}
                                                value={form.solution}
                                                onChange={e => setForm({ ...form, solution: e.target.value })}
                                                placeholder="Describe how you solved the problem — algorithms, architecture choices, tools..."
                                                className="w-full mt-1 p-3 rounded-xl bg-slate-950 border border-white/10 text-white text-sm focus:border-purple-500 outline-none resize-none"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Architecture Overview (Markdown)</label>
                                            <p className="text-[10px] text-slate-500 mt-0.5">Describe system design, component interactions, and data flows.</p>
                                            <textarea
                                                rows={6}
                                                value={form.architecture}
                                                onChange={e => setForm({ ...form, architecture: e.target.value })}
                                                placeholder={"## System Design\n\n- **Ingestion Layer**: Playwright + rotating proxies\n- **Processing Layer**: Celery + Redis queue\n- **Storage Layer**: PostgreSQL + S3..."}
                                                className="w-full mt-1 p-3 rounded-xl bg-slate-950 border border-white/10 text-white text-sm focus:border-purple-500 outline-none font-mono resize-none"
                                            />
                                        </div>

                                        <TagEditor
                                            label="Technologies Used"
                                            hint="Press Enter or + to add each technology"
                                            items={form.technologies}
                                            onChange={technologies => setForm({ ...form, technologies })}
                                            placeholder="e.g. Python, Playwright, Redis"
                                        />
                                    </>
                                )}

                                {/* ── IMPACT & RESULTS ── */}
                                {activeSection === 'impact' && (
                                    <>
                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Primary Impact Headline</label>
                                            <input
                                                type="text"
                                                value={form.impact_metric}
                                                onChange={e => setForm({ ...form, impact_metric: e.target.value })}
                                                placeholder="e.g. Extracted 10M+ datapoints daily at 99.7% uptime"
                                                className="w-full mt-1 p-3 rounded-xl bg-slate-950 border border-white/10 text-white text-sm focus:border-purple-500 outline-none"
                                            />
                                        </div>

                                        <TagEditor
                                            label="Key Results & Metrics"
                                            hint="Individual measurable outcomes — each becomes a bullet point"
                                            items={form.impact_list}
                                            onChange={impact_list => setForm({ ...form, impact_list })}
                                            placeholder="e.g. Reduced latency from 8s to 0.3s"
                                        />
                                    </>
                                )}

                                {/* ── MEDIA & LINKS ── */}
                                {activeSection === 'media' && (
                                    <>
                                        <ImageUploadField
                                            label="Cover / Hero Image"
                                            value={form.cover_image_url}
                                            onChange={url => setForm({ ...form, cover_image_url: url })}
                                        />

                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Live Demo URL</label>
                                            <input
                                                type="url"
                                                value={form.live_url}
                                                onChange={e => setForm({ ...form, live_url: e.target.value })}
                                                placeholder="https://demo.yourproject.com"
                                                className="w-full mt-1 p-3 rounded-xl bg-slate-950 border border-white/10 text-white text-sm focus:border-purple-500 outline-none"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">GitHub / Source Repository URL</label>
                                            <input
                                                type="url"
                                                value={form.github_url}
                                                onChange={e => setForm({ ...form, github_url: e.target.value })}
                                                placeholder="https://github.com/you/project"
                                                className="w-full mt-1 p-3 rounded-xl bg-slate-950 border border-white/10 text-white text-sm focus:border-purple-500 outline-none"
                                            />
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Footer Actions */}
                            <div className="pt-6 mt-4 border-t border-white/10 flex items-center justify-between gap-3">
                                <div className="flex gap-1">
                                    {['overview', 'technical', 'impact', 'media'].map((s, i) => (
                                        <button
                                            key={s}
                                            type="button"
                                            onClick={() => setActiveSection(s)}
                                            className={`w-2 h-2 rounded-full transition-all ${activeSection === s ? 'bg-purple-500' : 'bg-white/20'}`}
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
                                        {submitting ? 'Saving...' : 'Save Case Study'}
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
