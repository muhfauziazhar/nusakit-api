/**
 * Bank Indonesia — kode bank dan validasi rekening.
 * Ported from @fauzitech/nusakit
 */

export interface Bank {
  code: string;
  name: string;
  accountLength: [number, number];
}

export const BANKS: Bank[] = [
  { code: '002', name: 'Bank Rakyat Indonesia (BRI)', accountLength: [15, 15] },
  { code: '008', name: 'Bank Mandiri', accountLength: [13, 13] },
  { code: '009', name: 'Bank Negara Indonesia (BNI)', accountLength: [10, 10] },
  { code: '011', name: 'Bank Danamon', accountLength: [10, 12] },
  { code: '013', name: 'Bank Permata', accountLength: [10, 12] },
  { code: '014', name: 'Bank Central Asia (BCA)', accountLength: [10, 10] },
  { code: '016', name: 'Maybank Indonesia', accountLength: [10, 12] },
  { code: '019', name: 'Bank Panin', accountLength: [10, 12] },
  { code: '022', name: 'Bank CIMB Niaga', accountLength: [13, 13] },
  { code: '023', name: 'Bank UOB Indonesia', accountLength: [10, 12] },
  { code: '028', name: 'Bank OCBC NISP', accountLength: [10, 12] },
  { code: '037', name: 'Bank Artha Graha', accountLength: [10, 12] },
  { code: '042', name: 'Bank JTrust Indonesia', accountLength: [10, 12] },
  { code: '046', name: 'Bank DBS Indonesia', accountLength: [10, 12] },
  { code: '050', name: 'Bank Standard Chartered', accountLength: [10, 12] },
  { code: '054', name: 'Bank Capital Indonesia', accountLength: [10, 12] },
  { code: '069', name: 'Bank of China (BOC)', accountLength: [10, 12] },
  { code: '076', name: 'Bank Bumi Arta', accountLength: [10, 12] },
  { code: '087', name: 'Bank HSBC Indonesia', accountLength: [10, 12] },
  { code: '095', name: 'Bank JABAR Banten (BJB)', accountLength: [10, 13] },
  { code: '110', name: 'Bank BJB Syariah', accountLength: [10, 13] },
  { code: '147', name: 'Bank Muamalat', accountLength: [10, 13] },
  { code: '151', name: 'Bank Mega', accountLength: [10, 12] },
  { code: '153', name: 'Bank Sinarmas', accountLength: [10, 12] },
  { code: '157', name: 'Bank Maspion', accountLength: [10, 12] },
  { code: '161', name: 'Bank Ganesha', accountLength: [10, 12] },
  { code: '200', name: 'Bank Tabungan Negara (BTN)', accountLength: [16, 16] },
  { code: '213', name: 'Bank BTPN', accountLength: [10, 12] },
  { code: '422', name: 'Bank Syariah Indonesia (BSI)', accountLength: [10, 10] },
  { code: '426', name: 'Bank Mega Syariah', accountLength: [10, 12] },
  { code: '441', name: 'Bank Bukopin (KB Bukopin)', accountLength: [10, 12] },
  { code: '484', name: 'Bank KEB Hana', accountLength: [10, 12] },
  { code: '485', name: 'Bank MNC Internasional', accountLength: [10, 12] },
  { code: '490', name: 'Bank Neo Commerce (BNC)', accountLength: [10, 12] },
  { code: '494', name: 'Bank Raya (BRI Agroniaga)', accountLength: [10, 12] },
  { code: '501', name: 'Bank Digital BCA (blu)', accountLength: [10, 10] },
  { code: '513', name: 'Bank Ina Perdana', accountLength: [10, 12] },
  { code: '535', name: 'SeaBank Indonesia', accountLength: [12, 14] },
  { code: '536', name: 'Bank Jago', accountLength: [10, 12] },
  { code: '542', name: 'Bank Jago Syariah', accountLength: [10, 12] },
  { code: '547', name: 'Bank BTPN Syariah', accountLength: [10, 12] },
  { code: '553', name: 'Allo Bank Indonesia', accountLength: [10, 12] },
];

const BY_CODE: Record<string, Bank> = {};
for (const b of BANKS) BY_CODE[b.code] = b;

export function findBank(code: string): Bank | undefined {
  return BY_CODE[(code || '').padStart(3, '0')];
}

export function searchBank(query: string): Bank[] {
  const q = (query || '').toLowerCase().trim();
  if (!q) return [];
  return BANKS.filter((b) => b.name.toLowerCase().includes(q));
}

export interface AccountValidation {
  valid: boolean;
  reason?: string;
  bank?: Bank;
}

export function validateAccount(bankCode: string, account: string): AccountValidation {
  const bank = findBank(bankCode);
  if (!bank) return { valid: false, reason: `Kode bank "${bankCode}" tidak dikenal.` };

  const acc = (account || '').replace(/\D/g, '');
  if (!acc) return { valid: false, reason: 'Nomor rekening kosong.', bank };

  const [min, max] = bank.accountLength;
  if (acc.length < min || acc.length > max) {
    const range = min === max ? `${min}` : `${min}–${max}`;
    return { valid: false, reason: `Panjang nomor rekening ${bank.name} harus ${range} digit (diterima ${acc.length}).`, bank };
  }

  return { valid: true, bank };
}
