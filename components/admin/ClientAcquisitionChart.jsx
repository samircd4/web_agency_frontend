'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users } from 'lucide-react';

const fadeIn = (delay = 0) => ({
    initial: { opacity: 0, y: 5 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay },
});

const data = [
    { name: 'Jan', clients: 40 },
    { name: 'Feb', clients: 30 },
    { name: 'Mar', clients: 50 },
    { name: 'Apr', clients: 45 },
    { name: 'May', clients: 60 },
    { name: 'Jun', clients: 55 },
];

const ClientAcquisitionChart = () => {
    return (
        <motion.div {...fadeIn(0.45)} className="p-5 rounded-2xl bg-white/[0.02]">
            <h2 className="text-base font-black text-white uppercase tracking-tight flex items-center gap-2 mb-5">
                <Users size={14} className="text-brand-indigo" /> Client Acquisition
            </h2>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
                        <Bar dataKey="clients" fill="#6366F1" /> {/* indigo-500 */}
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};

export default ClientAcquisitionChart;
