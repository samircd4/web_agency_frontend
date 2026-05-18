'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, X, Upload, CheckCircle2, Circle, ChevronRight,
    LayoutGrid, List, Plus, Edit3, Calendar, DollarSign, User
} from 'lucide-react';

const STAGES = ['Requirements', 'Architecture', 'Development', 'QA', 'Deployment', 'Complete'];

const STAGE_META = {
    'Requirements':  { color: 'text-yellow-400',  bg: 'bg-yellow-400/10',  border: 'border-yellow-400/20' },
    'Architecture':  { color: 'text-brand-indigo', bg: 'bg-brand-indigo/10', border: 'border-brand-indigo/20' },
    'Development':   { color: 'text-brand-teal',   bg: 'bg-brand-teal/10',  border: 'border-brand-teal/20' },
    'QA':            { color: 'text-orange-400',   bg: 'bg-orange-400/10',  border: 'border-orange-400/20' },
    'Deployment':    { color: 'text-brand-blue',   bg: 'bg-brand-blue/10',  border: 'border-brand-blue/20' },
    'Complete':      { color: 'text-emerald-400',  bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' },
};

const PROJECTS = [
    {
        id: 'MSN-0091', title: 'Real-estate Data Extraction Engine',
        client: 'Tariq Hassan', type: 'Web Scraping', stage: 'Development', stageIndex: 2,
        progress: 55, deadline: 'Jun 10, 2026', value: '$3,200', priority: 'High',
        tech: ['Python', 'Playwright', 'Redis', 'AWS Lambda'],
        description: 'Distributed scraping network across 4 regions for Zillow & Redfin with anti-bot bypass.',
        milestones: [
            { label: 'Kickoff & Requirements Sign-off', done: true },
            { label: 'Architecture & Proxy Setup', done: true },
            { label: 'Scraper Core Build', done: false },
            { label: 'Anti-bot Integration & Testing', done: false },
            { label: 'Final QA & Production Deploy', done: false },
        ],
        files: [
            { name: 'architecture_v1.pdf', size: '1.2 MB', date: 'Apr 20' },
            { name: 'scraper_module_alpha.zip', size: '8.4 MB', date: 'May 3' },
        ],
        logs: [
            { time: '14:15', date: 'Today', event: 'Data ingestion rate: 450 records/sec' },
            { time: '11:30', date: 'Today', event: 'Anti-bot threshold reached — rotating proxy mesh' },
            { time: '09:00', date: 'Today', event: 'Node clustering initialized' },
        ],
    },
    {
        id: 'MSN-0088', title: 'Full E-commerce Platform Build',
        client: 'Rafael Ortega', type: 'E-commerce', stage: 'Architecture', stageIndex: 1,
        progress: 20, deadline: 'Jul 5, 2026', value: '$5,800', priority: 'High',
        tech: ['Django', 'React', 'Stripe', 'PostgreSQL'],
        description: 'Complete e-commerce with custom checkout, multi-currency, and bilingual (EN/AR) support.',
        milestones: [
            { label: 'Kickoff & Requirements', done: true },
            { label: 'DB Schema & Architecture', done: false },
            { label: 'Frontend Build', done: false },
            { label: 'Payment Integration', done: false },
            { label: 'UAT & Launch', done: false },
        ],
        files: [{ name: 'requirements_doc_v2.pdf', size: '780 KB', date: 'May 10' }],
        logs: [
            { time: '10:00', date: 'Yesterday', event: 'DB schema drafted — awaiting client approval' },
        ],
    },
    {
        id: 'MSN-0085', title: 'LinkedIn Lead Scraper', client: 'Sophie Müller',
        type: 'Automation', stage: 'Complete', stageIndex: 5,
        progress: 100, deadline: 'Completed', value: '$1,500', priority: 'Low',
        tech: ['Python', 'Selenium', 'Google Sheets API'],
        description: 'LinkedIn Sales Navigator automated lead extraction into a Google Sheets CRM pipeline.',
        milestones: [
            { label: 'Kickoff', done: true }, { label: 'Scraper Build', done: true },
            { label: 'CRM Integration', done: true }, { label: 'Delivery', done: true },
            { label: 'Client Sign-off', done: true },
        ],
        files: [
            { name: 'source_code_final.zip', size: '3.2 MB', date: 'Apr 18' },
            { name: 'delivery_report.pdf', size: '450 KB', date: 'Apr 18' },
        ],
        logs: [{ time: '15:00', date: 'Apr 18', event: 'Delivery confirmed — client signed off' }],
    },
];

const PRIORITY_DOT = { High: 'bg-brand-red', Medium: 'bg-yellow-400', Low: 'bg-slate-600' };

// ─── Kanban Column ───────────────────────────────────────────────────────────
function KanbanColumn({ stage, projects, onSelect }) {
    const meta = STAGE_META[stage];
    return (
        <div className="min-w-[240px] flex-1">
            <div className={`flex items-center gap-2 mb-3 px-3 py-2 rounded-xl ${meta.bg} border ${meta.border}`}>
                <span className={`text-[8px] font-black uppercase tracking-widest ${meta.color}`}>{stage}</span>
                <span className={`ml-auto text-[8px] font-black ${meta.color}`}>{projects.length}</span>
            </div>
            <div className="space-y-2">
                {projects.map(p => (
                    <div key={p.id} onClick={() => onSelect(p)}
                        className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/15 cursor-pointer group transition-all">
                        <div className="flex items-center gap-1.5 mb-2">
                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${PRIORITY_DOT[p.priority]}`} />
                            <span className="text-[7px] font-black text-slate-600 uppercase">{p.id}</span>
                        </div>
                        <p className="text-[10px] font-black text-white group-hover:text-brand-teal transition-colors leading-tight mb-2">{p.title}</p>
                        <div className="flex items-center gap-1.5 mb-2.5">
                            <User size={9} className="text-slate-600" />
                            <span className="text-[8px] text-slate-600 font-bold">{p.client}</span>
                        </div>
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                            <div style={{ width: `${p.progress}%` }}
                                className={`h-full rounded-full ${p.progress === 100 ? 'bg-emerald-400' : 'bg-brand-teal'}`} />
                        </div>
                        <div className="flex justify-between mt-1.5">
                            <span className="text-[7px] font-black text-slate-700">{p.progress}%</span>
                            <span className="text-[7px] font-black text-brand-teal">{p.value}</span>
                        </div>
                    </div>
                ))}
                {projects.length === 0 && (
                    <div className="flex items-center justify-center h-16 rounded-xl border border-dashed border-white/5 text-[8px] text-slate-700 font-black uppercase tracking-widest">
                        Empty
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── List Row ────────────────────────────────────────────────────────────────
function ListRow({ p, i, onSelect }) {
    const meta = STAGE_META[p.stage];
    return (
        <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all group">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="lg:w-[35%]">
                    <div className="flex items-center gap-2 mb-1">
                        <span className={`w-1.5 h-1.5 rounded-full ${PRIORITY_DOT[p.priority]}`} />
                        <span className="text-[8px] font-black text-brand-teal uppercase tracking-widest">{p.id}</span>
                    </div>
                    <h3 className="text-sm font-black text-white group-hover:text-brand-teal transition-colors uppercase leading-tight mb-1.5">{p.title}</h3>
                    <div className="flex gap-1.5">
                        <span className="px-2 py-0.5 rounded-md bg-white/5 text-[7px] font-black text-slate-500 uppercase">{p.type}</span>
                        <span className="px-2 py-0.5 rounded-md bg-white/5 text-[7px] font-black text-slate-500 uppercase">{p.client}</span>
                    </div>
                </div>

                {/* Stage pipeline */}
                <div className="flex-grow">
                    <div className="hidden md:flex items-center mb-2">
                        {STAGES.map((s, si) => (
                            <div key={s} className="flex items-center flex-1 min-w-0">
                                <div className={`shrink-0 w-2 h-2 rounded-full border-2 ${si < p.stageIndex ? 'bg-brand-teal border-brand-teal' : si === p.stageIndex ? 'bg-brand-teal/30 border-brand-teal animate-pulse' : 'bg-white/5 border-white/10'}`} />
                                {si < STAGES.length - 1 && <div className={`flex-1 h-px ${si < p.stageIndex ? 'bg-brand-teal' : 'bg-white/10'}`} />}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mb-1.5">
                        <span className={`text-[8px] font-black uppercase tracking-widest ${meta.color}`}>{p.stage}</span>
                        <span className="text-[8px] font-black text-white">{p.progress}%</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${p.progress}%` }} transition={{ duration: 0.8, delay: i * 0.1 }}
                            className={`h-full rounded-full ${p.progress === 100 ? 'bg-emerald-400' : 'bg-brand-teal'}`} />
                    </div>
                </div>

                <div className="lg:w-44 flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-3">
                    <div className="text-right">
                        <div className="text-xs font-black text-brand-teal">{p.value}</div>
                        <div className="flex items-center gap-1 justify-end mt-0.5">
                            <Calendar size={9} className="text-slate-600" />
                            <div className="text-[8px] font-black text-slate-600 uppercase">{p.deadline}</div>
                        </div>
                    </div>
                    <button onClick={() => onSelect(p)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-teal/10 hover:bg-brand-teal text-brand-teal hover:text-white text-[8px] font-black uppercase tracking-widest transition-all">
                        Manage <ChevronRight size={10} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

// ─── Detail Drawer ───────────────────────────────────────────────────────────
function ProjectDrawer({ project, onClose, onMilestoneDone }) {
    const meta = STAGE_META[project.stage];
    const completedCount = project.milestones.filter(m => m.done).length;
    return (
        <div className="fixed inset-0 z-[200] flex justify-end">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={onClose} className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25 }}
                className="relative w-full max-w-xl bg-[#080f1e] border-l border-white/10 flex flex-col h-full shadow-2xl">

                {/* Header */}
                <div className="p-6 border-b border-white/5 sticky top-0 bg-[#080f1e] z-10">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <span className="text-[8px] font-black text-brand-teal uppercase tracking-[0.3em]">{project.id}</span>
                            <h2 className="text-lg font-black text-white uppercase leading-tight mt-1">{project.title}</h2>
                            <p className="text-[10px] text-slate-500 mt-1">{project.client} &bull; {project.type}</p>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-xl bg-white/5 text-slate-500 hover:text-white transition-all shrink-0">
                            <X size={16} />
                        </button>
                    </div>
                    {/* Mini stats */}
                    <div className="grid grid-cols-3 gap-2">
                        {[['Value', project.value, 'text-brand-teal'], ['Deadline', project.deadline, 'text-white'], ['Progress', `${project.progress}%`, 'text-white']].map(([l, v, c]) => (
                            <div key={l} className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-center">
                                <div className="text-[7px] font-black text-slate-600 uppercase tracking-widest mb-0.5">{l}</div>
                                <div className={`text-xs font-black ${c}`}>{v}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Body */}
                <div className="flex-grow overflow-y-auto p-6 space-y-6">
                    {/* Stage badge */}
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${meta.bg} ${meta.color} ${meta.border}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                        Current Stage: {project.stage}
                    </div>

                    {/* Description */}
                    <div>
                        <div className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-2">Brief</div>
                        <p className="text-sm text-slate-400 leading-relaxed italic">"{project.description}"</p>
                    </div>

                    {/* Milestones */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <div className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Milestones</div>
                            <span className="text-[8px] font-black text-brand-teal">{completedCount}/{project.milestones.length} Done</span>
                        </div>
                        <div className="space-y-2">
                            {project.milestones.map((m, mi) => (
                                <div key={mi} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${m.done ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-white/5 border-white/5 hover:border-white/10'}`}>
                                    {m.done
                                        ? <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                                        : <Circle size={14} className="text-slate-700 shrink-0" />}
                                    <span className={`text-xs font-bold flex-grow ${m.done ? 'text-slate-600 line-through' : 'text-white'}`}>{m.label}</span>
                                    {!m.done && mi === completedCount && (
                                        <button onClick={() => onMilestoneDone(project.id, mi)}
                                            className="text-[7px] font-black text-brand-teal uppercase tracking-widest px-2 py-1 rounded-md bg-brand-teal/10 hover:bg-brand-teal hover:text-white transition-all shrink-0">
                                            Mark Done
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Tech stack */}
                    <div>
                        <div className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-2">Tech Stack</div>
                        <div className="flex flex-wrap gap-1.5">
                            {project.tech.map(t => (
                                <span key={t} className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 text-[8px] font-black text-white uppercase tracking-widest">{t}</span>
                            ))}
                        </div>
                    </div>

                    {/* Deliverables */}
                    <div>
                        <div className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-2">Deliverables</div>
                        {project.files.length > 0 ? (
                            <div className="space-y-2 mb-3">
                                {project.files.map((f, fi) => (
                                    <div key={fi} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                                        <div className="w-8 h-8 rounded-lg bg-brand-teal/10 flex items-center justify-center text-brand-teal text-[7px] font-black uppercase">
                                            {f.name.split('.').pop()}
                                        </div>
                                        <div className="flex-grow min-w-0">
                                            <div className="text-[10px] font-bold text-white truncate">{f.name}</div>
                                            <div className="text-[7px] font-black text-slate-600 uppercase">{f.size} &bull; {f.date}</div>
                                        </div>
                                        <button className="p-1.5 rounded-lg bg-white/5 text-slate-500 hover:text-white transition-all">
                                            <ChevronRight size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : null}
                        <label className="flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-white/10 hover:border-brand-teal/30 hover:bg-brand-teal/5 transition-all cursor-pointer">
                            <Upload size={16} className="text-slate-600" />
                            <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Upload Deliverable</span>
                            <input type="file" className="hidden" />
                        </label>
                    </div>

                    {/* Activity log */}
                    <div>
                        <div className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-3">Activity Log</div>
                        <div className="space-y-3 border-l border-white/5 ml-2 pl-4">
                            {project.logs.map((log, li) => (
                                <div key={li} className="relative">
                                    <div className="absolute -left-[21px] top-1.5 w-1.5 h-1.5 rounded-full bg-brand-teal" />
                                    <div className="text-[7px] font-black text-slate-700 uppercase tracking-widest mb-0.5">{log.date} &bull; {log.time}</div>
                                    <div className="text-[10px] text-slate-400">{log.event}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/5 space-y-2 sticky bottom-0 bg-[#080f1e]">
                    <div className="grid grid-cols-2 gap-2">
                        <button className="py-3 bg-brand-teal text-white rounded-xl font-black uppercase tracking-widest text-[9px] flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all shadow-glow-teal">
                            <Edit3 size={12} /> Edit Project
                        </button>
                        <button className="py-3 bg-white/5 border border-white/5 text-white rounded-xl font-black uppercase tracking-widest text-[9px] flex items-center justify-center gap-2 hover:bg-white/10 transition-all">
                            <Plus size={12} /> Add Note
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function AdminProjectsPage() {
    const [search, setSearch] = useState('');
    const [view, setView] = useState('list'); // 'list' | 'kanban'
    const [selected, setSelected] = useState(null);
    const [projects, setProjects] = useState(PROJECTS);

    const filtered = projects.filter(p =>
        [p.title, p.client, p.id].some(s => s.toLowerCase().includes(search.toLowerCase()))
    );

    const handleMilestoneDone = (projectId, milestoneIndex) => {
        setProjects(prev => prev.map(p => {
            if (p.id !== projectId) return p;
            const milestones = p.milestones.map((m, i) => i === milestoneIndex ? { ...m, done: true } : m);
            const done = milestones.filter(m => m.done).length;
            const progress = Math.round((done / milestones.length) * 100);
            return { ...p, milestones, progress };
        }));
        setSelected(prev => {
            if (!prev || prev.id !== projectId) return prev;
            const milestones = prev.milestones.map((m, i) => i === milestoneIndex ? { ...m, done: true } : m);
            const done = milestones.filter(m => m.done).length;
            return { ...prev, milestones, progress: Math.round((done / milestones.length) * 100) };
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <p className="text-[9px] font-black text-brand-teal uppercase tracking-[0.3em] mb-1">Admin / Projects</p>
                    <h1 className="text-2xl font-black text-white uppercase tracking-tight">Project Management</h1>
                    <p className="text-slate-500 text-xs mt-1">{projects.length} active projects &bull; Track stages, milestones & deliverables.</p>
                </div>
                <div className="flex items-center gap-2">
                    {/* Search */}
                    <div className="flex items-center gap-2 bg-white/5 border border-white/5 rounded-xl px-3.5 py-2 w-52">
                        <Search size={12} className="text-slate-600 shrink-0" />
                        <input type="text" placeholder="Search projects..." value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="bg-transparent border-none outline-none text-[10px] text-white placeholder:text-slate-700 w-full font-bold" />
                    </div>
                    {/* View toggle */}
                    <div className="flex items-center gap-1 p-1 bg-white/5 border border-white/5 rounded-xl">
                        <button onClick={() => setView('list')}
                            className={`p-1.5 rounded-lg transition-all ${view === 'list' ? 'bg-brand-teal/20 text-brand-teal' : 'text-slate-600 hover:text-white'}`}>
                            <List size={14} />
                        </button>
                        <button onClick={() => setView('kanban')}
                            className={`p-1.5 rounded-lg transition-all ${view === 'kanban' ? 'bg-brand-teal/20 text-brand-teal' : 'text-slate-600 hover:text-white'}`}>
                            <LayoutGrid size={14} />
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Summary pills */}
            <div className="flex flex-wrap gap-2">
                {STAGES.map(s => {
                    const count = projects.filter(p => p.stage === s).length;
                    const meta = STAGE_META[s];
                    return count > 0 ? (
                        <div key={s} className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border ${meta.bg} ${meta.color} ${meta.border}`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current" /> {s} ({count})
                        </div>
                    ) : null;
                })}
            </div>

            {/* List view */}
            {view === 'list' && (
                <div className="space-y-3">
                    {filtered.map((p, i) => <ListRow key={p.id} p={p} i={i} onSelect={setSelected} />)}
                </div>
            )}

            {/* Kanban view */}
            {view === 'kanban' && (
                <div className="flex gap-3 overflow-x-auto pb-4">
                    {STAGES.map(s => (
                        <KanbanColumn key={s} stage={s}
                            projects={filtered.filter(p => p.stage === s)}
                            onSelect={setSelected} />
                    ))}
                </div>
            )}

            {/* Detail Drawer */}
            <AnimatePresence>
                {selected && (
                    <ProjectDrawer
                        project={selected}
                        onClose={() => setSelected(null)}
                        onMilestoneDone={handleMilestoneDone}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
