'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { FiDollarSign, FiShoppingCart, FiUsers, FiPercent, FiClock } from 'react-icons/fi';
import DateRangeFilter from '@/components/ui/DateRangeFilter';
import StatCard from '@/components/ui/StatCard';
import PieChart from '@/components/dashboard/PieChart';
import BarChart from '@/components/dashboard/BarChart';
import ProductTable from '@/components/dashboard/ProductTable';
import { FilterOptions, DashboardData, StoreLocation } from '@/lib/types';
import { formatCurrency, formatNumber, formatPercentage } from '@/lib/utils/format';

// Mapování URL slugů na názvy prodejen
const slugToStore: Record<string, StoreLocation> = {
  'brno': 'Brno',
  'praha-luziny': 'Praha - OC Lužiny',
  'praha-centrala': 'Praha - Centrála'
};


export default function StorePage() {
  const params = useParams();
  const slug = params.slug as string;
  const storeName = slugToStore[slug];

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [filter, setFilter] = useState<FilterOptions | null>(null);

  // Načtení dat při změně filtru
  useEffect(() => {
    if (!filter) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...filter,
            storeLocation: storeName
          }),
        });

        if (!response.ok) {
          throw new Error('Nepodařilo se načíst data');
        }

        const data = await response.json();
        setDashboardData(data);
      } catch (error) {
        console.error('Error fetching store data:', error);
        setError('Došlo k chybě při načítání dat. Zkuste to prosím znovu.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [filter, storeName]);

  // Zpracování změny filtru - memoizováno pomocí useCallback
  const handleFilterChange = useCallback((newFilter: FilterOptions) => {
    setFilter(newFilter);
  }, []);

  // Příprava dat pro grafy
  const preparePaymentMethodData = () => {
    if (!dashboardData || !storeName) return [];

    const storeData = dashboardData.storeData[storeName];
    
    return [
      { name: 'Hotovost', value: storeData.paymentMethodDistribution.cash },
      { name: 'Karta', value: storeData.paymentMethodDistribution.card },
    ];
  };
  
  // Příprava dat pro rozdělení typů transakcí
  const prepareTransactionTypeData = () => {
    if (!dashboardData || !storeName) return [];
    
    // Pokud byl aplikován filtr na typ transakce, zobrazíme pouze ten typ
    if (filter?.transactionType === 'reservation') {
      return [{ name: 'Rezervace (e-shop)', value: dashboardData.storeData[storeName].transactionCount }];
    } else if (filter?.transactionType === 'direct_sale') {
      return [{ name: 'Přímý prodej', value: dashboardData.storeData[storeName].transactionCount }];
    }
    
    // Jinak zobrazíme oba typy (odhad, pokud nemáme přesná data)
    const totalTransactions = dashboardData.storeData[storeName].transactionCount;
    return [
      { name: 'Rezervace (e-shop)', value: totalTransactions * 0.4 }, // Odhad
      { name: 'Přímý prodej', value: totalTransactions * 0.6 }, // Odhad
    ];
  };
  
  // Příprava dat pro prodeje podle hodin
  const prepareHourlySalesData = () => {
    if (!dashboardData || !storeName) return [];
    
    // Formátování hodin pro lepší čitelnost
    return dashboardData.storeData[storeName].hourlySales.map(item => ({
      name: `${item.hour}:00`,
      count: item.count,
      revenue: item.revenue
    }));
  };
  
  // Najde hodinu s nejvyšším počtem prodejů
  const findPeakHour = () => {
    if (!dashboardData || !storeName) return null;
    
    const peakHour = dashboardData.storeData[storeName].hourlySales.reduce(
      (peak, current) => current.count > peak.count ? current : peak,
      { hour: 0, count: 0, revenue: 0 }
    );
    
    return peakHour.hour;
  };

  // Pokud prodejna neexistuje
  if (!storeName) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
        <p className="text-red-700">Prodejna nebyla nalezena</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Prodejna: {storeName}</h1>

      {/* Filtr časového období */}
      <DateRangeFilter onChange={handleFilterChange} initialFilter={{ storeLocation: storeName }} />

      {isLoading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {!isLoading && !error && dashboardData && dashboardData.storeData[storeName] && (
        <>
          {/* Statistické karty */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Celkový obrat"
              value={formatCurrency(dashboardData.storeData[storeName].totalRevenue)}
              icon={<FiDollarSign className="h-6 w-6 text-blue-500" />}
            />
            <StatCard
              title="Počet transakcí"
              value={formatNumber(dashboardData.storeData[storeName].transactionCount)}
              icon={<FiShoppingCart className="h-6 w-6 text-green-500" />}
            />
            <StatCard
              title="Návštěvnost"
              value={formatNumber(dashboardData.storeData[storeName].visitorCount)}
              icon={<FiUsers className="h-6 w-6 text-purple-500" />}
            />
            <StatCard
              title="Konverzní poměr"
              value={formatPercentage(dashboardData.storeData[storeName].conversionRate)}
              icon={<FiPercent className="h-6 w-6 text-orange-500" />}
            />
          </div>

          {/* Grafy */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <PieChart
              title="Rozdělení platebních metod"
              data={preparePaymentMethodData()}
              showPercentage={true}
            />
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Průměrná hodnota účtenky</h3>
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <p className="text-5xl font-bold text-gray-900">
                    {formatCurrency(dashboardData.storeData[storeName].averageTransactionValue)}
                  </p>
                  <p className="mt-2 text-sm text-gray-500">
                    Průměrná hodnota transakce za vybrané období
                  </p>
                </div>
              </div>
            </div>
            <PieChart
              title="Typy prodejů"
              data={prepareTransactionTypeData()}
              showPercentage={true}
            />
          </div>

          {/* Statistika prodejů podle hodin */}
          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <div className="flex items-center mb-4">
              <FiClock className="h-6 w-6 text-blue-500 mr-2" />
              <h2 className="text-lg font-medium text-gray-900">Prodeje podle hodin</h2>
            </div>
            
            {findPeakHour() !== null && (
              <div className="mb-4 p-3 bg-blue-50 rounded-md">
                <p className="text-blue-800">
                  Nejvíce prodejů probíhá v <span className="font-bold">{findPeakHour()}:00</span> hodin.
                </p>
              </div>
            )}
            
            <div className="h-80">
              <BarChart
                title=""
                data={prepareHourlySalesData()}
                dataKey="count"
                isCurrency={false}
                showXAxis={true}
                showYAxis={true}
              />
            </div>
          </div>
          
          {/* Tabulky produktů */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <ProductTable
              title={filter?.timeRange === 'day' ? "Všechny produkty podle množství" : "TOP 10 produktů podle množství"}
              products={dashboardData.storeData[storeName].topProducts.byQuantity}
              type="quantity"
            />
            <ProductTable
              title="TOP 10 produktů podle obratu"
              products={dashboardData.storeData[storeName].topProducts.byRevenue}
              type="revenue"
            />
          </div>
        </>
      )}
    </div>
  );
}
