'use client';

import React, { useEffect, useState } from 'react';
import { notFound, useRouter, useParams } from 'next/navigation';
import useDashboard from '@/hooks/useDashboard';
import DashboardTabPanels from '@/components/dashboard/TabPanels';
import DashboardModals from '@/components/dashboard/Modals';
import BillingNotice from '@/components/dashboard/BillingNotice';
import DashboardLoadingState from '@/components/dashboard/DashboardLoadingState';

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
        return <DashboardLoadingState />;
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
            <BillingNotice
                billingNotice={billingNotice}
                onViewBilling={() => {
                    router.push('/dashboard/billing');
                    setBillingView('invoices');
                }}
            />


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
