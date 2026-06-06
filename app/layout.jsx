// app/layout.jsx

import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import LayoutWrapper from '@/components/LayoutWrapper';
import JsonLd from '@/components/JsonLd';
import { organizationSchema, websiteSchema } from '@/lib/schemas';

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
    metadataBase: new URL("https://drpythonsolutions.com"),

    title: {
        default:  "Dr Python Solutions | Python Developer & E-commerce Expert",
        template: "%s | Dr Python Solutions",
    },

    description:
        "Hire a Python developer for e-commerce development, web scraping, API development, price monitoring and automation. 150+ projects delivered worldwide.",

    keywords: [
        "hire python developer",
        "web scraping service",
        "django e-commerce developer",
        "API development service",
        "price monitoring system",
        "python automation expert",
        "web scraping company",
        "e-commerce development service",
    ],

    authors: [{ name: "Somir Chandra Dash", url: "https://drpythonsolutions.com" }],
    creator: "Somir Chandra Dash",

    openGraph: {
        type:        "website",
        url:         "https://drpythonsolutions.com",
        siteName:    "Dr Python Solutions",
        locale:      "en_US",
        title:       "Dr Python Solutions | Python Developer & E-commerce Expert",
        description: "E-commerce development, web scraping, API development and automation. 150+ projects delivered.",
        images: [{
            url:    "/images/og-image.png",
            width:  1200,
            height: 630,
            alt:    "Dr Python Solutions",
        }],
    },

    twitter: {
        card:        "summary_large_image",
        title:       "Dr Python Solutions | Python Developer & E-commerce Expert",
        description: "E-commerce development, web scraping, API development and automation.",
        images:      ["/images/og-image.png"],
    },

    robots: {
        index:     true,
        follow:    true,
        googleBot: {
            index:               true,
            follow:              true,
            "max-image-preview": "large",
        },
    },

    icons: {
        icon: '/logo/logo.png',
    },
};

export default function RootLayout({ children }) {
    return (
        <html
            lang="en"
            suppressHydrationWarning={true}
            data-scroll-behavior="smooth"
            className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} h-full antialiased dark`}
        >
            <head>
                {/* Google Analytics */}
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

            <body
                className="font-sans antialiased bg-background text-foreground h-full"
                suppressHydrationWarning={true}
            >
                {/* Schemas — replaces the old inline jsonLd script */}
                <JsonLd data={organizationSchema} />
                <JsonLd data={websiteSchema} />

                <LayoutWrapper>
                    {children}
                </LayoutWrapper>
            </body>
        </html>
    );
}