import React from 'react';
import { AnimatePresence } from 'framer-motion';
import Communications from './Communications';
import Settings from './Settings';
import BillingTab from './BillingTab';
import ProjectsTab from './ProjectsTab';
import VaultTab from './VaultTab';





export default function DashboardTabPanels(props) {
    return (
        <AnimatePresence mode="wait">
            {props.activeTab === 'projects' && (
                <ProjectsTab
                    filteredProjects={props.filteredProjects}
                    totalInvestment={props.totalInvestment}
                    activeProjectsCount={props.activeProjectsCount}
                    deliverablesCount={props.deliverablesCount}
                    searchQuery={props.searchQuery}
                />
            )}
            {props.activeTab === 'vault' && (
                <VaultTab vaultFiles={props.vaultFiles} />
            )}
            {props.activeTab === 'comms' && (
                <Communications missions={props.projects} />
            )}
            {props.activeTab === 'billing' && (
                <BillingTab
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
            {props.activeTab === 'settings' && (
                <Settings
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
