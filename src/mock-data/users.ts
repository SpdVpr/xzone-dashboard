import { User } from '../lib/types';

// Testovací uživatelé pro přihlášení
export const mockUsers: User[] = [
  {
    id: 'user1',
    name: 'Jan Novák',
    email: 'jan.novak@example.com',
    role: 'admin'
  },
  {
    id: 'user2',
    name: 'Petra Svobodová',
    email: 'petra.svobodova@example.com',
    role: 'manager'
  },
  {
    id: 'user3',
    name: 'Martin Dvořák',
    email: 'martin.dvorak@example.com',
    role: 'manager'
  },
  {
    id: 'user4',
    name: 'Lucie Černá',
    email: 'lucie.cerna@example.com',
    role: 'manager'
  }
];

// Funkce pro ověření přihlašovacích údajů
export function authenticateUser(email: string, password: string): User | null {
  console.log('Authenticating user:', { email, passwordLength: password?.length });
  
  // Pro testovací účely akceptujeme jakékoliv heslo, které má alespoň 4 znaky
  if (!password || password.length < 4) {
    console.log('Password validation failed: too short or empty');
    return null;
  }
  
  // Najdeme uživatele podle emailu
  const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (!user) {
    console.log('User not found with email:', email);
  } else {
    console.log('User found:', user.name);
  }
  
  return user || null;
}

// Funkce pro získání uživatele podle ID
export function getUserById(id: string): User | null {
  return mockUsers.find(u => u.id === id) || null;
}
