import { VisitorData, StoreLocation } from '../lib/types';

// Prodejny
const storeLocations: StoreLocation[] = ['Brno', 'Praha - OC Lužiny', 'Praha - Centrála'];

// Funkce pro generování náhodného čísla v rozsahu
function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Funkce pro náhodný výběr z pole
function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

// Funkce pro generování dat o návštěvnosti pro jeden den
function generateVisitorDataForDay(date: Date): VisitorData[] {
  return storeLocations.map(storeLocation => {
    // Různé rozsahy návštěvnosti pro různé prodejny
    let minVisitors = 50;
    let maxVisitors = 200;
    
    if (storeLocation === 'Praha - Centrála') {
      minVisitors = 100;
      maxVisitors = 300;
    } else if (storeLocation === 'Praha - OC Lužiny') {
      minVisitors = 80;
      maxVisitors = 250;
    }
    
    // O víkendech je vyšší návštěvnost
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    if (isWeekend) {
      minVisitors = Math.floor(minVisitors * 1.5);
      maxVisitors = Math.floor(maxVisitors * 1.5);
    }
    
    return {
      date: new Date(date).toISOString(),
      storeLocation,
      visitorCount: getRandomInt(minVisitors, maxVisitors)
    };
  });
}

// Generování dat o návštěvnosti za poslední 3 měsíce
export function generateMockVisitorData(): VisitorData[] {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 3);
  
  const visitorData: VisitorData[] = [];
  
  // Procházíme každý den v rozsahu
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    visitorData.push(...generateVisitorDataForDay(currentDate));
    
    // Posun na další den
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  // Seřazení podle data (od nejnovějšího)
  return visitorData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// Exportování vygenerovaných dat o návštěvnosti
export const mockVisitorData = generateMockVisitorData();
