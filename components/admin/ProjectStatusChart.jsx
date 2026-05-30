'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Briefcase } from 'lucide-react';

const fadeIn = (delay = 0) => ({
    initial: { opacity: 0, y: 5 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay },
});

const colorMapping = {
    'Completed': { color: '#2dd4bf', bg: 'rgba(45,212,191,0.10)' },
    'In Progress': { color: '#60a5fa', bg: 'rgba(96,165,250,0.10)' },
    'Pending': { color: '#fbbf24', bg: 'rgba(251,191,36,0.10)'  },
    'Cancelled': { color: '#f87171', bg: 'rgba(248,113,113,0.10)' },
};

const dataMock = [
    { name: 'Completed',  count: 3 },
    { name: 'In Progress', count: 5 },
    { name: 'Pending',    count: 2 },
    { name: 'Cancelled',  count: 1 },
];

const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const { name, value, count, color } = payload[0].payload;
    return (
        <div style={{
            background: '#0f172a',
            border: `1px solid ${color}40`,
            borderRadius: 10,
            padding: '8px 14px',
            fontSize: 12,
        }}>
            <span style={{ color, fontWeight: 700 }}>{name}</span>
            <span style={{ color: '#f1f5f9', marginLeft: 8 }}>{count} ({value}%)</span>
        </div>
    );
};

const ProjectStatusChart = ({ data: dataProp }) => {
    const [activeIndex, setActiveIndex] = useState(null);

    const rawData = dataProp || dataMock;
    const totalProjects = rawData.reduce((s, d) => s + (d.count ?? d.value ?? 0), 0);

    const chartData = rawData.map(item => {
        const mapping = colorMapping[item.name] || { color: '#94a3b8', bg: 'rgba(148,163,184,0.10)' };
        const count = item.count ?? item.value ?? 0;
        const valuePct = totalProjects > 0 ? Math.round((count / totalProjects) * 100) : 0;
        return {
            ...item,
            ...mapping,
            count,
            value: valuePct
        };
    });

    const activeItem = activeIndex !== null ? chartData[activeIndex] : null;

    return (
        <motion.div
            {...fadeIn(0.4)}
            style={{
                padding: '20px 20px 16px',
                borderRadius: 16,
                background: 'rgba(255,255,255,0.02)',
            }}
        >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                <div style={{
                    width: 28, height: 28, borderRadius: 8,
                    background: 'rgba(96,165,250,0.12)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    <Briefcase size={13} color="#60a5fa" />
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#f1f5f9', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    Project Status
                </span>
            </div>

            {/* Chart + center label */}
            <div style={{ position: 'relative', height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={62}
                            outerRadius={88}
                            paddingAngle={3}
                            dataKey="value"
                            startAngle={90}
                            endAngle={-270}
                            onMouseEnter={(_, index) => setActiveIndex(index)}
                            onMouseLeave={() => setActiveIndex(null)}
                            stroke="none"
                        >
                            {chartData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.color}
                                    opacity={activeIndex === null || activeIndex === index ? 1 : 0.3}
                                    style={{ transition: 'opacity 0.2s ease', cursor: 'pointer' }}
                                />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                </ResponsiveContainer>

                {/* Center readout */}
                <div style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    pointerEvents: 'none',
                    transition: 'all 0.2s ease',
                }}>
                    {activeItem ? (
                        <>
                            <span style={{ fontSize: 22, fontWeight: 800, color: activeItem.color, lineHeight: 1 }}>
                                {activeItem.value}%
                            </span>
                            <span style={{ fontSize: 10, color: '#64748b', marginTop: 4, letterSpacing: '0.05em' }}>
                                {activeItem.name.toUpperCase()} ({activeItem.count})
                            </span>
                        </>
                    ) : (
                        <>
                            <span style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', lineHeight: 1 }}>
                                {totalProjects}
                            </span>
                            <span style={{ fontSize: 10, color: '#64748b', marginTop: 4, letterSpacing: '0.05em' }}>
                                TOTAL PROJECTS
                            </span>
                        </>
                    )}
                </div>
            </div>

            {/* Legend rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 16 }}>
                {chartData.map((entry, index) => (
                    <div
                        key={entry.name}
                        onMouseEnter={() => setActiveIndex(index)}
                        onMouseLeave={() => setActiveIndex(null)}
                        style={{
                            display: 'flex', alignItems: 'center',
                            gap: 10, padding: '6px 10px',
                            borderRadius: 8,
                            background: activeIndex === index ? entry.bg : 'transparent',
                            cursor: 'default',
                            transition: 'background 0.2s ease',
                        }}
                    >
                        {/* Color dot */}
                        <span style={{
                            width: 7, height: 7, borderRadius: '50%',
                            background: entry.color, flexShrink: 0,
                        }} />

                        {/* Label */}
                        <span style={{
                            fontSize: 12, color: activeIndex === index ? '#f1f5f9' : '#94a3b8',
                            flex: 1, transition: 'color 0.2s ease',
                        }}>
                            {entry.name}
                        </span>

                        {/* Bar track */}
                        <div style={{
                            width: 64, height: 3, borderRadius: 99,
                            background: 'rgba(255,255,255,0.06)', overflow: 'hidden',
                        }}>
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${entry.value}%` }}
                                transition={{ duration: 0.8, delay: 0.1 * index, ease: 'easeOut' }}
                                style={{ height: '100%', borderRadius: 99, background: entry.color }}
                            />
                        </div>

                        {/* Value */}
                        <span style={{
                            fontSize: 12, fontWeight: 700,
                            color: activeIndex === index ? entry.color : '#64748b',
                            minWidth: 70, textAlign: 'right',
                            transition: 'color 0.2s ease',
                        }}>
                            {entry.value}% ({entry.count})
                        </span>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default ProjectStatusChart;