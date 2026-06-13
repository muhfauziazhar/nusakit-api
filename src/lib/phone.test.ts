import { describe, it, expect } from 'vitest';
import { validatePhone, isValidPhone, detectOperator } from './phone.js';

describe('validatePhone', () => {
  it('normalizes a local 08 number', () => {
    const r = validatePhone('081234567890');
    expect(r.valid).toBe(true);
    expect(r.info?.local).toBe('081234567890');
    expect(r.info?.e164).toBe('6281234567890');
    expect(r.info?.international).toBe('+6281234567890');
  });

  it('normalizes +62, 62 and bare-8 forms to the same number', () => {
    const local = validatePhone('081234567890').info?.local;
    expect(validatePhone('+6281234567890').info?.local).toBe(local);
    expect(validatePhone('6281234567890').info?.local).toBe(local);
    expect(validatePhone('81234567890').info?.local).toBe(local);
  });

  it('tolerates spaces and dashes', () => {
    expect(validatePhone('0812-3456-7890').valid).toBe(true);
  });

  it('rejects non-Indonesian numbers', () => {
    expect(validatePhone('123456').valid).toBe(false);
  });

  it('rejects numbers that are too short or too long', () => {
    expect(validatePhone('0812345').valid).toBe(false);
    expect(validatePhone('08123456789012345').valid).toBe(false);
  });
});

describe('detectOperator', () => {
  it('maps prefixes to the right operator', () => {
    expect(detectOperator('081234567890')).toBe('Telkomsel');
    expect(detectOperator('081534567890')).toBe('Indosat');
    expect(detectOperator('081734567890')).toBe('XL');
    expect(detectOperator('083134567890')).toBe('Axis');
    expect(detectOperator('089534567890')).toBe('Tri');
    expect(detectOperator('088134567890')).toBe('Smartfren');
  });

  it('returns Unknown for an unmapped prefix', () => {
    expect(detectOperator('089034567890')).toBe('Unknown');
  });

  it('returns Unknown for an invalid number', () => {
    expect(detectOperator('not-a-phone')).toBe('Unknown');
  });

  it('isValidPhone agrees with validatePhone', () => {
    expect(isValidPhone('081234567890')).toBe(true);
    expect(isValidPhone('abc')).toBe(false);
  });
});
