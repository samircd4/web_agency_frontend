import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Terminal, CheckCircle2, Activity, Cpu, FileText, Download, Shield, Clock, Zap, MessageSquare } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function ProjectDetailModal({
    selectedProject,
    setSelectedProject,
    router, // Keep router for potential navigation within the modal
}) {
    return (
        <AnimatePresence>
            {selectedProject && (
                <motion.div className="fixed inset-0 z-[100] flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <motion.div onClick={() => setSelectedProject(null)} className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" />
                    <motion.div initial={{ opacity: 0, scale: 0.98, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: 10 }} className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden border border-white/10 rounded-2xl bg-[#080f1e] shadow-2xl flex flex-col" onClick={(e) => e.stopPropagation()}>
                        <div className="p-5 border-b border-white/5 flex items-start justify-between bg-white/[0.02]">
                            <div>
                                <div className="text-[8px] font-black text-brand-teal uppercase tracking-[0.3em] mb-0.5">{selectedProject.id} • {selectedProject.priority || 'Standard'} Priority</div>
                                <h2 className="text-lg font-black text-white uppercase tracking-tight">{selectedProject.title}</h2>
                            </div>
                            <button onClick={() => setSelectedProject(null)} className="w-9 h-9 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-600 hover:text-white hover:bg-brand-red/20 transition-all shrink-0">
                                <X size={16} />
                            </button>
                        </div>

                        <div className="px-6 py-4 border-b border-white/5 bg-white/[0.01]">
                            <div className="flex items-center mb-2">
                                {['Requirements', 'Architecture', 'Development', 'QA', 'Deployment', 'Complete'].map((s, si) => {
                                    const stageIdx = { Requirements: 1, Architecture: 1, Dev: 2, QA: 3, Deploying: 4, Complete: 5 }[selectedProject.stage] ?? 2;
                                    return (
                                        <React.Fragment key={s}>
                                            <div title={s} className={`shrink-0 w-2.5 h-2.5 rounded-full border-2 transition-all ${si < stageIdx ? 'bg-brand-teal border-brand-teal' : si === stageIdx ? 'bg-brand-teal/40 border-brand-teal animate-pulse' : 'bg-white/5 border-white/10'}`} />
                                            {si < 5 && <div className={`flex-1 h-px ${si < stageIdx ? 'bg-brand-teal' : 'bg-white/10'}`} />}
                                        </React.Fragment>
                                    );
                                })}
                            </div>
                            <div className="flex justify-between">
                                {['Requirements', 'Architecture', 'Development', 'QA', 'Deployment', 'Complete'].map((s, si) => {
                                    const stageIdx = { Requirements: 1, Architecture: 1, Dev: 2, QA: 3, Deploying: 4, Complete: 5 }[selectedProject.stage] ?? 2;
                                    return (
                                        <span key={s} className={`text-[6px] font-black uppercase tracking-widest flex-1 text-center ${si === stageIdx ? 'text-brand-teal' : si < stageIdx ? 'text-slate-600' : 'text-slate-800'}`}>{s}</span>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="flex-grow overflow-y-auto p-6">
                            <div className="grid md:grid-cols-[1fr_220px] gap-6">
                                <div className="space-y-6">
                                    <section>
                                        <h4 className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-2 flex items-center gap-2"><Terminal size={11} className="text-brand-teal" /> Project Brief</h4>
                                        <p className="text-slate-300 text-sm leading-relaxed italic">{selectedProject.description || 'No detailed brief provided.'}</p>
                                    </section>

                                    {selectedProject.milestones?.length > 0 && (
                                        <section>
                                            <div className="flex items-center justify-between mb-3">
                                                <h4 className="text-[8px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2"><CheckCircle2 size={11} className="text-brand-indigo" /> Milestones</h4>
                                                <span className="text-[8px] font-black text-brand-teal">{selectedProject.milestones.filter((m) => m.done).length}/{selectedProject.milestones.length} Done</span>
                                            </div>
                                            <div className="space-y-2">
                                                {selectedProject.milestones.map((m, mi) => (
                                                    <div key={mi} className={`flex items-center gap-3 p-3 rounded-xl border ${m.done ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-white/[0.02] border-white/5'}`}>
                                                        {m.done ? <CheckCircle2 size={13} className="text-emerald-400 shrink-0" /> : <Clock size={13} className="text-slate-700 shrink-0" />}
                                                        <span className={`text-xs font-bold ${m.done ? 'text-slate-600 line-through' : 'text-white'}`}>{m.label}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </section>
                                    )}

                                    {selectedProject.tags?.length > 0 && (
                                        <section>
                                            <h4 className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-2 flex items-center gap-2"><Cpu size={11} className="text-brand-red" /> Tech Stack</h4>
                                            <div className="flex flex-wrap gap-1.5">
                                                {selectedProject.tags.map((t) => (
                                                    <span key={t} className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 text-[8px] font-black text-white uppercase tracking-widest">{t}</span>
                                                ))}
                                            </div>
                                        </section>
                                    )}

                                    {selectedProject.activities?.length > 0 && (
                                        <section>
                                            <h4 className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-3 flex items-center gap-2"><Activity size={11} className="text-brand-indigo" /> Activity Log</h4>
                                            <div className="space-y-3 border-l border-white/5 ml-1.5 pl-4">
                                                {selectedProject.activities.map((log) => (
                                                    <div key={log.id} className="relative">
                                                        <div className="absolute -left-[21px] top-1.5 w-1.5 h-1.5 rounded-full bg-brand-teal" />
                                                        <div className="text-[7px] font-black text-slate-700 uppercase tracking-widest mb-0.5">{log.timestamp ? new Date(log.timestamp).toLocaleString() : 'Recent'}</div>
                                                        <div className="text-[10px] text-slate-400">{log.action_text}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </section>
                                    )}
                                </div>

                                <div className="space-y-3">
                                    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                        <div className="text-[7px] font-black text-slate-700 uppercase tracking-widest mb-3">Project Status</div>
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-brand-teal/10 flex items-center justify-center text-brand-teal shrink-0"><Zap size={18} /></div>
                                            <div>
                                                <div className="text-xl font-black text-white">{selectedProject.progress}%</div>
                                                <div className="text-[8px] font-black text-brand-teal uppercase tracking-widest">{selectedProject.stage}</div>
                                            </div>
                                        </div>
                                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mb-3">
                                            <motion.div initial={{ width: 0 }} animate={{ width: `${selectedProject.progress}%` }} className={`h-full rounded-full ${selectedProject.progress === 100 ? 'bg-emerald-400' : 'bg-brand-teal'}`} />
                                        </div>
                                        <div className="space-y-2.5 border-t border-white/5 pt-3">
                                            {[
                                                ['Deadline', selectedProject.deadline || 'Flexible'],
                                                ['Investment', selectedProject.value ? `$${Number(selectedProject.value).toLocaleString()}` : '$0.00'],
                                                ['Priority', selectedProject.priority],
                                            ].map(([l, v]) => (
                                                <div key={l} className="flex justify-between items-center">
                                                    <span className="text-[7px] font-black text-slate-700 uppercase tracking-widest">{l}</span>
                                                    <span className="text-[9px] font-bold text-white uppercase">{v}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {selectedProject.files?.length > 0 && (
                                        <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                            <div className="text-[7px] font-black text-slate-700 uppercase tracking-widest mb-3">Deliverables</div>
                                            <div className="space-y-2">
                                                {selectedProject.files.map((f) => (
                                                    <div key={f.id} className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
                                                        <FileText size={11} className="text-brand-teal shrink-0" />
                                                        <div className="flex-grow min-w-0">
                                                            <div className="text-[8px] font-bold text-white truncate">{f.name}</div>
                                                            <div className="text-[7px] text-slate-700">{f.size || 'N/A'}</div>
                                                        </div>
                                                        <a href={f.file_url} target="_blank" rel="noopener noreferrer" className="p-1 rounded-md bg-brand-teal/10 text-brand-teal hover:bg-brand-teal hover:text-white transition-all shrink-0">
                                                            <Download size={10} />
                                                        </a>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <button onClick={() => { setSelectedProject(null); }} className="w-full py-3 bg-brand-teal text-primary rounded-xl font-black uppercase tracking-widest text-[9px] shadow-glow-teal hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
                                        Secure Channel <MessageSquare size={13} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-white/[0.02] border-t border-white/5 flex items-center justify-center gap-2">
                            <Shield size={10} className="text-brand-teal" />
                            <span className="text-[7px] font-black text-slate-700 uppercase tracking-[0.3em]">Protected Engineering Protocol</span>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}