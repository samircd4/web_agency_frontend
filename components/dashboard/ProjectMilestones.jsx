import React from 'react';
import { CheckCircle2, Clock } from 'lucide-react';

export default function ProjectMilestones({ milestones }) {
    const completedCount = milestones.filter(m => m.done).length;
    return (
        <section>
            <div className="flex items-center justify-between mb-3">
                <div className="text-[10px] font-black text-muted uppercase tracking-widest flex items-center gap-2">
                    <CheckCircle2 size={12} className="text-brand-indigo" />
                    Milestones
                </div>
                {milestones.length > 0 && (
                    <span className="text-[10px] font-black text-brand-teal">{completedCount}/{milestones.length} Done</span>
                )}
            </div>
            <div className="space-y-2">
                {milestones.map((m, mi) => (
                    <div
                        key={m.id || mi}
                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${m.done ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-white/[0.02] border-white/5'}`}
                    >
                        {m.done ? (
                            <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                        ) : (
                            <Clock size={16} className="text-muted shrink-0" />
                        )}
                        <span className={`text-tiny font-bold flex-grow leading-normal ${m.done ? 'text-muted line-through' : 'text-white'}`}>
                            {m.label}
                        </span>
                    </div>
                ))}
            </div>
        </section>
    );
}
