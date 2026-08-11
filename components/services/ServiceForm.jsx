'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
    Layers, Plus, Trash2, Save, ArrowLeft, Loader2, Upload, X,
    ChevronDown, Package, ShieldCheck
} from 'lucide-react';
import { api } from '@/lib/api';

// ── Image Upload Field ────────────────────────────────────────────────────────
function ImageUploadField({ label, value, onChange, disabled }) {
    const fileRef = useRef();
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(value || '');

    useEffect(() => { setPreview(value || ''); }, [value]);

    const handleFile = async (file) => {
        if (!file) return;
        setUploading(true);
        try {
            const result = await api.uploadServiceImage(file);
            const url = result?.url || result?.file_url || result?.image_url || '';
            onChange(url);
            setPreview(url);
        } catch (err) {
            const localUrl = URL.createObjectURL(file);
            setPreview(localUrl);
            alert('Upload notice: Using local preview. Backend URL will update upon save.');
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
                    className="flex-1 p-3 bg-slate-900 border border-white/10 rounded-xl text-white text-sm focus:border-brand-teal outline-none placeholder:text-slate-600"
                />
                <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={disabled || uploading}
                    className="px-4 py-2.5 rounded-xl bg-brand-teal/10 border border-brand-teal/20 text-brand-teal text-xs font-black uppercase tracking-widest hover:bg-brand-teal/20 transition-all flex items-center gap-1.5 whitespace-nowrap disabled:opacity-50 cursor-pointer"
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

// ── Gallery Manager ──────────────────────────────────────────────────────────
function GalleryManager({ images = [], onChange, disabled }) {
    const fileRef = useRef();
    const [uploading, setUploading] = useState(false);

    const handleFile = async (file) => {
        if (!file) return;
        setUploading(true);
        try {
            const result = await api.uploadServiceImage(file);
            const url = result?.url || result?.file_url || result?.image_url || '';
            if (url) onChange([...images, url]);
        } catch (err) {
            alert('Upload notice: Failed to upload image file.');
        } finally {
            setUploading(false);
        }
    };

    const removeImage = (idx) => onChange(images.filter((_, i) => i !== idx));

    return (
        <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Gallery Images</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {images.map((img, idx) => (
                    <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-white/10 bg-slate-900 group">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                                type="button"
                                onClick={() => removeImage(idx)}
                                className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white cursor-pointer"
                            >
                                <Trash2 size={13} />
                            </button>
                        </div>
                    </div>
                ))}

                <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={disabled || uploading}
                    className="aspect-video rounded-xl border-2 border-dashed border-white/10 hover:border-brand-teal/40 hover:bg-brand-teal/5 transition-all flex flex-col items-center justify-center gap-1.5 text-slate-400 hover:text-brand-teal disabled:opacity-50 cursor-pointer"
                >
                    {uploading ? (
                        <Loader2 size={20} className="animate-spin text-brand-teal" />
                    ) : (
                        <>
                            <Plus size={20} />
                            <span className="text-[9px] font-black uppercase tracking-widest">Add Image</span>
                        </>
                    )}
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => handleFile(e.target.files?.[0])} />
            </div>
        </div>
    );
}

// ── List Editor (Highlights / Badges) ─────────────────────────────────────────
function ListEditor({ label, hint, items = [], onChange, disabled, placeholder = 'Add item...' }) {
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
                        <div key={idx} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white">
                            <span>{item}</span>
                            <button
                                type="button"
                                onClick={() => remove(idx)}
                                disabled={disabled}
                                className="text-slate-500 hover:text-red-400 transition-colors"
                            >
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
                    className="flex-1 p-2.5 bg-slate-900 border border-white/10 rounded-xl text-white text-sm focus:border-brand-teal outline-none placeholder:text-slate-600"
                />
                <button
                    type="button"
                    onClick={add}
                    disabled={disabled || !draft.trim()}
                    className="px-4 py-2.5 rounded-xl bg-brand-teal/10 border border-brand-teal/20 text-brand-teal text-xs font-black uppercase tracking-widest hover:bg-brand-teal/20 transition-all disabled:opacity-40"
                >
                    <Plus size={13} />
                </button>
            </div>
        </div>
    );
}

// ── FAQ Editor ────────────────────────────────────────────────────────────────
function FaqEditor({ faqs = [], onChange, disabled }) {
    const addFaq = () => onChange([...faqs, { q: '', a: '' }]);
    const removeFaq = (idx) => onChange(faqs.filter((_, i) => i !== idx));
    const updateFaq = (idx, field, val) => {
        const updated = faqs.map((f, i) => i === idx ? { ...f, [field]: val } : f);
        onChange(updated);
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">FAQ Items</label>
                <button
                    type="button"
                    onClick={addFaq}
                    disabled={disabled}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-teal/10 border border-brand-teal/20 text-brand-teal text-[10px] font-black uppercase tracking-widest hover:bg-brand-teal/20 transition-all"
                >
                    <Plus size={11} /> Add FAQ
                </button>
            </div>

            {faqs.map((faq, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-white/[0.02] border border-white/8 space-y-2.5 relative">
                    <button
                        type="button"
                        onClick={() => removeFaq(idx)}
                        disabled={disabled}
                        className="absolute top-3 right-3 text-slate-500 hover:text-red-400 transition-colors"
                    >
                        <Trash2 size={13} />
                    </button>
                    <div>
                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-500">Question</label>
                        <input
                            type="text"
                            value={faq.q || ''}
                            onChange={e => updateFaq(idx, 'q', e.target.value)}
                            disabled={disabled}
                            placeholder="What is included in this service?"
                            className="w-full mt-1 p-2.5 bg-slate-900 border border-white/10 rounded-lg text-white text-sm focus:border-brand-teal outline-none"
                        />
                    </div>
                    <div>
                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-500">Answer</label>
                        <textarea
                            rows={2}
                            value={faq.a || ''}
                            onChange={e => updateFaq(idx, 'a', e.target.value)}
                            disabled={disabled}
                            placeholder="Detailed answer..."
                            className="w-full mt-1 p-2.5 bg-slate-900 border border-white/10 rounded-lg text-white text-sm focus:border-brand-teal outline-none resize-none"
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}

// ── Roadmap Editor ────────────────────────────────────────────────────────────
function RoadmapEditor({ roadmap = [], onChange, disabled }) {
    const addStep = () => onChange([...roadmap, { step: roadmap.length + 1, title: '', desc: '' }]);
    const removeStep = (idx) => {
        const updated = roadmap.filter((_, i) => i !== idx).map((item, i) => ({ ...item, step: i + 1 }));
        onChange(updated);
    };
    const updateStep = (idx, field, val) => {
        const updated = roadmap.map((s, i) => i === idx ? { ...s, [field]: val } : s);
        onChange(updated);
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Delivery Roadmap Steps</label>
                <button
                    type="button"
                    onClick={addStep}
                    disabled={disabled}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-teal/10 border border-brand-teal/20 text-brand-teal text-[10px] font-black uppercase tracking-widest hover:bg-brand-teal/20 transition-all"
                >
                    <Plus size={11} /> Add Step
                </button>
            </div>

            {roadmap.map((step, idx) => (
                <div key={idx} className="flex gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/8 relative">
                    <div className="w-7 h-7 rounded-full bg-brand-teal/10 border border-brand-teal/30 flex items-center justify-center text-xs font-black text-brand-teal shrink-0 mt-1">
                        {step.step || idx + 1}
                    </div>
                    <div className="flex-1 space-y-2">
                        <input
                            type="text"
                            value={step.title || ''}
                            onChange={e => updateStep(idx, 'title', e.target.value)}
                            disabled={disabled}
                            placeholder="Step title (e.g. Requirement Gathering)"
                            className="w-full p-2.5 bg-slate-900 border border-white/10 rounded-lg text-white text-sm focus:border-brand-teal outline-none"
                        />
                        <textarea
                            rows={2}
                            value={step.desc || ''}
                            onChange={e => updateStep(idx, 'desc', e.target.value)}
                            disabled={disabled}
                            placeholder="Brief description of this step..."
                            className="w-full p-2.5 bg-slate-900 border border-white/10 rounded-lg text-white text-sm focus:border-brand-teal outline-none resize-none"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={() => removeStep(idx)}
                        disabled={disabled}
                        className="text-slate-500 hover:text-red-400 transition-colors self-start mt-1"
                    >
                        <Trash2 size={13} />
                    </button>
                </div>
            ))}
        </div>
    );
}

// ── Tier Editor ───────────────────────────────────────────────────────────────
function TierEditor({ tier, tierKey, onChange, disabled }) {
    return (
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/8 space-y-3">
            <div className="flex items-center gap-2 mb-1">
                <Package size={13} className="text-brand-teal" />
                <span className="text-[10px] font-black uppercase tracking-widest text-brand-teal">{tierKey} Tier Package</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-500">Name</label>
                    <input
                        type="text"
                        value={tier?.name || ''}
                        onChange={e => onChange({ ...tier, name: e.target.value })}
                        disabled={disabled}
                        placeholder={`${tierKey.charAt(0).toUpperCase() + tierKey.slice(1)} Pack`}
                        className="w-full mt-1 p-2.5 bg-slate-900 border border-white/10 rounded-lg text-white text-sm focus:border-brand-teal outline-none"
                    />
                </div>
                <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-500">Price ($)</label>
                    <input
                        type="number"
                        value={tier?.price || ''}
                        onChange={e => onChange({ ...tier, price: parseFloat(e.target.value) || 0 })}
                        disabled={disabled}
                        placeholder="299"
                        className="w-full mt-1 p-2.5 bg-slate-900 border border-white/10 rounded-lg text-white text-sm focus:border-brand-teal outline-none"
                    />
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-500">Delivery Time</label>
                    <input
                        type="text"
                        value={tier?.delivery_time || tier?.delivery || ''}
                        onChange={e => onChange({ ...tier, delivery_time: e.target.value, delivery: e.target.value })}
                        disabled={disabled}
                        placeholder="Up to 3 days"
                        className="w-full mt-1 p-2.5 bg-slate-900 border border-white/10 rounded-lg text-white text-sm focus:border-brand-teal outline-none"
                    />
                </div>
                <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-500">Revisions</label>
                    <input
                        type="number"
                        value={tier?.revisions ?? 2}
                        onChange={e => onChange({ ...tier, revisions: parseInt(e.target.value) || 0 })}
                        disabled={disabled}
                        className="w-full mt-1 p-2.5 bg-slate-900 border border-white/10 rounded-lg text-white text-sm focus:border-brand-teal outline-none"
                    />
                </div>
            </div>
        </div>
    );
}

// ── MAIN SERVICE FORM COMPONENT ───────────────────────────────────────────────
export default function ServiceForm({ initialData = null, isSeller = false, backUrl = '/admin/services' }) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('basic');
    const [saving, setSaving] = useState(false);
    const [categories, setCategories] = useState([]);

    const [formData, setFormData] = useState({
        title: '',
        category_name: 'Development',
        delivery_time: 'Up to 5 days',
        description: '',
        long_description: '',
        is_published: true,
        is_featured: false,
        features: ['Full Source Code', 'REST API Integration', '24/7 Support'],
        badges: ['Pro', 'Best Value'],
        faqs: [
            { q: 'What is included in this service package?', a: 'All source code, documentation, and 30 days post-delivery support.' }
        ],
        roadmap: [
            { step: 1, title: 'Requirement Gathering', desc: 'Define project scope and data schema.' },
            { step: 2, title: 'Development & Testing', desc: 'Build backend pipelines and perform test runs.' }
        ],
        tiers: {
            basic: { name: 'Basic', price: 299, delivery_time: 'Up to 3 days', revisions: 1 },
            standard: { name: 'Standard', price: 699, delivery_time: 'Up to 5 days', revisions: 2 },
            premium: { name: 'Premium', price: 1499, delivery_time: 'Up to 10 days', revisions: 5 },
        },
        cover_image_url: '',
        gallery: [],
    });

    useEffect(() => {
        if (initialData) {
            setFormData(prev => ({
                ...prev,
                ...initialData,
                features: initialData.features || prev.features,
                badges: initialData.badges || prev.badges,
                faqs: initialData.faqs || prev.faqs,
                roadmap: initialData.roadmap || prev.roadmap,
                tiers: initialData.tiers || prev.tiers,
                gallery: initialData.gallery || prev.gallery,
            }));
        }
    }, [initialData]);

    useEffect(() => {
        async function fetchCategories() {
            try {
                const cats = await api.getServiceCategories();
                setCategories(Array.isArray(cats) ? cats : cats.results || []);
            } catch (err) {
                console.error('Failed to fetch categories:', err);
            }
        }
        fetchCategories();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (initialData?.id) {
                if (isSeller) {
                    await api.updateSellerService(initialData.id, formData);
                } else {
                    await api.updateAdminService(initialData.id, formData);
                }
            } else {
                if (isSeller) {
                    await api.createSellerService(formData);
                } else {
                    await api.createAdminService(formData);
                }
            }
            router.push(backUrl);
        } catch (err) {
            console.error('Service save failed:', err);
            alert('Failed to save service: ' + (err.message || 'Unknown error'));
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSave} className="space-y-6 max-w-5xl mx-auto pb-12">
            {/* Top Bar Navigation */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900/90 border border-white/10 backdrop-blur-xl">
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => router.push(backUrl)}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition-all cursor-pointer"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div>
                        <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                            <Layers className="text-brand-teal" size={20} />
                            {initialData?.id ? 'Edit Service Listing' : 'Create New Service Listing'}
                        </h1>
                        <p className="text-xs text-slate-400 mt-0.5">Configure service packages, deliverables, roadmap, and media showcase.</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                    <button
                        type="button"
                        onClick={() => router.push(backUrl)}
                        className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-6 py-2.5 rounded-xl bg-brand-teal hover:bg-brand-teal/80 text-white text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-brand-teal/20 cursor-pointer disabled:opacity-50"
                    >
                        {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                        {saving ? 'Saving Service...' : 'Save Service'}
                    </button>
                </div>
            </div>

            {/* Editor Sub-Tab Bar */}
            <div className="flex border-b border-white/10 gap-2 overflow-x-auto pb-1">
                {[
                    { id: 'basic', label: '1. Basic Info' },
                    { id: 'content', label: '2. Highlights & Badges' },
                    { id: 'tiers', label: '3. Pricing Packages' },
                    { id: 'faq', label: '4. FAQ & Delivery Roadmap' },
                    { id: 'media', label: '5. Cover & Media Gallery' },
                ].map((t) => (
                    <button
                        key={t.id}
                        type="button"
                        onClick={() => setActiveTab(t.id)}
                        className={`px-4 py-2.5 rounded-t-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                            activeTab === t.id
                                ? 'bg-slate-900 text-brand-teal border-t border-x border-brand-teal/30'
                                : 'text-slate-500 hover:text-slate-300'
                        }`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Tab Form Content */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-xl">
                {activeTab === 'basic' && (
                    <div className="space-y-5">
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Service Title *</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                required
                                disabled={saving}
                                placeholder="e.g. High-Velocity Web Scraping & Data Pipeline"
                                className="w-full mt-1 p-3 bg-slate-950 border border-white/10 rounded-xl text-white text-sm focus:border-brand-teal outline-none"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Category</label>
                                <div className="relative mt-1">
                                    <select
                                        value={formData.category_name}
                                        onChange={e => setFormData({ ...formData, category_name: e.target.value })}
                                        disabled={saving}
                                        className="w-full p-3 pr-9 bg-slate-950 border border-white/10 rounded-xl text-white text-sm focus:border-brand-teal outline-none appearance-none"
                                    >
                                        <option value="Development">Development</option>
                                        <option value="Web Scraping">Web Scraping</option>
                                        <option value="AI & Data">AI & Data</option>
                                        <option value="Automation">Automation</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.name}>{cat.name}</option>
                                        ))}
                                    </select>
                                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Base Delivery Time</label>
                                <input
                                    type="text"
                                    value={formData.delivery_time}
                                    onChange={e => setFormData({ ...formData, delivery_time: e.target.value })}
                                    disabled={saving}
                                    placeholder="Up to 5 days"
                                    className="w-full mt-1 p-3 bg-slate-950 border border-white/10 rounded-xl text-white text-sm focus:border-brand-teal outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Short Summary</label>
                            <textarea
                                rows={2}
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                disabled={saving}
                                placeholder="Brief overview shown on catalog cards..."
                                className="w-full mt-1 p-3 bg-slate-950 border border-white/10 rounded-xl text-white text-sm focus:border-brand-teal outline-none resize-none"
                            />
                        </div>

                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Full Description (Markdown)</label>
                            <textarea
                                rows={8}
                                value={formData.long_description}
                                onChange={e => setFormData({ ...formData, long_description: e.target.value })}
                                disabled={saving}
                                placeholder={"## Overview\n\nFull service details, technology stack, and deliverables description..."}
                                className="w-full mt-1 p-3 bg-slate-950 border border-white/10 rounded-xl text-white text-sm focus:border-brand-teal outline-none font-mono resize-none"
                            />
                        </div>

                        <div className="flex items-center gap-6 pt-2">
                            <label className="flex items-center gap-2 text-xs font-bold text-white cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.is_published}
                                    onChange={e => setFormData({ ...formData, is_published: e.target.checked })}
                                    disabled={saving}
                                    className="w-4 h-4 accent-brand-teal"
                                />
                                Published (visible in marketplace)
                            </label>
                            <label className="flex items-center gap-2 text-xs font-bold text-white cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.is_featured}
                                    onChange={e => setFormData({ ...formData, is_featured: e.target.checked })}
                                    disabled={saving}
                                    className="w-4 h-4 accent-brand-teal"
                                />
                                Featured Service
                            </label>
                        </div>
                    </div>
                )}

                {activeTab === 'content' && (
                    <div className="space-y-6">
                        <ListEditor
                            label="Technical Highlights (Features)"
                            hint="Key engineering highlights bullet points."
                            items={formData.features || []}
                            onChange={features => setFormData({ ...formData, features })}
                            disabled={saving}
                            placeholder="e.g. Proxy Rotation & Anti-bot Bypass"
                        />
                        <div className="border-t border-white/10" />
                        <ListEditor
                            label="Service Badges"
                            hint='Badges displayed on service cards (e.g. "Certified", "Best Seller").'
                            items={formData.badges || []}
                            onChange={badges => setFormData({ ...formData, badges })}
                            disabled={saving}
                            placeholder="e.g. Certified"
                        />
                    </div>
                )}

                {activeTab === 'tiers' && (
                    <div className="space-y-4">
                        <p className="text-xs text-slate-400">Configure pricing, delivery timelines, and revision limits for each tier package.</p>
                        {['basic', 'standard', 'premium'].map(tierKey => (
                            <TierEditor
                                key={tierKey}
                                tier={formData.tiers?.[tierKey]}
                                tierKey={tierKey}
                                onChange={val => setFormData({
                                    ...formData,
                                    tiers: { ...formData.tiers, [tierKey]: val }
                                })}
                                disabled={saving}
                            />
                        ))}
                    </div>
                )}

                {activeTab === 'faq' && (
                    <div className="space-y-6">
                        <FaqEditor
                            faqs={formData.faqs || []}
                            onChange={faqs => setFormData({ ...formData, faqs })}
                            disabled={saving}
                        />
                        <div className="border-t border-white/10" />
                        <RoadmapEditor
                            roadmap={formData.roadmap || []}
                            onChange={roadmap => setFormData({ ...formData, roadmap })}
                            disabled={saving}
                        />
                    </div>
                )}

                {activeTab === 'media' && (
                    <div className="space-y-6">
                        <ImageUploadField
                            label="Main Cover Image"
                            value={formData.cover_image_url || ''}
                            onChange={url => setFormData({ ...formData, cover_image_url: url })}
                            disabled={saving}
                        />
                        <div className="border-t border-white/10" />
                        <GalleryManager
                            images={formData.gallery || []}
                            onChange={gallery => setFormData({ ...formData, gallery })}
                            disabled={saving}
                        />
                    </div>
                )}
            </div>
        </form>
    );
}
