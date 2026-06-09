'use client';

import React from 'react';
import { X } from 'lucide-react';

export default function ProjectDetailHeader({ project, onClose }) {
    return (
        <div className="p-5 border-b border-white/5 flex items-start justify-between bg-white/[0.02]">
            <div>
                <div className="text-[8px] font-black text-brand-teal uppercase tracking-[0.3em] mb-0.5">{project.id} • {project.priority || 'Standard'} Priority</div>
                <h2 className="text-lg font-black text-white uppercase tracking-tight">{project.title}</h2>
            </div>
            {onClose && (
                <button onClick={onClose} className="w-9 h-9 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-600 hover:text-white hover:bg-brand-red/20 transition-all shrink-0">
                    <X size={16} />
                </button>
            )}
        </div>
    );
}
