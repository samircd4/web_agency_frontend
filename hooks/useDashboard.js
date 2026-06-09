'use client';

import { createContext, useContext } from 'react';
import useAuthAndUser from './useAuthAndUser';
import useProjectsData from './useProjectsData';
import useBillingData from './useBillingData';
import useDashboardNavigation from './useDashboardNavigation';

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

export default function useDashboard() {
    const ctx = useContext(DashboardContext);
    if (!ctx) {
        throw new Error('useDashboard must be used inside <DashboardProvider>');
    }
    return ctx;
}

// ─── Internal state hook (used only by DashboardProvider) ────────────────────

function useDashboardState() {
    // Auth and User state
    const { currentUser, loading: userLoading, handleLogout, ...authAndUserSettings } = useAuthAndUser();

    // Projects data and state
    const projectsData = useProjectsData(currentUser);
    const { projects } = projectsData;

    // Billing state
    const billingData = useBillingData(projects);

    // Navigation state
    const navigationData = useDashboardNavigation();

    return {
        // Auth/User Settings
        currentUser,
        userLoading,
        handleLogout,
        ...authAndUserSettings,

        // Projects Data
        ...projectsData,

        // Billing Data
        ...billingData,

        // Navigation State
        ...navigationData,
    };
}