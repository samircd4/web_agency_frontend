'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Layers, Plus, Trash2, X, Save,
    Star, Eye, CheckCircle2, AlertCircle, Loader2, DollarSign
} from 'lucide-react';
import { api } from '@/lib/api';
import AdminModal from '@/components/AdminModal';

export default function AdminServicesPage() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedService, setSelectedService] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);

    const loadServices = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await api.getAdminServices();
            setServices(Array.isArray(data) ? data : data.results || []);
        } catch (err) {
            console.error("Failed to load admin services:", err);
            setError("Failed to fetch services from backend API.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadServices();
    }, []);

    const handleCreateNew = () => {
        setSelectedService({
            title: '',
            category_name: 'Development',
            description: '',
            about_service: '',
            delivery_time: 'Up to 3 days',
            is_published: true,
            is_featured: false,
            cover_image_url: '',
            tiers: {
                basic: { name: 'Basic Pack', price: 150, description: 'Core features' },
                standard: { name: 'Standard Pack', price: 300, description: 'Advanced features' },
                premium: { name: 'Enterprise Pack', price: 600, description: 'Full solution' }
            }
        });
        setIsEditModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (selectedService.id) {
                await api.updateAdminService(selectedService.id, selectedService);
            } else {
                await api.createAdminService(selectedService);
            }
            setIsEditModalOpen(false);
            await loadServices();
        } catch (err) {
            console.error("Failed to save service:", err);
            alert(err.message || "Error saving service");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this service?")) return;
        try {
            await api.deleteAdminService(id);
            await loadServices();
        } catch (err) {
            alert(err.message || "Failed to delete service");
        }
    };

    const toggleStatus = async (service) => {
        try {
            await api.updateAdminService(service.id, { is_published: !service.is_published });
            await loadServices();
        } catch (err) {
            alert("Failed to toggle status");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/[0.02] p-6 rounded-2xl border border-white/5">
                <div>
                    <div className="flex items-center gap-2 text-brand-teal text-xs font-black uppercase tracking-widest mb-1">
                        <Layers size={14} /> Service Management
                    </div>
                    <h1 className="text-2xl font-black text-white tracking-tight">Capabilities & Service Catalog</h1>
                    <p className="text-xs text-slate-400 mt-1">Manage active engineering packs, pricing tiers, and public offerings.</p>
                </div>
                <button
                    onClick={handleCreateNew}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-teal text-slate-950 font-black text-xs uppercase tracking-widest rounded-xl hover:bg-brand-teal/90 transition-all shadow-glow-teal"
                >
                    <Plus size={16} /> New Service
                </button>
            </div>

            {error && (
                <div className="p-4 rounded-xl bg-brand-red/10 border border-brand-red/20 text-brand-red text-xs font-bold flex items-center gap-2">
                    <AlertCircle size={16} /> {error}
                </div>
            )}

            {loading ? (
                <div className="flex flex-col items-center justify-center py-24 text-slate-500 gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-brand-teal" />
                    <span className="text-xs font-black uppercase tracking-widest">Loading Service Repository...</span>
                </div>
            ) : (
                <div className="rounded-2xl bg-white/[0.02] border border-white/5 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[700px]">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/[0.02]">
                                    {['Service Details', 'Category', 'Rating', 'Delivery', 'Status', 'Actions'].map(h => (
                                        <th key={h} className="px-4 py-3.5 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {services.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-4 py-12 text-center text-slate-500 text-xs uppercase tracking-widest font-bold">
                                            No services found in database.
                                        </td>
                                    </tr>
                                ) : (
                                    services.map((svc, i) => (
                                        <motion.tr key={svc.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="hover:bg-white/[0.02] transition-colors">
                                            <td className="px-4 py-4">
                                                <div className="text-[10px] font-black text-brand-teal uppercase mb-1">{svc.id}</div>
                                                <div className="text-sm font-black text-white hover:text-brand-teal transition-colors">{svc.title}</div>
                                                <div className="text-xs text-slate-400 line-clamp-1 mt-0.5">{svc.description}</div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-slate-300">
                                                    {svc.category || svc.category_name}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-1 text-xs font-bold text-white">
                                                    <Star size={12} className="text-brand-teal fill-brand-teal" />
                                                    {svc.rating} <span className="text-slate-500 text-[10px]">({svc.reviews_count || svc.reviews || 0})</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-xs font-bold text-slate-300">
                                                {svc.delivery || svc.delivery_time}
                                            </td>
                                            <td className="px-4 py-4">
                                                <button
                                                    onClick={() => toggleStatus(svc)}
                                                    className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${svc.is_published ? 'bg-brand-teal/10 text-brand-teal border border-brand-teal/20' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}
                                                >
                                                    {svc.is_published ? 'Published' : 'Draft'}
                                                </button>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => { setSelectedService(svc); setIsEditModalOpen(true); }}
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
            <AdminModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
                {selectedService && (
                    <form onSubmit={handleSave} className="space-y-4">
                        <div className="flex items-center justify-between pb-4 border-b border-white/10">
                            <h2 className="text-xl font-black text-white uppercase tracking-tight">
                                {selectedService.id ? `Edit Service: ${selectedService.id}` : 'Create New Service'}
                            </h2>
                            <button type="button" onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-white">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Service Title</label>
                                <input
                                    type="text"
                                    value={selectedService.title || ''}
                                    onChange={(e) => setSelectedService({ ...selectedService, title: e.target.value })}
                                    required
                                    className="w-full mt-1 p-3 bg-surface-900 border border-white/10 rounded-xl text-white text-sm focus:border-brand-teal outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Category Name</label>
                                    <input
                                        type="text"
                                        value={selectedService.category_name || selectedService.category || ''}
                                        onChange={(e) => setSelectedService({ ...selectedService, category_name: e.target.value })}
                                        className="w-full mt-1 p-3 bg-surface-900 border border-white/10 rounded-xl text-white text-sm focus:border-brand-teal outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Delivery Time</label>
                                    <input
                                        type="text"
                                        value={selectedService.delivery_time || selectedService.delivery || ''}
                                        onChange={(e) => setSelectedService({ ...selectedService, delivery_time: e.target.value, delivery: e.target.value })}
                                        className="w-full mt-1 p-3 bg-surface-900 border border-white/10 rounded-xl text-white text-sm focus:border-brand-teal outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Short Summary</label>
                                <textarea
                                    rows="2"
                                    value={selectedService.description || ''}
                                    onChange={(e) => setSelectedService({ ...selectedService, description: e.target.value })}
                                    className="w-full mt-1 p-3 bg-surface-900 border border-white/10 rounded-xl text-white text-sm focus:border-brand-teal outline-none"
                                />
                            </div>

                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Long Description (Markdown)</label>
                                <textarea
                                    rows="4"
                                    value={selectedService.long_description || selectedService.longDescription || ''}
                                    onChange={(e) => setSelectedService({ ...selectedService, long_description: e.target.value })}
                                    className="w-full mt-1 p-3 bg-surface-900 border border-white/10 rounded-xl text-white text-sm focus:border-brand-teal outline-none font-mono"
                                />
                            </div>

                            <div className="flex items-center gap-6 pt-2">
                                <label className="flex items-center gap-2 text-xs font-bold text-white cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedService.is_published ?? true}
                                        onChange={(e) => setSelectedService({ ...selectedService, is_published: e.target.checked })}
                                        className="w-4 h-4 accent-brand-teal"
                                    />
                                    Is Published
                                </label>
                                <label className="flex items-center gap-2 text-xs font-bold text-white cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedService.is_featured ?? false}
                                        onChange={(e) => setSelectedService({ ...selectedService, is_featured: e.target.checked })}
                                        className="w-4 h-4 accent-brand-teal"
                                    />
                                    Is Featured
                                </label>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                            <button
                                type="button"
                                onClick={() => setIsEditModalOpen(false)}
                                className="px-4 py-2 rounded-xl glass text-xs font-bold text-slate-400 hover:text-white"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex items-center gap-2 px-6 py-2 bg-brand-teal text-slate-950 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-brand-teal/90 transition-all shadow-glow-teal disabled:opacity-50"
                            >
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save size={16} />}
                                Save Service
                            </button>
                        </div>
                    </form>
                )}
            </AdminModal>
        </div>
    );
}
