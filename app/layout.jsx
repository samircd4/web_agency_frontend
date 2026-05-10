import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import LayoutWrapper from '@/components/LayoutWrapper';
import Cursor from '@/components/Cursor';

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
        description: 'Engineering Scalable Digital Assets with Velocity',
    },
    robots: {
        index: true,
        follow: true,
    },
    icons: {
        icon: '/favicon.png',
    },
};

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
            suppressHydrationWarning={true}
            data-scroll-behavior="smooth"
            className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} h-full antialiased dark`}
        >
            <head>
                {/* JSON-LD with unique key and suppression to avoid extension interference */}
                <script
                    key="json-ld"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                    suppressHydrationWarning={true}
                />
                {/* External Tracking Script */}
                <script 
                    async 
                    src="https://analytics.zapform.ai/api/tracking-script/cmou2x91o0006i6041glff0u0"
                    suppressHydrationWarning={true}
                />
            </head>
            <body className="antialiased bg-background text-foreground" suppressHydrationWarning={true}>
                <Cursor />
                <LayoutWrapper>
                    {children}
                </LayoutWrapper>
            </body>
        </html>
    );
}
