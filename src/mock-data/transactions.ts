import { Transaction, Product, StoreLocation } from '../lib/types';

// Vzorové produkty
const products: Product[] = [
  { code: 'P001', name: 'Smartphone XYZ', price: 12990 },
  { code: 'P002', name: 'Tablet ABC', price: 8990 },
  { code: 'P003', name: 'Sluchátka Premium', price: 2490 },
  { code: 'P004', name: 'Bezdrátová myš', price: 890 },
  { code: 'P005', name: 'Klávesnice mechanická', price: 1990 },
  { code: 'P006', name: 'Monitor 27"', price: 5990 },
  { code: 'P007', name: 'USB-C kabel', price: 290 },
  { code: 'P008', name: 'Powerbank 20000mAh', price: 1290 },
  { code: 'P009', name: 'Ochranné sklo', price: 490 },
  { code: 'P010', name: 'Obal na telefon', price: 390 },
  { code: 'P011', name: 'Webkamera HD', price: 1490 },
  { code: 'P012', name: 'Router WiFi', price: 1790 },
  { code: 'P013', name: 'Reproduktor Bluetooth', price: 990 },
  { code: 'P014', name: 'Herní konzole', price: 9990 },
  { code: 'P015', name: 'Chytrý náramek', price: 1890 },
];

// Uživatelé
const users = ['user1', 'user2', 'user3', 'user4'];

// Prodejny
const storeLocations: StoreLocation[] = ['Brno', 'Praha - OC Lužiny', 'Praha - Centrála'];

// Platební metody
const paymentMethods: Array<'cash' | 'card'> = ['cash', 'card'];

// Typy transakcí
const transactionTypes: Array<'reservation' | 'direct_sale'> = ['reservation', 'direct_sale'];

// Funkce pro generování náhodného čísla v rozsahu
function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Funkce pro náhodný výběr z pole
function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

// Funkce pro generování náhodného data v rozsahu
function getRandomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Funkce pro generování náhodné transakce
function generateRandomTransaction(id: number, date: Date): Transaction {
  // Náhodný počet produktů v transakci (1-5)
  const productCount = getRandomInt(1, 5);
  const transactionProducts: Product[] = [];
  
  // Přidání náhodných produktů
  for (let i = 0; i < productCount; i++) {
    transactionProducts.push(getRandomItem(products));
  }
  
  // Výpočet celkové částky
  const totalAmount = transactionProducts.reduce((sum, product) => sum + product.price, 0);
  
  // Náhodný typ transakce
  const transactionType = getRandomItem(transactionTypes);
  
  return {
    id: `TR${id.toString().padStart(6, '0')}`,
    date: date.toISOString(),
    receiptNumber: `R${id.toString().padStart(6, '0')}`,
    totalAmount,
    products: transactionProducts,
    paymentMethod: getRandomItem(paymentMethods),
    storeLocation: getRandomItem(storeLocations),
    user: getRandomItem(users),
    transactionType,
    reservationNumber: transactionType === 'reservation' ? `RES${id.toString().padStart(6, '0')}` : undefined,
  };
}

// Generování transakcí za poslední 3 měsíce
export function generateMockTransactions(count: number = 500): Transaction[] {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 3);
  
  const transactions: Transaction[] = [];
  
  for (let i = 1; i <= count; i++) {
    const date = getRandomDate(startDate, endDate);
    transactions.push(generateRandomTransaction(i, date));
  }
  
  // Seřazení podle data (od nejnovějšího)
  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// Exportování vygenerovaných transakcí
export const mockTransactions = generateMockTransactions();
