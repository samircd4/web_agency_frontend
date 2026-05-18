'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Search, Eye, X, ArrowUpRight, Send, Globe, Code2, DollarSign } from 'lucide-react';

const LEADS = [
    { id: 'LDR-0014', name: 'Tariq Hassan', company: 'DataSync Corp', email: 'tariq@datasync.io', project: 'Real-estate Data Extraction Engine', type: 'Web Scraping', budget: '$2,500–$4,000', submitted: '2 hours ago', status: 'New', priority: 'High', description: 'Need a distributed scraping solution for Zillow, Redfin, and Realtor.com across 3 regions. Must handle anti-bot and captchas.', tech: ['Python', 'Playwright', 'Residential Proxies'] },
    { id: 'LDR-0013', name: 'Amelia Carter', company: 'NexaRetail', email: 'amelia@nexaretail.com', project: 'Shopify ↔ ERP Middleware', type: 'Backend API', budget: '$800–$1,200', submitted: '1 day ago', status: 'In Review', priority: 'Medium', description: 'Custom middleware to sync Shopify inventory with an internal ERP system via webhook. 50k+ SKU batch support.', tech: ['Django', 'Celery', 'Shopify API'] },
    { id: 'LDR-0012', name: 'Rafael Ortega', company: 'Ortega Imports LLC', email: 'r.ortega@imports.mx', project: 'Full E-commerce Platform Build', type: 'E-commerce', budget: '$5,000+', submitted: '3 days ago', status: 'Quote Sent', priority: 'High', description: 'Complete Django e-commerce with custom checkout, product variants, multi-currency, and bilingual support.', tech: ['Django', 'PostgreSQL', 'Stripe', 'React'] },
    { id: 'LDR-0011', name: 'Sophie Müller', company: 'Apex Analytics', email: 'sophie@apex.de', project: 'LinkedIn Lead Scraper', type: 'Automation', budget: '$1,500', submitted: '5 days ago', status: 'Converted', priority: 'Low', description: 'LinkedIn Sales Navigator automated lead extraction into a Google Sheet / CRM pipeline.', tech: ['Python', 'Selenium', 'Google Sheets API'] },
];

const STATUS_STYLES = {
    'New': 'bg-brand-teal/10 text-brand-teal border-brand-teal/20',
    'In Review': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    'Quote Sent': 'bg-brand-indigo/10 text-brand-indigo border-brand-indigo/20',
    'Converted': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
};
const PRIORITY_DOT = { 'High': 'bg-brand-red', 'Medium': 'bg-yellow-400', 'Low': 'bg-slate-600' };

