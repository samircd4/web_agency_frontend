'use client';
import React from 'react';

import AdminModal from '@/components/AdminModal';
import { AlertCircle, Loader2, Trash2, CheckCircle } from 'lucide-react';

export default function ConfirmDangerModal({
    open,
    onClose,
    title = 'Confirm Action',
    subtitle = '',
    heading = 'Are you sure?',
    body,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    loading = false,
    onConfirm,
    modalIcon = AlertCircle,
    confirmIcon = Trash2,
    confirmColorClass = 'bg-brand-red/15 border border-brand-red/30 text-brand-red',
    bodyColorClass = 'bg-brand-red/10 border border-brand-red/20',
}) {
    return (
        <AdminModal
            open={open}
            onClose={loading ? undefined : onClose}
            title={title}
            subtitle={subtitle}
            icon={modalIcon}
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
                        className={`px-3.5 py-2 rounded-xl ${confirmColorClass} font-black uppercase tracking-widest text-[10px] hover:bg-opacity-80 transition-all flex items-center gap-2 disabled:opacity-60`}
                    >
                        {loading ? <Loader2 size={14} className="animate-spin" /> : React.createElement(confirmIcon, { size: 14 })}
                        {confirmText}
                    </button>
                </div>
            }
        >
            <div className="p-5">
                <div className={`p-4 rounded-2xl ${bodyColorClass}`}>
                    <div className="text-xs font-black text-text-primary uppercase tracking-widest mb-1">{heading}</div>
                    <div className="text-sm font-bold text-text-secondary">
                        {body || 'You are about to permanently delete this item.'}
                    </div>
                </div>
            </div>
        </AdminModal>
    );
}
