'use client';

import { useState, useEffect, useCallback } from 'react';
import { FilterOptions, TransactionType } from '@/lib/types';
import { getDateRangeFromTimeRange } from '@/lib/utils/date';

interface DateRangeFilterProps {
  onChange: (filter: FilterOptions) => void;
  initialFilter?: Partial<FilterOptions>;
}

export default function DateRangeFilter({ onChange, initialFilter }: DateRangeFilterProps) {
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month' | 'custom'>(initialFilter?.timeRange || 'week');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [transactionType, setTransactionType] = useState<TransactionType | undefined>(
    initialFilter?.transactionType
  );
  
  // Inicializace vlastních dat při prvním načtení
  useEffect(() => {
    const today = new Date();
    const formattedToday = today.toISOString().split('T')[0];
    setStartDate(formattedToday);
    setEndDate(formattedToday);
  }, []);
  
  // Memoizovaná funkce pro vytvoření a odeslání filtru
  const updateFilter = useCallback(() => {
    if (timeRange === 'custom' && (!startDate || !endDate)) {
      return; // Neodesílat filtr, pokud nejsou vyplněna vlastní data
    }
    
    let start: Date;
    let end: Date;
    
    if (timeRange === 'custom') {
      start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      
      end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
    } else {
      const dateRange = getDateRangeFromTimeRange(timeRange);
      start = dateRange.start;
      end = dateRange.end;
    }
    
    const filter: FilterOptions = {
      timeRange,
      dateRange: {
        start: start.toISOString(),
        end: end.toISOString(),
      },
      storeLocation: initialFilter?.storeLocation,
      transactionType: transactionType,
    };
    
    onChange(filter);
  }, [timeRange, startDate, endDate, initialFilter?.storeLocation, transactionType, onChange]);
  
  // Nastavení časového rozsahu
  useEffect(() => {
    updateFilter();
  }, [updateFilter]);
  
  return (
    <div className="bg-white shadow rounded-lg p-4 mb-6">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-medium text-gray-900 mb-4 sm:mb-0">Časové období</h2>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setTimeRange('day')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                timeRange === 'day'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Den
            </button>
            
            <button
              onClick={() => setTimeRange('week')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                timeRange === 'week'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Týden
            </button>
            
            <button
              onClick={() => setTimeRange('month')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                timeRange === 'month'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Měsíc
            </button>
            
            <button
              onClick={() => setTimeRange('custom')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                timeRange === 'custom'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Vlastní
            </button>
          </div>
        </div>
        
        {timeRange === 'custom' && (
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex flex-col">
              <label htmlFor="start-date" className="text-sm font-medium text-gray-700 mb-1">
                Od:
              </label>
              <input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="flex flex-col">
              <label htmlFor="end-date" className="text-sm font-medium text-gray-700 mb-1">
                Do:
              </label>
              <input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        )}
        
        {/* Filtr typu transakce */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 pt-4 border-t border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 mb-4 sm:mb-0">Typ prodeje</h2>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setTransactionType(undefined)}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                transactionType === undefined
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Všechny
            </button>
            
            <button
              onClick={() => setTransactionType('reservation')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                transactionType === 'reservation'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Rezervace (e-shop)
            </button>
            
            <button
              onClick={() => setTransactionType('direct_sale')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                transactionType === 'direct_sale'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Přímý prodej
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