export default function LeadsPage() {
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('All');
    const [selected, setSelected] = useState(null);

    const filtered = LEADS.filter(l =>
        (filter === 'All' || l.status === filter) &&
        [l.name, l.project, l.company].some(s => s.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <p className="text-[9px] font-black text-brand-teal uppercase tracking-[0.3em] mb-1">Admin / Leads</p>
                    <h1 className="text-2xl font-black text-white uppercase tracking-tight">Lead Management</h1>
                    <p className="text-slate-500 text-xs mt-1">Triage incoming Mission Briefings and convert to active projects.</p>
                </div>
                <div className="flex items-center gap-2 bg-white/5 border border-white/5 rounded-xl px-3.5 py-2 w-56">
                    <Search size={12} className="text-slate-600 shrink-0" />
                    <input type="text" placeholder="Search leads..." value={search} onChange={e => setSearch(e.target.value)}
                        className="bg-transparent border-none outline-none text-[10px] text-white placeholder:text-slate-700 w-full font-bold" />
                </div>
            </motion.div>

            <div className="flex gap-1.5 flex-wrap">
                {['All', 'New', 'In Review', 'Quote Sent', 'Converted'].map(s => (
                    <button key={s} onClick={() => setFilter(s)}
                        className={`px-3.5 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${filter === s ? 'bg-brand-teal/10 text-brand-teal border border-brand-teal/20' : 'bg-white/5 text-slate-500 border border-white/5 hover:text-white'}`}>
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
                                    <th key={h} className="px-5 py-3.5 text-[7px] font-black uppercase tracking-[0.25em] text-slate-600">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filtered.map((lead, i) => (
                                <motion.tr key={lead.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                                    className="hover:bg-white/[0.02] transition-all group">
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${PRIORITY_DOT[lead.priority]}`} />
                                            <span className="text-[9px] font-black text-slate-600 uppercase">{lead.id}</span>
                                        </div>
                                        <div className="font-black text-white text-xs group-hover:text-brand-teal transition-colors">{lead.name}</div>
                                        <div className="text-[9px] text-slate-600 font-bold">{lead.company}</div>
                                    </td>
                                    <td className="px-5 py-4 text-[9px] font-black text-slate-500 uppercase">{lead.type}</td>
                                    <td className="px-5 py-4 text-xs font-black text-brand-teal">{lead.budget}</td>
                                    <td className="px-5 py-4 text-[9px] text-slate-600 font-bold">{lead.submitted}</td>
                                    <td className="px-5 py-4">
                                        <span className={`px-2.5 py-1 rounded-lg text-[7px] font-black uppercase tracking-widest border ${STATUS_STYLES[lead.status]}`}>{lead.status}</span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <button onClick={() => setSelected(lead)}
                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-teal/10 hover:bg-brand-teal text-brand-teal hover:text-white text-[8px] font-black uppercase tracking-widest transition-all">
                                            <Eye size={10} /> View
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>

            <AnimatePresence>
                {selected && (
                    <div className="fixed inset-0 z-[200] flex justify-end">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setSelected(null)} className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" />
                        <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25 }}
                            className="relative w-full max-w-lg bg-slate-950 border-l border-white/10 flex flex-col h-full overflow-y-auto shadow-2xl">
                            <div className="p-6 border-b border-white/5 flex items-start justify-between sticky top-0 bg-slate-950 z-10">
                                <div>
                                    <div className="text-[8px] font-black text-brand-teal uppercase tracking-[0.3em] mb-1">{selected.id}</div>
                                    <h2 className="text-base font-black text-white uppercase leading-tight">{selected.project}</h2>
                                </div>
                                <button onClick={() => setSelected(null)} className="p-2 rounded-xl bg-white/5 text-slate-500 hover:text-white transition-all shrink-0">
                                    <X size={16} />
                                </button>
                            </div>
                            <div className="p-6 space-y-6 flex-grow">
                                <div className="grid grid-cols-2 gap-3">
                                    {[['Client', selected.name], ['Company', selected.company], ['Email', selected.email], ['Budget', selected.budget], ['Type', selected.type], ['Priority', selected.priority]].map(([label, value]) => (
                                        <div key={label} className="p-3 rounded-xl bg-white/5 border border-white/5">
                                            <div className="text-[7px] font-black text-slate-600 uppercase tracking-widest mb-1">{label}</div>
                                            <div className="text-xs font-bold text-white break-all">{value}</div>
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <div className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-2">Project Brief</div>
                                    <p className="text-sm text-slate-400 leading-relaxed italic">"{selected.description}"</p>
                                </div>
                                <div>
                                    <div className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-2">Tech Stack</div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {selected.tech.map(t => (
                                            <span key={t} className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 text-[8px] font-black text-white uppercase tracking-widest">{t}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 border-t border-white/5 space-y-2 sticky bottom-0 bg-slate-950">
                                <button className="w-full py-3 bg-brand-teal text-white rounded-xl font-black uppercase tracking-widest text-[9px] flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all shadow-glow-teal">
                                    <ArrowUpRight size={14} /> Convert to Project
                                </button>
                                <button className="w-full py-3 bg-white/5 border border-white/5 text-white rounded-xl font-black uppercase tracking-widest text-[9px] flex items-center justify-center gap-2 hover:bg-white/10 transition-all">
                                    <Send size={14} /> Send Quote
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
