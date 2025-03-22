'use client';

import { useState, useRef } from 'react';
import { parseVisitorCSV, createVisitorCSVTemplate } from '@/lib/utils/csv';
import { VisitorData } from '@/lib/types';
import { formatDate } from '@/lib/utils/date';

interface VisitorImportProps {
  onImport: (data: VisitorData[]) => void;
}

export default function VisitorImport({ onImport }: VisitorImportProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Array<{ row: number; message: string }>>([]);
  const [importedData, setImportedData] = useState<VisitorData[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setErrors([]);
      setImportedData([]);
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setIsLoading(true);
    setErrors([]);
    setImportedData([]);

    try {
      const content = await file.text();
      const { data, errors } = parseVisitorCSV(content);

      setErrors(errors);
      setImportedData(data);

      if (data.length > 0 && errors.length === 0) {
        onImport(data);
      }
    } catch (error) {
      console.error('Error parsing CSV:', error);
      setErrors([{ row: 0, message: 'Chyba při zpracování souboru. Zkontrolujte formát CSV.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadTemplate = () => {
    const template = createVisitorCSVTemplate();
    const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'sablona-navstevnost.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetForm = () => {
    setFile(null);
    setErrors([]);
    setImportedData([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Import dat o návštěvnosti</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Nahrajte CSV soubor s daty o návštěvnosti prodejen.
        </p>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">CSV soubor</label>
            <div className="mt-1 flex items-center">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <button
                type="button"
                onClick={handleDownloadTemplate}
                className="ml-3 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Stáhnout šablonu
              </button>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Soubor musí obsahovat sloupce: datum, prodejna, pocet_navstevniku
            </p>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={resetForm}
              className="mr-3 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Zrušit
            </button>
            <button
              type="button"
              onClick={handleImport}
              disabled={!file || isLoading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
            >
              {isLoading ? 'Importuji...' : 'Importovat data'}
            </button>
          </div>
        </div>

        {errors.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-red-800">Chyby při importu:</h4>
            <div className="mt-2 p-4 bg-red-50 rounded-md">
              <ul className="list-disc pl-5 space-y-1">
                {errors.map((error, index) => (
                  <li key={index} className="text-sm text-red-700">
                    Řádek {error.row}: {error.message}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {importedData.length > 0 && errors.length === 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-green-800">
              Úspěšně importováno {importedData.length} záznamů
            </h4>
            <div className="mt-2 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Datum
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Prodejna
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Počet návštěvníků
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {importedData.slice(0, 5).map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(item.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.storeLocation}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.visitorCount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {importedData.length > 5 && (
                <p className="mt-2 text-sm text-gray-500 text-center">
                  Zobrazeno prvních 5 z {importedData.length} záznamů
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
