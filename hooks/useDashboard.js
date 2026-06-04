'use client';

import { useState, useEffect, useRef, createContext, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import useSettings from './useSettings';

// ─── Context ────────────────────────────────────────────────────────────────

const DashboardContext = createContext(null);

// ─── Provider ────────────────────────────────────────────────────────────────

export function DashboardProvider({ children }) {
    const value = useDashboardState();
    return (
        <DashboardContext.Provider value={value}>
            {children}
        </DashboardContext.Provider>
    );
}

// ─── Consumer hook ────────────────────────────────────────────────────────────
// Use this in any component inside the dashboard layout.
// It reads from the single shared context so all components see the same state.

export default function useDashboard() {
    const ctx = useContext(DashboardContext);
    if (!ctx) {
        throw new Error('useDashboard must be used inside <DashboardProvider>');
    }
    return ctx;
}

// ─── Internal state hook (used only by DashboardProvider) ────────────────────

function useDashboardState() {
    const router = useRouter();
    const [selectedProject, setSelectedProject] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Live state
    const [currentUser, setCurrentUser] = useState(null);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const mountedRef = useRef(false);

    // Billing state
    const [billingView, setBillingView] = useState('invoices');

    const handleUserUpdate = (updatedUser) => {
        setCurrentUser(updatedUser);
    };

    // Settings state
    const {
        settingsView,
        setSettingsView,
        firstName,
        setFirstName,
        lastName,
        setLastName,
        username,
        setUsername,
        email,
        setEmail,
        isSaving,
        saveSuccess,
        handleSaveSettings,
        handleAvatarChange,
        usernameStatus,
        usernameCheckLoading,
    } = useSettings(currentUser, handleUserUpdate);

    const [clientInvoices, setClientInvoices] = useState([]);
    const [clientProposals, setClientProposals] = useState([]);
    const [billingDocsLoading, setBillingDocsLoading] = useState(false);
    const [billingDocsError, setBillingDocsError] = useState(null);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [selectedProposal, setSelectedProposal] = useState(null);
    const [checkoutInvoiceId, setCheckoutInvoiceId] = useState(null);
    const [billingNotice, setBillingNotice] = useState(null);
    const [billingRefreshNonce, setBillingRefreshNonce] = useState(0);
    const syncAttemptedRef = useRef(new Set());
    const pollAttemptedRef = useRef(new Set());
    const [proposalActionInProgress, setProposalActionInProgress] = useState(null);
    const [proposalActionError, setProposalActionError] = useState(null);
    const [showDeclineConfirm, setShowDeclineConfirm] = useState(false);

    const handleLogout = async () => {
        try {
            await api.logout();
        } catch (error) {
            console.error('Logout error:', error);
        }
        router.push('/admin/login');
    };

    const handleProposalRespond = async (projectId, proposalId, action) => {
        try {
            setProposalActionInProgress({ proposalId, action });
            setProposalActionError(null);

            const updatedProposal = await api.respondToProposal(projectId, proposalId, action);

            setClientProposals(prevProposals =>
                prevProposals.map(p =>
                    p.id === proposalId ? updatedProposal : p
                )
            );

            setSelectedProposal(null);
            setShowDeclineConfirm(false);
        } catch (err) {
            setProposalActionError(err?.message || 'Failed to respond to proposal');
        } finally {
            setProposalActionInProgress(null);
        }
    };

    const handlePayInvoice = async (invoice) => {
        setCheckoutInvoiceId(invoice.id);
        setBillingDocsError(null);

        try {
            const res = await api.createClientInvoiceCheckout(invoice._projectId, invoice.id);
            if (!res?.url) throw new Error('Failed to start checkout');
            window.location.href = res.url;
        } catch (err) {
            setBillingDocsError(err?.message || 'Failed to start checkout');
        } finally {
            setCheckoutInvoiceId(null);
        }
    };

    const handlePrintInvoice = (invoice) => {
        window.open(
            `http://localhost:8000/api/client/projects/${invoice._projectId}/invoices/${invoice.id}/print/`,
            '_blank',
            'noopener,noreferrer'
        );
    };

    // ── Handle Stripe return query params ──────────────────────────────────
    useEffect(() => {
        try {
            const qs = new URLSearchParams(window.location.search || '');
            const checkout = qs.get('checkout');
            const invoiceId = qs.get('invoice');
            const sessionId = qs.get('sessionId') || qs.get('session_id');
            if (checkout === 'success') {
                setBillingNotice({ kind: 'success', invoiceId, sessionId });
                setBillingView('invoices');
            }
            if (checkout === 'cancel') {
                setBillingNotice({ kind: 'cancel', invoiceId, sessionId });
                setBillingView('invoices');
            }
            if (checkout && typeof window !== 'undefined') {
                window.history.replaceState({}, '', window.location.pathname);
            }
        } catch {
            // ignore
        }
    }, []);

    // ── Initial data fetch ─────────────────────────────────────────────────
    useEffect(() => {
        if (mountedRef.current) return;
        mountedRef.current = true;

        const initDashboard = async () => {
            const token =
                typeof window !== 'undefined'
                    ? localStorage.getItem('access_token')
                    : null;
            if (!token) {
                router.push('/admin/login?from=/dashboard');
                return;
            }

            try {
                const me = await api.getMe();
                if (!currentUser || me.id !== currentUser.id) {
                    setCurrentUser(me);
                }

                const compactProjects = await api.getClientProjects();

                const detailedProjects = await Promise.all(
                    compactProjects.map(async (p) => {
                        try {
                            return await api.getClientProjectDetail(p.id);
                        } catch (err) {
                            console.error(`Failed to fetch project detail for ${p.id}`, err);
                            return {
                                ...p,
                                description: 'Brief details retrieved from directory.',
                                tags: [],
                                milestones: [],
                                files: [],
                                activities: [],
                            };
                        }
                    })
                );
                setProjects(detailedProjects);
            } catch (err) {
                console.error('Failed to initialize dashboard:', err);
                router.push('/admin/login?from=/dashboard');
            } finally {
                setLoading(false);
            }
        };

        initDashboard();
    }, [router]);

    // ── Load billing docs whenever projects or billingRefreshNonce changes ──
    const normalizeList = (res) =>
        Array.isArray(res) ? res : res?.results || [];

    useEffect(() => {
        if (!projects?.length) {
            setClientInvoices([]);
            setClientProposals([]);
            return;
        }

        let cancelled = false;
        const loadBillingDocs = async () => {
            try {
                setBillingDocsLoading(true);
                setBillingDocsError(null);

                const perProject = await Promise.all(
                    projects.map(async (p) => {
                        const [invRes, propRes] = await Promise.all([
                            api.getClientProjectInvoices(p.id).catch(() => []),
                            api.getClientProjectProposals(p.id).catch(() => []),
                        ]);
                        return {
                            projectId: p.id,
                            projectTitle: p.title,
                            projectValue: p.value,
                            invoices: normalizeList(invRes),
                            proposals: normalizeList(propRes),
                        };
                    })
                );

                const mergedInvoices = perProject.flatMap(
                    ({ projectId, projectTitle, projectValue, invoices }) =>
                        invoices.map((inv) => ({
                            ...inv,
                            _projectId: projectId,
                            _projectTitle: projectTitle,
                            _projectValue: projectValue,
                        }))
                );
                const mergedProposals = perProject.flatMap(
                    ({ projectId, projectTitle, projectValue, proposals }) =>
                        proposals.map((prop) => ({
                            ...prop,
                            _projectId: projectId,
                            _projectTitle: projectTitle,
                            _projectValue: projectValue,
                        }))
                );

                if (cancelled) return;
                setClientInvoices(mergedInvoices);
                setClientProposals(mergedProposals);
            } catch (err) {
                if (cancelled) return;
                setBillingDocsError(err?.message || 'Failed to load billing documents');
            } finally {
                if (!cancelled) setBillingDocsLoading(false);
            }
        };

        loadBillingDocs();
        return () => {
            cancelled = true;
        };
    }, [projects, billingRefreshNonce]);

    // ── Stripe success: sync + poll until invoice flips to paid ────────────
    useEffect(() => {
        if (billingNotice?.kind !== 'success') return;
        const invoiceId = billingNotice?.invoiceId
            ? Number(billingNotice.invoiceId)
            : null;
        const sessionId = billingNotice?.sessionId
            ? String(billingNotice.sessionId)
            : '';
        if (!invoiceId || !projects?.length) return;

        const invoice = clientInvoices.find((i) => Number(i.id) === invoiceId);
        const alreadyPaid = String(invoice?.status || '').toLowerCase() === 'paid';
        if (alreadyPaid) return;

        const syncKey = `${invoiceId}:${sessionId}`;
        const pollKey = `${invoiceId}:${sessionId}`;

        if (invoice?._projectId && !syncAttemptedRef.current.has(syncKey)) {
            syncAttemptedRef.current.add(syncKey);
            api
                .syncClientInvoiceStripe(invoice._projectId, invoiceId)
                .then(() => setBillingRefreshNonce((n) => n + 1))
                .catch((err) =>
                    setBillingDocsError(err?.message || 'Failed to sync payment status')
                );
        }

        if (pollAttemptedRef.current.has(pollKey)) return;
        pollAttemptedRef.current.add(pollKey);
        const timeouts = [
            setTimeout(() => setBillingRefreshNonce((n) => n + 1), 1500),
            setTimeout(() => setBillingRefreshNonce((n) => n + 1), 3500),
            setTimeout(() => setBillingRefreshNonce((n) => n + 1), 7000),
        ];
        return () => timeouts.forEach((t) => clearTimeout(t));
    }, [billingNotice, projects, clientInvoices]);

    return {
        selectedProject,
        setSelectedProject,
        isSidebarOpen,
        setIsSidebarOpen,
        currentUser,
        projects,
        loading,
        searchQuery,
        setSearchQuery,
        billingView,
        setBillingView,
        clientInvoices,
        clientProposals,
        billingDocsLoading,
        billingDocsError,
        selectedInvoice,
        setSelectedInvoice,
        selectedProposal,
        setSelectedProposal,
        checkoutInvoiceId,
        billingNotice,
        setBillingNotice,
        proposalActionInProgress,
        proposalActionError,
        showDeclineConfirm,
        setShowDeclineConfirm,
        // Settings
        settingsView,
        setSettingsView,
        firstName,
        setFirstName,
        lastName,
        setLastName,
        username,
        setUsername,
        email,
        setEmail,
        isSaving,
        saveSuccess,
        handleSaveSettings,
        handleAvatarChange,
        usernameStatus,
        usernameCheckLoading,
        // Actions
        handleLogout,
        handleProposalRespond,
        handlePayInvoice,
        handlePrintInvoice,
    };
}