import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
    variable: "--font-space-grotesk",
    subsets: ["latin"],
});

export const metadata = {
    title: {
        default: 'Dr. Python Solutions | Scraping & E-commerce Engineering',
        template: '%s | Dr. Python Solutions'
    },
    description: 'Expert software engineering specializing in industrial-grade web scraping, high-velocity API ecosystems, and premium e-commerce architectures.',
    keywords: ['Web Scraping', 'Python Developer', 'Django E-commerce', 'Automation Expert', 'Data Extraction', 'API Development', 'Software Engineering'],
    authors: [{ name: 'Samir' }],
    creator: 'Samir',
    openGraph: {
        title: 'Dr. Python Solutions',
        description: 'Engineering Scalable Digital Assets with Maximum Velocity',
        url: 'https://drpythonsolutions.com',
        siteName: 'Dr. Python Solutions',
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Dr. Python Solutions',
        description: 'Engineering Scalable Digital Assets with Maximum Velocity',
    },
    robots: {
        index: true,
        follow: true,
    },
    icons: {
        icon: '/favicon.png',
    },
};

import Cursor from '@/components/Cursor';

export default function RootLayout({ children }) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        "name": "Dr. Python Solutions",
        "image": "https://drpythonsolutions.com/images/logo/logo.png",
        "description": "Expert software engineering specializing in industrial-grade web scraping and premium e-commerce architectures.",
        "address": {
            "@type": "PostalAddress",
            "addressCountry": "Global"
        },
        "url": "https://drpythonsolutions.com"
    };

    return (
        <html
            lang="en"
            suppressHydrationWarning
            data-scroll-behavior="smooth"
            className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} h-full antialiased dark`}
        >
            <head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            </head>
            <body className="antialiased bg-background text-foreground" suppressHydrationWarning={true}>
                <Cursor />
                <Navbar />
                <main>{children}</main>
                <Footer />
            </body>
        </html>
    );
}
