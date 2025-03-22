import { redirect } from 'next/navigation';

export default function Home() {
  // Přesměrování na přihlašovací stránku
  redirect('/login');
}
