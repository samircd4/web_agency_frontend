'use client';

import React from 'react';
import ServiceForm from '@/components/services/ServiceForm';

export default function AdminNewServicePage() {
    return (
        <div className="min-h-screen bg-[#060814] text-white p-6 pt-24">
            <ServiceForm isSeller={false} backUrl="/admin/services" />
        </div>
    );
}
