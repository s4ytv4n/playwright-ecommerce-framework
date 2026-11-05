/** Converts a store price label like "Rs. 1,500" into a number (1500). */
export function parsePrice(label: string): number {
  const digits = label.replace(/[^\d]/g, '');
  if (!digits) {
    throw new Error(`Cannot parse price from "${label}"`);
  }
  return Number(digits);
}
