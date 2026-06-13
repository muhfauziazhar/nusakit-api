import { describe, it, expect } from 'vitest';
import { isValidPostalCode, normalizeWilayahCode, wilayahDepth } from './kodepos.js';

describe('isValidPostalCode', () => {
  it('accepts exactly 5 digits', () => {
    expect(isValidPostalCode('40111')).toBe(true);
  });

  it('trims surrounding whitespace', () => {
    expect(isValidPostalCode('  40111 ')).toBe(true);
  });

  it('rejects the wrong length or non-digits', () => {
    expect(isValidPostalCode('4011')).toBe(false);
    expect(isValidPostalCode('401111')).toBe(false);
    expect(isValidPostalCode('4011a')).toBe(false);
    expect(isValidPostalCode('')).toBe(false);
  });
});

describe('normalizeWilayahCode', () => {
  it('keeps digits and dots, drops everything else', () => {
    expect(normalizeWilayahCode(' 32.01.01.2001 ')).toBe('32.01.01.2001');
    expect(normalizeWilayahCode('32-01/01')).toBe('320101');
  });

  it('returns empty string for junk', () => {
    expect(normalizeWilayahCode('abc')).toBe('');
  });
});

describe('wilayahDepth', () => {
  it('counts hierarchy levels', () => {
    expect(wilayahDepth('32')).toBe(1);
    expect(wilayahDepth('32.01')).toBe(2);
    expect(wilayahDepth('32.01.01')).toBe(3);
    expect(wilayahDepth('32.01.01.2001')).toBe(4);
  });

  it('returns 0 for empty/invalid', () => {
    expect(wilayahDepth('')).toBe(0);
  });
});
