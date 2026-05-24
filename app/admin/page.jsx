'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Zap, Users, Briefcase, TrendingUp, DollarSign,
    Activity, ArrowUpRight, Clock, CheckCircle2, AlertCircle, Circle, Loader2
} from 'lucide-react';
import { api } from '@/lib/api';

const StatusIcon = ({ status }) => {
    if (status === 'new') return <span className="w-2 h-2 rounded-full bg-admin-accent animate-pulse inline-block" />;
    if (status === 'done') return <CheckCircle2 size={12} className="text-emerald-400" />;
    return <Clock size={12} className="text-yellow-400" />;
};

const fadeIn = (delay = 0) => ({
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay },
});

export default function AdminCommandCenter() {
    const [stats, setStats] = useState(null);
    const [activity, setActivity] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const [statsRes, activityRes] = await Promise.all([
                    api.getAdminStats(),
                    api.getAdminActivity(),
                ]);
                setStats(statsRes);
                // Normalize activity — API returns an array of { id, action_text, timestamp }
                const normalized = (Array.isArray(activityRes) ? activityRes : activityRes.results || []).map(item => ({
                    text: item.action_text,
                    time: new Date(item.timestamp).toLocaleString(),
                    status: item.action_text?.toLowerCase().includes('created') || item.action_text?.toLowerCase().includes('new')
                        ? 'new'
                        : item.action_text?.toLowerCase().includes('pending') || item.action_text?.toLowerCase().includes('quote')
                        ? 'pending'
                        : 'done',
                }));
                setActivity(normalized.slice(0, 8));
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 size={24} className="animate-spin text-admin-accent" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <AlertCircle size={24} className="text-admin-danger mx-auto mb-2" />
                    <p className="text-text-muted text-sm">{error}</p>
                </div>
            </div>
        );
    }

    const statCards = [
        { label: 'Monthly Revenue', value: stats?.mrr != null ? `$${Number(stats.mrr).toLocaleString()}` : '$0', change: '', icon: DollarSign, color: 'brand-teal' },
        { label: 'Active Projects', value: String(stats?.active_projects ?? 0), change: 'Stable', icon: Briefcase, color: 'brand-blue' },
        { label: 'Open Leads', value: String(stats?.total_leads ?? 0), change: stats?.new_leads ? `+${stats.new_leads} new` : '', icon: Zap, color: 'brand-red' },
        { label: 'Total Clients', value: String(stats?.total_clients ?? 0), change: '', icon: Users, color: 'brand-indigo' },
    ];

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <motion.div {...fadeIn()} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <p className="text-xs font-black text-admin-accent uppercase tracking-[0.3em] mb-1">Admin</p>
                    <h1 className="text-2xl font-black text-text-primary uppercase tracking-tight">Command Center</h1>
                    <p className="text-text-muted text-sm mt-1">Agency-wide overview and real-time activity.</p>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black text-text-muted uppercase tracking-widest">
                    <Activity size={12} className="text-admin-accent" />
                    Last updated: just now
                </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {statCards.map((s, i) => {
                    const Icon = s.icon;
                    return (
                        <motion.div key={i} {...fadeIn(i * 0.08)}
                            className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Icon size={40} />
                            </div>
                            <div className={`inline-flex items-center justify-center w-9 h-9 rounded-xl bg-${s.color}/10 mb-3`}>
                                <Icon size={16} className={`text-${s.color}`} />
                            </div>
                            <div className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-1">{s.label}</div>
                            <div className="flex items-end gap-2">
                                <div className="text-2xl font-black text-text-primary">{s.value}</div>
                                {s.change && <div className="text-xs font-bold text-admin-accent mb-0.5">{s.change}</div>}
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Content Row */}
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6">

                {/* Revenue chart placeholder */}
                <motion.div {...fadeIn(0.3)} className="p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-base font-black text-text-primary uppercase tracking-tight flex items-center gap-2">
                            <TrendingUp size={14} className="text-admin-accent" /> Revenue Overview
                        </h2>
                        <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Last 6 months</span>
                    </div>
                    {/* Simulated bar chart */}
                    <div className="flex items-end gap-3 h-32">
                        {[45, 72, 58, 90, 68, 100].map((h, i) => (
                            <motion.div
                                key={i}
                                initial={{ height: 0 }}
                                animate={{ height: `${h}%` }}
                                transition={{ duration: 0.6, delay: 0.4 + i * 0.08 }}
                                className="flex-1 bg-gradient-to-t from-brand-teal to-brand-blue rounded-t-lg opacity-70 hover:opacity-100 transition-opacity relative group"
                            >
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-black text-brand-teal opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    {['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'][i]}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-2">
                        {['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'].map(m => (
                            <span key={m} className="flex-1 text-center text-[9px] font-black text-text-dim uppercase tracking-widest">{m}</span>
                        ))}
                    </div>
                </motion.div>

                {/* Recent Activity */}
                <motion.div {...fadeIn(0.35)} className="p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                    <h2 className="text-base font-black text-text-primary uppercase tracking-tight flex items-center gap-2 mb-5">
                        <Activity size={14} className="text-admin-danger" /> Recent Activity
                    </h2>
                    <div className="space-y-3">
                        {activity.length === 0 && (
                            <p className="text-xs text-text-dim italic">No recent activity yet.</p>
                        )}
                        {activity.map((item, i) => (
                            <div key={i} className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-all group">
                                <div className="mt-0.5 shrink-0">
                                    <StatusIcon status={item.status} />
                                </div>
                                <div className="flex-grow min-w-0">
                                    <p className="text-xs font-bold text-text-secondary group-hover:text-text-primary transition-colors leading-relaxed">{item.text}</p>
                                    <p className="text-[10px] font-black text-text-dim uppercase tracking-widest mt-0.5">{item.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
