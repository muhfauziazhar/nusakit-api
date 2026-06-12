/**
 * Rupiah — format, parse, dan terbilang.
 * Ported from @fauzitech/nusakit
 */

export interface RupiahOptions {
  symbol?: boolean;
  decimals?: number;
  space?: boolean;
}

export function formatRupiah(value: number, options: RupiahOptions = {}): string {
  const { symbol = true, decimals = 0, space = true } = options;
  if (!Number.isFinite(value)) return symbol ? 'Rp 0' : '0';

  const negative = value < 0;
  const abs = Math.abs(value);
  const fixed = abs.toFixed(decimals);
  const [intPart, fracPart] = fixed.split('.');
  const withThousands = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  let body = withThousands;
  if (decimals > 0 && fracPart) body += ',' + fracPart;

  const prefix = symbol ? (space ? 'Rp ' : 'Rp') : '';
  return (negative ? '-' : '') + prefix + body;
}

export function parseRupiah(input: string): number {
  if (typeof input === 'number') return input;
  if (!input) return NaN;

  let s = String(input).trim();
  const negative = s.startsWith('-') || /^\(.*\)$/.test(s);
  s = s.replace(/rp/gi, '').replace(/[^\d.,-]/g, '');
  s = s.replace(/\./g, '').replace(',', '.');

  const num = parseFloat(s);
  if (Number.isNaN(num)) return NaN;
  return negative ? -Math.abs(num) : num;
}

const SATUAN = ['', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan', 'sepuluh', 'sebelas'];

function terbilangRatusan(n: number): string {
  if (n < 12) return SATUAN[n];
  if (n < 20) return terbilangRatusan(n - 10) + ' belas';
  if (n < 100) {
    const puluh = Math.floor(n / 10);
    const sisa = n % 10;
    return (SATUAN[puluh] + ' puluh' + (sisa ? ' ' + SATUAN[sisa] : '')).trim();
  }
  const ratus = Math.floor(n / 100);
  const sisa = n % 100;
  const prefix = ratus === 1 ? 'seratus' : SATUAN[ratus] + ' ratus';
  return (prefix + (sisa ? ' ' + terbilangRatusan(sisa) : '')).trim();
}

const SKALA = ['', 'ribu', 'juta', 'miliar', 'triliun', 'kuadriliun'];

export function terbilang(value: number): string {
  if (!Number.isFinite(value)) return '';
  if (value === 0) return 'nol';

  const negative = value < 0;
  let n = Math.floor(Math.abs(value));
  const groups: number[] = [];
  while (n > 0) { groups.push(n % 1000); n = Math.floor(n / 1000); }

  const parts: string[] = [];
  for (let i = groups.length - 1; i >= 0; i--) {
    const g = groups[i];
    if (g === 0) continue;
    if (i === 1 && g === 1) {
      parts.push('seribu');
    } else {
      parts.push((terbilangRatusan(g) + (SKALA[i] ? ' ' + SKALA[i] : '')).trim());
    }
  }

  const result = parts.join(' ').replace(/\s+/g, ' ').trim();
  return negative ? 'minus ' + result : result;
}

export function terbilangRupiah(value: number): string {
  const words = terbilang(value);
  if (!words) return '';
  return words + ' rupiah';
}
