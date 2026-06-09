export function canPayInvoice(status) {
    return status !== 'paid' && status !== 'void';
}