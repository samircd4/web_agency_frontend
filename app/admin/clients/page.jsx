'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Search, X, Briefcase, DollarSign, Mail, Globe, ChevronRight } from 'lucide-react';

const CLIENTS = [
    { id: 'CLT-001', name: 'Tariq Hassan', company: 'DataSync Corp', email: 'tariq@datasync.io', country: 'UAE', ltv: '$7,200', projects: 3, status: 'Active', joined: 'Jan 2025', tags: ['Scraping', 'API'] },
    { id: 'CLT-002', name: 'Rafael Ortega', company: 'Ortega Imports LLC', email: 'r.ortega@imports.mx', country: 'Mexico', ltv: '$5,800', projects: 1, status: 'Active', joined: 'Mar 2025', tags: ['E-commerce'] },
    { id: 'CLT-003', name: 'Sophie Müller', company: 'Apex Analytics', email: 'sophie@apex.de', country: 'Germany', ltv: '$3,500', projects: 2, status: 'Inactive', joined: 'Nov 2024', tags: ['Automation', 'Scraping'] },
    { id: 'CLT-004', name: 'Amelia Carter', company: 'NexaRetail', email: 'amelia@nexaretail.com', country: 'UK', ltv: '$1,200', projects: 1, status: 'Active', joined: 'Apr 2025', tags: ['Backend'] },
    { id: 'CLT-005', name: 'Jin-ho Park', company: 'SeoulTech Labs', email: 'jinho@seoultech.kr', country: 'South Korea', ltv: '$9,400', projects: 4, status: 'Active', joined: 'Aug 2024', tags: ['Scraping', 'Infrastructure'] },
];

export default function ClientsPage() {
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState(null);
    const [filter, setFilter] = useState('All');

    const filtered = CLIENTS.filter(c =>
        (filter === 'All' || c.status === filter) &&
        [c.name, c.company, c.email].some(s => s.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <p className="text-[9px] font-black text-brand-teal uppercase tracking-[0.3em] mb-1">Admin / Clients</p>
                    <h1 className="text-2xl font-black text-white uppercase tracking-tight">Client CRM</h1>
                    <p className="text-slate-500 text-xs mt-1">Directory of all clients, their history, and lifetime value.</p>
                </div>
                <div className="flex items-center gap-2 bg-white/5 border border-white/5 rounded-xl px-3.5 py-2 w-56">
                    <Search size={12} className="text-slate-600 shrink-0" />
                    <input type="text" placeholder="Search clients..." value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="bg-transparent border-none outline-none text-[10px] text-white placeholder:text-slate-700 w-full font-bold" />
                </div>
            </motion.div>

            {/* Summary stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                    { label: 'Total Clients', value: CLIENTS.length },
                    { label: 'Active', value: CLIENTS.filter(c => c.status === 'Active').length },
                    { label: 'Total Revenue', value: '$27.1K' },
                    { label: 'Avg. LTV', value: '$5.4K' },
                ].map((s, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                        className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                        <div className="text-[7px] font-black text-slate-600 uppercase tracking-widest mb-1">{s.label}</div>
                        <div className="text-xl font-black text-white">{s.value}</div>
                    </motion.div>
                ))}
            </div>

            <div className="flex gap-1.5">
                {['All', 'Active', 'Inactive'].map(s => (
                    <button key={s} onClick={() => setFilter(s)}
                        className={`px-3.5 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${filter === s ? 'bg-brand-teal/10 text-brand-teal border border-brand-teal/20' : 'bg-white/5 text-slate-500 border border-white/5 hover:text-white'}`}>
                        {s}
                    </button>
                ))}
            </div>

            {/* Client cards */}
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((c, i) => (
                    <motion.div key={c.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                        className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all group cursor-pointer"
                        onClick={() => setSelected(c)}>
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-teal/20 to-brand-indigo/20 border border-white/10 flex items-center justify-center font-black text-white text-sm">
                                    {c.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                    <div className="text-xs font-black text-white group-hover:text-brand-teal transition-colors">{c.name}</div>
                                    <div className="text-[9px] text-slate-600 font-bold">{c.company}</div>
                                </div>
                            </div>
                            <span className={`text-[7px] font-black uppercase tracking-widest px-2 py-1 rounded-lg border ${c.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-white/5 text-slate-600 border-white/5'}`}>
                                {c.status}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mb-4">
                            {[['Projects', c.projects], ['LTV', c.ltv], ['Country', c.country], ['Joined', c.joined]].map(([l, v]) => (
                                <div key={l}>
                                    <div className="text-[7px] font-black text-slate-700 uppercase tracking-widest">{l}</div>
                                    <div className="text-[10px] font-black text-white">{v}</div>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-wrap gap-1">
                            {c.tags.map(t => (
                                <span key={t} className="px-2 py-0.5 rounded-md bg-brand-teal/5 border border-brand-teal/10 text-[7px] font-black text-brand-teal uppercase tracking-widest">{t}</span>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Detail Drawer */}
            <AnimatePresence>
                {selected && (
                    <div className="fixed inset-0 z-[200] flex justify-end">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setSelected(null)} className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" />
                        <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25 }}
                            className="relative w-full max-w-md bg-slate-950 border-l border-white/10 flex flex-col h-full overflow-y-auto shadow-2xl">
                            <div className="p-6 border-b border-white/5 flex items-start justify-between sticky top-0 bg-slate-950 z-10">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-teal/20 to-brand-indigo/20 border border-white/10 flex items-center justify-center font-black text-white text-sm">
                                        {selected.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div>
                                        <h2 className="text-base font-black text-white">{selected.name}</h2>
                                        <p className="text-[10px] text-slate-500">{selected.company}</p>
                                    </div>
                                </div>
                                <button onClick={() => setSelected(null)} className="p-2 rounded-xl bg-white/5 text-slate-500 hover:text-white transition-all shrink-0">
                                    <X size={16} />
                                </button>
                            </div>
                            <div className="p-6 space-y-5 flex-grow">
                                <div className="grid grid-cols-2 gap-3">
                                    {[['Client ID', selected.id], ['Email', selected.email], ['Country', selected.country], ['Member Since', selected.joined], ['Total Projects', selected.projects], ['Lifetime Value', selected.ltv]].map(([l, v]) => (
                                        <div key={l} className="p-3 rounded-xl bg-white/5 border border-white/5 col-span-1">
                                            <div className="text-[7px] font-black text-slate-600 uppercase tracking-widest mb-1">{l}</div>
                                            <div className="text-xs font-bold text-white break-all">{v}</div>
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <div className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-2">Service Tags</div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {selected.tags.map(t => (
                                            <span key={t} className="px-2.5 py-1 rounded-lg bg-brand-teal/5 border border-brand-teal/10 text-[8px] font-black text-brand-teal uppercase tracking-widest">{t}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 border-t border-white/5 space-y-2 sticky bottom-0 bg-slate-950">
                                <button className="w-full py-3 bg-brand-teal text-white rounded-xl font-black uppercase tracking-widest text-[9px] flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all shadow-glow-teal">
                                    <Mail size={14} /> Send Message
                                </button>
                                <button className="w-full py-3 bg-white/5 border border-white/5 text-white rounded-xl font-black uppercase tracking-widest text-[9px] flex items-center justify-center gap-2 hover:bg-white/10 transition-all">
                                    <Briefcase size={14} /> View Projects
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
