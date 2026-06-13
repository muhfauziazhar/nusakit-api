/**
 * Seed script: build the `kodepos` table seed SQL from cahyadsn/wilayah_kodepos.
 *
 * Usage:
 *   1. Clone the data:  git clone https://github.com/cahyadsn/wilayah_kodepos ../cahyadsn-wilayah_kodepos
 *   2. Run:             npx tsx scripts/build-kodepos.ts [path/to/wilayah_kodepos.sql]
 *   3. Output:          kodepos-seed.sql
 *   4. Create table:    wrangler d1 execute nusakit-db --file=schema.sql --remote
 *   5. Seed:            wrangler d1 execute nusakit-db --file=kodepos-seed.sql --remote
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const SOURCE_PATH =
  process.argv[2] || join(process.cwd(), '..', 'cahyadsn-wilayah_kodepos', 'db', 'wilayah_kodepos.sql');

console.log(`📖 Reading ${SOURCE_PATH} ...`);
const sql = readFileSync(SOURCE_PATH, 'utf-8');

// Match ('<village code: PP.RR.DD.VVVV>', '<5-digit postal code>').
// Indonesian codes use 2-digit province/regency/district and a 4-digit village.
const pattern = /\('(\d{2}\.\d{2}\.\d{2}\.\d{4})'\s*,\s*'(\d{5})'\)/g;
const rows: { villageCode: string; postalCode: string }[] = [];
const seen = new Set<string>();
let match: RegExpExecArray | null;

while ((match = pattern.exec(sql)) !== null) {
  const [, villageCode, postalCode] = match;
  if (seen.has(villageCode)) continue; // village_code is the primary key
  seen.add(villageCode);
  rows.push({ villageCode, postalCode });
}

console.log(`✅ Parsed ${rows.length} village → postal-code mappings`);
if (rows.length === 0) {
  console.error('❌ No rows matched. Check the source file format/path.');
  process.exit(1);
}

// Note: no explicit BEGIN TRANSACTION/COMMIT — D1's remote executor wraps the
// file in its own transaction and rejects manual transaction statements.
const batchSize = 500;
const lines: string[] = [
  '-- Nusakit API D1 Seed Data — kodepos',
  '-- Generated from cahyadsn/wilayah_kodepos',
  '-- License: MIT (cahyadsn/wilayah_kodepos)',
  '',
];

for (let i = 0; i < rows.length; i += batchSize) {
  const batch = rows.slice(i, i + batchSize);
  const values = batch.map((r) => `('${r.villageCode}','${r.postalCode}')`);
  lines.push('INSERT OR REPLACE INTO kodepos (village_code, postal_code) VALUES');
  lines.push(values.join(',\n') + ';');
  lines.push('');
}

const outputPath = join(process.cwd(), 'kodepos-seed.sql');
const output = lines.join('\n');
writeFileSync(outputPath, output, 'utf-8');

const sizeMB = (Buffer.byteLength(output) / 1024 / 1024).toFixed(2);
console.log(`\n🎉 Generated ${outputPath} (${sizeMB} MB)`);
console.log('   Next: wrangler d1 execute nusakit-db --file=kodepos-seed.sql --remote');
