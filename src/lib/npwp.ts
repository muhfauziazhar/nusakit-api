/**
 * NPWP — Nomor Pokok Wajib Pajak.
 * Ported from @fauzitech/nusakit
 */

import { isValidNik } from './nik.js';

export interface NpwpInfo {
  npwp: string;
  format: 15 | 16;
  kpp?: string;
  branch?: string;
  isPusat?: boolean;
  formatted?: string;
}

export interface NpwpValidation {
  valid: boolean;
  reason?: string;
  info?: NpwpInfo;
}

function clean(input: string): string {
  return (input || '').replace(/\D/g, '');
}

export function formatNpwp(n: string): string {
  if (n.length === 16) return n;
  return `${n.slice(0,2)}.${n.slice(2,5)}.${n.slice(5,8)}.${n.slice(8,9)}-${n.slice(9,12)}.${n.slice(12,15)}`;
}

export function validateNpwp(input: string): NpwpValidation {
  const npwp = clean(input);

  if (npwp.length === 16) {
    if (!isValidNik(npwp)) {
      return { valid: false, reason: 'NPWP 16 digit harus berupa NIK yang valid secara struktur.' };
    }
    return { valid: true, info: { npwp, format: 16 } };
  }

  if (npwp.length === 15) {
    if (/^0+$/.test(npwp)) {
      return { valid: false, reason: 'NPWP tidak boleh semua nol.' };
    }
    const kpp = npwp.slice(9, 12);
    const branch = npwp.slice(12, 15);
    return {
      valid: true,
      info: {
        npwp, format: 15, kpp, branch,
        isPusat: branch === '000',
        formatted: formatNpwp(npwp),
      },
    };
  }

  return { valid: false, reason: `Panjang NPWP harus 15 atau 16 digit (diterima ${npwp.length}).` };
}

export function isValidNpwp(input: string): boolean {
  return validateNpwp(input).valid;
}
