'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import VisitorImport from '@/components/dashboard/VisitorImport';
import { VisitorData } from '@/lib/types';

export default function ImportPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleImport = async (data: VisitorData[]) => {
    if (data.length === 0) return;

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/visitors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Nepodařilo se importovat data');
      }

      const result = await response.json();
      setSuccess(`${result.message}`);
      
      // Aktualizace dat v dashboardu
      setTimeout(() => {
        router.refresh();
      }, 2000);
    } catch (error) {
      console.error('Error importing visitor data:', error);
      setError('Došlo k chybě při importu dat. Zkuste to prosím znovu.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Import dat o návštěvnosti</h1>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
          <p className="text-green-700">{success}</p>
        </div>
      )}

      <div className="mb-8">
        <VisitorImport onImport={handleImport} />
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Instrukce pro import</h2>
        <div className="prose max-w-none">
          <p>
            Pro import dat o návštěvnosti prodejen je potřeba připravit CSV soubor s následujícími sloupci:
          </p>
          <ul className="list-disc pl-5 mt-2 mb-4">
            <li>
              <strong>datum</strong> - datum ve formátu DD.MM.YYYY (např. 01.03.2025)
            </li>
            <li>
              <strong>prodejna</strong> - název prodejny, musí být jeden z: Brno, Praha - OC Lužiny, Praha - Centrála
            </li>
            <li>
              <strong>pocet_navstevniku</strong> - celé číslo udávající počet návštěvníků za daný den
            </li>
          </ul>
          <p>
            Pro usnadnění můžete stáhnout šablonu CSV souboru kliknutím na tlačítko &quot;Stáhnout šablonu&quot;.
          </p>
          <p className="mt-4">
            <strong>Poznámka:</strong> V reálném nasazení by tato data mohla být importována automaticky z externího systému pro počítání návštěvníků.
          </p>
        </div>
      </div>
    </div>
  );
}
