'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { Users, TrendingUp } from 'lucide-react';

const fadeIn = (delay = 0) => ({
    initial: { opacity: 0, y: 5 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay },
});

const BAR_COLOR         = '#818cf8'; // indigo-400
const BAR_COLOR_ACTIVE  = '#a5b4fc'; // indigo-300
const BAR_COLOR_PEAK    = '#6366f1'; // indigo-500 — highlight the max bar

const dataMock = [
    { name: 'Jan', clients: 40 },
    { name: 'Feb', clients: 30 },
    { name: 'Mar', clients: 50 },
    { name: 'Apr', clients: 45 },
    { name: 'May', clients: 60 },
    { name: 'Jun', clients: 55 },
];

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div style={{
            background: '#0f172a',
            border: '1px solid rgba(129,140,248,0.25)',
            borderRadius: 10,
            padding: '8px 14px',
            fontSize: 12,
        }}>
            <div style={{ color: '#64748b', marginBottom: 2, letterSpacing: '0.05em' }}>
                {label}
            </div>
            <div style={{ color: BAR_COLOR_ACTIVE, fontWeight: 700, fontSize: 16 }}>
                {payload[0].value}
                <span style={{ fontSize: 11, fontWeight: 400, color: '#64748b', marginLeft: 4 }}>clients</span>
            </div>
        </div>
    );
};

const ClientAcquisitionChart = ({ data: dataProp }) => {
    const [activeIndex, setActiveIndex] = useState(null);

    const chartData = dataProp || dataMock;
    const total = chartData.reduce((s, d) => s + d.clients, 0);
    const peak  = Math.max(...chartData.map(d => d.clients), 0);
    const lastTwo = chartData.slice(-2);
    const growthPct = lastTwo.length >= 2 && lastTwo[0].clients > 0
        ? Math.round(((lastTwo[1].clients - lastTwo[0].clients) / lastTwo[0].clients) * 100)
        : 0;
    const avgClients = chartData.length > 0 ? Math.round(total / chartData.length) : 0;

    return (
        <motion.div
            {...fadeIn(0.45)}
            style={{
                padding: '20px 20px 16px',
                borderRadius: 16,
                background: 'rgba(255,255,255,0.02)',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
            }}
        >
            {/* Header row */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                        width: 28, height: 28, borderRadius: 8,
                        background: 'rgba(99,102,241,0.12)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <Users size={13} color="#818cf8" />
                    </div>
                    <span style={{
                        fontSize: 12, fontWeight: 700, color: '#f1f5f9',
                        letterSpacing: '0.08em', textTransform: 'uppercase',
                    }}>
                        Client Acquisition
                    </span>
                </div>

                {/* Growth badge */}
                <div style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    background: growthPct >= 0 ? 'rgba(45,212,191,0.10)' : 'rgba(248,113,113,0.10)',
                    border: `1px solid ${growthPct >= 0 ? 'rgba(45,212,191,0.20)' : 'rgba(248,113,113,0.20)'}`,
                    borderRadius: 20, padding: '3px 9px',
                }}>
                    <TrendingUp size={10} color={growthPct >= 0 ? '#2dd4bf' : '#f87171'} />
                    <span style={{
                        fontSize: 11, fontWeight: 700,
                        color: growthPct >= 0 ? '#2dd4bf' : '#f87171',
                    }}>
                        {growthPct >= 0 ? '+' : ''}{growthPct}% MoM
                    </span>
                </div>
            </div>

            {/* Stat pills */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                {[
                    { label: 'Total Clients', value: total },
                    { label: 'Peak Month', value: peak },
                    { label: 'Avg / Month', value: avgClients },
                ].map(stat => (
                    <div key={stat.label} style={{
                        flex: 1, padding: '8px 10px', borderRadius: 10,
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.05)',
                    }}>
                        <div style={{ fontSize: 17, fontWeight: 800, color: '#f1f5f9', lineHeight: 1 }}>
                            {stat.value}
                        </div>
                        <div style={{ fontSize: 10, color: '#475569', marginTop: 3, letterSpacing: '0.04em' }}>
                            {stat.label.toUpperCase()}
                        </div>
                    </div>
                ))}
            </div>

            {/* Chart */}
            <div style={{ flex: 1, minHeight: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        margin={{ top: 4, right: 4, left: -24, bottom: 0 }}
                        barCategoryGap="35%"
                        onMouseLeave={() => setActiveIndex(null)}
                    >
                        <CartesianGrid
                            strokeDasharray="2 4"
                            stroke="rgba(255,255,255,0.04)"
                            vertical={false}
                        />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#475569', fontSize: 11 }}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#475569', fontSize: 11 }}
                            tickCount={4}
                            domain={[0, 'auto']}
                        />
                        <Tooltip
                            content={<CustomTooltip />}
                            cursor={{ fill: 'rgba(255,255,255,0.03)', radius: 6 }}
                        />
                        <Bar
                            dataKey="clients"
                            radius={[5, 5, 0, 0]}
                            onMouseEnter={(_, index) => setActiveIndex(index)}
                        >
                            {chartData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={
                                        activeIndex === index
                                            ? BAR_COLOR_ACTIVE
                                            : entry.clients === peak
                                                ? BAR_COLOR_PEAK
                                                : BAR_COLOR
                                    }
                                    opacity={activeIndex !== null && activeIndex !== index ? 0.45 : 1}
                                    style={{ transition: 'opacity 0.2s ease, fill 0.2s ease' }}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};

export default ClientAcquisitionChart;