'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import ServiceForm from '@/components/services/ServiceForm';
import { api } from '@/lib/api';
import { Loader2 } from 'lucide-react';

export default function SellerEditServicePage() {
    const { id } = useParams() || {};
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        async function fetchService() {
            try {
                const data = await api.getSellerServiceDetail(id);
                setService(data);
            } catch (err) {
                console.error('Failed to load service detail:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchService();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#060814] flex items-center justify-center text-white">
                <Loader2 size={32} className="animate-spin text-purple-400" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#060814] text-white p-6 pt-24">
            <ServiceForm initialData={service} isSeller={true} backUrl="/dashboard/services" />
        </div>
    );
}
