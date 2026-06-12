/**
 * NIK — Nomor Induk Kependudukan (16 digit di KTP).
 * Ported from @fauzitech/nusakit
 */

export type Gender = 'L' | 'P';

export interface NikInfo {
  nik: string;
  provinceCode: string;
  province?: string;
  regencyCode: string;
  districtCode: string;
  birthDateISO: string;
  gender: Gender;
  age: number;
  serial: string;
}

export interface NikValidation {
  valid: boolean;
  reason?: string;
  info?: NikInfo;
}

const PROVINCES: Record<string, string> = {
  '11': 'Aceh', '12': 'Sumatera Utara', '13': 'Sumatera Barat', '14': 'Riau',
  '15': 'Jambi', '16': 'Sumatera Selatan', '17': 'Bengkulu', '18': 'Lampung',
  '19': 'Kepulauan Bangka Belitung', '21': 'Kepulauan Riau',
  '31': 'DKI Jakarta', '32': 'Jawa Barat', '33': 'Jawa Tengah',
  '34': 'DI Yogyakarta', '35': 'Jawa Timur', '36': 'Banten',
  '51': 'Bali', '52': 'Nusa Tenggara Barat', '53': 'Nusa Tenggara Timur',
  '61': 'Kalimantan Barat', '62': 'Kalimantan Tengah', '63': 'Kalimantan Selatan',
  '64': 'Kalimantan Timur', '65': 'Kalimantan Utara',
  '71': 'Sulawesi Utara', '72': 'Sulawesi Tengah', '73': 'Sulawesi Selatan',
  '74': 'Sulawesi Tenggara', '75': 'Gorontalo', '76': 'Sulawesi Barat',
  '81': 'Maluku', '82': 'Maluku Utara',
  '91': 'Papua', '92': 'Papua Barat', '93': 'Papua Selatan',
  '94': 'Papua Tengah', '95': 'Papua Pegunungan', '96': 'Papua Barat Daya',
};

function clean(input: string): string {
  return (input || '').replace(/\D/g, '');
}

function resolveYear(yy: number): number {
  const currentYY = new Date().getFullYear() % 100;
  return yy <= currentYY ? 2000 + yy : 1900 + yy;
}

function computeAge(birth: Date, ref: Date = new Date()): number {
  let age = ref.getFullYear() - birth.getFullYear();
  const m = ref.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && ref.getDate() < birth.getDate())) age--;
  return age;
}

export function validateNik(input: string): NikValidation {
  const nik = clean(input);
  if (nik.length !== 16) {
    return { valid: false, reason: `Panjang NIK harus 16 digit (diterima ${nik.length}).` };
  }

  const provinceCode = nik.slice(0, 2);
  const regencyCode = nik.slice(2, 4);
  const districtCode = nik.slice(4, 6);
  const dd = parseInt(nik.slice(6, 8), 10);
  const mm = parseInt(nik.slice(8, 10), 10);
  const yy = parseInt(nik.slice(10, 12), 10);
  const serial = nik.slice(12, 16);

  const province = PROVINCES[provinceCode];
  if (!province) {
    return { valid: false, reason: `Kode provinsi "${provinceCode}" tidak dikenal.` };
  }

  const gender: Gender = dd > 40 ? 'P' : 'L';
  const day = gender === 'P' ? dd - 40 : dd;

  if (day < 1 || day > 31) return { valid: false, reason: `Tanggal lahir tidak valid (${day}).` };
  if (mm < 1 || mm > 12) return { valid: false, reason: `Bulan lahir tidak valid (${mm}).` };
  if (serial === '0000') return { valid: false, reason: 'Nomor urut tidak boleh 0000.' };

  const year = resolveYear(yy);
  const birthDate = new Date(year, mm - 1, day);
  if (birthDate.getFullYear() !== year || birthDate.getMonth() !== mm - 1 || birthDate.getDate() !== day) {
    return { valid: false, reason: 'Kombinasi tanggal lahir tidak valid.' };
  }

  const pad = (n: number) => String(n).padStart(2, '0');
  const birthDateISO = `${year}-${pad(mm)}-${pad(day)}`;

  return {
    valid: true,
    info: {
      nik, provinceCode, province, regencyCode, districtCode,
      birthDateISO, gender, age: computeAge(birthDate), serial,
    },
  };
}

export function isValidNik(input: string): boolean {
  return validateNik(input).valid;
}

export function parseNik(input: string): NikInfo | null {
  const result = validateNik(input);
  return result.valid && result.info ? result.info : null;
}
