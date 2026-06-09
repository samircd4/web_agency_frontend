export const centsToMoney = (cents) => {
    const value = Number(cents || 0) / 100;
    return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export const valueToMoney = (value) => {
    const numeric = Number(value || 0);
    if (!Number.isFinite(numeric)) return '0.00';
    return numeric.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export const invoicePaymentLabel = (status) => (status === 'paid' ? 'Paid' : 'Unpaid');