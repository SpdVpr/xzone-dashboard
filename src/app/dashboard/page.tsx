'use client';

import { useState, useEffect, useCallback } from 'react';
import { FiDollarSign, FiShoppingCart, FiUsers, FiPercent, FiClock } from 'react-icons/fi';
import DateRangeFilter from '@/components/ui/DateRangeFilter';
import StatCard from '@/components/ui/StatCard';
import BarChart from '@/components/dashboard/BarChart';
import PieChart from '@/components/dashboard/PieChart';
import { FilterOptions, DashboardData, StoreLocation } from '@/lib/types';
import { formatCurrency, formatNumber, formatPercentage } from '@/lib/utils/format';

export default function DashboardPage() {
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
          body: JSON.stringify(filter),
        });

        if (!response.ok) {
          throw new Error('Nepodařilo se načíst data');
        }

        const data = await response.json();
        setDashboardData(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Došlo k chybě při načítání dat. Zkuste to prosím znovu.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [filter]);

  // Zpracování změny filtru - memoizováno pomocí useCallback
  const handleFilterChange = useCallback((newFilter: FilterOptions) => {
    setFilter(newFilter);
  }, []);

  // Příprava dat pro grafy
  const prepareStoreComparisonData = () => {
    if (!dashboardData) return [];

    const storeLocations: StoreLocation[] = ['Brno', 'Praha - OC Lužiny', 'Praha - Centrála'];
    
    return storeLocations.map(location => ({
      name: location,
      value: dashboardData.storeData[location].totalRevenue,
    }));
  };

  const preparePaymentMethodData = () => {
    if (!dashboardData) return [];

    const cashTotal = Object.values(dashboardData.storeData).reduce(
      (sum, store) => sum + store.paymentMethodDistribution.cash,
      0
    );

    const cardTotal = Object.values(dashboardData.storeData).reduce(
      (sum, store) => sum + store.paymentMethodDistribution.card,
      0
    );

    return [
      { name: 'Hotovost', value: cashTotal },
      { name: 'Karta', value: cardTotal },
    ];
  };
  
  // Příprava dat pro rozdělení typů transakcí
  const prepareTransactionTypeData = () => {
    if (!dashboardData) return [];
    
    // Spočítáme počet transakcí podle typu
    const reservationCount = Object.values(dashboardData.storeData).reduce(
      (sum, store) => {
        // Počet rezervací je uložen v transactionCount, pokud byl aplikován filtr na typ transakce
        if (filter?.transactionType === 'reservation') {
          return sum + store.transactionCount;
        }
        // Jinak musíme počítat z celkového počtu transakcí
        return sum;
      },
      0
    );
    
    const directSaleCount = Object.values(dashboardData.storeData).reduce(
      (sum, store) => {
        // Počet přímých prodejů je uložen v transactionCount, pokud byl aplikován filtr na typ transakce
        if (filter?.transactionType === 'direct_sale') {
          return sum + store.transactionCount;
        }
        // Jinak musíme počítat z celkového počtu transakcí
        return sum;
      },
      0
    );
    
    // Pokud byl aplikován filtr na typ transakce, zobrazíme pouze ten typ
    if (filter?.transactionType === 'reservation') {
      return [{ name: 'Rezervace (e-shop)', value: reservationCount }];
    } else if (filter?.transactionType === 'direct_sale') {
      return [{ name: 'Přímý prodej', value: directSaleCount }];
    }
    
    // Jinak zobrazíme oba typy
    return [
      { name: 'Rezervace (e-shop)', value: reservationCount || dashboardData.totalTransactions * 0.4 }, // Odhad, pokud nemáme přesná data
      { name: 'Přímý prodej', value: directSaleCount || dashboardData.totalTransactions * 0.6 }, // Odhad, pokud nemáme přesná data
    ];
  };
  
  // Příprava dat pro prodeje podle hodin
  const prepareHourlySalesData = () => {
    if (!dashboardData) return [];
    
    // Formátování hodin pro lepší čitelnost
    return dashboardData.hourlySales.map(item => ({
      name: `${item.hour}:00`,
      count: item.count,
      revenue: item.revenue
    }));
  };
  
  // Najde hodinu s nejvyšším počtem prodejů
  const findPeakHour = () => {
    if (!dashboardData) return null;
    
    const peakHour = dashboardData.hourlySales.reduce(
      (peak, current) => current.count > peak.count ? current : peak,
      { hour: 0, count: 0, revenue: 0 }
    );
    
    return peakHour.hour;
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Přehled prodejen</h1>

      {/* Filtr časového období */}
      <DateRangeFilter onChange={handleFilterChange} />

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

      {!isLoading && !error && dashboardData && (
        <>
          {/* Statistické karty */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Celkový obrat"
              value={formatCurrency(dashboardData.totalRevenue)}
              icon={<FiDollarSign className="h-6 w-6 text-blue-500" />}
            />
            <StatCard
              title="Počet transakcí"
              value={formatNumber(dashboardData.totalTransactions)}
              icon={<FiShoppingCart className="h-6 w-6 text-green-500" />}
            />
            <StatCard
              title="Celková návštěvnost"
              value={formatNumber(
                Object.values(dashboardData.storeData).reduce(
                  (sum, store) => sum + store.visitorCount,
                  0
                )
              )}
              icon={<FiUsers className="h-6 w-6 text-purple-500" />}
            />
            <StatCard
              title="Průměrná konverze"
              value={formatPercentage(
                Object.values(dashboardData.storeData).reduce(
                  (sum, store) => sum + store.conversionRate,
                  0
                ) / Object.keys(dashboardData.storeData).length
              )}
              icon={<FiPercent className="h-6 w-6 text-orange-500" />}
            />
          </div>

          {/* Grafy */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <BarChart
              title="Porovnání obratu prodejen"
              data={prepareStoreComparisonData()}
              dataKey="value"
              isCurrency={true}
            />
            <PieChart
              title="Rozdělení platebních metod"
              data={preparePaymentMethodData()}
              showPercentage={true}
            />
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

          {/* Detaily prodejen */}
          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Detaily prodejen</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
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
                      Obrat
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Počet transakcí
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Průměrná hodnota
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Návštěvnost
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Konverze
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Object.entries(dashboardData.storeData).map(([location, data], index) => (
                    <tr key={location} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(data.totalRevenue)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatNumber(data.transactionCount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(data.averageTransactionValue)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatNumber(data.visitorCount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatPercentage(data.conversionRate)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
