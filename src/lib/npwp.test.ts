import { describe, it, expect } from 'vitest';
import { validateNpwp, isValidNpwp, formatNpwp } from './npwp.js';

describe('validateNpwp', () => {
  it('validates a 15-digit NPWP and exposes KPP/branch', () => {
    const r = validateNpwp('012345678012000');
    expect(r.valid).toBe(true);
    expect(r.info?.format).toBe(15);
    expect(r.info?.kpp).toBe('012');
    expect(r.info?.branch).toBe('000');
    expect(r.info?.isPusat).toBe(true);
    expect(r.info?.formatted).toBe('01.234.567.8-012.000');
  });

  it('marks a non-000 branch as cabang (not pusat)', () => {
    const r = validateNpwp('012345678012001');
    expect(r.info?.isPusat).toBe(false);
  });

  it('accepts a 16-digit NPWP that is a valid NIK', () => {
    const r = validateNpwp('3201010101900001');
    expect(r.valid).toBe(true);
    expect(r.info?.format).toBe(16);
  });

  it('rejects a 16-digit NPWP that is not a valid NIK', () => {
    expect(validateNpwp('9901010101900001').valid).toBe(false);
  });

  it('rejects an all-zero 15-digit NPWP', () => {
    expect(validateNpwp('000000000000000').valid).toBe(false);
  });

  it('rejects wrong length', () => {
    expect(validateNpwp('12345').valid).toBe(false);
  });

  it('strips formatting before validating', () => {
    expect(isValidNpwp('01.234.567.8-012.000')).toBe(true);
  });
});

describe('formatNpwp', () => {
  it('formats a 15-digit string with the standard mask', () => {
    expect(formatNpwp('012345678012000')).toBe('01.234.567.8-012.000');
  });

  it('returns 16-digit input unchanged', () => {
    expect(formatNpwp('3201010101900001')).toBe('3201010101900001');
  });
});
