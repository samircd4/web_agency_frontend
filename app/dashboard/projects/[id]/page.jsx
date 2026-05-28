'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    X, Terminal, CheckCircle2, Activity, Cpu, FileText, Download, Shield,
    ArrowLeft, MessageSquare, Clock, Zap
} from 'lucide-react';
import { api } from '@/lib/api';

const STAGE_META = {
    'Requirements': { color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20' },
    'Architecture': { color: 'text-brand-indigo', bg: 'bg-brand-indigo/10', border: 'border-brand-indigo/20' },
    'Dev': { color: 'text-brand-teal', bg: 'bg-brand-teal/10', border: 'border-brand-teal/20' },
    'QA': { color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/20' },
    'Deploying': { color: 'text-brand-blue', bg: 'bg-brand-blue/10', border: 'border-brand-blue/20' },
    'Complete': { color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' },
};

export default function ClientProjectDetail() {
    const { id } = useParams();
    const router = useRouter();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) return;
        const loadProject = async () => {
            try {
                setLoading(true);
                const p = await api.getClientProjectDetail(id);
                setProject(p);
            } catch (err) {
                console.error(err);
                setError(err.message || 'Failed to load project');
            } finally {
                setLoading(false);
            }
        };
        loadProject();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#020617] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-brand-teal border-t-transparent rounded-full animate-spin" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                        Loading Project...
                    </span>
                </div>
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className="min-h-screen bg-[#020617] flex items-center justify-center">
                <div className="text-center max-w-md px-4">
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">
                        Error
                    </div>
                    <div className="text-sm text-slate-300 mb-4">
                        {error || 'Project not found'}
                    </div>
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-xs font-black uppercase tracking-widest text-slate-300 hover:bg-white/10 transition-all"
                    >
                        <ArrowLeft size={12} />
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    const meta = STAGE_META[project.stage] || { color: 'text-text-muted', bg: 'bg-white/5', border: 'border-white/5' };
    const milestones = project.milestones || [];
    const files = project.files || [];
    const activities = project.activities || [];
    const completedCount = milestones.filter(m => m.done).length;

    return (
        <div className="min-h-screen bg-[#020617] text-slate-300 font-sans">
            <div className="max-w-5xl mx-auto px-4 py-6 lg:py-10">
                {/* Back button */}
                <div className="mb-6">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                    >
                        <ArrowLeft size={12} />
                        Back to Dashboard
                    </Link>
                </div>

                {/* Main content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass border border-white/10 rounded-2xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-white/5 bg-white/[0.02]">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <div className="text-[9px] font-black text-brand-teal uppercase tracking-[0.3em] mb-1">
                                    {project.id} • {project.priority || 'Standard'} Priority
                                </div>
                                <h1 className="text-xl lg:text-2xl font-black text-white uppercase tracking-tight">
                                    {project.title}
                                </h1>
                            </div>
                            <Link
                                href="/dashboard"
                                className="w-9 h-9 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 transition-all"
                            >
                                <X size={16} />
                            </Link>
                        </div>

                        {/* Stage pipeline */}
                        <div className="px-6 py-4 border border-white/5 rounded-xl bg-white/[0.01]">
                            <div className="flex items-center mb-2">
                                {['Requirements', 'Architecture', 'Dev', 'QA', 'Deploying', 'Complete'].map((s, si) => {
                                    const stageIndex = { Requirements: 1, Architecture: 1, Dev: 2, QA: 3, Deploying: 4, Complete: 5 }[project.stage] ?? 2;
                                    return (
                                        <React.Fragment key={s}>
                                            <div
                                                className={`shrink-0 w-2.5 h-2.5 rounded-full border-2 transition-all ${
                                                    si < stageIndex ? 'bg-brand-teal border-brand-teal'
                                                        : si === stageIndex ? 'bg-brand-teal/40 border-brand-teal animate-pulse'
                                                            : 'bg-white/5 border-white/10'
                                                }`}
                                            />
                                            {si < 5 && (
                                                <div
                                                    className={`flex-1 h-px ${
                                                        si < stageIndex ? 'bg-brand-teal' : 'bg-white/10'
                                                    }`}
                                                />
                                            )}
                                        </React.Fragment>
                                    );
                                })}
                            </div>
                            <div className="flex justify-between">
                                {['Requirements', 'Architecture', 'Dev', 'QA', 'Deploying', 'Complete'].map((s, si) => {
                                    const stageIndex = { Requirements: 1, Architecture: 1, Dev: 2, QA: 3, Deploying: 4, Complete: 5 }[project.stage] ?? 2;
                                    return (
                                        <span
                                            key={s}
                                            className={`text-[6px] font-black uppercase tracking-widest flex-1 text-center ${
                                                si === stageIndex ? 'text-brand-teal'
                                                    : si < stageIndex ? 'text-slate-600'
                                                        : 'text-slate-800'
                                            }`}
                                        >
                                            {s}
                                        </span>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="p-6 space-y-6">
                        <div className="grid md:grid-cols-[1fr_220px] gap-6">
                            {/* Left column */}
                            <div className="space-y-6">
                                {/* Project brief */}
                                <section>
                                    <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                                        <Terminal size={11} className="text-brand-teal" />
                                        Project Brief
                                    </div>
                                    <p className="text-slate-300 text-sm leading-relaxed italic">
                                        {project.description || 'No detailed brief provided.'}
                                    </p>
                                </section>

                                {/* Milestones */}
                                {milestones.length > 0 && (
                                    <section>
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                                <CheckCircle2 size={11} className="text-brand-indigo" />
                                                Milestones
                                            </div>
                                            <span className="text-[9px] font-black text-brand-teal">
                                                {completedCount}/{milestones.length} Done
                                            </span>
                                        </div>
                                        <div className="space-y-2">
                                            {milestones.map((m, mi) => (
                                                <div
                                                    key={m.id || mi}
                                                    className={`flex items-center gap-3 p-3 rounded-xl border ${
                                                        m.done ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-white/[0.02] border-white/5'
                                                    }`}
                                                >
                                                    {m.done ? (
                                                        <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                                                    ) : (
                                                        <Clock size={16} className="text-slate-500 shrink-0" />
                                                    )}
                                                    <span className={`text-xs font-bold flex-grow ${
                                                        m.done ? 'text-slate-500 line-through' : 'text-white'
                                                    }`}>
                                                        {m.label}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {/* Tech stack */}
                                {project.tags?.length > 0 && (
                                    <section>
                                        <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                                            <Cpu size={11} className="text-brand-red" />
                                            Tech Stack
                                        </div>
                                        <div className="flex flex-wrap gap-1.5">
                                            {project.tags.map((t) => (
                                                <span
                                                    key={t}
                                                    className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 text-[8px] font-black text-white uppercase tracking-widest"
                                                >
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {/* Activity log */}
                                {activities.length > 0 && (
                                    <section>
                                        <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                            <Activity size={11} className="text-brand-indigo" />
                                            Activity Log
                                        </div>
                                        <div className="space-y-3 border-l border-white/5 ml-1.5 pl-4">
                                            {activities.map((log) => (
                                                <div key={log.id} className="relative">
                                                    <div className="absolute -left-[21px] top-1.5 w-1.5 h-1.5 rounded-full bg-brand-teal" />
                                                    <div className="text-[7px] font-black text-slate-500 uppercase tracking-widest mb-0.5">
                                                        {log.timestamp ? new Date(log.timestamp).toLocaleString() : 'Recent'}
                                                    </div>
                                                    <div className="text-[10px] text-slate-400">{log.action_text}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                )}
                            </div>

                            {/* Right column */}
                            <div className="space-y-3">
                                {/* Project status card */}
                                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                                    <div className="text-[7px] font-black text-slate-500 uppercase tracking-widest mb-3">
                                        Project Status
                                    </div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-xl bg-brand-teal/10 flex items-center justify-center text-brand-teal shrink-0">
                                            <Zap size={18} />
                                        </div>
                                        <div>
                                            <div className="text-xl font-black text-white">{project.progress}%</div>
                                            <div className="text-[8px] font-black text-brand-teal uppercase tracking-widest">
                                                {project.stage}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mb-3">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${project.progress}%` }}
                                            className={`h-full rounded-full ${project.progress === 100 ? 'bg-emerald-400' : 'bg-brand-teal'}`}
                                        />
                                    </div>
                                    <div className="space-y-2.5 border-t border-white/5 pt-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest">
                                                Deadline
                                            </span>
                                            <span className="text-[9px] font-bold text-white uppercase">
                                                {project.deadline || 'Flexible'}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest">
                                                Investment
                                            </span>
                                            <span className="text-[9px] font-bold text-white uppercase">
                                                ${Number(project.value || 0).toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest">
                                                Priority
                                            </span>
                                            <span className="text-[9px] font-bold text-white uppercase">
                                                {project.priority || 'Standard'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Deliverables */}
                                {files.length > 0 && (
                                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                                        <div className="text-[7px] font-black text-slate-500 uppercase tracking-widest mb-3">
                                            Deliverables
                                        </div>
                                        <div className="space-y-2">
                                            {files.map((f) => (
                                                <div
                                                    key={f.id}
                                                    className="flex items-center gap-2 p-2 rounded-lg bg-white/5"
                                                >
                                                    <FileText size={11} className="text-brand-teal shrink-0" />
                                                    <div className="flex-grow min-w-0">
                                                        <div className="text-[8px] font-bold text-white truncate">
                                                            {f.name}
                                                        </div>
                                                        <div className="text-[7px] text-slate-500">
                                                            {f.size ? `${(Number(f.size) / (1024 * 1024)).toFixed(2)} MB` : '—'}
                                                        </div>
                                                    </div>
                                                    <a
                                                        href={f.file_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-1.5 rounded-md bg-brand-teal/10 text-brand-teal hover:bg-brand-teal hover:text-white transition-all shrink-0"
                                                    >
                                                        <Download size={10} />
                                                    </a>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Secure channel button */}
                                <Link
                                    href="/dashboard?tab=comms"
                                    className="w-full py-2.5 bg-brand-teal text-primary rounded-xl font-black uppercase tracking-widest text-[9px] shadow-glow-teal hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                                >
                                    Secure Channel <MessageSquare size={13} />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-4 bg-white/[0.02] border-t border-white/5 flex items-center justify-center gap-2">
                        <Shield size={10} className="text-brand-teal" />
                        <span className="text-[7px] font-black text-slate-500 uppercase tracking-[0.3em]">
                            Protected Engineering Protocol
                        </span>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
