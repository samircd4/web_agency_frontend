'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, usePathname } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import useDashboard from '@/hooks/useDashboard';
import DashboardSidebar from '@/components/dashboard/Sidebar';
import DashboardTopbar from '@/components/dashboard/Topbar';
import DashboardTabPanels from '@/components/dashboard/TabPanels';
import DashboardModals from '@/components/dashboard/Modals';
import BillingNotice from '@/components/dashboard/BillingNotice';
import DashboardLoadingState from '@/components/dashboard/DashboardLoadingState';

export default function DashboardView() {
    const {
        // Auth and User State
        currentUser,
        userLoading,
        handleLogout,
        // Projects Data
        projects,
        projectsLoading,
        selectedProject,
        setSelectedProject,
        searchQuery,
        setSearchQuery,
        filteredProjects,
        totalInvestment,
        activeProjectsCount,
        deliverablesCount,
        vaultFiles,
        // Billing Data
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
        billingNotice,
        setBillingNotice,
        proposalActionInProgress,
        proposalActionError,
        showDeclineConfirm,
        setShowDeclineConfirm,
        handleProposalRespond,
        handlePayInvoice,
        handlePrintInvoice,
        pendingInvoiceCount,
        pendingProposalCount,
        // Settings (from authAndUserSettings)
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
        // Navigation State
        activeTab,
        setActiveTab,
        isSidebarOpen,
        setIsSidebarOpen,
    } = useDashboard();

    const loading = userLoading || projectsLoading || billingDocsLoading;

    const searchParams = useSearchParams();
    const pathname = usePathname();

    // Update activeTab when URL search params change
    useEffect(() => {
        const tabFromUrl = searchParams.get('tab');
        if (tabFromUrl && ['projects', 'vault', 'comms', 'billing', 'settings'].includes(tabFromUrl)) {
            setActiveTab(tabFromUrl);
        }
    }, [searchParams, setActiveTab]);

    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        const checkIsDesktop = () => setIsDesktop(window.innerWidth >= 1024);
        checkIsDesktop();
        window.addEventListener('resize', checkIsDesktop);
        return () => window.removeEventListener('resize', checkIsDesktop);
    }, []);

    // Update URL when activeTab changes
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const newUrl = `/dashboard?tab=${activeTab}`;
            window.history.replaceState({}, '', newUrl);
        }
    }, [activeTab]);

    if (loading || !currentUser) {
        return (
            <DashboardLoadingState
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                handleLogout={handleLogout}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            />
        );
    }







    return (
        <div className="min-h-screen bg-[#020617] text-slate-300 font-sans">
            <AnimatePresence>
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[100] lg:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}
            </AnimatePresence>

            <DashboardSidebar
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                handleLogout={handleLogout}
                pendingInvoiceCount={pendingInvoiceCount}
                pendingProposalCount={pendingProposalCount}
            />

            {/* Fixed Topbar */}
            <div className="fixed top-0 right-0 left-0 lg:left-[256px] z-30 bg-[#020617] px-3 lg:px-6 py-3">
                <DashboardTopbar
                    setIsSidebarOpen={setIsSidebarOpen}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    currentUser={currentUser}
                />
            </div>

            {/* Main Content with Padding for Fixed Topbar */}
            <main className="lg:pl-[256px] flex flex-col p-0 lg:p-0 mt-[100px] min-h-screen">
                <BillingNotice
                    billingNotice={billingNotice}
                    onViewBilling={() => {
                        setActiveTab('billing');
                        setBillingView('invoices');
                    }}
                />

                <div className="flex-grow px-3 lg:px-6 pb-3 lg:pb-6">
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
                        onViewInvoice={selectedInvoice => setSelectedInvoice(selectedInvoice)}
                        onPrintInvoice={handlePrintInvoice}
                        onPayInvoice={handlePayInvoice}
                        onViewProposal={selectedProposal => setSelectedProposal(selectedProposal)}
                        currentUser={currentUser}
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
