import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    experimental: {
        serverActions: {
            allowedOrigins: ["drpythonsolutions.com", "*.drpypythonsolutions.com"],
        },
    },
    env: {
        NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000',
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "images.unsplash.com",
            },
            {
                protocol: "https",
                hostname: "plus.unsplash.com",
            }
        ],
    },
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/:path*`,
            },
            {
                source: '/docs',
                destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/docs/`,
            },
        ];
    },
};

export default nextConfig;

