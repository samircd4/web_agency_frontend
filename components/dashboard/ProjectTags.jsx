import React from 'react';
import { Cpu } from 'lucide-react';

export default function ProjectTags({ tags }) {
    if (!tags || tags.length === 0) return null;
    return (
        <section>
            <div className="text-[10px] font-black text-muted uppercase tracking-widest mb-2 flex items-center gap-2">
                <Cpu size={12} className="text-brand-red" />
                Tech Stack
            </div>
            <div className="flex flex-wrap gap-2">
                {tags.map((t) => (
                    <span
                        key={t}
                        className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-[10px] font-black text-white uppercase tracking-widest"
                    >
                        {t}
                    </span>
                ))}
            </div>
        </section>
    );
}
