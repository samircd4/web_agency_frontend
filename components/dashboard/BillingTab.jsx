import React from 'react';
import { motion } from 'framer-motion';
import { centsToMoney, invoicePaymentLabel } from '@/lib/utils/formatters';
import { canPayInvoice } from '@/lib/utils/billing-utils';

const valueToMoney = (value) => {
    const numeric = Number(value || 0);
    if (!Number.isFinite(numeric)) return '0.00';
    return numeric.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export default function BillingTab({
    billingNotice,
    billingView,
    setBillingView,
    clientInvoices,
    clientProposals,
    billingDocsLoading,
    billingDocsError,
    onViewInvoice,
    onPrintInvoice,
    onPayInvoice,
    onViewProposal,
}) {
    const pendingCount = clientProposals.filter((p) => p.status === 'sent').length;

    return (
        <motion.div key="billing" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}>
            <div className="mb-6">
                <h1 className="text-2xl font-black text-white mb-1 tracking-tight uppercase">Billing Ledger</h1>
                <p className="text-muted text-xs">Invoices and proposals.</p>
            </div>

            <div className="flex items-center gap-2 mb-4">
                <button
                    type="button"
                    onClick={() => setBillingView('invoices')}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border flex items-center gap-2 ${billingView === 'invoices'
                        ? 'bg-brand-teal/10 border-brand-teal/20 text-brand-teal'
                        : 'bg-white/5 border-white/10 text-muted hover:text-white hover:bg-white/10'}
        `}
                >
                    Invoices
                    {clientInvoices.filter((inv) => inv.status !== 'paid' && inv.status !== 'void').length > 0 && (
                        <span className="ml-1 px-1.5 py-0.5 rounded-full text-[8px] font-black bg-brand-red/20 text-brand-red border border-brand-red/30 animate-pulse">
                            {clientInvoices.filter((inv) => inv.status !== 'paid' && inv.status !== 'void').length}
                        </span>
                    )}
                </button>
                <button
                    type="button"
                    onClick={() => setBillingView('proposals')}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border flex items-center gap-2 ${billingView === 'proposals'
                        ? 'bg-brand-teal/10 border-brand-teal/20 text-brand-teal'
                        : 'bg-white/5 border-white/10 text-muted hover:text-white hover:bg-white/10'}
        `}
                >
                    Proposals
                    {pendingCount > 0 && (
                        <span className="ml-1 px-1.5 py-0.5 rounded-full text-[8px] font-black bg-brand-red/20 text-brand-red border border-brand-red/30 animate-pulse">
                            {pendingCount}
                        </span>
                    )}
                </button>
                {billingDocsLoading && <span className="ml-2 text-[10px] font-black uppercase tracking-widest text-muted">Loading…</span>}
                {billingDocsError && <span className="ml-2 text-[10px] font-black uppercase tracking-widest text-brand-red">{billingDocsError}</span>}
            </div>

            {billingView === 'invoices' ? (
                <div className="glass border-white/5 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-[980px] w-full text-left">
                            <thead>
                                <tr className="bg-slate-950/60 text-[10px] font-black uppercase tracking-[0.16em] text-primary border-b border-white/10 sticky top-0 z-10 backdrop-blur">
                                    <th className="px-6 py-4">Invoice</th>
                                    <th className="px-6 py-4">Project</th>
                                    <th className="px-6 py-4">Budget</th>
                                    <th className="px-6 py-4">Issued</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                                {clientInvoices.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-10 text-center text-secondary text-sm">
                                            No invoices yet.
                                        </td>
                                    </tr>
                                ) : (
                                    clientInvoices.map((inv, idx) => {
                                        const issued = inv.issued_at || inv.created_at;
                                        const paymentLabel = invoicePaymentLabel(inv.status);
                                        const showPayNow = canPayInvoice(inv.status);
                                        return (
                                            <tr key={`${inv._projectId}-${inv.id}`} className={`${idx % 2 === 0 ? 'bg-white/[0.01]' : ''} hover:bg-white/[0.04] transition-colors`}>
                                                <td className="px-6 py-4 font-black text-white text-xs">{inv.number || `#${inv.id}`}</td>
                                                <td className="px-6 py-4 text-primary text-xs uppercase font-bold">{inv._projectTitle || inv.project}</td>
                                                <td className="px-6 py-4 text-primary text-xs font-bold">USD {valueToMoney(inv._projectValue)}</td>
                                                <td className="px-6 py-4 text-secondary text-xs">{issued ? new Date(issued).toLocaleDateString() : '—'}</td>
                                                <td className="px-6 py-4 font-black text-brand-teal text-xs">{(inv.currency || 'usd').toUpperCase()} {centsToMoney(inv.amount_total_cents)}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-[0.14em] border ${paymentLabel === 'Paid'
                                                        ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                                                        : 'bg-white/5 text-primary border-white/10'}`}>
                                                        {paymentLabel}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => onViewInvoice(inv)}
                                                            className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/15 text-xs font-black uppercase tracking-[0.14em] text-white hover:bg-white/10 transition-all"
                                                        >
                                                            View
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => onPrintInvoice(inv)}
                                                            className="px-3 py-1.5 rounded-lg bg-brand-teal/10 border border-brand-teal/25 text-xs font-black uppercase tracking-[0.14em] text-brand-teal hover:bg-brand-teal/15 transition-all"
                                                        >
                                                            Print
                                                        </button>
                                                        {showPayNow ? (
                                                            <button
                                                                type="button"
                                                                onClick={() => onPayInvoice(inv)}
                                                                className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-xs font-black uppercase tracking-[0.14em] text-emerald-300 hover:bg-emerald-500/15 transition-all"
                                                            >
                                                                Pay Now
                                                            </button>
                                                        ) : null}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <>
                    {pendingCount > 0 && (
                        <div className="mb-4 p-4 rounded-xl border bg-brand-red/10 border-brand-red/20 text-brand-red">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <div className="font-black uppercase tracking-widest text-[10px] mb-1">Awaiting Your Approval</div>
                                    <div className="text-xs">{pendingCount} {pendingCount === 1 ? 'proposal' : 'proposals'} awaiting your response.</div>
                                </div>
                                <span className="px-3 py-1 rounded-lg bg-brand-red text-primary font-black uppercase tracking-widest text-[9px] whitespace-nowrap">{pendingCount}</span>
                            </div>
                        </div>
                    )}
                    <div className="glass border-white/5 rounded-xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-[900px] w-full text-left">
                                <thead>
                                    <tr className="bg-slate-950/60 text-[10px] font-black uppercase tracking-[0.16em] text-primary border-b border-white/10 sticky top-0 z-10 backdrop-blur">
                                        <th className="px-6 py-4">Proposal</th>
                                        <th className="px-6 py-4">Project</th>
                                        <th className="px-6 py-4">Budget</th>
                                        <th className="px-6 py-4">Sent</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/10">
                                    {clientProposals.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-10 text-center text-secondary text-sm">No proposals yet.</td>
                                        </tr>
                                    ) : (
                                        clientProposals.map((p, idx) => (
                                            <tr key={`${p._projectId}-${p.id}`} className={`${idx % 2 === 0 ? 'bg-white/[0.01]' : ''} hover:bg-white/[0.04] transition-colors`}>
                                                <td className="px-6 py-4 font-black text-white text-xs">{p.title || `#${p.id}`}</td>
                                                <td className="px-6 py-4 text-primary text-xs uppercase font-bold">{p._projectTitle || p.project}</td>
                                                <td className="px-6 py-4 text-primary text-xs font-bold">USD {valueToMoney(p._projectValue)}</td>
                                                <td className="px-6 py-4 text-secondary text-xs">{p.sent_at ? new Date(p.sent_at).toLocaleDateString() : '—'}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-[0.14em] border ${p.status === 'draft' ? 'bg-slate-500/10 text-slate-300 border-slate-500/20' : p.status === 'sent' ? 'bg-amber-500/10 text-amber-300 border-amber-500/20' : p.status === 'accepted' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' : p.status === 'rejected' ? 'bg-red-500/10 text-red-300 border-red-500/20' : 'bg-white/5 text-primary border-white/10'}`}>
                                                        {p.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        type="button"
                                                        onClick={() => onViewProposal(p)}
                                                        className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/15 text-xs font-black uppercase tracking-[0.14em] text-white hover:bg-white/10 transition-all"
                                                    >
                                                        View
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </motion.div>
    );
}