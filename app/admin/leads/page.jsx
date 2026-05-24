'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Search, Eye, X, ArrowUpRight, Send, Globe, Code2, DollarSign, Loader2, AlertCircle } from 'lucide-react';
import { api } from '@/lib/api';
import AdminModal from '@/components/AdminModal';

const STATUS_STYLES = {
    'New': 'bg-admin-accent/10 text-admin-accent border-admin-accent/20',
    'In Review': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    'Quote Sent': 'bg-brand-indigo/10 text-brand-indigo border-brand-indigo/20',
    'Converted': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
};
const PRIORITY_MAP = {
    'New': { dot: 'bg-admin-danger', priority: 'High' },
    'In Review': { dot: 'bg-yellow-400', priority: 'Medium' },
    'Quote Sent': { dot: 'bg-brand-indigo', priority: 'Medium' },
    'Converted': { dot: 'bg-text-dim', priority: 'Low' },
};

function timeAgo(dateStr) {
    const now = new Date();
    const past = new Date(dateStr);
    const diff = Math.floor((now - past) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return past.toLocaleDateString();
}

export default function LeadsPage() {
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('All');
    const [selected, setSelected] = useState(null);
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [converting, setConverting] = useState(false);

    useEffect(() => {
        fetchLeads();
    }, []);

    async function fetchLeads() {
        try {
            setLoading(true);
            const res = await api.getAdminLeads();
            const data = Array.isArray(res) ? res : res.results || [];
            setLeads(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleConvert(leadId) {
        try {
            setConverting(true);
            await api.convertLead(leadId);
            // Refresh leads list
            await fetchLeads();
            setSelected(null);
        } catch (err) {
            alert(err.message || 'Conversion failed');
        } finally {
            setConverting(false);
        }
    }

    async function handleStatusUpdate(leadId, newStatus) {
        try {
            await api.updateLeadStatus(leadId, newStatus);
            await fetchLeads();
        } catch (err) {
            alert(err.message || 'Status update failed');
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 size={24} className="animate-spin text-admin-accent" />
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

    const filtered = leads.filter(l =>
        (filter === 'All' || l.status === filter) &&
        [l.client_name, l.title, l.client_email].some(s => (s || '').toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <p className="text-xs font-black text-admin-accent uppercase tracking-[0.3em] mb-1">Admin / Leads</p>
                    <h1 className="text-2xl font-black text-text-primary uppercase tracking-tight">Lead Management</h1>
                    <p className="text-text-muted text-sm mt-1">Triage incoming Mission Briefings and convert to active projects.</p>
                </div>
                <div className="flex items-center gap-2 bg-white/5 border border-white/5 rounded-xl px-3 py-1.5 w-56">
                    <Search size={12} className="text-text-muted shrink-0" />
                    <input type="text" placeholder="Search leads..." value={search} onChange={e => setSearch(e.target.value)}
                        className="bg-transparent border-none outline-none text-xs text-text-primary placeholder:text-text-dim w-full font-bold" />
                </div>
            </motion.div>

            <div className="flex gap-1.5 flex-wrap">
                {['All', 'New', 'In Review', 'Quote Sent', 'Converted'].map(s => (
                    <button key={s} onClick={() => setFilter(s)}
                        className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${filter === s ? 'bg-admin-accent/10 text-admin-accent border border-admin-accent/20' : 'bg-white/5 text-text-muted border border-white/5 hover:text-text-primary'}`}>
                        {s}
                    </button>
                ))}
            </div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
                className="rounded-2xl bg-white/[0.02] border border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[680px]">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/[0.02]">
                                {['Lead', 'Type', 'Budget', 'Submitted', 'Status', ''].map(h => (
                                    <th key={h} className="px-4 py-2.5 text-[9px] font-black uppercase tracking-[0.25em] text-text-muted">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-4 py-12 text-center text-sm font-bold text-text-muted">
                                        No leads found.
                                    </td>
                                </tr>
                            )}
                            {filtered.map((lead, i) => {
                                const meta = PRIORITY_MAP[lead.status] || { dot: 'bg-text-dim', priority: 'Low' };
                                return (
                                    <motion.tr key={lead.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                                        className="hover:bg-white/[0.02] transition-all group">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${meta.dot}`} />
                                                <span className="text-[10px] font-black text-text-muted uppercase">{lead.id}</span>
                                            </div>
                                            <div className="font-black text-text-primary text-sm group-hover:text-admin-accent transition-colors">{lead.client_name}</div>
                                            <div className="text-[11px] text-text-muted font-bold">{lead.client_email}</div>
                                        </td>
                                        <td className="px-4 py-3 text-[11px] font-black text-text-muted uppercase">{lead.title}</td>
                                        <td className="px-4 py-3 text-sm font-black text-admin-accent">{lead.estimated_budget || '—'}</td>
                                        <td className="px-4 py-3 text-[11px] text-text-muted font-bold">{timeAgo(lead.created_at)}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${STATUS_STYLES[lead.status] || 'bg-white/5 text-text-muted border-white/5'}`}>{lead.status}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <button onClick={() => setSelected(lead)}
                                                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-admin-accent/10 hover:bg-admin-accent text-admin-accent hover:text-text-primary text-[10px] font-black uppercase tracking-widest transition-all">
                                                <Eye size={10} /> View
                                            </button>
                                        </td>
                                    </motion.tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </motion.div>

            <AnimatePresence>
                {selected && (
                    <AdminModal
                        open
                        onClose={() => setSelected(null)}
                        title={selected.title}
                        subtitle={`${selected.id} • ${selected.client_name || '—'}`}
                        maxWidthClass="max-w-3xl"
                        footer={
                            <>
                                {selected.status !== 'Converted' && (
                                    <button
                                        onClick={() => handleConvert(selected.id)}
                                        disabled={converting}
                                        className="w-full py-2.5 bg-admin-accent text-text-primary rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all shadow-glow-teal disabled:opacity-50">
                                        {converting ? (
                                            <><Loader2 size={14} className="animate-spin" /> Converting...</>
                                        ) : (
                                            <><ArrowUpRight size={14} /> Convert to Project</>
                                        )}
                                    </button>
                                )}
                                {selected.status === 'Converted' && (
                                    <div className="w-full py-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 border border-emerald-500/20">
                                        <ArrowUpRight size={14} /> Already Converted
                                    </div>
                                )}
                            </>
                        }
                    >
                        <div className="p-5 space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    {[['Client', selected.client_name], ['Email', selected.client_email], ['Budget', selected.estimated_budget || '—'], ['Status', selected.status]].map(([label, value]) => (
                                        <div key={label} className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                                            <div className="text-[9px] font-black text-text-muted uppercase tracking-widest mb-1">{label}</div>
                                            <div className="text-sm font-bold text-text-primary break-all">{value}</div>
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <div className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">Project Brief</div>
                                    <p className="text-base text-text-secondary leading-relaxed italic">&ldquo;{selected.description}&rdquo;</p>
                                </div>

                                {/* Status quick-actions */}
                                {selected.status !== 'Converted' && (
                                    <div>
                                        <div className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">Update Status</div>
                                        <div className="flex gap-1.5 flex-wrap">
                                            {['New', 'In Review', 'Quote Sent'].filter(s => s !== selected.status).map(s => (
                                                <button key={s} onClick={() => { handleStatusUpdate(selected.id, s); setSelected({ ...selected, status: s }); }}
                                                    className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all ${STATUS_STYLES[s]}`}>
                                                    {s}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                        </div>
                    </AdminModal>
                )}
            </AnimatePresence>
        </div>
    );
}
