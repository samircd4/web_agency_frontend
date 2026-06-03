import { redirect } from 'next/navigation';

const VALID_TABS = ['projects', 'vault', 'comms', 'billing', 'settings'];

export default async function DashboardPage({ searchParams }) {
    const resolvedSearchParams = await searchParams;
    const tab = resolvedSearchParams?.tab;

    if (tab && VALID_TABS.includes(tab)) {
        redirect(`/dashboard/${tab}`);
    }

    redirect('/dashboard/projects');
}
