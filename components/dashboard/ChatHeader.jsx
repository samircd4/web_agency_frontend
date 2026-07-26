'use client';
import { Lock } from 'lucide-react';

export default function ChatHeader({ isAdminOnline = false }) {
    return (
        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02] shrink-0">
            <div className="flex items-center gap-3">
                <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-brand-teal/20 flex items-center justify-center text-brand-teal font-black text-sm">DP</div>
                    <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#060814] ${isAdminOnline ? 'bg-green-500' : 'bg-slate-500'}`} />
                </div>
                <div>
                    <div className="text-xs font-black text-white uppercase tracking-widest">Lead Engineer</div>
                    <div className="text-[9px] font-bold uppercase tracking-widest mt-0.5 flex items-center gap-1.5">
                        <span className={isAdminOnline ? 'text-brand-teal' : 'text-slate-500'}>
                            {isAdminOnline ? 'Online' : 'Offline'}
                        </span>
                        <span className="text-slate-600">•</span>
                        <span className="text-slate-500">Active Node</span>
                    </div>
                </div>
            </div>
            <button type="button" className="p-2.5 rounded-lg bg-white/5 text-slate-400 hover:text-white border border-white/5 transition-colors">
                <Lock size={14} />
            </button>
        </div>
    );
}