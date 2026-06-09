import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Terminal, CheckCircle2, Activity, Cpu, FileText, Download, Shield, Loader2, Clock, Zap, MessageSquare } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

import { centsToMoney, invoicePaymentLabel } from '@/lib/utils/formatters';
import { canPayInvoice } from '@/lib/utils/billing-utils';
import ProjectDetailModal from './modals/ProjectDetailModal';

export default function DashboardModals({
    selectedProject,
    setSelectedProject,
    selectedInvoice,
    setSelectedInvoice,
    selectedProposal,
    setSelectedProposal,
    handleProposalRespond,
    proposalActionInProgress,
    proposalActionError,
    showDeclineConfirm,
    setShowDeclineConfirm,
    onPayInvoice,
    onPrintInvoice,
    router,
}) {
    return (
        <>
            <ProjectDetailModal selectedProject={selectedProject} setSelectedProject={setSelectedProject} router={router} />

            <AnimatePresence>
                {selectedInvoice && (
                    <motion.div className="fixed inset-0 z-[210] flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <motion.div onClick={() => setSelectedInvoice(null)} className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" />
                        <motion.div initial={{ opacity: 0, scale: 0.98, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: 10 }} className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden border border-white/10 rounded-2xl bg-[#080f1e] shadow-2xl flex flex-col" onClick={(e) => e.stopPropagation()}>
                            <div className="p-5 border-b border-white/5 flex items-start justify-between bg-white/[0.02]">
                                <div className="min-w-0">
                                    <div className="text-[8px] font-black text-brand-teal uppercase tracking-[0.3em] mb-0.5 truncate">{selectedInvoice._projectTitle || 'Project'} • {selectedInvoice.number || `#${selectedInvoice.id}`}</div>
                                    <h2 className="text-lg font-black text-white uppercase tracking-tight">Invoice</h2>
                                </div>
                                <button onClick={() => setSelectedInvoice(null)} className="w-9 h-9 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-600 hover:text-white hover:bg-brand-red/20 transition-all shrink-0">
                                    <X size={16} />
                                </button>
                            </div>

                            <div className="flex-grow overflow-y-auto p-6 space-y-6">
                                <div className="grid md:grid-cols-3 gap-3">
                                    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                        <div className="text-[7px] font-black text-slate-700 uppercase tracking-widest mb-2">Status</div>
                                        <div className="text-xs font-black text-white uppercase tracking-widest">{invoicePaymentLabel(selectedInvoice.status)}</div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                        <div className="text-[7px] font-black text-slate-700 uppercase tracking-widest mb-2">Issued</div>
                                        <div className="text-xs font-black text-white uppercase tracking-widest">{selectedInvoice.issued_at ? new Date(selectedInvoice.issued_at).toLocaleDateString() : '—'}</div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                        <div className="text-[7px] font-black text-slate-700 uppercase tracking-widest mb-2">Total</div>
                                        <div className="text-xs font-black text-brand-teal uppercase tracking-widest">{(selectedInvoice.currency || 'usd').toUpperCase()} {centsToMoney(selectedInvoice.amount_total_cents)}</div>
                                    </div>
                                </div>

                                {selectedInvoice.notes && (
                                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                                        <div className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-2">Notes</div>
                                        <div className="text-xs text-slate-300 whitespace-pre-wrap">{selectedInvoice.notes}</div>
                                    </div>
                                )}

                                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                                    <div className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-3">Items</div>
                                    {(selectedInvoice.items || []).length === 0 ? (
                                        <div className="text-xs text-slate-500">No items.</div>
                                    ) : (
                                        <div className="space-y-2">
                                            {(selectedInvoice.items || []).map((it) => (
                                                <div key={it.id} className="flex items-start justify-between gap-4 p-3 rounded-xl bg-white/5 border border-white/5">
                                                    <div className="min-w-0">
                                                        <div className="text-xs font-black text-white">{it.description}</div>
                                                        <div className="text-[9px] font-black uppercase tracking-widest text-slate-600 mt-1">Qty {it.quantity} • {(selectedInvoice.currency || 'usd').toUpperCase()} {centsToMoney(it.unit_amount_cents)} each</div>
                                                    </div>
                                                    <div className="text-xs font-black text-brand-teal shrink-0">{(selectedInvoice.currency || 'usd').toUpperCase()} {centsToMoney(it.amount_cents)}</div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="p-4 bg-white/[0.02] border-t border-white/5 flex items-center justify-end gap-2">
                                <button type="button" onClick={() => onPrintInvoice(selectedInvoice)} className="px-4 py-2 bg-brand-teal/10 border border-brand-teal/20 text-brand-teal rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-brand-teal/15 transition-all">
                                    Print
                                </button>
                                {canPayInvoice(selectedInvoice.status) && (
                                    <button type="button" onClick={() => onPayInvoice(selectedInvoice)} className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-emerald-500/15 transition-all">
                                        Pay Now
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {selectedProposal && (
                    <motion.div className="fixed inset-0 z-[210] flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <motion.div onClick={() => setSelectedProposal(null)} className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" />
                        <motion.div initial={{ opacity: 0, scale: 0.98, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: 10 }} className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden border border-white/10 rounded-2xl bg-[#080f1e] shadow-2xl flex flex-col" onClick={(e) => e.stopPropagation()}>
                            <div className="p-5 border-b border-white/5 flex items-start justify-between bg-white/[0.02]">
                                <div className="min-w-0">
                                    <div className="text-[8px] font-black text-brand-teal uppercase tracking-[0.3em] mb-0.5 truncate">{selectedProposal._projectTitle || 'Project'} • #{selectedProposal.id}</div>
                                    <h2 className="text-lg font-black text-white uppercase tracking-tight truncate">{selectedProposal.title || 'Proposal'}</h2>
                                    <div className="text-[9px] font-black uppercase tracking-widest text-slate-600 mt-1">{selectedProposal.status}{selectedProposal.sent_at ? ` • sent ${new Date(selectedProposal.sent_at).toLocaleDateString()}` : ''}</div>
                                </div>
                                <button onClick={() => setSelectedProposal(null)} className="w-9 h-9 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-600 hover:text-white hover:bg-brand-red/20 transition-all shrink-0">
                                    <X size={16} />
                                </button>
                            </div>

                            <div className="flex-grow overflow-y-auto p-6">
                                <div className="prose prose-invert max-w-none prose-a:text-brand-teal prose-strong:text-white prose-p:text-slate-300">
                                    <ReactMarkdown>{selectedProposal.body_md || ''}</ReactMarkdown>
                                </div>
                            </div>

                            {proposalActionError && (
                                <div className="mx-6 p-4 rounded-xl bg-brand-red/10 border border-brand-red/20 text-brand-red text-sm">{proposalActionError}</div>
                            )}

                            {selectedProposal.status === 'sent' && (
                                <div className="p-4 bg-white/[0.02] border-t border-white/5 flex items-center justify-end gap-2">
                                    <button type="button" onClick={() => setShowDeclineConfirm(true)} disabled={proposalActionInProgress !== null} className="px-4 py-2 bg-white/5 border border-white/15 text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-brand-red/10 hover:border-brand-red/30 hover:text-brand-red transition-all disabled:opacity-50">
                                        Decline
                                    </button>
                                    <button type="button" onClick={() => handleProposalRespond(selectedProposal._projectId, selectedProposal.id, 'accept')} disabled={proposalActionInProgress !== null} className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-emerald-500/20 transition-all disabled:opacity-50 flex items-center gap-2">
                                        {proposalActionInProgress?.action === 'accept' ? (<><Loader2 size={12} className="animate-spin" />Accepting…</>) : 'Accept Proposal'}
                                    </button>
                                </div>
                            )}

                            {showDeclineConfirm && (
                                <div className="p-4 bg-brand-red/10 border-t border-brand-red/20 flex items-center justify-between gap-4">
                                    <div className="text-sm text-brand-red font-bold">Are you sure you want to decline this proposal?</div>
                                    <div className="flex gap-2">
                                        <button type="button" onClick={() => setShowDeclineConfirm(false)} className="px-3 py-1.5 bg-white/5 border border-white/15 text-white rounded-lg font-black uppercase tracking-widest text-[9px] hover:bg-white/10 transition-all">Cancel</button>
                                        <button type="button" onClick={() => handleProposalRespond(selectedProposal._projectId, selectedProposal.id, 'reject')} disabled={proposalActionInProgress !== null} className="px-3 py-1.5 bg-brand-red/10 border border-brand-red/20 text-brand-red rounded-lg font-black uppercase tracking-widest text-[9px] hover:bg-brand-red/20 transition-all disabled:opacity-50 flex items-center gap-2">
                                            {proposalActionInProgress?.action === 'reject' ? (<><Loader2 size={12} className="animate-spin" />Declining…</>) : 'Confirm Decline'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}


