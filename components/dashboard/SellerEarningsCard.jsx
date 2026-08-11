'use client';

import React, { useState, useEffect } from 'react';
import { DollarSign, Clock, CheckCircle2, Briefcase, TrendingUp } from 'lucide-react';
import { api } from '@/lib/api';

export default function SellerEarningsCard() {
    const [stats, setStats] = useState({
        total_earnings: 320,
        pending_payouts: 0,
        active_projects_count: 0,
        completed_projects_count: 0,
        services_count: 0,
        portfolio_count: 0,
        blog_count: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                const data = await api.getSellerStats();
                setStats(data);
            } catch (err) {
                console.error("Failed to load seller stats:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, []);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Total Balance / Earnings */}
            <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/20 backdrop-blur-md shadow-xl flex items-center justify-between">
                <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-purple-300">Total Earnings</div>
                    <div className="text-2xl font-black text-white mt-1">
                        ${loading ? '...' : stats.total_earnings.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                    <div className="text-[9px] font-bold text-emerald-400 mt-1 flex items-center gap-1">
                        <TrendingUp size={10} /> Paid via Stripe Invoices
                    </div>
                </div>
                <div className="p-3 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    <DollarSign size={20} />
                </div>
            </div>

            {/* Pending Payouts */}
            <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-500/20 backdrop-blur-md shadow-xl flex items-center justify-between">
                <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-blue-300">Pending Payouts</div>
                    <div className="text-2xl font-black text-white mt-1">
                        ${loading ? '...' : stats.pending_payouts.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                    <div className="text-[9px] font-bold text-slate-400 mt-1">Awaiting client invoice payment</div>
                </div>
                <div className="p-3 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <Clock size={20} />
                </div>
            </div>

            {/* Active Orders */}
            <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/20 backdrop-blur-md shadow-xl flex items-center justify-between">
                <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-amber-300">Active Orders</div>
                    <div className="text-2xl font-black text-white mt-1">
                        {loading ? '...' : stats.active_projects_count}
                    </div>
                    <div className="text-[9px] font-bold text-amber-400/80 mt-1">In progress / QA / Staging</div>
                </div>
                <div className="p-3 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Briefcase size={20} />
                </div>
            </div>

            {/* Completed Deliveries */}
            <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/20 backdrop-blur-md shadow-xl flex items-center justify-between">
                <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-emerald-300">Completed Orders</div>
                    <div className="text-2xl font-black text-white mt-1">
                        {loading ? '...' : stats.completed_projects_count}
                    </div>
                    <div className="text-[9px] font-bold text-emerald-400 mt-1">Fully delivered & accepted</div>
                </div>
                <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 size={20} />
                </div>
            </div>
        </div>
    );
}
