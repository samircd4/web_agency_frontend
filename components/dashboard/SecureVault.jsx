import { motion } from 'framer-motion';
import { FileText, Download } from 'lucide-react';

export default function SecureVault({ vaultFiles }) {
    return (
        <motion.div key="vault" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}>
            <div className="mb-6">
                <h1 className="text-2xl font-black text-white mb-1 tracking-tight uppercase">Secure Vault</h1>
                <p className="text-slate-500 text-xs">Encrypted storage for briefings and project deliverables.</p>
            </div>

            <div className="grid gap-2">
                {vaultFiles.length === 0 ? (
                    <div className="p-8 text-center bg-white/[0.01] border border-white/5 rounded-xl text-slate-500 text-sm">
                        No files stored in this vault workspace.
                    </div>
                ) : (
                    vaultFiles.map((file, i) => (
                        <div key={i} className="p-4 rounded-xl glass border border-white/5 flex items-center justify-between group hover:border-brand-teal/30 transition-all">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-slate-500 group-hover:text-brand-teal transition-colors">
                                    <FileText size={18} />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-xs mb-0.5">{file.name}</h4>
                                    <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[8px] font-black uppercase tracking-widest text-slate-600">
                                        <span>Size: {file.size || 'N/A'}</span>
                                        <span>Project: {file.projectName}</span>
                                        {file.uploaded_at && <span>Added: {new Date(file.uploaded_at).toLocaleDateString()}</span>}
                                    </div>
                                </div>
                            </div>
                            <a href={file.file_url} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-lg bg-white/5 text-slate-500 hover:text-white hover:bg-brand-teal transition-all">
                                <Download size={14} />
                            </a>
                        </div>
                    ))
                )}
            </div>
        </motion.div>
    );
}
