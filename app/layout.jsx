import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import Script from "next/script"; // Imported Next.js Script Optimization component
import "./globals.css";
import LayoutWrapper from '@/components/LayoutWrapper';

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
                
                {/* 1. Optimized Zapform Tracker */}
                <Script
                    src="https://analytics.zapform.ai/api/tracking-script/cmou2x91o0006i6041glff0u0"
                    strategy="afterInteractive"
                />
                
                {/* 2. Optimized Google Analytics Framework */}
                <Script
                    src="https://www.googletagmanager.com/gtag/js?id=G-BLVNBL6E4B"
                    strategy="afterInteractive"
                />
                <Script id="google-analytics" strategy="afterInteractive">
                    {`
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', 'G-BLVNBL6E4B');
                    `}
                </Script>
            </head>
            {/* Added fallback font family configuration directly inline matching your variables */}
            <body className="font-sans antialiased bg-background text-foreground h-full" suppressHydrationWarning={true}>
                <LayoutWrapper>
                    {children}
                </LayoutWrapper>
            </body>
        </html>
    );
}