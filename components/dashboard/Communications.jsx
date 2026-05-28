import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Send, Paperclip, Smile } from 'lucide-react';

export default function Communications({ missions }) {
    const [messageText, setMessageText] = useState('');
    const [files, setFiles] = useState([]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!messageText.trim() && files.length === 0) return;
        setMessageText('');
        setFiles([]);
    };

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles([...files, ...selectedFiles]);
    };

    return (
        <motion.div key="comms" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="h-full flex flex-col">
            <div className="glass border-white/5 rounded-xl flex-grow flex flex-col overflow-hidden">
                <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-teal/20 flex items-center justify-center text-brand-teal font-black text-[10px]">DP</div>
                        <div>
                            <div className="text-[10px] font-black text-white uppercase tracking-widest">Lead Engineer</div>
                            <div className="text-[7px] font-bold text-brand-teal uppercase tracking-widest">Active Node</div>
                        </div>
                    </div>
                    <button className="p-2 rounded-lg bg-white/5 text-muted"><Lock size={12} /></button>
                </div>

                <div className="flex-grow p-5 space-y-4 overflow-y-auto">
                    <div className="flex gap-3 max-w-sm">
                        <div className="w-7 h-7 rounded-full bg-brand-teal/20 flex items-center justify-center text-brand-teal text-[8px] font-black shrink-0">DP</div>
                        <div className="p-4 rounded-xl rounded-tl-none bg-white/5 border border-white/5 text-sm leading-relaxed text-slate-300">
                            Secure telemetry setup completed. Please upload project requirements and wireframes to the secure vault directly, or communicate here.
                        </div>
                    </div>

                    {missions.map((m) => (m.activities || []).slice(0, 2).map((log) => (
                        <div key={`${m.id}-${log.id}`} className="flex gap-3 max-w-sm ml-auto flex-row-reverse">
                            <div className="w-7 h-7 rounded-full bg-brand-blue/20 flex items-center justify-center text-brand-blue text-[8px] font-black shrink-0">CL</div>
                            <div className="p-4 rounded-xl rounded-tr-none bg-brand-blue/5 border border-brand-blue/20 text-sm leading-relaxed text-slate-300">
                                {log.action_text} ({new Date(log.timestamp).toLocaleTimeString()})
                            </div>
                        </div>
                    )))}
                </div>

                <div className="p-4 border-t border-white/5 bg-white/[0.02]">
                    {files.length > 0 && (
                        <div className="mb-3 flex gap-2 flex-wrap">
                            {files.map((file, idx) => (
                                <div key={idx} className="flex items-center gap-2 bg-white/5 border border-white/5 rounded-lg px-3 py-1.5">
                                    <span className="text-[9px] text-secondary truncate max-w-[120px]">{file.name}</span>
                                    <button type="button" onClick={() => setFiles(files.filter((_, i) => i !== idx))} className="text-muted hover:text-red-400">
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                    <form onSubmit={handleSendMessage} className="flex items-end gap-2">
                        <input
                            type="file"
                            id="file-upload"
                            multiple
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        <label htmlFor="file-upload" className="p-2.5 rounded-lg bg-white/5 text-muted hover:text-white transition-all border border-white/5 cursor-pointer">
                            <Paperclip size={16} />
                        </label>
                        <button type="button" className="p-2.5 rounded-lg bg-white/5 text-muted hover:text-white transition-all border border-white/5">
                            <Smile size={16} />
                        </button>
                        <div className="flex-grow bg-white/5 border border-white/5 rounded-lg px-4 py-2">
                            <input
                                type="text"
                                placeholder="Encrypted message..."
                                value={messageText}
                                onChange={(e) => setMessageText(e.target.value)}
                                className="flex-grow bg-transparent border-none outline-none text-xs text-white placeholder:text-dim w-full font-bold"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={!messageText.trim() && files.length === 0}
                            className="p-3 bg-brand-teal text-primary rounded-lg shadow-glow-teal disabled:opacity-50"
                        >
                            <Send size={16} />
                        </button>
                    </form>
                </div>
            </div>
        </motion.div>
    );
}
