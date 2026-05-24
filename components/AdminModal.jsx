'use client';

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

export default function AdminModal({
    open,
    onClose,
    title,
    subtitle,
    icon: Icon,
    children,
    footer,
    maxWidthClass = 'max-w-3xl',
}) {
    useEffect(() => {
        if (!open) return;
        const onKeyDown = (e) => {
            if (e.key === 'Escape') onClose?.();
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [open, onClose]);

    return (
        <AnimatePresence>
            {open && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
                    />

                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        initial={{ opacity: 0, y: 18, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 12, scale: 0.98 }}
                        transition={{ type: 'spring', damping: 26, stiffness: 260 }}
                        className={`relative w-full ${maxWidthClass} bg-surface-900/95 border border-border-subtle rounded-2xl shadow-2xl shadow-black/60 overflow-hidden`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {(title || subtitle) && (
                            <div className="p-5 border-b border-border-subtle flex items-start justify-between bg-surface-900/90 backdrop-blur-xl">
                                <div className="flex items-center gap-3 min-w-0">
                                    {Icon && (
                                        <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center shrink-0">
                                            <Icon size={18} className="text-brand-teal" />
                                        </div>
                                    )}
                                    <div className="min-w-0">
                                        {title && <h2 className="text-lg font-black text-text-primary truncate">{title}</h2>}
                                        {subtitle && <p className="text-xs text-text-muted truncate">{subtitle}</p>}
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-xl bg-white/5 text-text-muted hover:text-text-primary transition-all shrink-0"
                                    aria-label="Close modal"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        )}

                        <div className="max-h-[78vh] overflow-y-auto">
                            {children}
                        </div>

                        {footer && (
                            <div className="p-5 border-t border-border-subtle bg-surface-900/90 backdrop-blur-xl">
                                {footer}
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

