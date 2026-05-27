import { motion } from 'framer-motion';
import { ArrowLeft, Lock, Send } from 'lucide-react';

export default function Communications({ missions }) {
    return (
        <motion.div key="comms" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}>
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-white mb-1 tracking-tight uppercase">Secure Comms</h1>
                    <p className="text-slate-500 text-xs">Direct encrypted channel to lead team.</p>
                </div>
                <button className="p-2 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-lg border border-white/5 transition-all" title="Return to Command">
                    <ArrowLeft size={14} />
                </button>
            </div>

            <div className="glass border-white/5 rounded-xl h-[500px] flex flex-col overflow-hidden">
                <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-teal/20 flex items-center justify-center text-brand-teal font-black text-[10px]">DP</div>
                        <div>
                            <div className="text-[10px] font-black text-white uppercase tracking-widest">Lead Engineer</div>
                            <div className="text-[7px] font-bold text-brand-teal uppercase tracking-widest">Active Node</div>
                        </div>
                    </div>
                    <button className="p-2 rounded-lg bg-white/5 text-slate-600"><Lock size={12} /></button>
                </div>

                <div className="flex-grow p-5 space-y-4 overflow-y-auto">
                    <div className="flex gap-3 max-w-sm">
                        <div className="w-7 h-7 rounded-full bg-brand-teal/20 flex items-center justify-center text-brand-teal text-[8px] font-black shrink-0">DP</div>
                        <div className="p-4 rounded-xl rounded-tl-none bg-white/5 border border-white/5 text-xs leading-relaxed text-slate-300">
                            Secure telemetry setup completed. Please upload project requirements and wireframes to the secure vault directly, or communicate here.
                        </div>
                    </div>

                    {missions.map((m) => (m.activities || []).slice(0, 2).map((log) => (
                        <div key={`${m.id}-${log.id}`} className="flex gap-3 max-w-sm ml-auto flex-row-reverse">
                            <div className="w-7 h-7 rounded-full bg-brand-blue/20 flex items-center justify-center text-brand-blue text-[8px] font-black shrink-0">CL</div>
                            <div className="p-4 rounded-xl rounded-tr-none bg-brand-blue/5 border border-brand-blue/20 text-xs leading-relaxed text-slate-300">
                                {log.action_text} ({new Date(log.timestamp).toLocaleTimeString()})
                            </div>
                        </div>
                    )))}
                </div>

                <div className="p-4 border-t border-white/5 bg-white/[0.02]">
                    <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
                        <input type="text" placeholder="Encrypted message..." className="flex-grow bg-white/5 border border-white/10 rounded-lg px-4 text-xs text-white focus:outline-none focus:border-brand-teal/50" />
                        <button type="submit" className="p-3 bg-brand-teal text-text-primary rounded-lg shadow-glow-teal"><Send size={16} /></button>
                    </form>
                </div>
            </div>
        </motion.div>
    );
}
