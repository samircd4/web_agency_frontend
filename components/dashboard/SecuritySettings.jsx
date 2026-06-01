'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export default function SecuritySettings({ currentUser }) {
    // Password Change
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isChanging, setIsChanging] = useState(false);
    const [passwordErrors, setPasswordErrors] = useState({});
    const [passwordSuccess, setPasswordSuccess] = useState('');

    // Two-Factor Auth
    const [otpStep, setOtpStep] = useState('initial'); // initial, setup, verify, disable
    const [otpData, setOtpData] = useState(null);
    const [otpToken, setOtpToken] = useState('');
    const [otpError, setOtpError] = useState('');
    const [otpSuccess, setOtpSuccess] = useState('');
    const [otpLoading, setOtpLoading] = useState(false);

    // Active Sessions
    const [sessions, setSessions] = useState([]);
    const [sessionsLoading, setSessionsLoading] = useState(false);
    const [sessionsError, setSessionsError] = useState('');
    const [sessionsSuccess, setSessionsSuccess] = useState('');

    // Helper function to parse user agent
    const parseUserAgent = (ua) => {
        if (!ua) return { browser: 'Unknown', os: 'Unknown' };
        const browserMatch = ua.match(/(Chrome|Firefox|Safari|Edge|Opera|Brave)/);
        const osMatch = ua.match(/(Windows|Mac|Linux|Android|iOS|iPhone|iPad)/);
        return {
            browser: browserMatch ? browserMatch[0] : 'Unknown',
            os: osMatch ? osMatch[0] : 'Unknown'
        };
    };

    // Password change
    const handleChangePassword = async (e) => {
        e.preventDefault();
        setIsChanging(true);
        setPasswordErrors({});
        setPasswordSuccess('');

        try {
            await api.changePassword({
                old_password: oldPassword,
                new_password: newPassword,
                confirm_password: confirmPassword,
            });
            setPasswordSuccess('Password changed successfully!');
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            if (error.data) {
                setPasswordErrors(error.data);
            } else {
                setPasswordErrors({ general: 'An error occurred. Please try again.' });
            }
        } finally {
            setIsChanging(false);
        }
    };

    // 2FA Functions
    const handleGenerateOTP = async () => {
        setOtpLoading(true);
        setOtpError('');
        try {
            const data = await api.otpGenerate();
            setOtpData(data);
            setOtpStep('setup');
        } catch (error) {
            setOtpError('Failed to generate OTP');
        } finally {
            setOtpLoading(false);
        }
    };

    const handleVerifyOTP = async () => {
        setOtpLoading(true);
        setOtpError('');
        try {
            await api.otpVerify({ otp: otpToken });
            setOtpSuccess('2FA enabled successfully!');
            setOtpStep('initial');
            // Refresh user
            window.location.reload();
        } catch (error) {
            setOtpError(error.data?.otp?.[0] || 'Invalid OTP');
        } finally {
            setOtpLoading(false);
        }
    };

    const handleDisableOTP = async () => {
        setOtpLoading(true);
        setOtpError('');
        try {
            await api.otpDisable({ otp: otpToken });
            setOtpSuccess('2FA disabled successfully!');
            setOtpStep('initial');
            // Refresh user
            window.location.reload();
        } catch (error) {
            setOtpError(error.data?.otp?.[0] || 'Invalid OTP');
        } finally {
            setOtpLoading(false);
        }
    };

    // Sessions Functions
    const fetchSessions = async () => {
        console.log("=== fetchSessions ===");
        console.log("localStorage.access_token:", localStorage.getItem("access_token") ? localStorage.getItem("access_token").substring(0, 20) + "..." : "NONE");
        console.log("localStorage.refresh_token:", localStorage.getItem("refresh_token") ? localStorage.getItem("refresh_token").substring(0, 20) + "..." : "NONE");

        setSessionsLoading(true);
        setSessionsError('');
        try {
            const data = await api.getActiveSessions();
            console.log("getActiveSessions response:", data);
            setSessions(data);
        } catch (error) {
            console.error("getActiveSessions error:", error);
            setSessionsError('Failed to load sessions');
        } finally {
            setSessionsLoading(false);
        }
    };

    useEffect(() => {
        fetchSessions();
    }, []);

    const handleRevokeSession = async (id) => {
        try {
            await api.revokeSession(id);
            setSessionsSuccess('Session revoked');
            fetchSessions();
        } catch (error) {
            setSessionsError('Failed to revoke session');
        }
    };

    const handleRevokeAllSessions = async () => {
        try {
            await api.revokeAllSessions();
            setSessionsSuccess('All other sessions revoked');
            fetchSessions();
        } catch (error) {
            setSessionsError('Failed to revoke sessions');
        }
    };

    return (
        <div className="max-w-2xl space-y-6">
            {/* Password Change Section */}
            <div className="glass border-white/5 rounded-xl p-6">
                <h2 className="text-xs font-black text-white uppercase tracking-widest mb-4">Change Password</h2>
                <form onSubmit={handleChangePassword} className="space-y-4">
                    {passwordSuccess && (
                        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs">
                            {passwordSuccess}
                        </div>
                    )}
                    {passwordErrors.general && (
                        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-brand-red text-xs">
                            {passwordErrors.general}
                        </div>
                    )}

                    <div className="space-y-3">
                        <div className="space-y-1.5">
                            <label className="text-[8px] font-black uppercase tracking-widest text-muted ml-2">Current Password</label>
                            <input
                                type="password"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-xs text-white focus:outline-none focus:border-brand-teal/50"
                                required
                            />
                            {passwordErrors.old_password && (
                                <p className="text-[8px] text-brand-red font-black uppercase tracking-widest ml-2">
                                    {Array.isArray(passwordErrors.old_password) ? passwordErrors.old_password[0] : passwordErrors.old_password}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[8px] font-black uppercase tracking-widest text-muted ml-2">New Password</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-xs text-white focus:outline-none focus:border-brand-teal/50"
                                required
                                minLength={8}
                            />
                            {passwordErrors.new_password && (
                                <p className="text-[8px] text-brand-red font-black uppercase tracking-widest ml-2">
                                    {Array.isArray(passwordErrors.new_password) ? passwordErrors.new_password[0] : passwordErrors.new_password}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[8px] font-black uppercase tracking-widest text-muted ml-2">Confirm New Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-xs text-white focus:outline-none focus:border-brand-teal/50"
                                required
                                minLength={8}
                            />
                            {passwordErrors.confirm_password && (
                                <p className="text-[8px] text-brand-red font-black uppercase tracking-widest ml-2">
                                    {Array.isArray(passwordErrors.confirm_password) ? passwordErrors.confirm_password[0] : passwordErrors.confirm_password}
                                </p>
                            )}
                            {passwordErrors.non_field_errors && (
                                <p className="text-[8px] text-brand-red font-black uppercase tracking-widest ml-2">
                                    {Array.isArray(passwordErrors.non_field_errors) ? passwordErrors.non_field_errors[0] : passwordErrors.non_field_errors}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={isChanging}
                            className="px-5 py-2 bg-brand-teal text-primary rounded-lg text-[9px] font-black uppercase tracking-widest shadow-glow-teal hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isChanging ? 'Changing...' : 'Change Password'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Two-Factor Authentication Section */}
            <div className="glass border-white/5 rounded-xl p-6">
                <h2 className="text-xs font-black text-white uppercase tracking-widest mb-4">Two-Factor Authentication</h2>
                <p className="text-xs text-muted mb-4">Add an extra layer of security to your account</p>

                {otpSuccess && (
                    <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs mb-4">
                        {otpSuccess}
                    </div>
                )}
                {otpError && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-brand-red text-xs mb-4">
                        {otpError}
                    </div>
                )}

                {otpStep === 'initial' && (
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${currentUser?.otp_enabled ? 'bg-emerald-500' : 'bg-red-500'}`} />
                            <span className="text-xs text-white">
                                {currentUser?.otp_enabled ? 'Enabled' : 'Disabled'}
                            </span>
                        </div>
                        {currentUser?.otp_enabled ? (
                            <button
                                onClick={() => setOtpStep('disable')}
                                className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-black uppercase tracking-[0.14em] text-muted hover:text-white hover:bg-white/10 transition-all"
                            >
                                Disable 2FA
                            </button>
                        ) : (
                            <button
                                onClick={handleGenerateOTP}
                                disabled={otpLoading}
                                className="px-3 py-1.5 rounded-lg bg-brand-teal text-primary text-xs font-black uppercase tracking-[0.14em] hover:-translate-y-0.5 transition-all disabled:opacity-50"
                            >
                                Enable 2FA
                            </button>
                        )}
                    </div>
                )}

                {otpStep === 'setup' && otpData && (
                    <div className="space-y-4">
                        <p className="text-xs text-muted">
                            Scan this QR code with your authenticator app (like Google Authenticator, Authy, etc.):
                        </p>
                        <div className="flex justify-center">
                            <div className="p-4 bg-white rounded-lg">
                                <img
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(otpData.provisioning_uri)}`}
                                    alt="QR Code"
                                />
                            </div>
                        </div>
                        <p className="text-xs text-muted text-center">
                            Or enter this secret manually: <span className="font-mono text-white">{otpData.secret}</span>
                        </p>
                        <div className="space-y-1.5">
                            <label className="text-[8px] font-black uppercase tracking-widest text-muted ml-2">Enter 6-digit OTP</label>
                            <input
                                type="text"
                                value={otpToken}
                                onChange={(e) => setOtpToken(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-xs text-white focus:outline-none focus:border-brand-teal/50"
                                maxLength={6}
                                placeholder="000000"
                            />
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setOtpStep('initial')}
                                className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-black uppercase tracking-[0.14em] text-muted hover:text-white hover:bg-white/10 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleVerifyOTP}
                                disabled={otpLoading}
                                className="px-3 py-1.5 rounded-lg bg-brand-teal text-primary text-xs font-black uppercase tracking-[0.14em] hover:-translate-y-0.5 transition-all disabled:opacity-50"
                            >
                                {otpLoading ? 'Verifying...' : 'Verify & Enable'}
                            </button>
                        </div>
                    </div>
                )}

                {otpStep === 'disable' && (
                    <div className="space-y-4">
                        <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
                            Warning: Disabling 2FA will revoke all other active sessions.
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[8px] font-black uppercase tracking-widest text-muted ml-2">Enter OTP to confirm</label>
                            <input
                                type="text"
                                value={otpToken}
                                onChange={(e) => setOtpToken(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-xs text-white focus:outline-none focus:border-brand-teal/50"
                                maxLength={6}
                                placeholder="000000"
                            />
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setOtpStep('initial')}
                                className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-black uppercase tracking-[0.14em] text-muted hover:text-white hover:bg-white/10 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDisableOTP}
                                disabled={otpLoading}
                                className="px-3 py-1.5 rounded-lg bg-brand-red text-white text-xs font-black uppercase tracking-[0.14em] hover:-translate-y-0.5 transition-all disabled:opacity-50"
                            >
                                {otpLoading ? 'Disabling...' : 'Disable 2FA'}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Active Sessions Section */}
            <div className="glass border-white/5 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xs font-black text-white uppercase tracking-widest">Active Sessions</h2>
                    <button
                        onClick={handleRevokeAllSessions}
                        className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-black uppercase tracking-[0.14em] text-muted hover:text-white hover:bg-white/10 transition-all"
                    >
                        Revoke All Others
                    </button>
                </div>
                <p className="text-xs text-muted mb-4">View and manage your active login sessions</p>

                {sessionsSuccess && (
                    <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs mb-4">
                        {sessionsSuccess}
                    </div>
                )}
                {sessionsError && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-brand-red text-xs mb-4">
                        {sessionsError}
                    </div>
                )}

                {sessionsLoading ? (
                    <div className="p-8 text-center text-muted text-xs">Loading sessions...</div>
                ) : (
                    <div className="space-y-3">
                        {sessions.map((session) => {
                            const ua = parseUserAgent(session.user_agent);
                            return (
                                <div
                                    key={session.id}
                                    className="p-4 rounded-lg bg-white/[0.02] border border-white/5 flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                                            {ua.browser === 'Chrome' && <span className="text-xl">🌐</span>}
                                            {ua.browser === 'Firefox' && <span className="text-xl">🦊</span>}
                                            {ua.browser === 'Safari' && <span className="text-xl">🍎</span>}
                                            {!['Chrome', 'Firefox', 'Safari'].includes(ua.browser) && <span className="text-xl">📱</span>}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-white font-bold">
                                                    {ua.browser} on {ua.os}
                                                </span>
                                                {session.is_current && (
                                                    <span className="px-2 py-0.5 bg-brand-teal/20 text-brand-teal text-[7px] font-black uppercase rounded-full">
                                                        Current
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-[8px] text-muted">
                                                IP: {session.ip_address} • Created: {new Date(session.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    {!session.is_current && (
                                        <button
                                            onClick={() => handleRevokeSession(session.id)}
                                            className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[8px] font-black uppercase tracking-[0.14em] text-muted hover:text-white hover:bg-white/10 transition-all"
                                        >
                                            Revoke
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
