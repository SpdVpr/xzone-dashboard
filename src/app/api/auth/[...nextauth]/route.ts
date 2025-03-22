import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { mockUsers } from '@/mock-data/users';

// Zjednodušená konfigurace NextAuth pro testovací účely
const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Heslo', type: 'password' }
      },
      async authorize(credentials) {
        console.log('NextAuth authorize called with credentials:', {
          email: credentials?.email,
          passwordLength: credentials?.password?.length
        });

        if (!credentials?.email || !credentials?.password) {
          console.log('Missing email or password');
          return null;
        }

        // Pro testovací účely akceptujeme jakékoliv heslo, které má alespoň 4 znaky
        if (credentials.password.length < 4) {
          console.log('Password too short');
          return null;
        }

        // Najdeme uživatele podle emailu
        const user = mockUsers.find(
          u => u.email.toLowerCase() === credentials.email.toLowerCase()
        );
        
        if (user) {
          console.log('User found and authenticated:', user.name);
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          };
        }
        
        console.log('User not found with email:', credentials.email);
        return null;
      }
    })
  ],
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      // Přidání role do JWT tokenu
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Přidání role do session
      if (session.user) {
        session.user.role = token.role as 'admin' | 'manager';
        session.user.id = token.id as string;
      }
      return session;
    }
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hodin
  },
  debug: true, // Zapnutí debug módu pro NextAuth
  secret: process.env.NEXTAUTH_SECRET || 'tajny-klic-pro-vyvoj',
});

export { handler as GET, handler as POST };
