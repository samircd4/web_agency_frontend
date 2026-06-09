export const getStatusClasses = (status) => {
    switch (status) {
        case 'pending':
            return 'bg-amber-500/10 text-amber-300 border-amber-500/20';
        case 'active':
            return 'bg-brand-teal/10 text-brand-teal border-brand-teal/20';
        case 'complete':
            return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20';
        case 'cancelled':
            return 'bg-brand-red/10 text-brand-red border-brand-red/20';
        default:
            return 'bg-white/5 text-primary border-white/10';
    }
};