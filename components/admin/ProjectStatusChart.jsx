'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Briefcase, CheckCircle2, Loader2, XCircle } from 'lucide-react';

const fadeIn = (delay = 0) => ({
    initial: { opacity: 0, y: 5 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay },
});

const data = [
    { name: 'Completed', value: 30, color: 'var(--color-brand-teal)' },
    { name: 'In Progress', value: 50, color: 'var(--color-brand-blue)' },
    { name: 'Pending', value: 20, color: 'var(--color-admin-warning)' },
    { name: 'Cancelled', value: 5, color: 'var(--color-brand-red)' },
];

const ProjectStatusChart = () => {
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    return (
        <motion.div {...fadeIn(0.4)} className="p-5 rounded-2xl bg-white/[0.02]">
            <h2 className="text-base font-black text-white uppercase tracking-tight flex items-center gap-2 mb-5">
                <Briefcase size={14} className="text-brand-blue" /> Project Status
            </h2>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={90} // Increased outerRadius for a more prominent donut
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                            labelLine={false}
                            label={renderCustomizedLabel} // Use custom label for percentages
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value}%`} /> {/* Format tooltip to show percentage */}
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-4 text-xs">
                {data.map((entry, index) => (
                    <div key={`legend-${index}`} className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></span>
                        <span className="text-slate-400">{entry.name} ({entry.value}%)</span>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default ProjectStatusChart;
