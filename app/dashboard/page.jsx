'use client';

import React, { Suspense } from 'react';
import DashboardView from './DashboardView';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#020617] flex items-center justify-center">
                <Loader2 size={32} className="animate-spin text-[#00f2fe]" />
            </div>
        }>
            <DashboardView />
        </Suspense>
    );
}
