'use client';

import React, { useEffect, useState } from 'react';
import { notFound, useRouter, useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import useDashboard from '@/hooks/useDashboard';
import DashboardTabPanels from '@/components/dashboard/TabPanels';
import DashboardModals from '@/components/dashboard/Modals';

const VALID_TABS = ['projects', 'vault', 'comms', 'billing', 'settings'];

export default function DashboardTabPage() {
    const { tab } = useParams() || {};
    const router = useRouter();

    // ── Always call hooks before any conditional return ──────────────────
    const {
        searchQuery,
        setSearchQuery,
        loading,
        currentUser,
        projects,
        billingView,
        setBillingView,
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
        clientInvoices,
        clientProposals,
        billingDocsLoading,
        billingDocsError,
        selectedInvoice,
        setSelectedInvoice,
        selectedProject,
        setSelectedProject,
        selectedProposal,
        setSelectedProposal,
        billingNotice,
        setBillingNotice,
        proposalActionInProgress,
        proposalActionError,
        showDeclineConfirm,
        setShowDeclineConfirm,
        handleProposalRespond,
        handlePayInvoice,
        handlePrintInvoice,
    } = useDashboard();

    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        const checkIsDesktop = () => setIsDesktop(window.innerWidth >= 1024);
        checkIsDesktop();
        window.addEventListener('resize', checkIsDesktop);
        return () => window.removeEventListener('resize', checkIsDesktop);
    }, []);

    // ── Now it's safe to do conditional returns ───────────────────────────
    if (!VALID_TABS.includes(tab)) {
        return notFound();
    }

    if (loading || !currentUser) {
        return (
            <div className="flex-grow flex items-center justify-center px-3 lg:px-6 pb-3 lg:pb-6">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 size={32} className="animate-spin text-brand-teal" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                        Decrypting Command Space...
                    </span>
                </div>
            </div>
        );
    }

    const vaultFiles = projects.flatMap((m) =>
        (m.files || []).map((f) => ({
            ...f,
            projectName: m.title,
            projectId: m.id,
        }))
    );

    const filteredProjects = projects.filter((m) =>
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalInvestment = projects.reduce((sum, m) => sum + Number(m.value || 0), 0);
    const activeProjectsCount = projects.filter((m) => m.stage !== 'Complete').length;
    const deliverablesCount = vaultFiles.length;

    const userInitials = currentUser.first_name && currentUser.last_name
        ? `${currentUser.first_name[0]}${currentUser.last_name[0]}`.toUpperCase()
        : currentUser.username.slice(0, 2).toUpperCase();

    return (
        <>
            {billingNotice?.kind && (
                <div className="px-3 lg:px-6 pb-4">
                    <div
                        className={`p-4 rounded-xl border ${billingNotice.kind === 'success'
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-200'
                            : 'bg-amber-500/10 border-amber-500/20 text-amber-200'
                            }`}
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <div className="font-black uppercase tracking-widest text-[10px] mb-1">
                                    {billingNotice.kind === 'success'
                                        ? 'Payment Successful'
                                        : 'Payment Canceled'}
                                </div>
                                <div className="text-slate-200/90 text-xs">
                                    {billingNotice.kind === 'success'
                                        ? 'Thanks — your payment was received. Your invoice status will update shortly.'
                                        : 'No charges were made. You can try again anytime.'}
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    router.push('/dashboard/billing');
                                    setBillingView('invoices');
                                }}
                                className="shrink-0 px-3 py-1.5 rounded-lg bg-white/5 border border-white/15 text-xs font-black uppercase tracking-[0.14em] text-white hover:bg-white/10 transition-all"
                            >
                                View Billing
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex-grow px-3 lg:px-6 pb-3 lg:pb-6">
                <DashboardTabPanels
                    activeTab={tab}
                    setActiveTab={(newTab) => router.push(`/dashboard/${newTab}`)}
                    filteredProjects={filteredProjects}
                    setSelectedProject={setSelectedProject}
                    totalInvestment={totalInvestment}
                    activeProjectsCount={activeProjectsCount}
                    deliverablesCount={deliverablesCount}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    vaultFiles={vaultFiles}
                    projects={projects}
                    billingNotice={billingNotice}
                    billingView={billingView}
                    setBillingView={setBillingView}
                    clientInvoices={clientInvoices}
                    clientProposals={clientProposals}
                    billingDocsLoading={billingDocsLoading}
                    billingDocsError={billingDocsError}
                    onViewInvoice={setSelectedInvoice}
                    onPrintInvoice={handlePrintInvoice}
                    onPayInvoice={handlePayInvoice}
                    onViewProposal={setSelectedProposal}
                    currentUser={currentUser}
                    userInitials={userInitials}
                    settingsView={settingsView}
                    setSettingsView={setSettingsView}
                    firstName={firstName}
                    setFirstName={setFirstName}
                    lastName={lastName}
                    setLastName={setLastName}
                    username={username}
                    setUsername={setUsername}
                    email={email}
                    setEmail={setEmail}
                    handleSaveSettings={handleSaveSettings}
                    isSaving={isSaving}
                    saveSuccess={saveSuccess}
                    handleAvatarChange={handleAvatarChange}
                    usernameStatus={usernameStatus}
                    usernameCheckLoading={usernameCheckLoading}
                />
            </div>

            <DashboardModals
                selectedProject={selectedProject}
                setSelectedProject={setSelectedProject}
                selectedInvoice={selectedInvoice}
                setSelectedInvoice={setSelectedInvoice}
                selectedProposal={selectedProposal}
                setSelectedProposal={setSelectedProposal}
                handleProposalRespond={handleProposalRespond}
                proposalActionInProgress={proposalActionInProgress}
                proposalActionError={proposalActionError}
                showDeclineConfirm={showDeclineConfirm}
                setShowDeclineConfirm={setShowDeclineConfirm}
                onPayInvoice={handlePayInvoice}
                onPrintInvoice={handlePrintInvoice}
            />
        </>
    );
}
