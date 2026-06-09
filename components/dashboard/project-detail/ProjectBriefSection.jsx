'use client';

import React from 'react';
import { Terminal } from 'lucide-react';

export default function ProjectBriefSection({ description }) {
    return (
        <section>
            <h4 className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-2 flex items-center gap-2"><Terminal size={11} className="text-brand-teal" /> Project Brief</h4>
            <p className="text-slate-300 text-sm leading-relaxed italic">{description || 'No detailed brief provided.'}</p>
        </section>
    );
}
