'use client';
import { Send, Paperclip, Smile, Loader2, X } from 'lucide-react';

export default function ChatFooter({ messageText, setMessageText, files, setFiles, isSending, onSubmit }) {
    const handleFileChange = (e) => {
        setFiles([...files, ...Array.from(e.target.files)]);
    };

    return (
        <div className="p-4 border-t border-white/5 bg-white/[0.02] shrink-0">
            {files.length > 0 && (
                <div className="mb-3 flex gap-2 flex-wrap max-h-24 overflow-y-auto">
                    {files.map((file, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 shadow-sm">
                            <span className="text-xs text-slate-400 truncate max-w-[150px] font-medium">{file.name}</span>
                            <button type="button" onClick={() => setFiles(files.filter((_, i) => i !== idx))} className="text-slate-500 hover:text-red-400 transition-colors ml-1 font-bold">
                                <X size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <form onSubmit={onSubmit} className="flex items-end gap-2">
                <input type="file" id="client-file-upload" multiple onChange={handleFileChange} disabled={isSending} className="hidden" />
                <label htmlFor="client-file-upload" className={`p-2.5 rounded-lg bg-white/5 text-slate-400 hover:text-white transition-colors border border-white/5 cursor-pointer ${isSending ? 'opacity-50 pointer-events-none' : ''}`}>
                    <Paperclip size={16} />
                </label>
                <button type="button" className="p-2.5 rounded-lg bg-white/5 text-slate-400 hover:text-white transition-colors border border-white/5"><Smile size={16} /></button>
                <div className="flex-grow bg-white/5 border border-white/5 rounded-lg px-4 py-2">
                    <input type="text" placeholder={isSending ? "Syncing telemetry..." : "Encrypted message..."} value={messageText} onChange={(e) => setMessageText(e.target.value)} disabled={isSending} className="flex-grow bg-transparent border-none outline-none text-sm text-white placeholder:text-slate-600 w-full font-bold disabled:opacity-50" />
                </div>
                <button type="submit" disabled={(!messageText.trim() && files.length === 0) || isSending} className="p-2.5 bg-brand-teal text-primary rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center min-w-[42px]">
                    {isSending ? <Loader2 size={16} className="animate-spin text-brand-dark" /> : <Send size={16} />}
                </button>
            </form>
        </div>
    );
}