import { DefaultSession, DefaultUser } from 'next-auth';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  /**
   * Rozšíření výchozího User typu
   */
  interface User extends DefaultUser {
    role?: 'admin' | 'manager';
  }

  /**
   * Rozšíření výchozího Session typu
   */
  interface Session {
    user: {
      id: string;
      role: 'admin' | 'manager';
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  /**
   * Rozšíření výchozího JWT typu
   */
  interface JWT {
    id?: string;
    role?: 'admin' | 'manager';
  }
}
