/**
 * Utility funkce pro formátování hodnot
 */

/**
 * Formátuje částku jako měnu v Kč
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('cs-CZ', {
    style: 'currency',
    currency: 'CZK',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formátuje procenta
 */
export function formatPercentage(value: number): string {
  return new Intl.NumberFormat('cs-CZ', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);
}

/**
 * Formátuje číslo s oddělovači tisíců
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('cs-CZ').format(value);
}

/**
 * Převádí způsob platby na čitelný text
 */
export function formatPaymentMethod(method: 'cash' | 'card'): string {
  return method === 'cash' ? 'Hotovost' : 'Karta';
}

/**
 * Převádí typ transakce na čitelný text
 */
export function formatTransactionType(type: 'reservation' | 'direct_sale'): string {
  return type === 'reservation' ? 'Rezervace' : 'Přímý prodej';
}
