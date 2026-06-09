'use client';

import React from 'react';
import { CheckCircle2, Clock } from 'lucide-react';

export default function ProjectMilestonesSection({ milestones }) {
    return (
        <section>
            <div className="flex items-center justify-between mb-3">
                <h4 className="text-[8px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2"><CheckCircle2 size={11} className="text-brand-indigo" /> Milestones</h4>
                <span className="text-[8px] font-black text-brand-teal">{milestones.filter((m) => m.done).length}/{milestones.length} Done</span>
            </div>
            <div className="space-y-2">
                {milestones.map((m, mi) => (
                    <div key={mi} className={`flex items-center gap-3 p-3 rounded-xl border ${m.done ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-white/[0.02] border-white/5'}`}>
                        {m.done ? <CheckCircle2 size={13} className="text-emerald-400 shrink-0" /> : <Clock size={13} className="text-slate-700 shrink-0" />}
                        <span className={`text-xs font-bold ${m.done ? 'text-slate-600 line-through' : 'text-white'}`}>{m.label}</span>
                    </div>
                ))}
            </div>
        </section>
    );
}
