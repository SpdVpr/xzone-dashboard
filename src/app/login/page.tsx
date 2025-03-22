'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Login form submitted with:', { email, passwordLength: password.length });
    
    if (!email || !password) {
      setError('Vyplňte prosím email a heslo');
      return;
    }
    
    if (password.length < 4) {
      setError('Heslo musí mít alespoň 4 znaky');
      return;
    }
    
    try {
      setIsLoading(true);
      setError('');
      
      console.log('Calling signIn with credentials');
      
      // Přidáme callbackUrl pro správné přesměrování
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
        callbackUrl: '/dashboard'
      });
      
      console.log('SignIn result:', result);
      
      if (result?.error) {
        setError('Neplatné přihlašovací údaje: ' + result.error);
        console.error('SignIn error:', result.error);
      } else if (result?.url) {
        console.log('Login successful, redirecting to:', result.url);
        // Použijeme window.location.href místo router.push pro úplné obnovení stránky
        window.location.href = result.url;
      } else {
        console.log('Login successful but no URL returned, using default redirect');
        window.location.href = '/dashboard';
      }
    } catch (error) {
      setError('Došlo k chybě při přihlašování: ' + (error instanceof Error ? error.message : String(error)));
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Dashboard Prodejen</h1>
          <h2 className="mt-6 text-xl font-semibold text-gray-900">Přihlášení</h2>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
              <p className="text-red-700">{error}</p>
            </div>
          )}
          
          <div className="rounded-md -space-y-px">
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="jan.novak@example.com"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Heslo
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
            >
              {isLoading ? 'Přihlašování...' : 'Přihlásit se'}
            </button>
          </div>
          
          <div className="text-sm text-center mt-4">
            <p className="text-gray-600">
              Pro testovací účely použijte:
            </p>
            <p className="text-gray-600 mt-1">
              Email: jan.novak@example.com
            </p>
            <p className="text-gray-600">
              Heslo: libovolné (min. 4 znaky)
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
