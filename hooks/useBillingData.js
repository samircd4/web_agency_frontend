'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { api } from '@/lib/api';

const getApiBaseUrl = () => {
    if (process.env.NEXT_PUBLIC_API_BASE_URL) return process.env.NEXT_PUBLIC_API_BASE_URL;
    if (typeof window !== "undefined") {
        const host = window.location.hostname;
        if (host === "drpythonsolutions.com" || host === "www.drpythonsolutions.com") {
            return "https://api.drpythonsolutions.com";
        }
    }
    return "http://localhost:8000";
};
const API_BASE_URL = getApiBaseUrl().replace(/\/$/, "");

export default function useBillingData(projects) {
    const [billingView, setBillingView] = useState('invoices');
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

    const pendingInvoiceCount = useMemo(() => {
        return clientInvoices.filter(
            (inv) => inv.status !== 'paid' && inv.status !== 'void'
        ).length;
    }, [clientInvoices]);

    const pendingProposalCount = useMemo(() => {
        return clientProposals.filter(
            (p) => p.status === 'sent'
        ).length;
    }, [clientProposals]);

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
        const token = localStorage.getItem('access_token') || '';
        const tokenParam = token ? `?token=${encodeURIComponent(token)}` : '';
        window.open(
            `${API_BASE_URL}/client/projects/${invoice._projectId}/invoices/${invoice.id}/print/${tokenParam}`,
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
        billingView,
        setBillingView,
        clientInvoices,
        setClientInvoices,
        clientProposals,
        setClientProposals,
        billingDocsLoading,
        billingDocsError,
        selectedInvoice,
        setSelectedInvoice,
        selectedProposal,
        setSelectedProposal,
        checkoutInvoiceId,
        setCheckoutInvoiceId,
        billingNotice,
        setBillingNotice,
        billingRefreshNonce,
        setBillingRefreshNonce,
        proposalActionInProgress,
        setProposalActionInProgress,
        proposalActionError,
        setProposalActionError,
        showDeclineConfirm,
        setShowDeclineConfirm,
        handleProposalRespond,
        handlePayInvoice,
        handlePrintInvoice,
        pendingInvoiceCount,
        pendingProposalCount,
    };
}

