import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Zap, Box, FileText, ChevronRight, CreditCard, CheckCircle2, Clock } from 'lucide-react';

const centsToMoney = (cents) => {
    const value = Number(cents || 0) / 100;
    return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export default function Projects({
    filteredMissions,
    setSelectedMission,
    totalInvestment,
    activeMissionsCount,
    deliverablesCount,
}) {
    return (
        <motion.div key="missions" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}>
            <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-white mb-1 tracking-tight uppercase">My Projects</h1>
                    <p className="text-slate-500 text-xs">Track your active projects and deliverables.</p>
                </div>
                <div className="flex gap-2">
                    <Link href="/contact" className="px-5 py-2 bg-brand-teal text-text-primary rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-2 shadow-glow-teal hover:-translate-y-0.5 transition-all">
                        Request New Project <Zap size={12} />
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {[
                    { label: 'Total Invested', value: `$${totalInvestment.toLocaleString()}`, icon: <CreditCard className="text-brand-teal" />, sub: 'Aggregated project value' },
                    { label: 'Active Projects', value: String(activeMissionsCount), icon: <Zap className="text-brand-red" />, sub: 'In Development / QA' },
                    { label: 'Secure Deliverables', value: String(deliverablesCount), icon: <Box className="text-brand-indigo" />, sub: 'Files in vault' },
                ].map((stat, i) => (
                    <div key={i} className="p-5 rounded-xl glass border border-white/5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            {React.cloneElement(stat.icon, { size: 24 })}
                        </div>
                        <div className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">{stat.label}</div>
                        <div className="text-2xl font-black text-white mb-0.5">{stat.value}</div>
                        <div className="text-[9px] font-bold text-brand-teal">{stat.sub}</div>
                    </div>
                ))}
            </div>

            <div className="space-y-4">
                {filteredMissions.length === 0 ? (
                    <div className="p-8 text-center bg-white/[0.01] border border-white/5 rounded-xl text-slate-500 text-sm">
                        No active projects matching your query.
                    </div>
                ) : (
                    filteredMissions.map((mission) => {
                        const statusStageMap = { Requirements: 1, Architecture: 1, Dev: 2, QA: 3, Deploying: 4, Complete: 5 };
                        const stageIdx = statusStageMap[mission.stage] ?? 2;
                        const milestones = mission.milestones || [];
                        const projectTags = mission.tags || [];

                        return (
                            <div key={mission.id} className="rounded-2xl bg-white/[0.02] border border-white/5 hover:border-brand-teal/20 transition-all group overflow-hidden">
                                <div className="p-5">
                                    <div className="flex flex-col lg:flex-row lg:items-start gap-5">
                                        <div className="lg:w-[38%]">
                                            <div className="text-[9px] font-black text-brand-teal uppercase tracking-widest mb-1">{mission.id}</div>
                                            <h3 className="text-sm font-black text-white group-hover:text-brand-teal transition-colors mb-2 uppercase leading-tight">{mission.title}</h3>
                                            <div className="flex flex-wrap gap-1.5">
                                                <span className="px-2 py-0.5 rounded-md bg-white/5 text-[7px] font-black text-slate-500 uppercase tracking-widest">{mission.priority || 'Standard'} Priority</span>
                                                {projectTags.slice(0, 3).map((tag) => (
                                                    <span key={tag} className="px-2 py-0.5 rounded-md bg-white/5 text-[7px] font-black text-slate-400 uppercase tracking-widest">{tag}</span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex-grow">
                                            <div className="hidden md:flex items-center mb-2">
                                                {['Requirements', 'Architecture', 'Development', 'QA', 'Deployment', 'Complete'].map((s, si, arr) => (
                                                    <div key={s} className="flex items-center flex-1 min-w-0">
                                                        <div className={`shrink-0 w-2.5 h-2.5 rounded-full border-2 ${si < stageIdx ? 'bg-brand-teal border-brand-teal' : si === stageIdx ? 'bg-brand-teal/30 border-brand-teal animate-pulse' : 'bg-white/5 border-white/10'}`} />
                                                        {si < arr.length - 1 && <div className={`flex-1 h-px ${si < stageIdx ? 'bg-brand-teal' : 'bg-white/10'}`} />}
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="flex justify-between mb-1.5">
                                                <span className="text-[8px] font-black text-brand-teal uppercase tracking-widest">Stage: {mission.stage}</span>
                                                <span className="text-[8px] font-black text-white">{mission.progress}%</span>
                                            </div>
                                            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                <motion.div initial={{ width: 0 }} animate={{ width: `${mission.progress}%` }} className={`h-full rounded-full ${mission.progress === 100 ? 'bg-emerald-400' : 'bg-brand-teal'}`} />
                                            </div>
                                        </div>

                                        <div className="lg:w-36 flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-2">
                                            <div className="text-right">
                                                <div className="text-xs font-black text-brand-teal">${Number(mission.value || 0).toLocaleString()}</div>
                                                <div className="text-[8px] text-slate-600 font-bold uppercase tracking-widest">Deadline: {mission.deadline || 'Flexible'}</div>
                                            </div>
                                            <button
                                                onClick={() => setSelectedMission(mission)}
                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-teal/10 hover:bg-brand-teal text-brand-teal hover:text-text-primary rounded-lg text-[8px] font-black uppercase tracking-widest transition-all"
                                            >
                                                Details <ChevronRight size={10} />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {milestones.length > 0 && (
                                    <div className="border-t border-white/5 px-5 py-3 flex gap-2 overflow-x-auto bg-white/[0.01]">
                                        {milestones.slice(0, 5).map((m, mi) => (
                                            <div key={mi} className={`flex items-center gap-1.5 shrink-0 text-[7px] font-black uppercase tracking-widest ${m.done ? 'text-emerald-400' : 'text-slate-700'}`}>
                                                {m.done ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                                                {m.label}
                                                {mi < milestones.slice(0, 5).length - 1 && <span className="ml-1 text-slate-800">›</span>}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </motion.div>
    );
}
