import { NextRequest, NextResponse } from 'next/server';
import { mockTransactions } from '@/mock-data/transactions';
import { mockVisitorData } from '@/mock-data/visitors';
import { 
  filterTransactionsByDateRange, 
  filterVisitorDataByDateRange,
  createStoreSummary,
  calculateHourlySales
} from '@/lib/utils/statistics';
import { StoreLocation, FilterOptions, DashboardData, StoreSummary } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    // Získání filtru z požadavku
    const filter: FilterOptions = await request.json();
    
    // Převod ISO string na Date objekty
    const startDate = new Date(filter.dateRange.start);
    const endDate = new Date(filter.dateRange.end);
    
    // Filtrování dat podle časového rozsahu
    const filteredTransactions = filterTransactionsByDateRange(
      mockTransactions,
      startDate,
      endDate
    );
    
    const filteredVisitorData = filterVisitorDataByDateRange(
      mockVisitorData,
      startDate,
      endDate
    );
    
    // Další filtrování podle prodejny, pokud je specifikováno
    const storeFilteredTransactions = filter.storeLocation
      ? filteredTransactions.filter(t => t.storeLocation === filter.storeLocation)
      : filteredTransactions;
    
    // Další filtrování podle typu transakce, pokud je specifikováno
    const typeFilteredTransactions = filter.transactionType
      ? storeFilteredTransactions.filter(t => t.transactionType === filter.transactionType)
      : storeFilteredTransactions;
    
    // Seznam prodejen
    const storeLocations: StoreLocation[] = ['Brno', 'Praha - OC Lužiny', 'Praha - Centrála'];
    
    // Vytvoření souhrnných dat pro každou prodejnu
    const storeData = {} as Record<StoreLocation, StoreSummary>;
    
    storeLocations.forEach(location => {
      storeData[location] = createStoreSummary(
        typeFilteredTransactions,
        filteredVisitorData,
        location,
        filter.timeRange
      );
    });
    
    // Výpočet celkových hodnot
    const totalRevenue = Object.values(storeData).reduce(
      (sum, store) => sum + store.totalRevenue,
      0
    );
    
    const totalTransactions = Object.values(storeData).reduce(
      (sum, store: StoreSummary) => sum + store.transactionCount,
      0
    );
    
    // Výpočet celkových prodejů podle hodin
    const hourlySales = calculateHourlySales(typeFilteredTransactions);
    
    // Sestavení odpovědi
    const dashboardData: DashboardData = {
      timeRange: filter.timeRange,
      startDate: filter.dateRange.start,
      endDate: filter.dateRange.end,
      storeData,
      totalRevenue,
      totalTransactions,
      hourlySales,
    };
    
    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Došlo k chybě při zpracování požadavku' },
      { status: 500 }
    );
  }
}
