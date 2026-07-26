'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Layers, Plus, Trash2, Save, Star, CheckCircle2,
    AlertCircle, Loader2, DollarSign, Upload, X, Image as ImageIcon,
    Eye, EyeOff, Package, ChevronDown, ToggleLeft, ToggleRight, GripVertical
} from 'lucide-react';
import { api } from '@/lib/api';
import AdminModal from '@/components/AdminModal';

// ─── Image Upload Field ───────────────────────────────────────────────────────

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
            // Fall back to object URL for preview if upload fails
            const localUrl = URL.createObjectURL(file);
            setPreview(localUrl);
            alert('Upload failed: ' + (err.message || 'Unknown error') + '\nUsing local preview only.');
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
                    placeholder="https://... or upload below"
                    disabled={disabled || uploading}
                    className="flex-1 p-3 bg-surface-900 border border-white/10 rounded-xl text-white text-sm focus:border-brand-teal outline-none placeholder:text-slate-600"
                />
                <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={disabled || uploading}
                    className="px-3 py-2 rounded-xl bg-brand-teal/10 border border-brand-teal/20 text-brand-teal text-xs font-black uppercase tracking-widest hover:bg-brand-teal/20 transition-all flex items-center gap-1.5 whitespace-nowrap disabled:opacity-50"
                >
                    {uploading ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
                    {uploading ? 'Uploading...' : 'Upload'}
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => handleFile(e.target.files?.[0])} />
            </div>
            {preview && (
                <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-white/10 bg-slate-900">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" onError={() => setPreview('')} />
                    <button
                        type="button"
                        onClick={() => { onChange(''); setPreview(''); }}
                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-brand-red transition-colors"
                    >
                        <X size={12} />
                    </button>
                </div>
            )}
        </div>
    );
}

// ─── Gallery Manager ──────────────────────────────────────────────────────────

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
            alert('Gallery upload failed: ' + (err.message || 'Unknown error'));
        } finally {
            setUploading(false);
        }
    };

    const removeImage = (idx) => onChange(images.filter((_, i) => i !== idx));

    return (
        <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Gallery Images</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {images.map((img, idx) => (
                    <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-white/10 bg-slate-900 group">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                                type="button"
                                onClick={() => removeImage(idx)}
                                className="w-8 h-8 rounded-full bg-brand-red flex items-center justify-center text-white"
                            >
                                <Trash2 size={13} />
                            </button>
                        </div>
                        <div className="absolute bottom-1 left-1 text-[9px] font-black text-white/60 bg-black/50 px-1.5 rounded">
                            {idx + 1}
                        </div>
                    </div>
                ))}

                {/* Add button */}
                <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={disabled || uploading}
                    className="aspect-video rounded-xl border-2 border-dashed border-white/10 hover:border-brand-teal/40 hover:bg-brand-teal/5 transition-all flex flex-col items-center justify-center gap-1.5 text-text-muted hover:text-brand-teal disabled:opacity-50"
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
            <p className="text-[10px] text-slate-600">First image is used as the main card image. Add multiple for a gallery slideshow.</p>
        </div>
    );
}

// ─── Tier Editor ──────────────────────────────────────────────────────────────

