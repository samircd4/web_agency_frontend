'use client';

import React, { useState, useEffect } from 'react';
import { Briefcase, ChevronRight, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '@/lib/api';
import SellerEarningsCard from './SellerEarningsCard';
import SellerProjectDrawer from './SellerProjectDrawer';

const STATUS_STYLES = {
    pending:     { dot: 'bg-yellow-400', badge: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30' },
    in_progress: { dot: 'bg-blue-400',   badge: 'bg-blue-500/15 text-blue-300 border-blue-500/30' },
    in_review:   { dot: 'bg-purple-400', badge: 'bg-purple-500/15 text-purple-300 border-purple-500/30' },
    completed:   { dot: 'bg-emerald-400',badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' },
    cancelled:   { dot: 'bg-red-400',    badge: 'bg-red-500/15 text-red-300 border-red-500/30' },
};

function ProjectCard({ project, onClick }) {
    const statusKey = (project.status || project.stage || 'pending').toLowerCase().replace(' ', '_');
    const styles  = STATUS_STYLES[statusKey] || STATUS_STYLES['pending'];
    const msDone  = (project.milestones || []).filter(m => m.completed || m.done).length;
    const msTotal = (project.milestones || []).length;
    const pct     = msTotal > 0 ? Math.round((msDone / msTotal) * 100) : (project.progress || 0);

    const titleText = project.name || project.title || 'Untitled Project';
    const clientText = project.client_name || project.client_profile?.company_name || project.client_profile?.contact_name || project.client?.full_name || '—';

    return (
        <button
            onClick={() => onClick(project)}
            className="w-full text-left p-5 rounded-2xl bg-slate-900/80 border border-white/10 hover:border-purple-500/30 transition-all group space-y-4 cursor-pointer"
        >
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <span className={`w-2 h-2 rounded-full ${styles.dot}`} />
                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${styles.badge}`}>
                            {(project.status || project.stage || 'pending').replace('_', ' ')}
                        </span>
                        <span className="text-[10px] font-bold text-slate-600">#{project.project_id || project.id}</span>
                    </div>
                    <h3 className="text-sm font-black text-white truncate">{titleText}</h3>
                    <p className="text-[10px] font-bold text-slate-400 mt-0.5">
                        Client: <span className="text-slate-300">{clientText}</span>
                    </p>
                </div>
                <ChevronRight
                    size={16}
                    className="flex-shrink-0 text-slate-600 group-hover:text-purple-400 transition-colors mt-1"
                />
            </div>

            {/* Milestone progress */}
            {msTotal > 0 && (
                <div className="space-y-1">
                    <div className="flex justify-between text-[9px] font-bold text-slate-500">
                        <span>{msDone}/{msTotal} milestones</span>
                        <span>{pct}%</span>
                    </div>
                    <div className="h-1 rounded-full bg-slate-800 overflow-hidden">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-purple-500 to-violet-400 transition-all"
                            style={{ width: `${pct}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Meta */}
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[9px] font-bold text-slate-500">
                {project.deadline && (
                    <span className="flex items-center gap-1">
                        <Clock size={9} />
                        Due: {new Date(project.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                )}
                {(project.files || []).length > 0 && (
                    <span>{(project.files || []).length} file(s) uploaded</span>
                )}
            </div>
        </button>
    );
}

export default function SellerProjectsTab() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading]   = useState(true);
    const [selectedProject, setSelectedProject] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('all');

    const loadProjects = async () => {
        setLoading(true);
        try {
            const data = await api.getSellerProjects();
            setProjects(data.results || data || []);
        } catch (err) {
            console.error("Failed to load seller projects:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProjects();
    }, []);

    const filteredProjects = projects.filter(p => {
        const titleName = (p.name || p.title || '');
        const matchSearch = titleName.toLowerCase().includes(searchQuery.toLowerCase());
        const statusVal = (p.status || p.stage || '').toLowerCase();
        const matchFilter = filter === 'all' || statusVal === filter || statusVal.replace(/ /g, '_') === filter;
        return matchSearch && matchFilter;
    });

    const handleProjectUpdated = (updated) => {
        setProjects(prev => prev.map(p => p.id === updated.id ? { ...p, ...updated } : p));
    };

    return (
        <div className="space-y-6">
            {/* Earnings Summary */}
            <SellerEarningsCard />

            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-purple-950/20 border border-purple-500/20 backdrop-blur-xl">
                <div>
                    <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                        <Briefcase className="text-purple-400" size={24} /> Active Orders
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">Manage your assigned projects, milestones, deliverables, proposals, and invoices.</p>
                </div>
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Search projects..."
                        className="px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-white text-xs outline-none focus:border-purple-500 w-44"
                    />
                </div>
            </div>

            {/* Status Filter Tabs */}
            <div className="flex flex-wrap gap-2">
                {['all', 'pending', 'in_progress', 'in_review', 'completed'].map(s => (
                    <button
                        key={s}
                        onClick={() => setFilter(s)}
                        className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                            filter === s
                                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                                : 'bg-slate-900/80 border border-white/10 text-slate-400 hover:border-purple-500/30'
                        }`}
                    >
                        {s === 'all' ? 'All Orders' : s.replace('_', ' ')}
                    </button>
                ))}
            </div>

            {/* Projects Grid */}
            {loading ? (
                <div className="p-10 text-center text-slate-500 text-xs font-bold uppercase tracking-widest">
                    Loading orders...
                </div>
            ) : filteredProjects.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-slate-900/50 border border-white/5 space-y-3">
                    <Briefcase size={36} className="mx-auto text-purple-400/50" />
                    <div className="text-sm font-bold text-white">
                        {projects.length === 0 ? 'No orders assigned yet' : 'No orders match this filter'}
                    </div>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                        {projects.length === 0
                            ? "You'll see projects here once an admin assigns them to you."
                            : "Try a different status filter or search term."}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {filteredProjects.map(p => (
                        <ProjectCard
                            key={p.id}
                            project={p}
                            onClick={setSelectedProject}
                        />
                    ))}
                </div>
            )}

            {/* Project Action Drawer */}
            {selectedProject && (
                <SellerProjectDrawer
                    project={selectedProject}
                    onClose={() => setSelectedProject(null)}
                    onProjectUpdated={handleProjectUpdated}
                />
            )}
        </div>
    );
}
