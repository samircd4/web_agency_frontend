'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Chatbot from '@/components/Chatbot';
import Cursor from '@/components/Cursor';

export default function LayoutWrapper({ children }) {
    const pathname = usePathname();
    const isDashboard = pathname?.startsWith('/dashboard');
    const isAdmin = pathname?.startsWith('/admin');

    if (isDashboard || isAdmin) {
        return (
            <main>{children}</main>
        );
    }

    return (
        <>
            <Cursor />
            <Navbar />
            <main>{children}</main>
            <Footer />
            <Chatbot />
        </>
    );
}
