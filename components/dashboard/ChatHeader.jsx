'use client';
import { Lock } from 'lucide-react';

export default function ChatHeader() {
    return (
        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02] shrink-0">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-teal/20 flex items-center justify-center text-brand-teal font-black text-sm">DP</div>
                <div>
                    <div className="text-xs font-black text-white uppercase tracking-widest">Lead Engineer</div>
                    <div className="text-[9px] font-bold text-brand-teal uppercase tracking-widest mt-0.5">Active Node</div>
                </div>
            </div>
            <button type="button" className="p-2.5 rounded-lg bg-white/5 text-slate-400 hover:text-white border border-white/5 transition-colors">
                <Lock size={14} />
            </button>
        </div>
    );
}