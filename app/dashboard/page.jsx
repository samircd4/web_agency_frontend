import { redirect } from 'next/navigation';

const VALID_TABS = ['projects', 'vault', 'comms', 'billing', 'settings'];

export default async function DashboardPage({ searchParams }) {
    const resolvedSearchParams = await searchParams;
    const tab = resolvedSearchParams?.tab;

    const searchParamsObj = new URLSearchParams(resolvedSearchParams);
    searchParamsObj.delete('tab');
    const queryString = searchParamsObj.toString();

    if (tab && VALID_TABS.includes(tab)) {
        const dest = queryString ? `/dashboard/${tab}?${queryString}` : `/dashboard/${tab}`;
        redirect(dest);
    }

    const dest = queryString ? `/dashboard/projects?${queryString}` : `/dashboard/projects`;
    redirect(dest);
}
