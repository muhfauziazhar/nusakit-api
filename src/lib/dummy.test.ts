import { describe, it, expect } from 'vitest';
import { dummyNik, dummyPhone, dummyNpwp } from './dummy.js';
import { validateNik } from './nik.js';
import { validatePhone } from './phone.js';
import { validateNpwp } from './npwp.js';

// Property tests: generated dummy data must always pass its own validator.
describe('dummyNik', () => {
  it('always produces a structurally valid NIK', () => {
    for (let i = 0; i < 500; i++) {
      const nik = dummyNik();
      expect(validateNik(nik).valid, `invalid NIK generated: ${nik}`).toBe(true);
    }
  });

  it('honours the provinceCode, gender and birthYear options', () => {
    const r = validateNik(dummyNik({ provinceCode: '32', gender: 'P', birthYear: 1990 }));
    expect(r.valid).toBe(true);
    expect(r.info?.provinceCode).toBe('32');
    expect(r.info?.gender).toBe('P');
    expect(r.info?.birthDateISO.startsWith('1990')).toBe(true);
  });
});

describe('dummyPhone', () => {
  it('always produces a valid number with a known operator', () => {
    for (let i = 0; i < 500; i++) {
      const phone = dummyPhone();
      const r = validatePhone(phone);
      expect(r.valid, `invalid phone generated: ${phone}`).toBe(true);
      expect(r.info?.operator).not.toBe('Unknown');
    }
  });
});

describe('dummyNpwp', () => {
  it('always produces a valid 15-digit NPWP', () => {
    for (let i = 0; i < 500; i++) {
      const npwp = dummyNpwp();
      expect(npwp).toHaveLength(15);
      expect(validateNpwp(npwp).valid, `invalid NPWP generated: ${npwp}`).toBe(true);
    }
  });
});
