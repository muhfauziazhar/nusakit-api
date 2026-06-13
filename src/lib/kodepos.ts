/**
 * Kode Pos — helpers for Indonesian 5-digit postal codes and wilayah codes.
 * The data itself lives in D1 (table `kodepos`); these are the pure helpers
 * shared by the route layer.
 */

/** A valid Indonesian postal code is exactly 5 digits. */
export function isValidPostalCode(input: string): boolean {
  return /^\d{5}$/.test((input || '').trim());
}

/**
 * Normalize a dotted wilayah code, keeping only digits and dots
 * (e.g. " 32.01.01.2001 " → "32.01.01.2001"). Returns '' for junk input.
 */
export function normalizeWilayahCode(input: string): string {
  return (input || '').trim().replace(/[^\d.]/g, '');
}

/** How many hierarchy levels a dotted code spans (1=province … 4=village). */
export function wilayahDepth(code: string): number {
  const c = normalizeWilayahCode(code);
  if (!c) return 0;
  return c.split('.').length;
}
