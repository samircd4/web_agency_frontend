'use client';

import React from 'react';
import { X } from 'lucide-react';

export default function ProjectDetailHeader({ project, onClose }) {
    const statusLower = (project?.status || '').toLowerCase();
    const stageLower = (project?.stage || '').toLowerCase();

    const isCancelled = statusLower === 'cancelled' || stageLower === 'cancelled';
    const isExplicitlyActive = statusLower === 'active' || statusLower === 'in_progress' || statusLower === 'pending';

    const isCompleted = !isCancelled && !isExplicitlyActive && (
        statusLower === 'completed' || statusLower === 'complete' || stageLower === 'complete' || stageLower === 'completed'
    );

    const statusText = isCompleted 
        ? 'Completed' 
        : isCancelled 
        ? 'Cancelled' 
        : (project?.status === 'active' && project?.stage && project?.stage !== 'Complete' ? project.stage : (project?.status === 'active' ? 'Active' : (project?.stage || project?.status || 'In Progress')));

    const badgeStyle = isCompleted
        ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
        : isCancelled
        ? 'bg-brand-red/15 border-brand-red/30 text-brand-red'
        : 'bg-brand-teal/15 border-brand-teal/30 text-brand-teal';

    return (
        <div className="p-5 border-b border-white/5 flex items-start justify-between bg-white/[0.02]">
            <div>
                <div className="text-[8px] font-black text-brand-teal uppercase tracking-[0.3em] mb-0.5">{project.id} • {project.priority || 'Standard'} Priority</div>
                <h2 className="text-lg font-black text-white uppercase tracking-tight">{project.title}</h2>
            </div>
            
            <div className="flex items-center gap-3">
                {/* Project Status Tag */}
                <div className={`px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${badgeStyle}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${isCompleted ? 'bg-emerald-400' : isCancelled ? 'bg-brand-red' : 'bg-brand-teal animate-pulse'}`} />
                    {statusText}
                </div>

                {onClose && (
                    <button onClick={onClose} className="w-9 h-9 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-600 hover:text-white hover:bg-brand-red/20 transition-all shrink-0">
                        <X size={16} />
                    </button>
                )}
            </div>
        </div>
    );
}
