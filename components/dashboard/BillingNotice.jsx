'use client';

import React from 'react';

export default function BillingNotice({ billingNotice, onViewBilling }) {
    if (!billingNotice?.kind) return null;

    return (
        <div className="px-3 lg:px-6 pb-4">
            <div
                className={`p-4 rounded-xl border ${billingNotice.kind === 'success'
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-200'
                    : 'bg-amber-500/10 border-amber-500/20 text-amber-200'
                    }`}
            >
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <div className="font-black uppercase tracking-widest text-[10px] mb-1">
                            {billingNotice.kind === 'success'
                                ? 'Payment Successful'
                                : 'Payment Canceled'}
                        </div>
                        <div className="text-slate-200/90 text-xs">
                            {billingNotice.kind === 'success'
                                ? 'Thanks — your payment was received. Your invoice status will update shortly.'
                                : 'No charges were made. You can try again anytime.'}
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onViewBilling}
                        className="shrink-0 px-3 py-1.5 rounded-lg bg-white/5 border border-white/15 text-xs font-black uppercase tracking-[0.14em] text-white hover:bg-white/10 transition-all"
                    >
                        View Billing
                    </button>
                </div>
            </div>
        </div>
    );
}
