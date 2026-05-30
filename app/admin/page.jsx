'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Zap,
    Users,
    Briefcase,
    TrendingUp,
    DollarSign,
    Activity,
    Clock,
    CheckCircle2,
    AlertCircle,
    Loader2,
} from 'lucide-react';
import { api } from '@/lib/api';
import ProjectStatusChart from '@/components/admin/ProjectStatusChart';
import ClientAcquisitionChart from '@/components/admin/ClientAcquisitionChart';

import { LineChart, Line, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import ClientMap from '@/components/admin/ClientMap';

const StatusIcon = ({ status }) => {
    if (status === 'new')
        return (
            <span className="w-2 h-2 rounded-full bg-brand-teal animate-pulse inline-block" />
        );
    if (status === 'done')
        return <CheckCircle2 size={12} className="text-emerald-400" />;
    return <Clock size={12} className="text-yellow-400" />;
};

const fadeIn = (delay = 0) => ({
    initial: { opacity: 0, y: 5 },
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
                const normalized = (Array.isArray(activityRes)
                    ? activityRes
                    : activityRes.results || []
                ).map((item) => ({
                    text: item.action_text,
                    time: new Date(item.timestamp).toLocaleString(),
                    status:
                        item.action_text?.toLowerCase().includes('created') ||
                            item.action_text?.toLowerCase().includes('new')
                            ? 'new'
                            : item.action_text?.toLowerCase().includes('pending') ||
                                item.action_text?.toLowerCase().includes('quote')
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
            <div className="min-h-screen bg-[#020617] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 size={32} className="animate-spin text-brand-teal" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                        Decrypting Command Space...
                    </span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <AlertCircle size={24} className="text-brand-red mx-auto mb-2" />
                    <p className="text-slate-500 text-sm">{error}</p>
                </div>
            </div>
        );
    }

    const statCards = [
        {
            label: 'Monthly Revenue',
            value:
                stats?.mrr != null
                    ? `$${Number(stats.mrr).toLocaleString()}`
                    : '$0',
            icon: <DollarSign className="text-brand-teal" />,
            sub: 'MRR',
        },
        {
            label: 'Active Projects',
            value: String(stats?.active_projects ?? 0),
            icon: <Briefcase className="text-brand-blue" />,
            sub: 'Stable',
        },
        {
            label: 'Open Leads',
            value: String(stats?.total_leads ?? 0),
            icon: <Zap className="text-brand-red" />,
            sub: stats?.new_leads ? `+${stats.new_leads} new` : '',
        },
        {
            label: 'Total Clients',
            value: String(stats?.total_clients ?? 0),
            icon: <Users className="text-brand-indigo" />,
            sub: '',
        },
    ];

    return (
        <div className="space-y-6">
            <motion.div
                {...fadeIn()}
                className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4"
            >
                <div>
                    <h1 className="text-2xl font-black text-white mb-1 tracking-tight uppercase">
                        Command Center
                    </h1>
                    <p className="text-slate-500 text-xs">
                        Agency-wide overview and real-time activity.
                    </p>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    <Activity size={12} className="text-brand-teal" />
                    Last updated: just now
                </div>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                {statCards.map((stat, i) => (
                    <motion.div
                        key={i}
                        {...fadeIn(i * 0.08)}
                        className="p-5 rounded-xl glass border border-white/5 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            {React.cloneElement(stat.icon, { size: 24 })}
                        </div>
                        <div className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">
                            {stat.label}
                        </div>
                        <div className="text-2xl font-black text-white mb-0.5">
                            {stat.value}
                        </div>
                        {stat.sub && (
                            <div className="text-[9px] font-bold text-brand-teal">
                                {stat.sub}
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6">
                <motion.div
                    {...fadeIn(0.3)}
                    className="p-5 rounded-2xl bg-white/[0.02]"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-base font-black text-white uppercase tracking-tight flex items-center gap-2">
                            <TrendingUp size={14} className="text-brand-teal" /> Revenue
                            Overview
                        </h2>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                            Last 6 months
                        </span>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={stats?.revenue_overview || []}
                                margin={{
                                    top: 5,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="name" stroke="#94A3B8" />
                                <YAxis stroke="#94A3B8" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1E293B',
                                        border: 'none',
                                        borderRadius: '8px',
                                        color: '#E2E8F0',
                                    }}
                                    itemStyle={{ color: '#E2E8F0' }}
                                    labelStyle={{ color: '#94A3B8' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#22D3EE" // Tailwind cyan-400
                                    activeDot={{ r: 8 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
 
                <motion.div
                    {...fadeIn(0.35)}
                    className="p-5 rounded-2xl bg-white/[0.02]"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-base font-black text-white uppercase tracking-tight flex items-center gap-2 mb-5">
                            <Activity size={14} className="text-brand-red" /> Recent Activity
                        </h2>
                    </div>
                    <div className="h-64 overflow-y-auto pr-2">
                        {activity.length === 0 && (
                            <p className="text-xs text-slate-500 italic">
                                No recent activity yet.
                            </p>
                        )}
                        {activity.map((item, i) => (
                            <div
                                key={i}
                                className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-all group"
                            >
                                <div className="mt-0.5 shrink-0">
                                    <StatusIcon status={item.status} />
                                </div>
                                <div className="flex-grow min-w-0">
                                    <p className="text-xs font-bold text-slate-400 group-hover:text-slate-300 transition-colors leading-relaxed">
                                        {item.text}
                                    </p>
                                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mt-0.5">
                                        {item.time}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
 
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
                <ProjectStatusChart data={stats?.project_status} />
                <ClientAcquisitionChart data={stats?.client_acquisition} />
            </div>
 
            <ClientMap data={stats?.map_data} />
        </div>
    );
}
