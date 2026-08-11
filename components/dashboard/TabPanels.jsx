import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Communications from './Communications';
import Settings from './Settings';
import BillingTab from './BillingTab';
import ProjectsTab from './ProjectsTab';
import VaultTab from './VaultTab';
// Seller-specific tabs
import SellerProjectsTab from './SellerProjectsTab';
import SellerServicesTab from './SellerServicesTab';
import SellerPortfolioTab from './SellerPortfolioTab';
import SellerBlogTab from './SellerBlogTab';

export default function DashboardTabPanels(props) {
    // Read from localStorage — same source of truth as the Sidebar
    const getStoredRole = () => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('active_role') || props.currentUser?.active_role || 'buyer';
        }
        return props.currentUser?.active_role || 'buyer';
    };

    const [activeRole, setActiveRole] = useState(getStoredRole);

    // Re-sync when currentUser prop changes (after API call resolves)
    useEffect(() => {
        if (props.currentUser?.active_role) {
            setActiveRole(props.currentUser.active_role);
        }
    }, [props.currentUser?.active_role]);

    // Also poll localStorage for Sidebar-driven changes (instant switch)
    useEffect(() => {
        const interval = setInterval(() => {
            const stored = localStorage.getItem('active_role') || 'buyer';
            setActiveRole(prev => prev !== stored ? stored : prev);
        }, 200);
        return () => clearInterval(interval);
    }, []);

    const isSellerMode = activeRole === 'seller';


    return (
        <AnimatePresence mode="wait">

            {/* ── Projects / Active Orders ── */}
            {props.activeTab === 'projects' && (
                isSellerMode
                    ? <SellerProjectsTab key="seller-projects" />
                    : (
                        <ProjectsTab
                            key="buyer-projects"
                            filteredProjects={props.filteredProjects}
                            totalInvestment={props.totalInvestment}
                            activeProjectsCount={props.activeProjectsCount}
                            deliverablesCount={props.deliverablesCount}
                            searchQuery={props.searchQuery}
                        />
                    )
            )}

            {/* ── Seller: My Services ── */}
            {props.activeTab === 'services' && isSellerMode && (
                <SellerServicesTab key="seller-services" />
            )}

            {/* ── Seller: My Portfolio ── */}
            {props.activeTab === 'portfolio' && isSellerMode && (
                <SellerPortfolioTab key="seller-portfolio" currentUser={props.currentUser} />
            )}

            {/* ── Seller: My Blog Articles ── */}
            {props.activeTab === 'blog' && isSellerMode && (
                <SellerBlogTab key="seller-blog" currentUser={props.currentUser} />
            )}

            {/* ── Vault ── */}
            {props.activeTab === 'vault' && (
                <VaultTab key="vault" vaultFiles={props.vaultFiles} />
            )}

            {/* ── Communications ── */}
            {props.activeTab === 'comms' && (
                <Communications key="comms" missions={props.projects} isSellerMode={isSellerMode} />
            )}

            {/* ── Billing ── */}
            {props.activeTab === 'billing' && (
                <BillingTab
                    key="billing"
                    billingNotice={props.billingNotice}
                    billingView={props.billingView}
                    setBillingView={props.setBillingView}
                    clientInvoices={props.clientInvoices}
                    clientProposals={props.clientProposals}
                    billingDocsLoading={props.billingDocsLoading}
                    billingDocsError={props.billingDocsError}
                    onViewInvoice={props.onViewInvoice}
                    onPrintInvoice={props.onPrintInvoice}
                    onPayInvoice={props.onPayInvoice}
                    onViewProposal={props.onViewProposal}
                />
            )}

            {/* ── Settings ── */}
            {props.activeTab === 'settings' && (
                <Settings
                    key="settings"
                    currentUser={props.currentUser}
                    userInitials={props.userInitials}
                    settingsView={props.settingsView}
                    setSettingsView={props.setSettingsView}
                    firstName={props.firstName}
                    setFirstName={props.setFirstName}
                    lastName={props.lastName}
                    setLastName={props.setLastName}
                    username={props.username}
                    setUsername={props.setUsername}
                    email={props.email}
                    setEmail={props.setEmail}
                    handleSaveSettings={props.handleSaveSettings}
                    isSaving={props.isSaving}
                    saveSuccess={props.saveSuccess}
                    handleAvatarChange={props.handleAvatarChange}
                    usernameStatus={props.usernameStatus}
                    usernameCheckLoading={props.usernameCheckLoading}
                />
            )}
        </AnimatePresence>
    );
}