function TierEditor({ tier, tierKey, onChange, disabled }) {
    return (
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/8 space-y-3">
            <div className="flex items-center gap-2 mb-1">
                <Package size={13} className="text-brand-teal" />
                <span className="text-[10px] font-black uppercase tracking-widest text-brand-teal">{tierKey} Tier</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-500">Name</label>
                    <input
                        type="text"
                        value={tier?.name || ''}
                        onChange={e => onChange({ ...tier, name: e.target.value })}
                        disabled={disabled}
                        placeholder={`${tierKey.charAt(0).toUpperCase() + tierKey.slice(1)} Pack`}
                        className="w-full mt-1 p-2.5 bg-surface-900 border border-white/10 rounded-lg text-white text-sm focus:border-brand-teal outline-none"
                    />
                </div>
                <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-500">Price ($)</label>
                    <input
                        type="number"
                        value={tier?.price || ''}
                        onChange={e => onChange({ ...tier, price: parseFloat(e.target.value) || 0 })}
                        disabled={disabled}
                        placeholder="150"
                        className="w-full mt-1 p-2.5 bg-surface-900 border border-white/10 rounded-lg text-white text-sm focus:border-brand-teal outline-none"
                    />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-500">Delivery Time</label>
                    <input
                        type="text"
                        value={tier?.delivery_time || tier?.delivery || ''}
                        onChange={e => onChange({ ...tier, delivery_time: e.target.value, delivery: e.target.value })}
                        disabled={disabled}
                        placeholder="Up to 3 days"
                        className="w-full mt-1 p-2.5 bg-surface-900 border border-white/10 rounded-lg text-white text-sm focus:border-brand-teal outline-none"
                    />
                </div>
                <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-500">Revisions</label>
                    <input
                        type="number"
                        value={tier?.revisions ?? 2}
                        onChange={e => onChange({ ...tier, revisions: parseInt(e.target.value) || 0 })}
                        disabled={disabled}
                        className="w-full mt-1 p-2.5 bg-surface-900 border border-white/10 rounded-lg text-white text-sm focus:border-brand-teal outline-none"
                    />
                </div>
            </div>
            <div>
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-500">Description</label>
                <textarea
                    rows={2}
                    value={tier?.description || ''}
                    onChange={e => onChange({ ...tier, description: e.target.value })}
                    disabled={disabled}
                    placeholder="Brief description of what's included..."
                    className="w-full mt-1 p-2.5 bg-surface-900 border border-white/10 rounded-lg text-white text-sm focus:border-brand-teal outline-none resize-none"
                />
            </div>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const DEFAULT_SERVICE = {
    title: '',
    category_name: 'Development',
    description: '',
    long_description: '',
    about_service: '',
    delivery_time: 'Up to 7 days',
    is_published: true,
    is_featured: false,
    cover_image_url: '',
    gallery: [],
    tiers: {
        basic: { name: 'Basic Pack', price: 150, description: 'Core features', delivery_time: 'Up to 3 days', revisions: 2 },
        standard: { name: 'Standard Pack', price: 300, description: 'Advanced features', delivery_time: 'Up to 7 days', revisions: 3 },
        premium: { name: 'Enterprise Pack', price: 600, description: 'Full solution', delivery_time: 'Up to 14 days', revisions: 5 }
    }
};

export default function AdminServicesPage() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedService, setSelectedService] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState('');
    const [activeTab, setActiveTab] = useState('details'); // 'details' | 'tiers' | 'media'

    const loadServices = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await api.getAdminServices();
            setServices(Array.isArray(data) ? data : data.results || []);
        } catch (err) {
            setError('Failed to fetch services: ' + (err.message || 'Unknown error'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadServices(); }, []);

    const handleCreateNew = () => {
        setSelectedService({ ...DEFAULT_SERVICE, isNew: true });
        setActiveTab('details');
        setSaveError('');
        setIsEditModalOpen(true);
    };

    const handleEdit = (svc) => {
        setSelectedService({
            ...svc,
            gallery: svc.gallery || [],
            tiers: svc.tiers || DEFAULT_SERVICE.tiers,
            isNew: false,
        });
        setActiveTab('details');
        setSaveError('');
        setIsEditModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!selectedService?.title?.trim()) {
            setSaveError('Service title is required.');
            return;
        }
        setSaving(true);
        setSaveError('');
        try {
            const payload = { ...selectedService };
            delete payload.isNew;
            if (selectedService.isNew || !selectedService.id) {
                await api.createAdminService(payload);
            } else {
                await api.updateAdminService(selectedService.id, payload);
            }
            setIsEditModalOpen(false);
            await loadServices();
        } catch (err) {
            setSaveError(err.message || 'Error saving service. Check all required fields.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this service? This cannot be undone.')) return;
        try {
            await api.deleteAdminService(id);
            await loadServices();
        } catch (err) {
            alert(err.message || 'Failed to delete service');
        }
    };

    const toggleStatus = async (service) => {
        try {
            await api.updateAdminService(service.id, { is_published: !service.is_published });
            await loadServices();
        } catch {
            alert('Failed to toggle status');
        }
    };

    const updateTier = (tierKey, val) => {
        setSelectedService(p => ({ ...p, tiers: { ...p.tiers, [tierKey]: val } }));
    };

    const TABS = [
        { id: 'details', label: 'Details' },
        { id: 'tiers', label: 'Pricing Tiers' },
        { id: 'media', label: 'Images & Gallery' },
    ];

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <p className="text-xs font-black text-brand-teal uppercase tracking-[0.3em] mb-1">Admin / Services</p>
                    <h1 className="text-2xl font-black text-white uppercase tracking-tight">Service Catalog</h1>
                    <p className="text-slate-400 text-sm mt-1">Manage engineering packs, pricing tiers, and public offerings.</p>
                </div>
                <button
                    onClick={handleCreateNew}
                    className="flex items-center gap-2 px-4 py-2.5 bg-brand-teal text-slate-950 font-black text-xs uppercase tracking-widest rounded-xl hover:bg-brand-teal/90 transition-all shadow-glow-teal"
                >
                    <Plus size={16} /> New Service
                </button>
            </motion.div>

            {error && (
                <div className="p-4 rounded-xl bg-brand-red/10 border border-brand-red/20 text-brand-red text-xs font-bold flex items-center gap-2">
                    <AlertCircle size={15} /> {error}
                </div>
            )}

            {/* Table */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-24 text-slate-500 gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-brand-teal" />
                    <span className="text-xs font-black uppercase tracking-widest">Loading Service Repository...</span>
                </div>
            ) : (
                <div className="rounded-2xl bg-white/[0.02] border border-white/5 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[720px]">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/[0.02]">
                                    {['Service', 'Category', 'Pricing', 'Status', 'Actions'].map(h => (
                                        <th key={h} className="px-4 py-3.5 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {services.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-4 py-16 text-center text-slate-500 text-xs uppercase tracking-widest font-bold">
                                            No services found — create your first one above.
                                        </td>
                                    </tr>
                                ) : (
                                    services.map((svc, i) => (
                                        <motion.tr key={svc.id}
                                            initial={{ opacity: 0, y: 4 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.03 }}
                                            className="hover:bg-white/[0.02] transition-colors group"
                                        >
                                            {/* Service details */}
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-3">
                                                    {(svc.cover_image_url || (svc.gallery && svc.gallery[0])) ? (
                                                        <div className="w-12 h-9 rounded-lg overflow-hidden border border-white/10 shrink-0">
                                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                                            <img
                                                                src={svc.cover_image_url || svc.gallery[0]}
                                                                alt={svc.title}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="w-12 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                                            <ImageIcon size={14} className="text-slate-600" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div className="text-sm font-black text-white group-hover:text-brand-teal transition-colors">{svc.title}</div>
                                                        <div className="text-xs text-slate-400 line-clamp-1 mt-0.5 max-w-[240px]">{svc.description}</div>
                                                        {svc.gallery?.length > 0 && (
                                                            <div className="text-[9px] text-brand-teal/60 font-bold mt-0.5">{svc.gallery.length} gallery images</div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Category */}
                                            <td className="px-4 py-4">
                                                <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-slate-300">
                                                    {svc.category || svc.category_name || '—'}
                                                </span>
                                            </td>

                                            {/* Pricing */}
                                            <td className="px-4 py-4">
                                                {svc.tiers ? (
                                                    <div className="flex flex-col gap-0.5">
                                                        {Object.entries(svc.tiers).map(([k, t]) => t && (
                                                            <div key={k} className="flex items-center gap-1.5">
                                                                <span className="text-[9px] font-black uppercase text-slate-500 w-14">{k}</span>
                                                                <span className="text-xs font-bold text-white">${t.price}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-slate-500">—</span>
                                                )}
                                            </td>

                                            {/* Status */}
                                            <td className="px-4 py-4">
                                                <button
                                                    onClick={() => toggleStatus(svc)}
                                                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${svc.is_published ? 'bg-brand-teal/10 text-brand-teal border border-brand-teal/20' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}
                                                >
                                                    {svc.is_published ? <ToggleRight size={13} /> : <ToggleLeft size={13} />}
                                                    {svc.is_published ? 'Published' : 'Draft'}
                                                </button>
                                            </td>

                                            {/* Actions */}
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleEdit(svc)}
                                                        className="px-3 py-1.5 rounded-lg glass text-xs font-bold text-white hover:bg-white/10 transition-colors"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(svc.id)}
                                                        className="p-1.5 rounded-lg text-slate-500 hover:text-brand-red hover:bg-brand-red/10 transition-colors"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Edit / Create Modal */}
            <AdminModal
                open={isEditModalOpen}
                onClose={() => { if (!saving) setIsEditModalOpen(false); }}
                title={selectedService?.isNew ? 'New Service' : `Edit: ${selectedService?.title || ''}`}
                subtitle={selectedService?.isNew ? 'Create a new service listing' : `ID: ${selectedService?.id}`}
                maxWidthClass="max-w-3xl"
                footer={
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full py-2.5 bg-brand-teal text-slate-950 rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all shadow-glow-teal disabled:opacity-50"
                    >
                        {saving ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : <><Save size={14} /> Save Service</>}
                    </button>
                }
            >
                {selectedService && (
                    <div className="flex flex-col h-full">
                        {/* Tab bar */}
                        <div className="flex border-b border-white/10 px-5 pt-4">
                            {TABS.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-4 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 -mb-px ${activeTab === tab.id ? 'border-brand-teal text-brand-teal' : 'border-transparent text-slate-500 hover:text-white'}`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <div className="p-5 space-y-4 overflow-y-auto flex-1">
                            {saveError && (
                                <div className="flex items-center gap-2 p-3 rounded-xl bg-brand-red/10 border border-brand-red/20 text-brand-red text-xs">
                                    <AlertCircle size={13} className="shrink-0" /> {saveError}
                                </div>
                            )}

                            {/* ── DETAILS TAB ── */}
                            {activeTab === 'details' && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Service Title *</label>
                                        <input
                                            type="text"
                                            value={selectedService.title || ''}
                                            onChange={e => setSelectedService(p => ({ ...p, title: e.target.value }))}
                                            required
                                            disabled={saving}
                                            placeholder="e.g. Full-Stack Web Application"
                                            className="w-full mt-1 p-3 bg-surface-900 border border-white/10 rounded-xl text-white text-sm focus:border-brand-teal outline-none"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Category</label>
                                            <input
                                                type="text"
                                                value={selectedService.category_name || selectedService.category || ''}
                                                onChange={e => setSelectedService(p => ({ ...p, category_name: e.target.value }))}
                                                disabled={saving}
                                                placeholder="Development"
                                                className="w-full mt-1 p-3 bg-surface-900 border border-white/10 rounded-xl text-white text-sm focus:border-brand-teal outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Base Delivery Time</label>
                                            <input
                                                type="text"
                                                value={selectedService.delivery_time || selectedService.delivery || ''}
                                                onChange={e => setSelectedService(p => ({ ...p, delivery_time: e.target.value, delivery: e.target.value }))}
                                                disabled={saving}
                                                placeholder="Up to 7 days"
                                                className="w-full mt-1 p-3 bg-surface-900 border border-white/10 rounded-xl text-white text-sm focus:border-brand-teal outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Short Summary</label>
                                        <textarea
                                            rows={2}
                                            value={selectedService.description || ''}
                                            onChange={e => setSelectedService(p => ({ ...p, description: e.target.value }))}
                                            disabled={saving}
                                            placeholder="One or two sentences displayed on the service card..."
                                            className="w-full mt-1 p-3 bg-surface-900 border border-white/10 rounded-xl text-white text-sm focus:border-brand-teal outline-none resize-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Full Description (Markdown)</label>
                                        <textarea
                                            rows={6}
                                            value={selectedService.long_description || selectedService.longDescription || ''}
                                            onChange={e => setSelectedService(p => ({ ...p, long_description: e.target.value }))}
                                            disabled={saving}
                                            placeholder="## What's Included&#10;&#10;Full markdown content for the service detail page..."
                                            className="w-full mt-1 p-3 bg-surface-900 border border-white/10 rounded-xl text-white text-sm focus:border-brand-teal outline-none font-mono resize-none"
                                        />
                                    </div>

                                    <div className="flex items-center gap-6 pt-2">
                                        <label className="flex items-center gap-2 text-xs font-bold text-white cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={selectedService.is_published ?? true}
                                                onChange={e => setSelectedService(p => ({ ...p, is_published: e.target.checked }))}
                                                disabled={saving}
                                                className="w-4 h-4 accent-brand-teal"
                                            />
                                            Published (visible to public)
                                        </label>
                                        <label className="flex items-center gap-2 text-xs font-bold text-white cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={selectedService.is_featured ?? false}
                                                onChange={e => setSelectedService(p => ({ ...p, is_featured: e.target.checked }))}
                                                disabled={saving}
                                                className="w-4 h-4 accent-brand-teal"
                                            />
                                            Featured (highlighted on homepage)
                                        </label>
                                    </div>
                                </div>
                            )}

                            {/* ── TIERS TAB ── */}
                            {activeTab === 'tiers' && (
                                <div className="space-y-4">
                                    <p className="text-xs text-slate-400">Configure pricing, delivery times, and revisions for each service tier.</p>
                                    {['basic', 'standard', 'premium'].map(tierKey => (
                                        <TierEditor
                                            key={tierKey}
                                            tier={selectedService.tiers?.[tierKey]}
                                            tierKey={tierKey}
                                            onChange={val => updateTier(tierKey, val)}
                                            disabled={saving}
                                        />
                                    ))}
                                </div>
                            )}

                            {/* ── MEDIA TAB ── */}
                            {activeTab === 'media' && (
                                <div className="space-y-6">
                                    <ImageUploadField
                                        label="Cover Image (main card image)"
                                        value={selectedService.cover_image_url || ''}
                                        onChange={url => setSelectedService(p => ({ ...p, cover_image_url: url }))}
                                        disabled={saving}
                                    />
                                    <div className="border-t border-white/10" />
                                    <GalleryManager
                                        images={selectedService.gallery || []}
                                        onChange={imgs => setSelectedService(p => ({ ...p, gallery: imgs }))}
                                        disabled={saving}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </AdminModal>
        </div>
    );
}
