'use client';

import React from 'react';
import { Activity } from 'lucide-react';

export default function ProjectActivityLogSection({ activities }) {
    if (!activities || activities.length === 0) return null;

    return (
        <section>
            <h4 className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-3 flex items-center gap-2"><Activity size={11} className="text-brand-indigo" /> Activity Log</h4>
            <div className="space-y-3 border-l border-white/5 ml-1.5 pl-4">
                {activities.map((log) => (
                    <div key={log.id} className="relative">
                        <div className="absolute -left-[21px] top-1.5 w-1.5 h-1.5 rounded-full bg-brand-teal" />
                        <div className="text-[7px] font-black text-slate-700 uppercase tracking-widest mb-0.5">{log.timestamp ? new Date(log.timestamp).toLocaleString() : 'Recent'}</div>
                        <div className="text-[10px] text-slate-400">{log.action_text}</div>
                    </div>
                ))}
            </div>
        </section>
    );
}
