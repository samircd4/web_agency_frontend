'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, X, Upload, Loader2, Image as ImageIcon, Trash2 } from 'lucide-react';
import AdminModal from '@/components/AdminModal';
import { api } from '@/lib/api';

export default function ProjectCompleteModal({ open, onClose, loading, onConfirm }) {
    const [imageUrl, setImageUrl] = useState('');
    const [preview, setPreview] = useState('');
    const [uploading, setUploading] = useState(false);
    const fileRef = useRef();

    const handleFile = async (file) => {
        if (!file) return;
        setUploading(true);
        try {
            const result = await api.uploadProjectPortfolioImage(null, file);
            const url = result?.file_url || result?.url || result?.image_url || '';
            setImageUrl(url);
            setPreview(url);
        } catch {
            // Fall back to local preview
            setPreview(URL.createObjectURL(file));
            setImageUrl('');
        } finally {
            setUploading(false);
        }
    };

    const clearImage = () => {
        setImageUrl('');
        setPreview('');
        if (fileRef.current) fileRef.current.value = '';
    };

    const handleConfirm = () => {
        onConfirm(imageUrl ? { completion_image_url: imageUrl } : {});
    };

    return (
        <AdminModal
            open={open}
            onClose={() => { if (!loading) { clearImage(); onClose(); } }}
            title="Complete Project"
            subtitle="Mark this project as finished"
            icon={CheckCircle2}
            maxWidthClass="max-w-md"
            footer={
                <div className="flex gap-3">
                    <button
                        onClick={() => { clearImage(); onClose(); }}
                        disabled={loading}
                        className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 text-text-muted text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={loading || uploading}
                        className="flex-1 py-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-black uppercase tracking-widest hover:bg-emerald-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loading ? <><Loader2 size={13} className="animate-spin" /> Completing...</> : <><CheckCircle2 size={13} /> Mark Complete</>}
                    </button>
                </div>
            }
        >
            <div className="p-5 space-y-5">
                {/* Warning */}
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <p className="text-sm font-bold text-emerald-400 mb-1">Are you sure?</p>
                    <p className="text-xs text-text-muted leading-relaxed">
                        This will mark the project as <strong className="text-emerald-400">Complete</strong> and notify the client.
                        The client will then be prompted to leave a review.
                    </p>
                </div>

                {/* Optional completion image */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="text-[10px] font-black uppercase tracking-widest text-text-muted">
                            Completion Preview Image
                            <span className="ml-1 normal-case font-normal text-text-dim">(optional)</span>
                        </label>
                        {preview && (
                            <button
                                type="button"
                                onClick={clearImage}
                                className="text-[10px] text-brand-red hover:underline font-bold"
                            >
                                Remove
                            </button>
                        )}
                    </div>
                    <p className="text-[11px] text-text-dim leading-relaxed">
                        Attach a screenshot or preview of the finished work. The client will be able to see it and accept or decline its use in your portfolio.
                    </p>

                    <AnimatePresence mode="wait">
                        {preview ? (
                            <motion.div
                                key="preview"
                                initial={{ opacity: 0, scale: 0.97 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.97 }}
                                className="relative rounded-xl overflow-hidden border border-white/10 bg-slate-950 aspect-video"
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={preview} alt="Completion preview" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={clearImage}
                                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 flex items-center justify-center text-white hover:bg-brand-red transition-colors"
                                >
                                    <X size={13} />
                                </button>
                                {!imageUrl && (
                                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-yellow-500/20 border-t border-yellow-500/30">
                                        <p className="text-[10px] text-yellow-400 font-bold text-center">⚠ Upload failed — local preview only. Image won't be saved.</p>
                                    </div>
                                )}
                            </motion.div>
                        ) : (
                            <motion.button
                                key="upload"
                                type="button"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => fileRef.current?.click()}
                                disabled={uploading}
                                className="w-full aspect-video rounded-xl border-2 border-dashed border-white/10 hover:border-brand-teal/40 hover:bg-brand-teal/5 transition-all flex flex-col items-center justify-center gap-2 text-text-muted hover:text-brand-teal disabled:opacity-50"
                            >
                                {uploading ? (
                                    <><Loader2 size={22} className="animate-spin text-brand-teal" /><span className="text-xs font-black uppercase tracking-widest">Uploading...</span></>
                                ) : (
                                    <><ImageIcon size={22} /><span className="text-xs font-black uppercase tracking-widest">Click to upload image</span><span className="text-[10px] text-text-dim">PNG, JPG, WebP up to 10MB</span></>
                                )}
                            </motion.button>
                        )}
                    </AnimatePresence>
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => handleFile(e.target.files?.[0])} />
                </div>
            </div>
        </AdminModal>
    );
}
