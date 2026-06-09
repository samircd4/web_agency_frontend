'use client';

import React from 'react';
import ConfirmDangerModal from '@/components/ConfirmDangerModal';
import { CheckCircle2 } from 'lucide-react';

export default function ProjectCompleteModal({ open, onClose, loading, onConfirm }) {
    return (
        <ConfirmDangerModal
            open={open}
            onClose={onClose}
            title="Complete Project"
            subtitle="This will mark the project as complete and cannot be undone."
            heading="Are you sure you want to mark this project as complete?"
            body="This action will set the project status to 'completed'."
            confirmText="Mark Complete"
            loading={loading}
            onConfirm={onConfirm}
            modalIcon={CheckCircle2}
            confirmIcon={CheckCircle2}
            confirmColorClass="bg-emerald-500/15 border border-emerald-500/30 text-emerald-500"
            bodyColorClass="bg-emerald-500/10 border border-emerald-500/20"
        />
    );
}
