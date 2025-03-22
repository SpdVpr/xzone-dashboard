import { NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';

// Zjednodušený middleware pro autentizaci
export default withAuth({
  pages: {
    signIn: '/login',
  },
});

// Konfigurace, které cesty by měly být chráněny middlewarem
export const config = {
  matcher: ['/dashboard/:path*'],
};
