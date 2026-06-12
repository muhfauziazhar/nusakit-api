/**
 * Phone — Validasi nomor HP Indonesia + deteksi operator.
 * Ported from @fauzitech/nusakit
 */

export type Operator = 'Telkomsel' | 'Indosat' | 'XL' | 'Axis' | 'Tri' | 'Smartfren' | 'by.U' | 'Unknown';

const PREFIX_MAP: Record<string, Operator> = {};
function register(op: Operator, prefixes: string[]) {
  for (const p of prefixes) PREFIX_MAP[p] = op;
}

register('Telkomsel', ['0811','0812','0813','0821','0822','0823','0851','0852','0853']);
register('Indosat', ['0814','0815','0816','0855','0856','0857','0858']);
register('XL', ['0817','0818','0819','0859','0877','0878']);
register('Axis', ['0831','0832','0833','0838']);
register('Tri', ['0895','0896','0897','0898','0899']);
register('Smartfren', ['0881','0882','0883','0884','0885','0886','0887','0888','0889']);

export interface PhoneInfo {
  local: string;
  international: string;
  e164: string;
  operator: Operator;
  prefix: string;
}

export interface PhoneValidation {
  valid: boolean;
  reason?: string;
  info?: PhoneInfo;
}

function toLocal(input: string): string | null {
  let s = (input || '').trim().replace(/[^\d+]/g, '');
  if (s.startsWith('+62')) s = '0' + s.slice(3);
  else if (s.startsWith('62')) s = '0' + s.slice(2);
  else if (s.startsWith('8')) s = '0' + s;
  if (!s.startsWith('08')) return null;
  return s;
}

export function validatePhone(input: string): PhoneValidation {
  const local = toLocal(input);
  if (!local) return { valid: false, reason: 'Bukan format nomor HP Indonesia (harus diawali 08/8/62/+62).' };
  if (local.length < 10 || local.length > 13) {
    return { valid: false, reason: `Panjang nomor tidak valid (${local.length} digit, harus 10–13).` };
  }

  const prefix = local.slice(0, 4);
  const operator = PREFIX_MAP[prefix] ?? 'Unknown';
  const e164 = '62' + local.slice(1);

  return {
    valid: true,
    info: { local, international: '+' + e164, e164, operator, prefix },
  };
}

export function isValidPhone(input: string): boolean {
  return validatePhone(input).valid;
}

export function detectOperator(input: string): Operator {
  const r = validatePhone(input);
  return r.valid && r.info ? r.info.operator : 'Unknown';
}
