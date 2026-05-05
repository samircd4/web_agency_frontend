import React from 'react';
import AboutUs from '@/components/AboutUs';

export const metadata = {
    title: 'About Us',
    description: 'Learn about Dr. Python Solutions — a boutique software engineering firm building industrial-grade scraping networks, commerce engines, and API infrastructures.',
};

export default function AboutView() {
    return (
        <main className="bg-background">
            <AboutUs />
        </main>
    );
}
