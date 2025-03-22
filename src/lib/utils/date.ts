/**
 * Utility funkce pro práci s daty
 */

/**
 * Formátuje datum do lokálního formátu
 */
export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('cs-CZ', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

/**
 * Formátuje datum a čas do lokálního formátu
 */
export function formatDateTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('cs-CZ', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Vrátí první den aktuálního týdne
 */
export function getStartOfWeek(date: Date = new Date()): Date {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Upravit pro pondělí jako první den týdne
  const startOfWeek = new Date(date);
  startOfWeek.setDate(diff);
  startOfWeek.setHours(0, 0, 0, 0);
  return startOfWeek;
}

/**
 * Vrátí poslední den aktuálního týdne
 */
export function getEndOfWeek(date: Date = new Date()): Date {
  const startOfWeek = getStartOfWeek(date);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);
  return endOfWeek;
}

/**
 * Vrátí první den aktuálního měsíce
 */
export function getStartOfMonth(date: Date = new Date()): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

/**
 * Vrátí poslední den aktuálního měsíce
 */
export function getEndOfMonth(date: Date = new Date()): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
}

/**
 * Vrátí rozsah dat na základě zvoleného časového období
 */
export function getDateRangeFromTimeRange(
  timeRange: 'day' | 'week' | 'month' | 'custom',
  date: Date = new Date()
): { start: Date; end: Date } {
  switch (timeRange) {
    case 'day': {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    }
    case 'week':
      return {
        start: getStartOfWeek(date),
        end: getEndOfWeek(date),
      };
    case 'month':
      return {
        start: getStartOfMonth(date),
        end: getEndOfMonth(date),
      };
    case 'custom':
      // Pro vlastní časový rozsah se očekává, že data budou poskytnuta zvlášť
      // Vrátíme aktuální den jako výchozí hodnotu
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    default:
      throw new Error(`Neplatný časový rozsah: ${timeRange}`);
  }
}
