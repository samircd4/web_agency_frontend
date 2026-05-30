'use client';

import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import useDashboard from '@/hooks/useDashboard';
import DashboardSidebar from '@/components/dashboard/Sidebar';
import DashboardTopbar from '@/components/dashboard/Topbar';
import DashboardTabPanels from '@/components/dashboard/TabPanels';
import DashboardModals from '@/components/dashboard/Modals';

export default function DashboardView() {
    const {
        activeTab,
        setActiveTab,
        selectedProject,
        setSelectedProject,
        isSidebarOpen,
        setIsSidebarOpen,
        loading,
        currentUser,
        projects,
        searchQuery,
        setSearchQuery,
        billingView,
        setBillingView,
        settingsView,
        setSettingsView,
        sysConfigName,
        setSysConfigName,
        sysConfigEmail,
        setSysConfigEmail,
        isSaving,
        saveSuccess,
        handleSaveSettings,
        handleAvatarChange,
        clientInvoices,
        clientProposals,
        billingDocsLoading,
        billingDocsError,
        selectedInvoice,
        setSelectedInvoice,
        selectedProposal,
        setSelectedProposal,
        billingNotice,
        setBillingNotice,
        proposalActionInProgress,
        proposalActionError,
        showDeclineConfirm,
        setShowDeclineConfirm,
        handleLogout,
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

    if (loading || !currentUser) {
        return (
            <div className="min-h-screen bg-[#020617] flex items-center justify-center">
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

    const totalInvestment = projects.reduce(
        (sum, m) => sum + Number(m.value || 0),
        0
    );
    const activeProjectsCount = projects.filter(
        (m) => m.stage !== 'Complete'
    ).length;
    const deliverablesCount = vaultFiles.length;

    const pendingInvoiceCount = clientInvoices.filter(
        (inv) => inv.status !== 'paid' && inv.status !== 'void'
    ).length;
    const pendingProposalCount = clientProposals.filter(
        (prop) => prop.status === 'sent'
    ).length;

    const userInitials =
        currentUser.first_name && currentUser.last_name
            ? `${currentUser.first_name[0]}${currentUser.last_name[0]}`.toUpperCase()
            : currentUser.username.slice(0, 2).toUpperCase();

    const userDisplayName =
        currentUser.first_name && currentUser.last_name
            ? `${currentUser.first_name} ${currentUser.last_name}`
            : currentUser.username;

    return (
        <div className="h-screen bg-[#020617] text-slate-300 font-sans overflow-hidden">
            <AnimatePresence>
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[100] lg:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}
            </AnimatePresence>

            <DashboardSidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                handleLogout={handleLogout}
                pendingInvoiceCount={pendingInvoiceCount}
                pendingProposalCount={pendingProposalCount}
            />

            <main className="lg:pl-[272px] h-screen flex flex-col p-0 lg:p-0">
                <div className="px-4 lg:px-8 pt-4 lg:pt-6">
                    <DashboardTopbar
                        isDesktop={isDesktop}
                        setIsSidebarOpen={setIsSidebarOpen}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        setActiveTab={setActiveTab}
                        activeProjectsCount={activeProjectsCount}
                        userDisplayName={userDisplayName}
                        userInitials={userInitials}
                        currentUser={currentUser}
                    />
                </div>

                {billingNotice?.kind && (
                    <div className="px-4 lg:px-8">
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
                                        setActiveTab('billing');
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

                <div className="flex-grow overflow-hidden px-4 lg:px-8 pb-4 lg:pb-6">
                    <DashboardTabPanels
                        activeTab={activeTab}
                        filteredProjects={filteredProjects}
                        setSelectedProject={setSelectedProject}
                        totalInvestment={totalInvestment}
                        activeProjectsCount={activeProjectsCount}
                        deliverablesCount={deliverablesCount}
                        searchQuery={searchQuery}
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
                        sysConfigName={sysConfigName}
                        setSysConfigName={setSysConfigName}
                        sysConfigEmail={sysConfigEmail}
                        setSysConfigEmail={setSysConfigEmail}
                        handleSaveSettings={handleSaveSettings}
                        isSaving={isSaving}
                        saveSuccess={saveSuccess}
                        handleAvatarChange={handleAvatarChange}
                    />
                </div>
            </main>

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
        </div>
    );
}
