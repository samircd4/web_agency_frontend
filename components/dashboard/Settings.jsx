import { motion } from 'framer-motion';

export default function Settings({
    sysConfigName,
    sysConfigEmail,
    currentUser,
    setSysConfigName,
    setSysConfigEmail,
}) {
    return (
        <motion.div key="settings" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}>
            <div className="mb-6">
                <h1 className="text-2xl font-black text-white mb-1 tracking-tight uppercase">System Config</h1>
                <p className="text-slate-500 text-xs">Operational preferences.</p>
            </div>

            <div className="max-w-2xl glass border-white/5 rounded-xl p-6">
                <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[8px] font-black uppercase tracking-widest text-slate-600 ml-2">Name</label>
                            <input
                                type="text"
                                value={sysConfigName}
                                onChange={(e) => setSysConfigName(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-xs text-white focus:outline-none focus:border-brand-teal/50"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[8px] font-black uppercase tracking-widest text-slate-600 ml-2">Email Hook</label>
                            <input
                                type="email"
                                value={sysConfigEmail}
                                onChange={(e) => setSysConfigEmail(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-xs text-white focus:outline-none focus:border-brand-teal/50"
                            />
                        </div>
                    </div>

                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                        <div className="text-[8px] font-black uppercase tracking-widest text-slate-500 mb-1">Account Specifications</div>
                        <div className="flex justify-between text-xs">
                            <span className="text-slate-600">Username ID:</span>
                            <span className="font-mono text-white">{currentUser.username}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span className="text-slate-600">Role Status:</span>
                            <span className="text-white font-bold">{currentUser.is_staff ? 'Staff Member' : 'Associated Client'}</span>
                        </div>
                        {currentUser.date_joined && (
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-600">Established:</span>
                                <span className="text-white">{new Date(currentUser.date_joined).toLocaleDateString()}</span>
                            </div>
                        )}
                    </div>

                    <button className="px-5 py-2 bg-brand-teal text-text-primary rounded-lg text-[9px] font-black uppercase tracking-widest shadow-glow-teal hover:-translate-y-0.5 transition-all">
                        Save System Config
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
