'use client';

import React from 'react';
import { Shield } from 'lucide-react';

export default function ProjectDetailFooter() {
    return (
        <div className="p-4 bg-white/[0.02] border-t border-white/5 flex items-center justify-center gap-2">
            <Shield size={10} className="text-brand-teal" />
            <span className="text-[7px] font-black text-slate-700 uppercase tracking-[0.3em]">Protected Engineering Protocol</span>
        </div>
    );
}
