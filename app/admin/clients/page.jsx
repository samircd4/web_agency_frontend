'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Search, X, Briefcase, DollarSign, Mail, Globe, ChevronRight, Loader2, AlertCircle } from 'lucide-react';
import { api } from '@/lib/api';
import AdminModal from '@/components/AdminModal';

export default function ClientsPage() {
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState(null);
    const [filter, setFilter] = useState('All');
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchClients() {
            try {
                setLoading(true);
                const res = await api.getAdminClients();
                const data = Array.isArray(res) ? res : res.results || [];
                setClients(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchClients();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 size={24} className="animate-spin text-brand-teal" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <AlertCircle size={24} className="text-admin-danger mx-auto mb-2" />
                    <p className="text-text-muted text-sm">{error}</p>
                </div>
            </div>
        );
    }

    // Determine status from LTV or active field — backend may not have status field,
    // so we treat all clients with non-zero LTV as Active
    const enrichedClients = clients.map(c => ({
        ...c,
        name: c.full_name || c.username || '—',
        company: c.company_name || '—',
        ltv: c.lifetime_value != null ? `$${Number(c.lifetime_value).toLocaleString()}` : '$0',
        status: Number(c.lifetime_value) > 0 ? 'Active' : 'Inactive',
        joined: c.joined_at ? new Date(c.joined_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '—',
    }));

    const filtered = enrichedClients.filter(c =>
        (filter === 'All' || c.status === filter) &&
        [c.name, c.company, c.email].some(s => (s || '').toLowerCase().includes(search.toLowerCase()))
    );

    const totalRevenue = enrichedClients.reduce((sum, c) => sum + (Number(c.lifetime_value) || 0), 0);
    const avgLtv = enrichedClients.length > 0 ? totalRevenue / enrichedClients.length : 0;

    return (
        <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <p className="text-[11px] font-black text-brand-teal uppercase tracking-[0.3em] mb-1">Admin / Clients</p>
                    <h1 className="text-2xl font-black text-text-primary uppercase tracking-tight">Client CRM</h1>
                    <p className="text-text-muted text-sm mt-1">Directory of all clients, their history, and lifetime value.</p>
                </div>
                <div className="flex items-center gap-2 bg-white/5 border border-white/5 rounded-xl px-3 py-1.5 w-56">
                    <Search size={12} className="text-text-muted shrink-0" />
                    <input type="text" placeholder="Search clients..." value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="bg-transparent border-none outline-none text-xs text-text-primary placeholder:text-text-dim w-full font-bold" />
                </div>
            </motion.div>

            {/* Summary stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                    { label: 'Total Clients', value: enrichedClients.length },
                    { label: 'Active', value: enrichedClients.filter(c => c.status === 'Active').length },
                    { label: 'Total Revenue', value: `$${(totalRevenue / 1000).toFixed(1)}K` },
                    { label: 'Avg. LTV', value: `$${(avgLtv / 1000).toFixed(1)}K` },
                ].map((s, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                        className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                        <div className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">{s.label}</div>
                        <div className="text-2xl font-black text-text-primary">{s.value}</div>
                    </motion.div>
                ))}
            </div>

            <div className="flex gap-1.5">
                {['All', 'Active', 'Inactive'].map(s => (
                    <button key={s} onClick={() => setFilter(s)}
                        className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${filter === s ? 'bg-brand-teal/10 text-brand-teal border border-brand-teal/20' : 'bg-white/5 text-text-muted border border-white/5 hover:text-text-primary'}`}>
                        {s}
                    </button>
                ))}
            </div>

            {/* Client Table */}
            <div className="w-full overflow-hidden rounded-2xl border border-white/5 bg-white/[0.01] backdrop-blur-xl">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/[0.02]">
                                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Client ID</th>
                                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Client Info</th>
                                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Status</th>
                                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Lifetime Value</th>
                                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Country</th>
                                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Joined</th>
                                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-4 py-12 text-center text-sm font-bold text-text-muted">
                                        No clients found matching the filters.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((c, i) => (
                                    <motion.tr
                                        key={c.id}
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        onClick={() => setSelected(c)}
                                        className="hover:bg-white/[0.02] cursor-pointer group transition-all"
                                    >
                                        <td className="px-4 py-3">
                                            <span className="text-xs font-mono font-black text-text-dim group-hover:text-brand-teal transition-colors">
                                                {c.id}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-teal/20 to-brand-indigo/20 border border-white/10 flex items-center justify-center font-black text-text-primary text-xs shrink-0">
                                                    {(c.name || '?').split(' ').map(n => n[0]).join('').slice(0, 2)}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-black text-text-primary group-hover:text-brand-teal transition-colors">{c.name}</div>
                                                    <div className="text-[11px] text-text-muted font-bold">{c.company}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg border ${c.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-white/5 text-text-muted border-white/5'}`}>
                                                {c.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-xs font-black text-text-primary">{c.ltv}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-xs font-bold text-text-secondary">{c.country || '—'}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-xs font-bold text-text-muted">{c.joined}</span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="p-1 rounded-lg hover:bg-white/5 text-text-muted group-hover:text-brand-teal transition-all inline-flex items-center">
                                                <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Detail Drawer */}
            <AnimatePresence>
                {selected && (
                    <AdminModal
                        open
                        onClose={() => setSelected(null)}
                        title={selected.name}
                        subtitle={selected.company}
                        maxWidthClass="max-w-3xl"
                        footer={
                            <div className="space-y-2">
                                <button className="w-full py-2.5 bg-brand-teal text-text-primary rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all shadow-glow-teal">
                                    <Mail size={14} /> Send Message
                                </button>
                                <button className="w-full py-2.5 bg-white/5 border border-white/5 text-text-primary rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-white/10 transition-all">
                                    <Briefcase size={14} /> View Projects
                                </button>
                            </div>
                        }
                    >
                        <div className="p-5 space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    {[['Client ID', selected.id], ['Email', selected.email], ['Country', selected.country || '—'], ['Member Since', selected.joined], ['Lifetime Value', selected.ltv]].map(([l, v]) => (
                                        <div key={l} className="p-2.5 rounded-xl bg-white/5 border border-white/5 col-span-1">
                                            <div className="text-[9px] font-black text-text-muted uppercase tracking-widest mb-1">{l}</div>
                                            <div className="text-sm font-bold text-text-primary break-all">{v}</div>
                                        </div>
                                    ))}
                                </div>
                        </div>
                    </AdminModal>
                )}
            </AnimatePresence>
        </div>
    );
}
