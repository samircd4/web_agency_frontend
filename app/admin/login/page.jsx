'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Shield, Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminLoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const from = searchParams.get('from') || '/admin';

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // --- MOCK AUTH ---
        // TODO: Replace with real Django token auth:
        // const res = await fetch('/api/admin/token/', { method: 'POST', body: JSON.stringify({ username, password }) });
        // if (res.ok) { const { token } = await res.json(); document.cookie = `admin_session=${token}; path=/`; }
        await new Promise((r) => setTimeout(r, 1000));

        if (username === 'admin' && password === 'drpython') {
            // Set a mock session cookie
            document.cookie = 'admin_session=mock-token-12345; path=/; max-age=86400';
            router.push(from);
        } else {
            setError('Invalid credentials. Access denied.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

            {/* Glow orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-teal/5 rounded-full blur-3xl animate-pulse-slow" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-red/5 rounded-full blur-3xl animate-pulse-slow" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative w-full max-w-md"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 border border-white/10 mb-5 relative">
                        <div className="absolute inset-0 rounded-2xl bg-brand-teal/10 blur-xl" />
                        <Image src="/images/logo/logo.png" alt="Dr. Python" fill sizes="64px" className="object-contain p-2" />
                    </div>
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Shield size={14} className="text-brand-teal" />
                        <span className="text-[9px] font-black text-brand-teal uppercase tracking-[0.3em]">Secure Access</span>
                    </div>
                    <h1 className="text-2xl font-black text-white uppercase tracking-tight">Command Center</h1>
                    <p className="text-slate-600 text-xs mt-1">Administrator authentication required</p>
                </div>

                {/* Login Card */}
                <div className="glass border border-white/10 rounded-2xl p-8 shadow-2xl shadow-black/50">
                    <form onSubmit={handleLogin} className="space-y-5">
                        {/* Username */}
                        <div className="space-y-1.5">
                            <label className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-1.5 ml-1">
                                <User size={10} /> Username
                            </label>
                            <div className="relative">
                                <input
                                    id="admin-username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter admin username"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-700 focus:outline-none focus:border-brand-teal/50 focus:bg-brand-teal/5 transition-all"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <label className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-1.5 ml-1">
                                <Lock size={10} /> Password
                            </label>
                            <div className="relative">
                                <input
                                    id="admin-password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter admin password"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 text-sm text-white placeholder:text-slate-700 focus:outline-none focus:border-brand-teal/50 focus:bg-brand-teal/5 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-600 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                                </button>
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-2 p-3 rounded-xl bg-brand-red/10 border border-brand-red/20 text-brand-red text-xs"
                            >
                                <AlertCircle size={14} />
                                {error}
                            </motion.div>
                        )}

                        {/* Submit */}
                        <button
                            id="admin-login-btn"
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 bg-brand-teal text-white rounded-xl font-black uppercase tracking-widest text-[10px] shadow-glow-teal hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Authenticating...
                                </>
                            ) : (
                                <>
                                    <Shield size={14} /> Authenticate
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-white/5 text-center">
                        <p className="text-[8px] font-black text-slate-700 uppercase tracking-[0.2em]">
                            Dr. Python Solutions &mdash; Internal Access Only
                        </p>
                    </div>
                </div>

                {/* Demo hint */}
                <p className="text-center text-[8px] font-bold text-slate-700 mt-4 uppercase tracking-widest">
                    Mock credentials: admin / drpython
                </p>
            </motion.div>
        </div>
    );
}
