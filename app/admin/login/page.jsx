'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
    Shield, Lock, User, Eye, EyeOff, AlertCircle,
    ArrowRight, ArrowLeft, Mail, CheckCircle2, LogOut,
    LayoutDashboard, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';

/* ─── Google SVG Icon ──────────────────────────────────────────────────────── */
function GoogleIcon({ size = 18 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
    );
}

/* ─── Login Form Component ─────────────────────────────────────────────────── */
function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const from = searchParams.get('from') || '/admin';

    // Form state
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Already logged in state
    const [checkingSession, setCheckingSession] = useState(true);
    const [existingUser, setExistingUser] = useState(null);

    // Forgot password state
    const [activeView, setActiveView] = useState('login'); // 'login' | 'forgot' | 'forgot_success'
    const [forgotEmail, setForgotEmail] = useState('');
    const [forgotLoading, setForgotLoading] = useState(false);

    // Google login state
    const [googleLoading, setGoogleLoading] = useState(false);

    // Check if already logged in
    useEffect(() => {
        const checkSession = async () => {
            const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
            if (token) {
                try {
                    const user = await api.getMe();
                    setExistingUser(user);
                } catch {
                    // Token expired or invalid — show login
                }
            }
            setCheckingSession(false);
        };
        checkSession();
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await api.login(username, password);
            const user = await api.getMe();
            if (user.is_staff) {
                router.push(from.startsWith('/admin') ? from : '/admin');
            } else {
                router.push('/dashboard');
            }
        } catch (err) {
            setError(err.message || 'Invalid credentials. Access denied.');
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setGoogleLoading(true);
        setError('');
        // Simulated Google OAuth flow for demo
        await new Promise(r => setTimeout(r, 2500));
        setGoogleLoading(false);
        setError('Google OAuth is not configured yet. Please use username/password.');
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setForgotLoading(true);
        // Simulated forgot password API call
        await new Promise(r => setTimeout(r, 2000));
        setForgotLoading(false);
        setActiveView('forgot_success');
    };

    const handleSwitchAccount = async () => {
        await api.logout();
        setExistingUser(null);
    };

    const handleGoToDashboard = () => {
        if (existingUser?.is_staff) {
            router.push(from.startsWith('/admin') ? from : '/admin');
        } else {
            router.push('/dashboard');
        }
    };

    // ─── Loading Screen ────────────────────────────────────────────────────
    if (checkingSession) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                        <div className="w-12 h-12 border-2 border-brand-teal/20 border-t-brand-teal rounded-full animate-spin" />
                        <Shield size={16} className="text-brand-teal absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-text-dim">Verifying session...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

            {/* Glow orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-teal/5 rounded-full blur-3xl animate-pulse-slow" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-red/5 rounded-full blur-3xl animate-pulse-slow" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-blue/3 rounded-full blur-[120px]" />

            <div className="relative w-full max-w-md">
                {/* Header - always visible */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="text-center mb-8"
                >
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 border border-border-light mb-5 relative">
                        <div className="absolute inset-0 rounded-2xl bg-brand-teal/10 blur-xl" />
                        <Image src="/images/logo/logo.png" alt="Dr. Python" fill sizes="64px" className="object-contain p-2" />
                    </div>
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Shield size={14} className="text-brand-teal" />
                        <span className="text-xs font-black text-brand-teal uppercase tracking-[0.3em]">Secure Access</span>
                    </div>
                    <h1 className="text-2xl font-black text-text-primary uppercase tracking-tight">Command Center</h1>
                    <p className="text-text-muted text-sm mt-1">Secure client &amp; admin authentication</p>
                </motion.div>

                {/* ─── Card Container with AnimatePresence ─── */}
                <AnimatePresence mode="wait">

                    {/* ═══════════════════════════════════════════════════════════════ */}
                    {/* Already Logged In View                                         */}
                    {/* ═══════════════════════════════════════════════════════════════ */}
                    {existingUser ? (
                        <motion.div
                            key="already-logged-in"
                            initial={{ opacity: 0, y: 20, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.98 }}
                            transition={{ duration: 0.35 }}
                            className="glass border border-border-light rounded-2xl p-8 shadow-2xl shadow-black/50"
                        >
                            <div className="text-center">
                                {/* Active session indicator */}
                                <div className="relative inline-flex items-center justify-center mb-6">
                                    <div className="absolute w-20 h-20 rounded-full bg-emerald-500/10 animate-ping" style={{ animationDuration: '2s' }} />
                                    <div className="absolute w-16 h-16 rounded-full bg-emerald-500/5 border border-emerald-500/20" />
                                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-teal to-emerald-500 flex items-center justify-center font-black text-white text-lg border-2 border-white/20 shadow-lg shadow-emerald-500/20 relative z-10">
                                        {existingUser.first_name && existingUser.last_name
                                            ? `${existingUser.first_name[0]}${existingUser.last_name[0]}`.toUpperCase()
                                            : existingUser.username.slice(0, 2).toUpperCase()
                                        }
                                    </div>
                                </div>

                                <div className="flex items-center justify-center gap-2 mb-1">
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-400">Session Active</span>
                                </div>

                                <h2 className="text-lg font-black text-text-primary mt-2">
                                    {existingUser.first_name && existingUser.last_name
                                        ? `${existingUser.first_name} ${existingUser.last_name}`
                                        : existingUser.username
                                    }
                                </h2>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">
                                    {existingUser.is_staff ? 'Administrator' : 'Buyer Account'}
                                </span>

                                <div className="mt-8 space-y-3">
                                    <button
                                        onClick={handleGoToDashboard}
                                        className="w-full py-3.5 bg-brand-teal text-text-primary rounded-xl font-black uppercase tracking-widest text-xs shadow-glow-teal hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                                    >
                                        <LayoutDashboard size={14} />
                                        {existingUser.is_staff ? 'Go to Command Center' : 'Go to Dashboard'}
                                        <ArrowRight size={14} />
                                    </button>
                                    <button
                                        onClick={handleSwitchAccount}
                                        className="w-full py-3 bg-white/5 text-text-muted rounded-xl font-black uppercase tracking-widest text-[10px] border border-white/5 hover:bg-white/10 hover:text-text-primary transition-all flex items-center justify-center gap-2"
                                    >
                                        <LogOut size={12} />
                                        Switch Account
                                    </button>
                                </div>
                            </div>

                            <div className="mt-6 pt-5 border-t border-white/5 text-center">
                                <p className="text-[10px] font-black text-text-dim uppercase tracking-[0.2em]">
                                    Dr. Python Solutions &mdash; Secure Portal
                                </p>
                            </div>
                        </motion.div>

                    /* ═══════════════════════════════════════════════════════════════ */
                    /* Forgot Password View                                          */
                    /* ═══════════════════════════════════════════════════════════════ */
                    ) : activeView === 'forgot' ? (
                        <motion.div
                            key="forgot-password"
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -30 }}
                            transition={{ duration: 0.3 }}
                            className="glass border border-border-light rounded-2xl p-8 shadow-2xl shadow-black/50"
                        >
                            <div className="text-center mb-6">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-blue/10 border border-brand-blue/20 mb-4">
                                    <Mail size={20} className="text-brand-blue" />
                                </div>
                                <h2 className="text-lg font-black text-text-primary uppercase tracking-tight">Reset Access</h2>
                                <p className="text-text-muted text-xs mt-1">Enter your registered email to receive a reset link</p>
                            </div>

                            <form onSubmit={handleForgotPassword} className="space-y-5">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted flex items-center gap-1.5 ml-1">
                                        <Mail size={10} /> Email Address
                                    </label>
                                    <input
                                        id="forgot-email"
                                        type="email"
                                        value={forgotEmail}
                                        onChange={(e) => setForgotEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        required
                                        className="w-full bg-white/5 border border-border-light rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-dim focus:outline-none focus:border-brand-blue/50 focus:bg-brand-blue/5 transition-all"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={forgotLoading}
                                    className="w-full py-3.5 bg-brand-blue text-white rounded-xl font-black uppercase tracking-widest text-xs hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {forgotLoading ? (
                                        <>
                                            <Loader2 size={14} className="animate-spin" />
                                            Transmitting...
                                        </>
                                    ) : (
                                        <>
                                            <Mail size={14} />
                                            Send Reset Link
                                        </>
                                    )}
                                </button>
                            </form>

                            <button
                                onClick={() => { setActiveView('login'); setForgotEmail(''); }}
                                className="w-full mt-4 py-2.5 text-text-muted text-xs font-black uppercase tracking-widest hover:text-text-primary transition-all flex items-center justify-center gap-2"
                            >
                                <ArrowLeft size={12} /> Back to Login
                            </button>

                            <div className="mt-4 pt-5 border-t border-white/5 text-center">
                                <p className="text-[10px] font-black text-text-dim uppercase tracking-[0.2em]">
                                    Dr. Python Solutions &mdash; Secure Portal
                                </p>
                            </div>
                        </motion.div>

                    /* ═══════════════════════════════════════════════════════════════ */
                    /* Forgot Password Success View                                  */
                    /* ═══════════════════════════════════════════════════════════════ */
                    ) : activeView === 'forgot_success' ? (
                        <motion.div
                            key="forgot-success"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            className="glass border border-border-light rounded-2xl p-8 shadow-2xl shadow-black/50"
                        >
                            <div className="text-center">
                                <div className="relative inline-flex items-center justify-center mb-6">
                                    <div className="absolute w-16 h-16 rounded-full bg-emerald-500/10 animate-ping" style={{ animationDuration: '2s' }} />
                                    <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center relative z-10">
                                        <CheckCircle2 size={28} className="text-emerald-400" />
                                    </div>
                                </div>

                                <h2 className="text-lg font-black text-text-primary uppercase tracking-tight mb-2">Link Sent</h2>
                                <p className="text-text-muted text-xs leading-relaxed max-w-xs mx-auto">
                                    If an account exists for <span className="text-brand-teal font-bold">{forgotEmail}</span>,
                                    you&apos;ll receive a password reset link in your inbox shortly.
                                </p>

                                <div className="mt-8 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-text-dim mb-1">Didn&apos;t receive it?</p>
                                    <p className="text-[10px] text-text-muted">Check your spam folder, or try again in a few minutes.</p>
                                </div>

                                <button
                                    onClick={() => { setActiveView('login'); setForgotEmail(''); }}
                                    className="w-full mt-6 py-3.5 bg-brand-teal text-text-primary rounded-xl font-black uppercase tracking-widest text-xs shadow-glow-teal hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                                >
                                    <ArrowLeft size={14} />
                                    Return to Login
                                </button>
                            </div>

                            <div className="mt-6 pt-5 border-t border-white/5 text-center">
                                <p className="text-[10px] font-black text-text-dim uppercase tracking-[0.2em]">
                                    Dr. Python Solutions &mdash; Secure Portal
                                </p>
                            </div>
                        </motion.div>

                    /* ═══════════════════════════════════════════════════════════════ */
                    /* Standard Login View                                           */
                    /* ═══════════════════════════════════════════════════════════════ */
                    ) : (
                        <motion.div
                            key="login-form"
                            initial={{ opacity: 0, y: 20, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.98 }}
                            transition={{ duration: 0.35 }}
                            className="glass border border-border-light rounded-2xl p-8 shadow-2xl shadow-black/50"
                        >
                            <form onSubmit={handleLogin} className="space-y-4">
                                {/* Username */}
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted flex items-center gap-1.5 ml-1">
                                        <User size={10} /> Username
                                    </label>
                                    <input
                                        id="admin-username"
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="Enter your username"
                                        required
                                        autoComplete="username"
                                        className="w-full bg-white/5 border border-border-light rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-dim focus:outline-none focus:border-brand-teal/50 focus:bg-brand-teal/5 transition-all"
                                    />
                                </div>

                                {/* Password */}
                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between ml-1 mr-1">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted flex items-center gap-1.5">
                                            <Lock size={10} /> Password
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => setActiveView('forgot')}
                                            className="text-[10px] font-bold text-brand-teal hover:text-brand-teal/80 transition-colors uppercase tracking-wider"
                                        >
                                            Forgot password?
                                        </button>
                                    </div>
                                    <div className="relative">
                                        <input
                                            id="admin-password"
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Enter your password"
                                            required
                                            autoComplete="current-password"
                                            className="w-full bg-white/5 border border-border-light rounded-xl px-4 py-3 pr-12 text-sm text-text-primary placeholder:text-text-dim focus:outline-none focus:border-brand-teal/50 focus:bg-brand-teal/5 transition-all"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-text-muted hover:text-text-primary transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                                        </button>
                                    </div>
                                </div>

                                {/* Error */}
                                <AnimatePresence>
                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -5, height: 0 }}
                                            animate={{ opacity: 1, y: 0, height: 'auto' }}
                                            exit={{ opacity: 0, y: -5, height: 0 }}
                                            className="flex items-center gap-2 p-3 rounded-xl bg-brand-red/10 border border-brand-red/20 text-brand-red text-xs overflow-hidden"
                                        >
                                            <AlertCircle size={14} className="shrink-0" />
                                            {error}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Submit */}
                                <button
                                    id="admin-login-btn"
                                    type="submit"
                                    disabled={loading || googleLoading}
                                    className="w-full py-3.5 bg-brand-teal text-text-primary rounded-xl font-black uppercase tracking-widest text-xs shadow-glow-teal hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Authenticating...
                                        </>
                                    ) : (
                                        <>
                                            <Shield size={14} /> Sign In
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Divider */}
                            <div className="flex items-center gap-4 my-6">
                                <div className="flex-1 h-px bg-white/10" />
                                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-text-dim">or</span>
                                <div className="flex-1 h-px bg-white/10" />
                            </div>

                            {/* Google Login Button */}
                            <button
                                onClick={handleGoogleLogin}
                                disabled={googleLoading || loading}
                                className="w-full py-3 bg-white text-slate-800 rounded-xl font-bold text-sm transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-white/10 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3 active:scale-[0.98]"
                            >
                                {googleLoading ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin text-slate-500" />
                                        <span className="text-slate-500 text-xs font-black uppercase tracking-wider">Connecting to Google...</span>
                                    </>
                                ) : (
                                    <>
                                        <GoogleIcon size={18} />
                                        Continue with Google
                                    </>
                                )}
                            </button>

                            {/* Footer */}
                            <div className="mt-6 pt-5 border-t border-white/5 flex flex-col items-center gap-3">
                                <p className="text-xs text-text-muted">
                                    Don&apos;t have an account?{' '}
                                    <Link href="/admin/register" className="text-brand-teal font-bold hover:underline transition-colors">
                                        Register
                                    </Link>
                                </p>
                                <p className="text-[10px] font-black text-text-dim uppercase tracking-[0.2em]">
                                    Dr. Python Solutions &mdash; Secure Portal
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Back to site */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center mt-6"
                >
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-dim hover:text-text-primary transition-colors"
                    >
                        <ArrowLeft size={12} />
                        Back to Website
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}

/* ─── Page Export ───────────────────────────────────────────────────────────── */
export default function AdminLoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-brand-teal/30 border-t-brand-teal rounded-full animate-spin" />
            </div>
        }>
            <LoginForm />
        </Suspense>
    );
}
