'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
    Shield, Lock, User, Eye, EyeOff, AlertCircle,
    ArrowRight, ArrowLeft, Mail, Building2, Globe2,
    CheckCircle2, Loader2
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

/* ─── Registration Form Component ───────────────────────────────────────────── */
function RegisterForm() {
    const router = useRouter();

    // Form fields state
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [country, setCountry] = useState('');

    // UI state
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // Auto-detect country on mount
    useEffect(() => {
        const detectCountry = async () => {
            try {
                const response = await fetch('https://ipapi.co/json/');
                if (response.ok) {
                    const data = await response.json();
                    if (data.country_name) {
                        setCountry(data.country_name);
                    }
                }
            } catch (err) {
                console.warn('Auto-country detection failed:', err);
            }
        };
        detectCountry();
    }, []);

    const handleGoogleRegister = async () => {
        setGoogleLoading(true);
        setError('');
        // Simulated Google OAuth flow for demo
        await new Promise(r => setTimeout(r, 2500));
        setGoogleLoading(false);
        setError('Google OAuth is not configured yet. Please register with username/password.');
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await api.register({
                username,
                email,
                password,
                first_name: firstName,
                last_name: lastName,
                company_name: companyName,
                country: country
            });
            
            setSuccess(true);
            setLoading(false);
            
            // Wait 2 seconds for a beautiful success checkmark animation, then redirect
            setTimeout(() => {
                router.push('/dashboard');
            }, 2000);
        } catch (err) {
            if (err.data && typeof err.data === 'object' && !err.data.detail && !err.data.message) {
                // Format Django serializer field errors
                const fieldErrors = Object.entries(err.data)
                    .map(([field, msgs]) => {
                        const fieldName = field.charAt(0).toUpperCase() + field.slice(1).replace('_', ' ');
                        const message = Array.isArray(msgs) ? msgs.join(' ') : String(msgs);
                        return `${fieldName}: ${message}`;
                    })
                    .join(' | ');
                setError(fieldErrors || 'Registration failed. Please check your inputs.');
            } else {
                setError(err.message || 'Registration failed. Please check your details.');
            }
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

            {/* Glow orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-teal/5 rounded-full blur-3xl animate-pulse-slow" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-red/5 rounded-full blur-3xl animate-pulse-slow" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-blue/3 rounded-full blur-[120px]" />

            <div className="relative w-full max-w-2xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="text-center mb-6"
                >
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/5 border border-border-light mb-4 relative">
                        <div className="absolute inset-0 rounded-2xl bg-brand-teal/10 blur-xl" />
                        <Image src="/images/logo/logo.png" alt="Dr. Python" fill sizes="64px" className="object-contain p-2" />
                    </div>
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Shield size={14} className="text-brand-teal" />
                        <span className="text-xs font-black text-brand-teal uppercase tracking-[0.3em]">Join Command Center</span>
                    </div>
                    <h1 className="text-2xl font-black text-text-primary uppercase tracking-tight">Create Client Account</h1>
                    <p className="text-text-muted text-sm mt-1">Get immediate access to your tailored software projects</p>
                </motion.div>

                {/* Card Container with AnimatePresence */}
                <AnimatePresence mode="wait">
                    {success ? (
                        <motion.div
                            key="register-success"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            className="glass border border-border-light rounded-2xl p-10 shadow-2xl shadow-black/50 text-center max-w-md mx-auto"
                        >
                            <div className="relative inline-flex items-center justify-center mb-6">
                                <div className="absolute w-20 h-20 rounded-full bg-emerald-500/10 animate-ping" style={{ animationDuration: '2s' }} />
                                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center relative z-10">
                                    <CheckCircle2 size={32} className="text-emerald-400" />
                                </div>
                            </div>

                            <h2 className="text-xl font-black text-text-primary uppercase tracking-tight mb-2">Registration Complete</h2>
                            <p className="text-text-muted text-sm leading-relaxed mb-6">
                                Welcome aboard! Your secure buyer account has been provisioned. Launching your control panel now...
                            </p>

                            <div className="flex items-center justify-center gap-2 text-xs font-black text-brand-teal uppercase tracking-[0.2em] animate-pulse">
                                <Loader2 size={14} className="animate-spin" />
                                Connecting to Command Center...
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="register-form"
                            initial={{ opacity: 0, y: 20, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.98 }}
                            transition={{ duration: 0.35 }}
                            className="glass border border-border-light rounded-2xl p-8 shadow-2xl shadow-black/50"
                        >
                            <form onSubmit={handleRegister} className="space-y-6">
                                {/* Grid container for columns */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {/* Personal Info */}
                                    <div className="space-y-4">
                                        <h3 className="text-[11px] font-black uppercase tracking-[0.25em] text-brand-teal border-b border-white/5 pb-2">
                                            Account Identity
                                        </h3>
                                        
                                        {/* Username */}
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted flex items-center gap-1.5 ml-1">
                                                <User size={10} /> Username
                                            </label>
                                            <input
                                                id="register-username"
                                                type="text"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                placeholder="e.g. janesmith"
                                                required
                                                className="w-full bg-white/5 border border-border-light rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-dim focus:outline-none focus:border-brand-teal/50 focus:bg-brand-teal/5 transition-all"
                                            />
                                        </div>

                                        {/* Email */}
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted flex items-center gap-1.5 ml-1">
                                                <Mail size={10} /> Email Address
                                            </label>
                                            <input
                                                id="register-email"
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="you@example.com"
                                                required
                                                className="w-full bg-white/5 border border-border-light rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-dim focus:outline-none focus:border-brand-teal/50 focus:bg-brand-teal/5 transition-all"
                                            />
                                        </div>

                                        {/* Password */}
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted flex items-center gap-1.5 ml-1">
                                                <Lock size={10} /> Password
                                            </label>
                                            <div className="relative">
                                                <input
                                                    id="register-password"
                                                    type={showPassword ? 'text' : 'password'}
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    placeholder="Choose a strong password"
                                                    required
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
                                    </div>

                                    {/* Profile Details */}
                                    <div className="space-y-4">
                                        <h3 className="text-[11px] font-black uppercase tracking-[0.25em] text-brand-teal border-b border-white/5 pb-2">
                                            Client Intelligence
                                        </h3>
                                        
                                        {/* First / Last Name Grid */}
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted flex items-center gap-1.5 ml-1">
                                                    First Name
                                                </label>
                                                <input
                                                    id="register-firstname"
                                                    type="text"
                                                    value={firstName}
                                                    onChange={(e) => setFirstName(e.target.value)}
                                                    placeholder="Jane"
                                                    required
                                                    className="w-full bg-white/5 border border-border-light rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-dim focus:outline-none focus:border-brand-teal/50 focus:bg-brand-teal/5 transition-all"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted flex items-center gap-1.5 ml-1">
                                                    Last Name
                                                </label>
                                                <input
                                                    id="register-lastname"
                                                    type="text"
                                                    value={lastName}
                                                    onChange={(e) => setLastName(e.target.value)}
                                                    placeholder="Smith"
                                                    required
                                                    className="w-full bg-white/5 border border-border-light rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-dim focus:outline-none focus:border-brand-teal/50 focus:bg-brand-teal/5 transition-all"
                                                />
                                            </div>
                                        </div>

                                        {/* Company Name */}
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted flex items-center gap-1.5 ml-1">
                                                <Building2 size={10} /> Company Name <span className="text-[8px] text-text-dim lowercase tracking-normal">(optional)</span>
                                            </label>
                                            <input
                                                id="register-company"
                                                type="text"
                                                value={companyName}
                                                onChange={(e) => setCompanyName(e.target.value)}
                                                placeholder="e.g. Acme Corp"
                                                className="w-full bg-white/5 border border-border-light rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-dim focus:outline-none focus:border-brand-teal/50 focus:bg-brand-teal/5 transition-all"
                                            />
                                        </div>

                                        {/* Country */}
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted flex items-center gap-1.5 ml-1">
                                                <Globe2 size={10} /> Country <span className="text-[8px] text-text-dim lowercase tracking-normal">(optional)</span>
                                            </label>
                                            <input
                                                id="register-country"
                                                type="text"
                                                value={country}
                                                onChange={(e) => setCountry(e.target.value)}
                                                placeholder="e.g. United States"
                                                className="w-full bg-white/5 border border-border-light rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-dim focus:outline-none focus:border-brand-teal/50 focus:bg-brand-teal/5 transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Error message display */}
                                <AnimatePresence>
                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -5, height: 0 }}
                                            animate={{ opacity: 1, y: 0, height: 'auto' }}
                                            exit={{ opacity: 0, y: -5, height: 0 }}
                                            className="flex items-center gap-2 p-3.5 rounded-xl bg-brand-red/10 border border-brand-red/20 text-brand-red text-xs overflow-hidden"
                                        >
                                            <AlertCircle size={14} className="shrink-0" />
                                            {error}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Submit button */}
                                <button
                                    id="register-btn"
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 bg-brand-teal text-text-primary rounded-xl font-black uppercase tracking-widest text-xs shadow-glow-teal hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 size={14} className="animate-spin" />
                                            Provisioning Account...
                                        </>
                                    ) : (
                                        <>
                                            Register &amp; Launch Control Panel <ArrowRight size={14} />
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

                            {/* Google Register Button */}
                            <button
                                onClick={handleGoogleRegister}
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

                            {/* Footer links */}
                            <div className="mt-8 pt-5 border-t border-white/5 flex flex-col items-center gap-3">
                                <p className="text-xs text-text-muted">
                                    Already have an account?{' '}
                                    <Link href="/admin/login" className="text-brand-teal font-bold hover:underline transition-colors">
                                        Sign In
                                    </Link>
                                </p>
                                <p className="text-[10px] font-black text-text-dim uppercase tracking-[0.2em]">
                                    Dr. Python Solutions &mdash; Secure Portal
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Back button */}
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
export default function AdminRegisterPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-brand-teal/30 border-t-brand-teal rounded-full animate-spin" />
            </div>
        }>
            <RegisterForm />
        </Suspense>
    );
}