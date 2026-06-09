'use client';

import React from 'react';
import ConfirmDangerModal from '@/components/ConfirmDangerModal';
import { AlertCircle, Trash2 } from 'lucide-react';

export default function ProjectCancelModal({ open, onClose, loading, onConfirm }) {
    return (
        <ConfirmDangerModal
            open={open}
            onClose={onClose}
            title="Cancel Project"
            subtitle="This will mark the project as cancelled and cannot be undone."
            heading="Are you sure you want to cancel this project?"
            body="This action will set the project status to 'cancelled'."
            confirmText="Cancel Project"
            loading={loading}
            onConfirm={onConfirm}
            modalIcon={AlertCircle}
            confirmIcon={Trash2}
            confirmColorClass="bg-brand-red/15 border border-brand-red/30 text-brand-red"
            bodyColorClass="bg-brand-red/10 border border-brand-red/20"
        />
    );
}
