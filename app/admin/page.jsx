'use client';

import { motion } from 'framer-motion';
import {
    Zap, Users, Briefcase, TrendingUp, DollarSign,
    Activity, ArrowUpRight, Clock, CheckCircle2, AlertCircle, Circle
} from 'lucide-react';

const stats = [
    { label: 'Monthly Revenue', value: '$12,400', change: '+18%', icon: DollarSign, color: 'brand-teal' },
    { label: 'Active Projects', value: '7', change: 'Stable', icon: Briefcase, color: 'brand-blue' },
    { label: 'Open Leads', value: '14', change: '+3 new', icon: Zap, color: 'brand-red' },
    { label: 'Total Clients', value: '38', change: '+2 this week', icon: Users, color: 'brand-indigo' },
];

const recentActivity = [
    { type: 'lead', text: 'New Mission Briefing from Tariq Hassan', time: '5m ago', status: 'new' },
    { type: 'project', text: 'MSN-0091 milestone "QA Complete" marked done', time: '1h ago', status: 'done' },
    { type: 'client', text: 'New client onboarded: Apex Analytics Ltd.', time: '3h ago', status: 'done' },
    { type: 'lead', text: 'Lead MSN-0088 converted to Active Project', time: 'Yesterday', status: 'done' },
    { type: 'project', text: 'Deliverable uploaded for MSN-0085', time: 'Yesterday', status: 'done' },
    { type: 'lead', text: 'Quote sent to Rafael Ortega (E-commerce Build)', time: '2d ago', status: 'pending' },
];

const StatusIcon = ({ status }) => {
    if (status === 'new') return <span className="w-2 h-2 rounded-full bg-brand-teal animate-pulse inline-block" />;
    if (status === 'done') return <CheckCircle2 size={12} className="text-emerald-400" />;
    return <Clock size={12} className="text-yellow-400" />;
};

const fadeIn = (delay = 0) => ({
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay },
});

export default function AdminCommandCenter() {
    return (
        <div className="space-y-6">
            {/* Page Header */}
            <motion.div {...fadeIn()} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <p className="text-[9px] font-black text-brand-teal uppercase tracking-[0.3em] mb-1">Admin</p>
                    <h1 className="text-2xl font-black text-white uppercase tracking-tight">Command Center</h1>
                    <p className="text-slate-500 text-xs mt-1">Agency-wide overview and real-time activity.</p>
                </div>
                <div className="flex items-center gap-2 text-[8px] font-black text-slate-600 uppercase tracking-widest">
                    <Activity size={12} className="text-brand-teal" />
                    Last updated: just now
                </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {stats.map((s, i) => {
                    const Icon = s.icon;
                    return (
                        <motion.div key={i} {...fadeIn(i * 0.08)}
                            className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Icon size={40} />
                            </div>
                            <div className={`inline-flex items-center justify-center w-9 h-9 rounded-xl bg-${s.color}/10 mb-3`}>
                                <Icon size={16} className={`text-${s.color}`} />
                            </div>
                            <div className="text-[8px] font-black text-slate-600 uppercase tracking-[0.2em] mb-1">{s.label}</div>
                            <div className="flex items-end gap-2">
                                <div className="text-2xl font-black text-white">{s.value}</div>
                                <div className="text-[9px] font-bold text-brand-teal mb-0.5">{s.change}</div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Content Row */}
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6">

                {/* Revenue chart placeholder */}
                <motion.div {...fadeIn(0.3)} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-sm font-black text-white uppercase tracking-tight flex items-center gap-2">
                            <TrendingUp size={14} className="text-brand-teal" /> Revenue Overview
                        </h2>
                        <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Last 6 months</span>
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
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[7px] font-black text-brand-teal opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    {['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'][i]}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-2">
                        {['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'].map(m => (
                            <span key={m} className="flex-1 text-center text-[7px] font-black text-slate-700 uppercase tracking-widest">{m}</span>
                        ))}
                    </div>
                </motion.div>

                {/* Recent Activity */}
                <motion.div {...fadeIn(0.35)} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                    <h2 className="text-sm font-black text-white uppercase tracking-tight flex items-center gap-2 mb-5">
                        <Activity size={14} className="text-brand-red" /> Recent Activity
                    </h2>
                    <div className="space-y-3">
                        {recentActivity.map((item, i) => (
                            <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-all group">
                                <div className="mt-0.5 shrink-0">
                                    <StatusIcon status={item.status} />
                                </div>
                                <div className="flex-grow min-w-0">
                                    <p className="text-[10px] font-bold text-slate-300 group-hover:text-white transition-colors leading-relaxed">{item.text}</p>
                                    <p className="text-[8px] font-black text-slate-700 uppercase tracking-widest mt-0.5">{item.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
