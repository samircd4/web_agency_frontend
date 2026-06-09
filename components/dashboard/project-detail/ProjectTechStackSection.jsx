'use client';

import React from 'react';
import { Cpu } from 'lucide-react';

export default function ProjectTechStackSection({ tags }) {
    if (!tags || tags.length === 0) return null;

    return (
        <section>
            <h4 className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-2 flex items-center gap-2"><Cpu size={11} className="text-brand-red" /> Tech Stack</h4>
            <div className="flex flex-wrap gap-1.5">
                {tags.map((t) => (
                    <span key={t} className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 text-[8px] font-black text-white uppercase tracking-widest">{t}</span>
                ))}
            </div>
        </section>
    );
}
