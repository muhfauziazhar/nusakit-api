import { describe, it, expect } from 'vitest';
import { crc16, parseQris, convertToDynamic, extractInfo } from './qris.js';

function tlv(tag: string, value: string): string {
  return `${tag}${String(value.length).padStart(2, '0')}${value}`;
}

function buildStaticQris(): string {
  const body =
    tlv('00', '01') +
    tlv('01', '11') +
    tlv('26', tlv('00', 'ID.CO.EXAMPLE.WWW') + tlv('01', '936000140000000001')) +
    tlv('52', '5812') +
    tlv('53', '360') +
    tlv('58', 'ID') +
    tlv('59', 'WARUNG MAKAN JAYA') +
    tlv('60', 'JAKARTA') +
    tlv('61', '12345');
  return `${body}6304${crc16(`${body}6304`)}`;
}

describe('crc16', () => {
  it('matches the CRC16-CCITT-FALSE test vector', () => {
    expect(crc16('123456789')).toBe('29B1');
  });
});

describe('convertToDynamic', () => {
  it('converts a static QRIS to dynamic with amount', () => {
    const result = convertToDynamic(buildStaticQris(), { amount: 25000 });
    expect(result.success).toBe(true);

    const fields = parseQris(result.qris!)!;
    expect(fields.find((f) => f.tag === '01')?.value).toBe('12');
    expect(fields.find((f) => f.tag === '54')?.value).toBe('25000');

    const crc = result.qris!.slice(-4);
    expect(crc16(result.qris!.slice(0, -4))).toBe(crc);

    const info = extractInfo(fields);
    expect(info.pointOfInitiation).toBe('dynamic');
    expect(info.merchantName).toBe('WARUNG MAKAN JAYA');
  });

  it('inserts amount after the currency tag (53)', () => {
    const result = convertToDynamic(buildStaticQris(), { amount: 100 });
    const tags = parseQris(result.qris!)!.map((f) => f.tag);
    expect(tags.indexOf('54')).toBe(tags.indexOf('53') + 1);
  });

  it('supports fixed rupiah fee (tag 55=02, tag 56)', () => {
    const result = convertToDynamic(buildStaticQris(), { amount: 50000, feeType: 'rupiah', feeValue: 1000 });
    const fields = parseQris(result.qris!)!;
    expect(fields.find((f) => f.tag === '55')?.value).toBe('02');
    expect(fields.find((f) => f.tag === '56')?.value).toBe('1000');
  });

  it('supports percentage fee (tag 55=03, tag 57)', () => {
    const result = convertToDynamic(buildStaticQris(), { amount: 50000, feeType: 'percent', feeValue: 0.7 });
    const fields = parseQris(result.qris!)!;
    expect(fields.find((f) => f.tag === '55')?.value).toBe('03');
    expect(fields.find((f) => f.tag === '57')?.value).toBe('0.70');
  });

  it('rejects payload with invalid CRC', () => {
    const broken = buildStaticQris().slice(0, -4) + '0000';
    const result = convertToDynamic(broken, { amount: 100 });
    expect(result.success).toBe(false);
    expect(result.reason).toMatch(/CRC/);
  });

  it('rejects non-positive amount', () => {
    expect(convertToDynamic(buildStaticQris(), { amount: 0 }).success).toBe(false);
  });

  it('rejects malformed TLV payload', () => {
    expect(convertToDynamic('halo ini bukan qris', { amount: 100 }).success).toBe(false);
  });

  it('replaces an existing amount when QRIS is already dynamic', () => {
    const first = convertToDynamic(buildStaticQris(), { amount: 100 }).qris!;
    const second = convertToDynamic(first, { amount: 999 });
    expect(second.success).toBe(true);
    const fields = parseQris(second.qris!)!;
    expect(fields.filter((f) => f.tag === '54')).toHaveLength(1);
    expect(fields.find((f) => f.tag === '54')?.value).toBe('999');
  });
});
