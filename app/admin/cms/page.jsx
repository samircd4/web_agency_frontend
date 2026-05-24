'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileEdit, Plus, Trash2, X, Save,
    Tag, Calendar, BookOpen, Briefcase, ToggleLeft, ToggleRight, Loader2, AlertCircle
} from 'lucide-react';
import { api } from '@/lib/api';
import AdminModal from '@/components/AdminModal';

function ContentTable({ items, tab, onEdit, onDelete, onToggle }) {
    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        try {
            return new Date(dateStr).toLocaleDateString(undefined, {
                month: 'short',
                year: 'numeric'
            });
        } catch (e) {
            return dateStr;
        }
    };

    return (
        <div className="rounded-2xl bg-white/[0.02] border border-white/5 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[560px]">
                    <thead>
                        <tr className="border-b border-white/5 bg-white/[0.02]">
                            {['ID / Title', 'Tags', 'Date', 'Published', ''].map(h => (
                                <th key={h} className="px-4 py-3 text-[9px] font-black uppercase tracking-[0.25em] text-text-muted">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {items.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-4 py-8 text-center text-text-dim text-xs">
                                    No records found in this repository.
                                </td>
                            </tr>
                        ) : (
                            items.map((item, i) => (
                                <motion.tr key={item.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                                    className="hover:bg-white/[0.02] transition-all group">
                                    <td className="px-4 py-3">
                                        <div className="text-[10px] font-black text-text-dim uppercase mb-0.5">{item.id}</div>
                                        <div className="text-sm font-black text-text-primary group-hover:text-brand-teal transition-colors leading-tight max-w-xs">{item.title}</div>
                                        {item.slug && <div className="text-[9px] text-text-muted font-mono mt-0.5">/{item.slug}</div>}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex flex-wrap gap-1">
                                            {item.tags?.map(t => {
                                                const tagName = typeof t === 'string' ? t : (t?.name || '');
                                                return (
                                                    <span key={tagName} className="px-1.5 py-0.5 rounded-md bg-white/5 text-[9px] font-black text-text-muted uppercase tracking-widest">{tagName}</span>
                                                );
                                            })}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-[11px] text-text-muted font-bold">
                                        {formatDate(item.published_at || item.created_at)}
                                    </td>
                                    <td className="px-4 py-3">
                                        {tab === 'journal' ? (
                                            <button onClick={() => onToggle(item)}
                                                className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest transition-all ${item.published ? 'text-emerald-400' : 'text-text-muted'}`}>
                                                {item.published ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                                                {item.published ? 'Live' : 'Draft'}
                                            </button>
                                        ) : (
                                            <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-400">
                                                <ToggleRight size={16} className="text-emerald-400" /> Live
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1.5">
                                            <button onClick={() => onEdit(item)}
                                                className="p-1.5 rounded-lg bg-brand-teal/10 text-brand-teal hover:bg-brand-teal hover:text-text-primary transition-all">
                                                <FileEdit size={12} />
                                            </button>
                                            <button onClick={() => onDelete(item.id)}
                                                className="p-1.5 rounded-lg bg-brand-red/10 text-brand-red hover:bg-brand-red hover:text-text-primary transition-all">
                                                <Trash2 size={12} />
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
    );
}

export default function CMSPage() {
    const [tab, setTab] = useState('portfolio');
    const [portfolio, setPortfolio] = useState([]);
    const [journal, setJournal] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [editor, setEditor] = useState(null); // null = closed, object = open

    const loadContent = async () => {
        try {
            const [pItems, bItems] = await Promise.all([
                api.getAdminPortfolioItems(),
                api.getAdminBlogPosts()
            ]);
            setPortfolio(pItems);
            setJournal(bItems);
        } catch (err) {
            console.error('Failed to load CMS content:', err);
            setError('Could not retrieve CMS records. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadContent();
    }, []);

    const items = tab === 'portfolio' ? portfolio : journal;

    const handleToggle = async (item) => {
        if (tab !== 'journal') return;
        try {
            await api.updateAdminBlogPost(item.id, { published: !item.published });
            loadContent();
        } catch (err) {
            alert('Failed to update published status: ' + err.message);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this content item?')) return;
        try {
            if (tab === 'portfolio') {
                await api.deleteAdminPortfolioItem(id);
            } else {
                await api.deleteAdminBlogPost(id);
            }
            loadContent();
        } catch (err) {
            alert('Failed to delete content: ' + err.message);
        }
    };

    const handleEdit = (item) => {
        const tagNames = item.tags?.map(t => typeof t === 'string' ? t : (t?.name || '')) || [];
        setEditor({
            ...item,
            tagsStr: tagNames.join(', '),
            body: item.content_markdown || '',
            description: item.description || '',
            cover_image_url: item.cover_image_url || '',
            slug: item.slug || '',
            isNew: false
        });
        setError('');
    };

    const handleNew = () => {
        setEditor({
            id: 'NEW-ENTRY',
            title: '',
            slug: '',
            tagsStr: '',
            body: '',
            description: '',
            cover_image_url: '',
            published: false,
            isNew: true
        });
        setError('');
    };

    // Auto-generate slug from title
    const handleTitleChange = (val) => {
        setEditor(p => {
            const updated = { ...p, title: val };
            if (p.isNew) {
                updated.slug = val.toLowerCase()
                    .replace(/[^a-z0-9\s-]/g, '') // remove special chars
                    .replace(/\s+/g, '-')         // spaces to hyphens
                    .replace(/-+/g, '-')          // dedup hyphens
                    .trim();
            }
            return updated;
        });
    };

    const handleSave = async () => {
        if (!editor.title || !editor.slug || !editor.body) {
            setError('Title, slug, and markdown content are required.');
            return;
        }

        setSaving(true);
        setError('');

        try {
            // 1. Process tags
            const enteredTagNames = editor.tagsStr
                .split(',')
                .map(t => t.trim())
                .filter(Boolean);

            // 2. Fetch existing tags
            const existingTags = await api.getAdminTags();
            const existingTagNamesLower = existingTags.map(t => t.name.toLowerCase());

            // 3. Create missing tags
            const finalTags = [];
            for (const name of enteredTagNames) {
                const index = existingTagNamesLower.indexOf(name.toLowerCase());
                if (index === -1) {
                    const newTag = await api.createAdminTag(name);
                    finalTags.push(newTag.name);
                } else {
                    finalTags.push(existingTags[index].name);
                }
            }

            // 4. Build payload
            const payload = {
                title: editor.title,
                slug: editor.slug,
                content_markdown: editor.body,
                tags: finalTags,
            };

            if (tab === 'portfolio') {
                payload.description = editor.description;
                payload.cover_image_url = editor.cover_image_url;

                if (editor.isNew) {
                    await api.createAdminPortfolioItem(payload);
                } else {
                    await api.updateAdminPortfolioItem(editor.id, payload);
                }
            } else {
                payload.published = editor.published;

                if (editor.isNew) {
                    await api.createAdminBlogPost(payload);
                } else {
                    await api.updateAdminBlogPost(editor.id, payload);
                }
            }

            // Reload and close
            await loadContent();
            setEditor(null);
        } catch (err) {
            console.error(err);
            setError(err.message || 'Failed to save item. Check slug uniqueness or fields.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 size={32} className="animate-spin text-brand-teal" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Loading CMS Engine...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <p className="text-xs font-black text-brand-teal uppercase tracking-[0.3em] mb-1">Admin / CMS</p>
                    <h1 className="text-2xl font-black text-text-primary uppercase tracking-tight">Content Management</h1>
                    <p className="text-text-muted text-sm mt-1">Manage Portfolio case studies and Journal blog posts.</p>
                </div>
                <button onClick={handleNew}
                    className="flex items-center gap-2 px-3 py-2 bg-brand-teal text-text-primary rounded-xl font-black uppercase tracking-widest text-xs shadow-glow-teal hover:-translate-y-0.5 transition-all">
                    <Plus size={14} /> New {tab === 'portfolio' ? 'Case Study' : 'Post'}
                </button>
            </motion.div>

            {/* Tab switcher */}
            <div className="flex gap-1.5">
                <button onClick={() => { setTab('portfolio'); setError(''); }}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${tab === 'portfolio' ? 'bg-brand-teal/10 text-brand-teal border border-brand-teal/20' : 'bg-white/5 text-text-muted border border-white/5 hover:text-text-primary'}`}>
                    <Briefcase size={12} /> Portfolio
                </button>
                <button onClick={() => { setTab('journal'); setError(''); }}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${tab === 'journal' ? 'bg-brand-teal/10 text-brand-teal border border-brand-teal/20' : 'bg-white/5 text-text-muted border border-white/5 hover:text-text-primary'}`}>
                    <BookOpen size={12} /> Journal
                </button>
            </div>

            <motion.div key={tab} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}>
                <ContentTable items={items} tab={tab} onEdit={handleEdit} onDelete={handleDelete} onToggle={handleToggle} />
            </motion.div>

            {/* Editor Drawer */}
            <AnimatePresence>
                {editor && (
                    <AdminModal
                        open
                        onClose={() => { if (!saving) setEditor(null); }}
                        title={editor.isNew ? `New ${tab === 'portfolio' ? 'Case Study' : 'Post'}` : 'Edit Entry'}
                        subtitle={editor.isNew ? 'New Entry' : editor.id}
                        maxWidthClass="max-w-4xl"
                        footer={
                            <button onClick={handleSave} disabled={saving}
                                className="w-full py-2.5 bg-brand-teal text-text-primary rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all shadow-glow-teal disabled:opacity-50 disabled:cursor-not-allowed">
                                {saving ? (
                                    <>
                                        <Loader2 size={14} className="animate-spin" /> Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save size={14} /> Save Entry
                                    </>
                                )}
                            </button>
                        }
                    >
                        <div className="p-5 space-y-4">
                                {error && (
                                    <div className="flex items-center gap-2 p-3 rounded-xl bg-brand-red/10 border border-brand-red/20 text-brand-red text-xs">
                                        <AlertCircle size={14} className="shrink-0" />
                                        {error}
                                    </div>
                                )}

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Title</label>
                                    <input type="text" value={editor.title} onChange={e => handleTitleChange(e.target.value)}
                                        placeholder="Enter title..." disabled={saving}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-dim focus:outline-none focus:border-brand-teal/50 transition-all" />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Slug</label>
                                    <input type="text" value={editor.slug} onChange={e => setEditor(p => ({ ...p, slug: e.target.value }))}
                                        placeholder="e.g. enterprise-sync-service" disabled={saving}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-dim focus:outline-none focus:border-brand-teal/50 transition-all font-mono" />
                                </div>

                                {tab === 'portfolio' && (
                                    <>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Cover Image URL</label>
                                            <input type="text" value={editor.cover_image_url} onChange={e => setEditor(p => ({ ...p, cover_image_url: e.target.value }))}
                                                placeholder="https://images.unsplash.com/photo-..." disabled={saving}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-dim focus:outline-none focus:border-brand-teal/50 transition-all" />
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Short Description</label>
                                            <textarea value={editor.description} onChange={e => setEditor(p => ({ ...p, description: e.target.value }))}
                                                placeholder="Brief introduction displayed in cards..." disabled={saving} rows={3}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-dim focus:outline-none focus:border-brand-teal/50 transition-all resize-none" />
                                        </div>
                                    </>
                                )}

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1 flex items-center gap-1.5">
                                        <Tag size={10} /> Tags (comma-separated)
                                    </label>
                                    <input type="text" value={editor.tagsStr} onChange={e => setEditor(p => ({ ...p, tagsStr: e.target.value }))}
                                        placeholder="Python, Django, React..." disabled={saving}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-dim focus:outline-none focus:border-brand-teal/50 transition-all" />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Content (Markdown)</label>
                                    <textarea value={editor.body} onChange={e => setEditor(p => ({ ...p, body: e.target.value }))}
                                        placeholder="Write case study or blog article in Markdown..." disabled={saving}
                                        rows={12}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-dim focus:outline-none focus:border-brand-teal/50 transition-all font-mono resize-none" />
                                </div>

                                {tab === 'journal' && (
                                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                                        <div>
                                            <div className="text-xs font-black text-text-primary">Publish Status</div>
                                            <div className="text-[11px] text-text-muted">{editor.published ? 'Live on public blog' : 'Draft / Hidden'}</div>
                                        </div>
                                        <button onClick={() => { if (!saving) setEditor(p => ({ ...p, published: !p.published })); }}>
                                            {editor.published
                                                ? <ToggleRight size={28} className="text-emerald-400" />
                                                : <ToggleLeft size={28} className="text-text-muted" />}
                                        </button>
                                    </div>
                                )}
                        </div>
                    </AdminModal>
                )}
            </AnimatePresence>
        </div>
    );
}
