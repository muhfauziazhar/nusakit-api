import { describe, it, expect } from 'vitest';
import { validateNik, isValidNik, parseNik } from './nik.js';

describe('validateNik', () => {
  it('validates and parses a structurally valid NIK', () => {
    const r = validateNik('3201010101900001');
    expect(r.valid).toBe(true);
    expect(r.info?.provinceCode).toBe('32');
    expect(r.info?.province).toBe('Jawa Barat');
    expect(r.info?.gender).toBe('L');
    expect(r.info?.birthDateISO).toBe('1990-01-01');
    expect(r.info?.serial).toBe('0001');
  });

  it('accepts separators and strips them', () => {
    expect(validateNik('3201-0101-0190-0001').valid).toBe(true);
  });

  it('detects female when birth day is offset by 40', () => {
    const r = validateNik('3201014101900001');
    expect(r.valid).toBe(true);
    expect(r.info?.gender).toBe('P');
    expect(r.info?.birthDateISO).toBe('1990-01-01');
  });

  it('rejects wrong length', () => {
    expect(validateNik('320101010190').valid).toBe(false);
  });

  it('rejects unknown province code', () => {
    const r = validateNik('9901010101900001');
    expect(r.valid).toBe(false);
    expect(r.reason).toMatch(/provinsi/i);
  });

  it('rejects invalid month', () => {
    expect(validateNik('3201010113900001').valid).toBe(false);
  });

  it('rejects an all-zero serial', () => {
    expect(validateNik('3201010101900000').valid).toBe(false);
  });

  it('rejects an impossible calendar date (Feb 30)', () => {
    expect(validateNik('3201013002900001').valid).toBe(false);
  });

  it('isValidNik and parseNik agree with validateNik', () => {
    expect(isValidNik('3201010101900001')).toBe(true);
    expect(parseNik('3201010101900001')?.province).toBe('Jawa Barat');
    expect(parseNik('invalid')).toBeNull();
  });
});
