import React from 'react';
import { Activity } from 'lucide-react';

export default function ProjectActivityLog({ activities }) {
    if (!activities || activities.length === 0) return null;

    return (
        <section>
            <div className="text-[10px] font-black text-muted uppercase tracking-widest mb-3 flex items-center gap-2">
                <Activity size={12} className="text-brand-indigo" />
                Activity Log
            </div>
            <div className="max-h-[450px] overflow-y-auto space-y-4 border-l border-white/5 ml-1.5 pl-4 pr-2">
                {activities.map((log, idx) => (
                    <div key={log.id || idx} className="relative">
                        <div className="absolute -left-[21px] top-1.5 w-1.5 h-1.5 rounded-full bg-brand-teal" />
                        <div className="text-[10px] font-black text-muted uppercase tracking-widest mb-0.5">
                            {log.timestamp ? new Date(log.timestamp).toLocaleString() : 'Recent'}
                        </div>
                        <div className="text-tiny text-secondary leading-normal">{log.action_text}</div>
                    </div>
                ))}
            </div>
        </section>
    );
}
