'use client';

import AdminModal from '@/components/AdminModal';
import { AlertCircle, Loader2, Trash2 } from 'lucide-react';

export default function ConfirmDangerModal({
    open,
    onClose,
    title = 'Confirm Delete',
    subtitle = 'This action cannot be undone.',
    heading = 'Are you sure?',
    body,
    confirmText = 'Delete',
    cancelText = 'Cancel',
    loading = false,
    onConfirm,
}) {
    return (
        <AdminModal
            open={open}
            onClose={loading ? undefined : onClose}
            title={title}
            subtitle={subtitle}
            icon={AlertCircle}
            maxWidthClass="max-w-md"
            footer={
                <div className="flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-text-primary font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all disabled:opacity-60"
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={loading}
                        className="px-3.5 py-2 rounded-xl bg-brand-red/15 border border-brand-red/30 text-brand-red font-black uppercase tracking-widest text-[10px] hover:bg-brand-red/25 transition-all flex items-center gap-2 disabled:opacity-60"
                    >
                        {loading ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                        {confirmText}
                    </button>
                </div>
            }
        >
            <div className="p-5">
                <div className="p-4 rounded-2xl bg-brand-red/10 border border-brand-red/20">
                    <div className="text-xs font-black text-text-primary uppercase tracking-widest mb-1">{heading}</div>
                    <div className="text-sm font-bold text-text-secondary">
                        {body || 'You are about to permanently delete this item.'}
                    </div>
                </div>
            </div>
        </AdminModal>
    );
}
