'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Chatbot from '@/components/Chatbot';

export default function LayoutWrapper({ children }) {
    const pathname = usePathname();
    const isDashboard = pathname?.startsWith('/dashboard');

    if (isDashboard) {
        return (
            <>
                <main>{children}</main>
                <Chatbot />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <main>{children}</main>
            <Footer />
            <Chatbot />
        </>
    );
}
