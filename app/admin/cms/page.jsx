'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileEdit, Plus, Eye, Trash2, X, Save, Image as ImageIcon,
    Tag, Calendar, BookOpen, Briefcase, ToggleLeft, ToggleRight
} from 'lucide-react';

const PORTFOLIO = [
    { id: 'PF-001', title: 'Real-estate Data Extraction Platform', tags: ['Python', 'Playwright', 'AWS'], published: true, date: 'Apr 2025' },
    { id: 'PF-002', title: 'Multi-vendor E-commerce Marketplace', tags: ['Django', 'React', 'Stripe'], published: true, date: 'Feb 2025' },
    { id: 'PF-003', title: 'Distributed Proxy Mesh Infrastructure', tags: ['Golang', 'Docker', 'K8s'], published: false, date: 'Jan 2025' },
];

const JOURNAL = [
    { id: 'JR-001', title: 'How We Bypassed Cloudflare on 50M+ Records', tags: ['Scraping', 'Anti-bot'], published: true, date: 'May 2025' },
    { id: 'JR-002', title: 'Django vs FastAPI: A Production Perspective', tags: ['Django', 'FastAPI'], published: true, date: 'Apr 2025' },
    { id: 'JR-003', title: 'Building a Real-time Inventory Sync with Celery', tags: ['Django', 'Celery'], published: false, date: 'Mar 2025' },
];

const EMPTY_POST = { title: '', tags: '', body: '', published: false };

