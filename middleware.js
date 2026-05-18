import { NextResponse } from 'next/server';

export function middleware(request) {
    const { pathname } = request.nextUrl;

    // Allow login page to pass through freely
    if (pathname.startsWith('/admin/login')) {
        return NextResponse.next();
    }

    // Check for the admin session cookie (mock auth)
    // FUTURE: Replace this with a real Django JWT/session validation call
    const adminSession = request.cookies.get('admin_session');

    if (!adminSession?.value) {
        const loginUrl = new URL('/admin/login', request.url);
        loginUrl.searchParams.set('from', pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};
