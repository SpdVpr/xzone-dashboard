// Middleware je dočasně zakázán, aby byl umožněn přímý přístup k dashboardu bez přihlášení

/*
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
*/

// Prázdný middleware, který nic nedělá
export function middleware() {
  // Bez autentizace - přímý přístup k dashboardu
  return;
}

// Prázdná konfigurace - žádné cesty nejsou chráněny
export const config = {
  matcher: [], // Žádné cesty nejsou chráněny
};