function ContentTable({ items, onEdit, onDelete, onToggle }) {
    return (
        <div className="rounded-2xl bg-white/[0.02] border border-white/5 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[560px]">
                    <thead>
                        <tr className="border-b border-white/5 bg-white/[0.02]">
                            {['Title', 'Tags', 'Date', 'Published', ''].map(h => (
                                <th key={h} className="px-5 py-3.5 text-[7px] font-black uppercase tracking-[0.25em] text-slate-600">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {items.map((item, i) => (
                            <motion.tr key={item.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                                className="hover:bg-white/[0.02] transition-all group">
                                <td className="px-5 py-4">
                                    <div className="text-[8px] font-black text-slate-700 uppercase mb-0.5">{item.id}</div>
                                    <div className="text-xs font-black text-white group-hover:text-brand-teal transition-colors leading-tight max-w-xs">{item.title}</div>
                                </td>
                                <td className="px-5 py-4">
                                    <div className="flex flex-wrap gap-1">
                                        {item.tags.map(t => (
                                            <span key={t} className="px-1.5 py-0.5 rounded-md bg-white/5 text-[7px] font-black text-slate-500 uppercase tracking-widest">{t}</span>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-5 py-4 text-[9px] text-slate-600 font-bold">{item.date}</td>
                                <td className="px-5 py-4">
                                    <button onClick={() => onToggle(item.id)}
                                        className={`flex items-center gap-1.5 text-[8px] font-black uppercase tracking-widest transition-all ${item.published ? 'text-emerald-400' : 'text-slate-600'}`}>
                                        {item.published ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                                        {item.published ? 'Live' : 'Draft'}
                                    </button>
                                </td>
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-1.5">
                                        <button onClick={() => onEdit(item)}
                                            className="p-1.5 rounded-lg bg-brand-teal/10 text-brand-teal hover:bg-brand-teal hover:text-white transition-all">
                                            <FileEdit size={12} />
                                        </button>
                                        <button onClick={() => onDelete(item.id)}
                                            className="p-1.5 rounded-lg bg-brand-red/10 text-brand-red hover:bg-brand-red hover:text-white transition-all">
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default function CMSPage() {
    const [tab, setTab] = useState('portfolio');
    const [portfolio, setPortfolio] = useState(PORTFOLIO);
    const [journal, setJournal] = useState(JOURNAL);
    const [editor, setEditor] = useState(null); // null = closed, object = open

    const items = tab === 'portfolio' ? portfolio : journal;
    const setItems = tab === 'portfolio' ? setPortfolio : setJournal;

    const handleToggle = (id) => {
        setItems(prev => prev.map(it => it.id === id ? { ...it, published: !it.published } : it));
    };
    const handleDelete = (id) => {
        setItems(prev => prev.filter(it => it.id !== id));
    };
    const handleEdit = (item) => {
        setEditor({ ...item, tagsStr: item.tags.join(', '), body: item.body || '' });
    };
    const handleNew = () => {
        const prefix = tab === 'portfolio' ? 'PF' : 'JR';
        setEditor({ id: `${prefix}-NEW`, title: '', tagsStr: '', body: '', published: false, date: 'Now', isNew: true });
    };
    const handleSave = () => {
        const updatedTags = editor.tagsStr.split(',').map(t => t.trim()).filter(Boolean);
        const updatedItem = { ...editor, tags: updatedTags };
        delete updatedItem.tagsStr;
        delete updatedItem.isNew;
        if (editor.isNew) {
            setItems(prev => [{ ...updatedItem, id: `${tab === 'portfolio' ? 'PF' : 'JR'}-${String(prev.length + 1).padStart(3, '0')}` }, ...prev]);
        } else {
            setItems(prev => prev.map(it => it.id === editor.id ? updatedItem : it));
        }
        setEditor(null);
    };

    return (
        <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <p className="text-[9px] font-black text-brand-teal uppercase tracking-[0.3em] mb-1">Admin / CMS</p>
                    <h1 className="text-2xl font-black text-white uppercase tracking-tight">Content Management</h1>
                    <p className="text-slate-500 text-xs mt-1">Manage Portfolio case studies and Journal blog posts.</p>
                </div>
                <button onClick={handleNew}
                    className="flex items-center gap-2 px-4 py-2.5 bg-brand-teal text-white rounded-xl font-black uppercase tracking-widest text-[9px] shadow-glow-teal hover:-translate-y-0.5 transition-all">
                    <Plus size={14} /> New {tab === 'portfolio' ? 'Case Study' : 'Post'}
                </button>
            </motion.div>

            {/* Tab switcher */}
            <div className="flex gap-1.5">
                <button onClick={() => setTab('portfolio')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${tab === 'portfolio' ? 'bg-brand-teal/10 text-brand-teal border border-brand-teal/20' : 'bg-white/5 text-slate-500 border border-white/5 hover:text-white'}`}>
                    <Briefcase size={12} /> Portfolio
                </button>
                <button onClick={() => setTab('journal')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${tab === 'journal' ? 'bg-brand-teal/10 text-brand-teal border border-brand-teal/20' : 'bg-white/5 text-slate-500 border border-white/5 hover:text-white'}`}>
                    <BookOpen size={12} /> Journal
                </button>
            </div>

            <motion.div key={tab} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}>
                <ContentTable items={items} onEdit={handleEdit} onDelete={handleDelete} onToggle={handleToggle} />
            </motion.div>

            {/* Editor Drawer */}
            <AnimatePresence>
                {editor && (
                    <div className="fixed inset-0 z-[200] flex justify-end">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setEditor(null)} className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" />
                        <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25 }}
                            className="relative w-full max-w-lg bg-slate-950 border-l border-white/10 flex flex-col h-full shadow-2xl">
                            <div className="p-6 border-b border-white/5 flex items-center justify-between sticky top-0 bg-slate-950 z-10">
                                <div>
                                    <div className="text-[8px] font-black text-brand-teal uppercase tracking-[0.3em] mb-1">{editor.isNew ? 'New Entry' : editor.id}</div>
                                    <h2 className="text-base font-black text-white uppercase">{editor.isNew ? `New ${tab === 'portfolio' ? 'Case Study' : 'Post'}` : 'Edit Entry'}</h2>
                                </div>
                                <button onClick={() => setEditor(null)} className="p-2 rounded-xl bg-white/5 text-slate-500 hover:text-white transition-all">
                                    <X size={16} />
                                </button>
                            </div>

                            <div className="p-6 space-y-4 flex-grow overflow-y-auto">
                                <div className="space-y-1.5">
                                    <label className="text-[8px] font-black text-slate-600 uppercase tracking-widest ml-1">Title</label>
                                    <input type="text" value={editor.title} onChange={e => setEditor(p => ({ ...p, title: e.target.value }))}
                                        placeholder="Enter title..."
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-700 focus:outline-none focus:border-brand-teal/50 transition-all" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[8px] font-black text-slate-600 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                                        <Tag size={10} /> Tags (comma-separated)
                                    </label>
                                    <input type="text" value={editor.tagsStr} onChange={e => setEditor(p => ({ ...p, tagsStr: e.target.value }))}
                                        placeholder="Python, Django, Scraping..."
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-700 focus:outline-none focus:border-brand-teal/50 transition-all" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[8px] font-black text-slate-600 uppercase tracking-widest ml-1">Content (Markdown)</label>
                                    <textarea value={editor.body} onChange={e => setEditor(p => ({ ...p, body: e.target.value }))}
                                        placeholder="Write your content in Markdown..."
                                        rows={14}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-700 focus:outline-none focus:border-brand-teal/50 transition-all font-mono resize-none" />
                                </div>
                                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                                    <div>
                                        <div className="text-xs font-black text-white">Publish Status</div>
                                        <div className="text-[9px] text-slate-600">{editor.published ? 'Live on site' : 'Hidden (draft)'}</div>
                                    </div>
                                    <button onClick={() => setEditor(p => ({ ...p, published: !p.published }))}>
                                        {editor.published
                                            ? <ToggleRight size={28} className="text-emerald-400" />
                                            : <ToggleLeft size={28} className="text-slate-600" />}
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 border-t border-white/5 sticky bottom-0 bg-slate-950">
                                <button onClick={handleSave}
                                    className="w-full py-3 bg-brand-teal text-white rounded-xl font-black uppercase tracking-widest text-[9px] flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all shadow-glow-teal">
                                    <Save size={14} /> Save Entry
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
