import Papa from 'papaparse';
import { VisitorData, StoreLocation } from '../types';

interface CSVVisitorRow {
  datum: string; // Očekávaný formát: DD.MM.YYYY
  prodejna: string; // Očekávaný formát: "Brno", "Praha - OC Lužiny", "Praha - Centrála"
  pocet_navstevniku: string; // Očekávaný formát: číslo jako string
}

/**
 * Převede string na StoreLocation
 */
function parseStoreLocation(location: string): StoreLocation | null {
  switch (location.trim()) {
    case 'Brno':
      return 'Brno';
    case 'Praha - OC Lužiny':
      return 'Praha - OC Lužiny';
    case 'Praha - Centrála':
      return 'Praha - Centrála';
    default:
      return null;
  }
}

/**
 * Převede české datum ve formátu DD.MM.YYYY na ISO string
 */
function parseCzechDate(dateStr: string): string | null {
  const parts = dateStr.trim().split('.');
  if (parts.length !== 3) return null;
  
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // Měsíce jsou indexovány od 0
  const year = parseInt(parts[2], 10);
  
  if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
  
  const date = new Date(year, month, day);
  return date.toISOString();
}

/**
 * Zpracuje CSV data o návštěvnosti
 */
export function parseVisitorCSV(csvContent: string): {
  data: VisitorData[];
  errors: Array<{ row: number; message: string }>;
} {
  const result = Papa.parse<CSVVisitorRow>(csvContent, {
    header: true,
    skipEmptyLines: true,
  });
  
  const data: VisitorData[] = [];
  const errors: Array<{ row: number; message: string }> = [];
  
  result.data.forEach((row, index) => {
    // Kontrola, zda jsou všechna požadovaná pole přítomna
    if (!row.datum || !row.prodejna || !row.pocet_navstevniku) {
      errors.push({
        row: index + 2, // +2 protože index začíná od 0 a první řádek je hlavička
        message: 'Chybí povinná pole (datum, prodejna, pocet_navstevniku)',
      });
      return;
    }
    
    // Zpracování data
    const date = parseCzechDate(row.datum);
    if (!date) {
      errors.push({
        row: index + 2,
        message: `Neplatný formát data: ${row.datum}. Očekávaný formát: DD.MM.YYYY`,
      });
      return;
    }
    
    // Zpracování prodejny
    const storeLocation = parseStoreLocation(row.prodejna);
    if (!storeLocation) {
      errors.push({
        row: index + 2,
        message: `Neplatná prodejna: ${row.prodejna}. Povolené hodnoty: Brno, Praha - OC Lužiny, Praha - Centrála`,
      });
      return;
    }
    
    // Zpracování počtu návštěvníků
    const visitorCount = parseInt(row.pocet_navstevniku.trim(), 10);
    if (isNaN(visitorCount) || visitorCount < 0) {
      errors.push({
        row: index + 2,
        message: `Neplatný počet návštěvníků: ${row.pocet_navstevniku}. Očekáváno kladné číslo.`,
      });
      return;
    }
    
    // Přidání validních dat
    data.push({
      date,
      storeLocation,
      visitorCount,
    });
  });
  
  return { data, errors };
}

/**
 * Vytvoří CSV šablonu pro import návštěvnosti
 */
export function createVisitorCSVTemplate(): string {
  const headers = ['datum', 'prodejna', 'pocet_navstevniku'];
  const exampleRows = [
    ['01.03.2025', 'Brno', '120'],
    ['01.03.2025', 'Praha - OC Lužiny', '85'],
    ['01.03.2025', 'Praha - Centrála', '150'],
  ];
  
  const csv = Papa.unparse({
    fields: headers,
    data: exampleRows,
  });
  
  return csv;
}
