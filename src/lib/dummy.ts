/**
 * Generator data dummy untuk testing.
 * Ported from @fauzitech/nusakit
 */

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(arr: T[]): T {
  return arr[randInt(0, arr.length - 1)];
}

const pad = (n: number, len: number) => String(n).padStart(len, '0');

const PROVINCE_CODES = [
  '11','12','13','14','15','16','17','18','19','21',
  '31','32','33','34','35','36','51','52','53',
  '61','62','63','64','65','71','72','73','74','75','76',
  '81','82','91','92','93','94','95','96',
];

const PHONE_PREFIXES = [
  '0811','0812','0813','0821','0822','0852','0853',
  '0814','0815','0816','0855','0856','0857','0858',
  '0817','0818','0819','0859','0877','0878',
  '0831','0832','0833','0838',
  '0895','0896','0897','0898','0899',
  '0881','0882','0883','0885','0887','0888',
];

export interface DummyNikOptions {
  provinceCode?: string;
  gender?: 'L' | 'P';
  birthYear?: number;
}

export function dummyNik(options: DummyNikOptions = {}): string {
  const provinceCode = options.provinceCode ?? pick(PROVINCE_CODES);
  const gender = options.gender ?? pick(['L', 'P'] as const);
  const year = options.birthYear ?? randInt(1960, 2005);

  const regency = pad(randInt(1, 99), 2);
  const district = pad(randInt(1, 99), 2);
  const month = randInt(1, 12);
  let day = randInt(1, 28);
  if (gender === 'P') day += 40;

  const yy = pad(year % 100, 2);
  const serial = pad(randInt(1, 9999), 4);

  return `${provinceCode}${regency}${district}${pad(day, 2)}${pad(month, 2)}${yy}${serial}`;
}

export function dummyPhone(): string {
  const prefix = pick(PHONE_PREFIXES);
  const restLen = randInt(7, 8);
  let rest = '';
  for (let i = 0; i < restLen; i++) rest += randInt(0, 9);
  return prefix + rest;
}

export function dummyNpwp(): string {
  let n = '';
  n += randInt(1, 9);
  for (let i = 1; i < 15; i++) n += randInt(0, 9);
  return n;
}
