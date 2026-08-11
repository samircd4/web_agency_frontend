'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Store, Star, Trash2, Edit3, Clock, CheckCircle2 } from 'lucide-react';
import { api } from '@/lib/api';

export default function SellerServicesTab() {
    const router = useRouter();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadServices = async () => {
        setLoading(true);
        try {
            const data = await api.getSellerServices();
            setServices(data.results || data || []);
        } catch (err) {
            console.error("Failed to load seller services:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadServices();
    }, []);

    const handleDeleteService = async (id) => {
        if (!confirm("Are you sure you want to delete this service listing?")) return;
        try {
            await api.deleteSellerService(id);
            setServices(prev => prev.filter(s => s.id !== id));
        } catch (err) {
            console.error("Failed to delete service:", err);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-purple-950/20 border border-purple-500/20 backdrop-blur-xl">
                <div>
                    <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                        <Store className="text-purple-400" size={24} /> My Services Catalog
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">Manage and publish your specialized technical offerings to the marketplace.</p>
                </div>
                <button
                    onClick={() => router.push('/dashboard/services/new')}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-purple-600/30 cursor-pointer"
                >
                    <Plus size={16} /> + Create New Service
                </button>
            </div>

            {/* Service Cards Grid */}
            {loading ? (
                <div className="p-8 text-center text-slate-500 text-xs font-bold uppercase tracking-widest">Loading services...</div>
            ) : services.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-slate-900/50 border border-white/5 space-y-3">
                    <Store size={36} className="mx-auto text-purple-400/50" />
                    <div className="text-sm font-bold text-white">No services published yet</div>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">Create your first service listing to start offering web scraping, API development, or automation services to clients.</p>
                    <button
                        onClick={() => router.push('/dashboard/services/new')}
                        className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold cursor-pointer hover:bg-purple-500 transition-all"
                    >
                        Create First Service
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((svc) => (
                        <div key={svc.id} className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 hover:border-purple-500/30 transition-all space-y-4 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between gap-2 mb-2">
                                    <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                        {svc.category || svc.category_name}
                                    </span>
                                    <div className="flex items-center gap-1 text-xs font-bold text-amber-400">
                                        <Star size={12} fill="currentColor" /> {svc.rating || 5.0} ({svc.reviews_count || 0})
                                    </div>
                                </div>

                                <h3 className="text-base font-black text-white leading-snug line-clamp-2">{svc.title}</h3>
                                <p className="text-xs text-slate-400 mt-2 line-clamp-3">{svc.description || svc.aboutService}</p>

                                <div className="flex items-center gap-3 mt-3 text-[10px] text-slate-500 font-bold">
                                    {svc.delivery_time && (
                                        <span className="flex items-center gap-1">
                                            <Clock size={10} /> {svc.delivery_time}
                                        </span>
                                    )}
                                    <span className={`flex items-center gap-1 ${svc.is_published ? 'text-emerald-400' : 'text-slate-500'}`}>
                                        <CheckCircle2 size={10} /> {svc.is_published ? 'Published' : 'Draft'}
                                    </span>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                                <div>
                                    <div className="text-[9px] font-bold text-slate-500 uppercase">Starting at</div>
                                    <div className="text-lg font-black text-white">${svc.price || svc.tiers?.basic?.price || 299}</div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => router.push(`/dashboard/services/${svc.id}/edit`)}
                                        className="p-2 rounded-lg bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition-all cursor-pointer"
                                        title="Edit Service"
                                    >
                                        <Edit3 size={14} />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteService(svc.id)}
                                        className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all cursor-pointer"
                                        title="Delete Service"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
