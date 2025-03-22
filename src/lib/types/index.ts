// Typy pro autentizaci
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager';
}

// Typy pro prodejny
export type StoreLocation = 'Brno' | 'Praha - OC Lužiny' | 'Praha - Centrála';

// Typy pro transakce
export type PaymentMethod = 'cash' | 'card';
export type TransactionType = 'reservation' | 'direct_sale';

export interface Product {
  code: string;
  name: string;
  price: number;
}

export interface Transaction {
  id: string;
  date: string; // ISO string
  receiptNumber: string;
  totalAmount: number;
  products: Product[];
  paymentMethod: PaymentMethod;
  storeLocation: StoreLocation;
  user: string; // ID uživatele, který vytvořil účtenku
  transactionType: TransactionType;
  reservationNumber?: string; // Pouze pro rezervace
}

// Typy pro návštěvnost
export interface VisitorData {
  date: string; // ISO string
  storeLocation: StoreLocation;
  visitorCount: number;
}

// Typy pro statistiky
export interface StoreSummary {
  totalRevenue: number;
  transactionCount: number;
  averageTransactionValue: number;
  paymentMethodDistribution: {
    cash: number;
    card: number;
  };
  topProducts: {
    byQuantity: Array<{ product: Product; quantity: number }>;
    byRevenue: Array<{ product: Product; revenue: number }>;
  };
  visitorCount: number;
  conversionRate: number; // počet nákupů / počet návštěvníků
  hourlySales: Array<{ hour: number; count: number; revenue: number }>;
}

export interface DashboardData {
  timeRange: 'day' | 'week' | 'month' | 'custom';
  startDate: string;
  endDate: string;
  storeData: Record<StoreLocation, StoreSummary>;
  totalRevenue: number;
  totalTransactions: number;
  hourlySales: Array<{ hour: number; count: number; revenue: number }>;
}

// Typy pro filtry
export interface FilterOptions {
  dateRange: {
    start: string;
    end: string;
  };
  timeRange: 'day' | 'week' | 'month' | 'custom';
  storeLocation?: StoreLocation;
  transactionType?: TransactionType;
}
