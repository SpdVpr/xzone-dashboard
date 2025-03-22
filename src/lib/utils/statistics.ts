import { Transaction, Product, StoreSummary, VisitorData, StoreLocation, FilterOptions } from '../types';

/**
 * Vypočítá celkový obrat z transakcí
 */
export function calculateTotalRevenue(transactions: Transaction[]): number {
  return transactions.reduce((sum, transaction) => sum + transaction.totalAmount, 0);
}

/**
 * Vypočítá průměrnou hodnotu transakce
 */
export function calculateAverageTransactionValue(transactions: Transaction[]): number {
  if (transactions.length === 0) return 0;
  const totalRevenue = calculateTotalRevenue(transactions);
  return totalRevenue / transactions.length;
}

/**
 * Vypočítá distribuci platebních metod
 */
export function calculatePaymentMethodDistribution(transactions: Transaction[]): { cash: number; card: number } {
  const cashTransactions = transactions.filter(t => t.paymentMethod === 'cash').length;
  const cardTransactions = transactions.filter(t => t.paymentMethod === 'card').length;
  
  return {
    cash: cashTransactions,
    card: cardTransactions
  };
}

/**
 * Získá všechny produkty podle množství
 */
export function getAllProductsByQuantity(transactions: Transaction[]): Array<{ product: Product; quantity: number }> {
  // Vytvoříme mapu pro sledování počtu každého produktu
  const productCounts = new Map<string, { product: Product; quantity: number }>();
  
  // Projdeme všechny transakce a jejich produkty
  transactions.forEach(transaction => {
    transaction.products.forEach(product => {
      const existingProduct = productCounts.get(product.code);
      
      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        productCounts.set(product.code, { product, quantity: 1 });
      }
    });
  });
  
  // Převedeme mapu na pole a seřadíme podle množství
  return Array.from(productCounts.values())
    .sort((a, b) => b.quantity - a.quantity);
}

/**
 * Získá top produkty podle množství
 */
export function getTopProductsByQuantity(transactions: Transaction[], limit: number = 10): Array<{ product: Product; quantity: number }> {
  // Vytvoříme mapu pro sledování počtu každého produktu
  const productCounts = new Map<string, { product: Product; quantity: number }>();
  
  // Projdeme všechny transakce a jejich produkty
  transactions.forEach(transaction => {
    transaction.products.forEach(product => {
      const existingProduct = productCounts.get(product.code);
      
      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        productCounts.set(product.code, { product, quantity: 1 });
      }
    });
  });
  
  // Převedeme mapu na pole a seřadíme podle množství
  return Array.from(productCounts.values())
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, limit);
}

/**
 * Získá všechny produkty podle obratu
 */
export function getAllProductsByRevenue(transactions: Transaction[]): Array<{ product: Product; revenue: number }> {
  // Vytvoříme mapu pro sledování obratu každého produktu
  const productRevenue = new Map<string, { product: Product; revenue: number }>();
  
  // Projdeme všechny transakce a jejich produkty
  transactions.forEach(transaction => {
    transaction.products.forEach(product => {
      const existingProduct = productRevenue.get(product.code);
      
      if (existingProduct) {
        existingProduct.revenue += product.price;
      } else {
        productRevenue.set(product.code, { product, revenue: product.price });
      }
    });
  });
  
  // Převedeme mapu na pole a seřadíme podle obratu
  return Array.from(productRevenue.values())
    .sort((a, b) => b.revenue - a.revenue);
}

/**
 * Získá top produkty podle obratu
 */
export function getTopProductsByRevenue(transactions: Transaction[], limit: number = 10): Array<{ product: Product; revenue: number }> {
  // Vytvoříme mapu pro sledování obratu každého produktu
  const productRevenue = new Map<string, { product: Product; revenue: number }>();
  
  // Projdeme všechny transakce a jejich produkty
  transactions.forEach(transaction => {
    transaction.products.forEach(product => {
      const existingProduct = productRevenue.get(product.code);
      
      if (existingProduct) {
        existingProduct.revenue += product.price;
      } else {
        productRevenue.set(product.code, { product, revenue: product.price });
      }
    });
  });
  
  // Převedeme mapu na pole a seřadíme podle obratu
  return Array.from(productRevenue.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit);
}

/**
 * Vypočítá konverzní poměr (počet transakcí / počet návštěvníků)
 */
export function calculateConversionRate(transactions: Transaction[], visitorData: VisitorData[]): number {
  const totalVisitors = visitorData.reduce((sum, data) => sum + data.visitorCount, 0);
  if (totalVisitors === 0) return 0;
  
  return transactions.length / totalVisitors;
}

/**
 * Vypočítá prodeje podle hodin
 */
export function calculateHourlySales(transactions: Transaction[]): Array<{ hour: number; count: number; revenue: number }> {
  // Inicializace pole pro všechny hodiny (0-23)
  const hourlySales = Array.from({ length: 24 }, (_, hour) => ({
    hour,
    count: 0,
    revenue: 0
  }));
  
  // Procházení transakcí a přiřazení do příslušné hodiny
  transactions.forEach(transaction => {
    const date = new Date(transaction.date);
    const hour = date.getHours();
    
    hourlySales[hour].count += 1;
    hourlySales[hour].revenue += transaction.totalAmount;
  });
  
  return hourlySales;
}

/**
 * Vytvoří souhrnné statistiky pro prodejnu
 */
export function createStoreSummary(
  transactions: Transaction[],
  visitorData: VisitorData[],
  storeLocation: StoreLocation,
  timeRange: FilterOptions['timeRange'] = 'week'
): StoreSummary {
  const storeTransactions = transactions.filter(t => t.storeLocation === storeLocation);
  const storeVisitorData = visitorData.filter(v => v.storeLocation === storeLocation);
  
  const totalRevenue = calculateTotalRevenue(storeTransactions);
  const transactionCount = storeTransactions.length;
  const averageTransactionValue = calculateAverageTransactionValue(storeTransactions);
  const paymentMethodDistribution = calculatePaymentMethodDistribution(storeTransactions);
  // Pro denní přehled zobrazíme všechny produkty, pro ostatní časová období jen TOP 10
  const topProductsByQuantity = timeRange === 'day' 
    ? getAllProductsByQuantity(storeTransactions)
    : getTopProductsByQuantity(storeTransactions);
    
  // Pro TOP produkty podle obratu vždy zobrazíme jen TOP 10
  const topProductsByRevenue = getTopProductsByRevenue(storeTransactions);
  const visitorCount = storeVisitorData.reduce((sum, data) => sum + data.visitorCount, 0);
  const conversionRate = calculateConversionRate(storeTransactions, storeVisitorData);
  const hourlySales = calculateHourlySales(storeTransactions);
  
  return {
    totalRevenue,
    transactionCount,
    averageTransactionValue,
    paymentMethodDistribution,
    topProducts: {
      byQuantity: topProductsByQuantity,
      byRevenue: topProductsByRevenue
    },
    visitorCount,
    conversionRate,
    hourlySales
  };
}

/**
 * Filtruje transakce podle data
 */
export function filterTransactionsByDateRange(
  transactions: Transaction[],
  startDate: Date,
  endDate: Date
): Transaction[] {
  return transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return transactionDate >= startDate && transactionDate <= endDate;
  });
}

/**
 * Filtruje návštěvnická data podle data
 */
export function filterVisitorDataByDateRange(
  visitorData: VisitorData[],
  startDate: Date,
  endDate: Date
): VisitorData[] {
  return visitorData.filter(data => {
    const dataDate = new Date(data.date);
    return dataDate >= startDate && dataDate <= endDate;
  });
}
