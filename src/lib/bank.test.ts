import { describe, it, expect } from 'vitest';
import { findBank, searchBank, validateAccount, BANKS } from './bank.js';

describe('findBank', () => {
  it('finds a bank by exact code', () => {
    expect(findBank('014')?.name).toMatch(/BCA/);
  });

  it('left-pads short codes to 3 digits', () => {
    expect(findBank('8')?.name).toBe('Bank Mandiri');
  });

  it('returns undefined for an unknown code', () => {
    expect(findBank('999')).toBeUndefined();
  });
});

describe('searchBank', () => {
  it('matches case-insensitively on name', () => {
    const r = searchBank('mandiri');
    expect(r.some((b) => b.code === '008')).toBe(true);
  });

  it('returns an empty array for a blank query', () => {
    expect(searchBank('')).toEqual([]);
  });
});

describe('validateAccount', () => {
  it('accepts an account within the allowed length', () => {
    const r = validateAccount('014', '1234567890');
    expect(r.valid).toBe(true);
    expect(r.bank?.code).toBe('014');
  });

  it('rejects an account of the wrong length', () => {
    const r = validateAccount('014', '123');
    expect(r.valid).toBe(false);
    expect(r.reason).toMatch(/Panjang/);
  });

  it('rejects an unknown bank', () => {
    expect(validateAccount('999', '1234567890').valid).toBe(false);
  });

  it('rejects an empty account', () => {
    expect(validateAccount('014', '').valid).toBe(false);
  });

  it('strips non-digits before measuring length', () => {
    expect(validateAccount('014', '1234-5678-90').valid).toBe(true);
  });
});

describe('BANKS data integrity', () => {
  it('has unique 3-digit codes and valid length ranges', () => {
    const codes = new Set<string>();
    for (const b of BANKS) {
      expect(b.code).toMatch(/^\d{3}$/);
      expect(codes.has(b.code)).toBe(false);
      codes.add(b.code);
      const [min, max] = b.accountLength;
      expect(min).toBeLessThanOrEqual(max);
      expect(min).toBeGreaterThan(0);
    }
  });
});
