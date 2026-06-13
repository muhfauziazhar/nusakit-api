import { describe, it, expect } from 'vitest';
import { formatRupiah, parseRupiah, terbilang, terbilangRupiah } from './rupiah.js';

describe('formatRupiah', () => {
  it('formats with the Rp symbol and thousands separators', () => {
    expect(formatRupiah(1500000)).toBe('Rp 1.500.000');
  });

  it('omits the symbol when symbol=false', () => {
    expect(formatRupiah(1500000, { symbol: false })).toBe('1.500.000');
  });

  it('renders decimals with a comma', () => {
    expect(formatRupiah(1234.5, { decimals: 2 })).toBe('Rp 1.234,50');
  });

  it('prefixes a minus for negative values', () => {
    expect(formatRupiah(-2000)).toBe('-Rp 2.000');
  });

  it('falls back to zero for non-finite input', () => {
    expect(formatRupiah(NaN)).toBe('Rp 0');
  });
});

describe('parseRupiah', () => {
  it('parses a formatted Rupiah string', () => {
    expect(parseRupiah('Rp 1.500.000')).toBe(1500000);
  });

  it('parses decimals written with a comma', () => {
    expect(parseRupiah('Rp 1.234,50')).toBe(1234.5);
  });

  it('handles negative and parenthesised values', () => {
    expect(parseRupiah('-2000')).toBe(-2000);
    expect(parseRupiah('(2000)')).toBe(-2000);
  });

  it('returns NaN for unparseable input', () => {
    expect(Number.isNaN(parseRupiah('abc'))).toBe(true);
  });

  it('round-trips with formatRupiah', () => {
    expect(parseRupiah(formatRupiah(987654))).toBe(987654);
  });
});

describe('terbilang', () => {
  it('handles zero and units', () => {
    expect(terbilang(0)).toBe('nol');
    expect(terbilang(11)).toBe('sebelas');
  });

  it('uses "seribu" for exactly one thousand', () => {
    expect(terbilang(1000)).toBe('seribu');
    expect(terbilang(2000)).toBe('dua ribu');
  });

  it('composes larger numbers', () => {
    expect(terbilang(1500000)).toBe('satu juta lima ratus ribu');
    expect(terbilang(105)).toBe('seratus lima');
  });

  it('prefixes minus for negatives', () => {
    expect(terbilang(-7)).toBe('minus tujuh');
  });

  it('terbilangRupiah appends the rupiah suffix', () => {
    expect(terbilangRupiah(1500000)).toBe('satu juta lima ratus ribu rupiah');
  });
});
