'use client';

import React from 'react';
import { FileText, Download } from 'lucide-react';
import { bytesToMB } from '@/lib/utils/formatters';

export default function VaultFileItem({ file }) {
    return (
        <div className="p-4 rounded-xl glass border border-white/5 flex items-center justify-between group hover:border-brand-teal/30 transition-all">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-muted group-hover:text-brand-teal transition-colors">
                    <FileText size={18} />
                </div>
                <div>
                    <h4 className="text-white font-bold text-sm mb-0.5">{file.name}</h4>
                    <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[10px] font-black uppercase tracking-widest text-secondary">
                        <span>Size: {bytesToMB(file.size)} MB</span>
                        <span>Project: {file.projectName}</span>
                        {file.uploaded_at && <span>Added: {new Date(file.uploaded_at).toLocaleDateString()}</span>}
                    </div>
                </div>
            </div>
            <a href={file.file_url} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-lg bg-white/5 text-muted hover:text-white hover:bg-brand-teal transition-all">
                <Download size={14} />
            </a>
        </div>
    );
}
