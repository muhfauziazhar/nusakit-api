/**
 * QRIS — Quick Response Code Indonesian Standard (EMVCo merchant-presented).
 * Konversi QRIS statis menjadi dinamis: ubah Point of Initiation Method
 * (tag 01) ke "12", sisipkan nominal transaksi (tag 54) dan biaya layanan
 * opsional (tag 55/56/57), lalu hitung ulang CRC16 (tag 63).
 */

export interface QrisField {
  tag: string;
  value: string;
}

export interface QrisInfo {
  merchantName?: string;
  merchantCity?: string;
  postalCode?: string;
  pointOfInitiation: 'static' | 'dynamic' | 'unknown';
  amount?: string;
}

export type FeeType = 'rupiah' | 'percent';

export interface ConvertOptions {
  amount: number;
  feeType?: FeeType;
  feeValue?: number;
}

export interface ConvertResult {
  success: boolean;
  reason?: string;
  qris?: string;
  info?: QrisInfo;
}

const CRC_TAG = '63';
const POI_TAG = '01';
const AMOUNT_TAG = '54';
const FEE_INDICATOR_TAG = '55';
const FEE_FIXED_TAG = '56';
const FEE_PERCENT_TAG = '57';

/** CRC16-CCITT-FALSE (poly 0x1021, init 0xFFFF) sesuai spesifikasi EMVCo. */
export function crc16(payload: string): string {
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

export function parseQris(payload: string): QrisField[] | null {
  const fields: QrisField[] = [];
  let i = 0;
  while (i < payload.length) {
    if (i + 4 > payload.length) return null;
    const tag = payload.slice(i, i + 2);
    const len = Number(payload.slice(i + 2, i + 4));
    if (!/^\d{2}$/.test(payload.slice(i + 2, i + 4))) return null;
    if (i + 4 + len > payload.length) return null;
    fields.push({ tag, value: payload.slice(i + 4, i + 4 + len) });
    i += 4 + len;
  }
  return fields;
}

function tlv(tag: string, value: string): string {
  return `${tag}${String(value.length).padStart(2, '0')}${value}`;
}

function build(fields: QrisField[]): string {
  const body = fields.map((f) => tlv(f.tag, f.value)).join('');
  return `${body}${CRC_TAG}04${crc16(`${body}${CRC_TAG}04`)}`;
}

export function extractInfo(fields: QrisField[]): QrisInfo {
  const get = (tag: string) => fields.find((f) => f.tag === tag)?.value;
  const poi = get(POI_TAG);
  return {
    merchantName: get('59'),
    merchantCity: get('60'),
    postalCode: get('61'),
    pointOfInitiation: poi === '11' ? 'static' : poi === '12' ? 'dynamic' : 'unknown',
    amount: get(AMOUNT_TAG),
  };
}

/** Format nominal: bilangan bulat tanpa pemisah, desimal pakai titik (maks 2 digit). */
function formatAmount(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(2);
}

export function convertToDynamic(payload: string, opts: ConvertOptions): ConvertResult {
  const raw = (payload || '').trim();
  if (!raw) return { success: false, reason: 'Payload QRIS wajib diisi.' };

  const fields = parseQris(raw);
  if (!fields || fields[0]?.tag !== '00') {
    return { success: false, reason: 'Payload QRIS tidak valid (struktur TLV rusak).' };
  }

  const crcField = fields.find((f) => f.tag === CRC_TAG);
  if (!crcField) return { success: false, reason: 'Payload QRIS tidak memiliki CRC (tag 63).' };

  const crcIndex = raw.lastIndexOf(`${CRC_TAG}04`);
  if (crc16(raw.slice(0, crcIndex + 4)) !== crcField.value.toUpperCase()) {
    return { success: false, reason: 'CRC QRIS tidak valid — payload kemungkinan rusak atau tidak lengkap.' };
  }

  if (!Number.isFinite(opts.amount) || opts.amount <= 0) {
    return { success: false, reason: 'Nominal (amount) harus angka lebih dari 0.' };
  }

  if (opts.feeType && (!Number.isFinite(opts.feeValue) || (opts.feeValue as number) < 0)) {
    return { success: false, reason: 'Nilai biaya (feeValue) wajib diisi jika feeType ditentukan.' };
  }
  if (opts.feeType === 'percent' && (opts.feeValue as number) > 100) {
    return { success: false, reason: 'Biaya persen tidak boleh lebih dari 100.' };
  }

  // Buang tag yang akan ditulis ulang: nominal, fee, dan CRC.
  const kept = fields.filter(
    (f) => ![AMOUNT_TAG, FEE_INDICATOR_TAG, FEE_FIXED_TAG, FEE_PERCENT_TAG, CRC_TAG].includes(f.tag)
  );

  const poi = kept.find((f) => f.tag === POI_TAG);
  if (poi) {
    poi.value = '12';
  } else {
    kept.splice(1, 0, { tag: POI_TAG, value: '12' });
  }

  const inserted: QrisField[] = [{ tag: AMOUNT_TAG, value: formatAmount(opts.amount) }];
  if (opts.feeType === 'rupiah') {
    inserted.push(
      { tag: FEE_INDICATOR_TAG, value: '02' },
      { tag: FEE_FIXED_TAG, value: formatAmount(opts.feeValue as number) }
    );
  } else if (opts.feeType === 'percent') {
    inserted.push(
      { tag: FEE_INDICATOR_TAG, value: '03' },
      { tag: FEE_PERCENT_TAG, value: formatAmount(opts.feeValue as number) }
    );
  }

  // Sisipkan setelah tag 53 (mata uang); jika tidak ada, sebelum tag 58 (negara).
  let at = kept.findIndex((f) => f.tag === '53');
  if (at >= 0) {
    at += 1;
  } else {
    at = kept.findIndex((f) => f.tag === '58');
    if (at < 0) at = kept.length;
  }
  kept.splice(at, 0, ...inserted);

  const result = build(kept);
  return { success: true, qris: result, info: extractInfo(parseQris(result) ?? kept) };
}
