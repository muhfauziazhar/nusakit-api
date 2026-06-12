/**
 * Seed script: Convert cahyadsn/wilayah MySQL data → D1 SQLite format.
 *
 * Usage:
 *   1. Clone cahyadsn/wilayah to ../cahyadsn-wilayah
 *   2. Run: npx tsx scripts/build-sql.ts
 *   3. Output: seed.sql (ready for wrangler d1 execute)
 *   4. Deploy: wrangler d1 execute nusakit-db --file=seed.sql --remote
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const WILAYAH_SQL_PATH = join(process.cwd(), '..', 'cahyadsn-wilayah', 'db', 'wilayah.sql');

console.log('📖 Reading wilayah.sql...');
const sql = readFileSync(WILAYAH_SQL_PATH, 'utf-8');

// Parse INSERT statements: ('code','name')
const insertPattern = /\('([^']+)',\s*'([^']+)'\)/g;
const rows: { code: string; name: string }[] = [];
let match;

while ((match = insertPattern.exec(sql)) !== null) {
  rows.push({ code: match[1], name: match[2].replace(/''/g, "'") });
}

console.log(`✅ Parsed ${rows.length} wilayah rows`);

// Classify by code depth
const provinces: typeof rows = [];
const regencies: typeof rows = [];
const districts: typeof rows = [];
const villages: typeof rows = [];

for (const row of rows) {
  const depth = row.code.split('.').length;
  if (depth === 1) provinces.push(row);
  else if (depth === 2) regencies.push(row);
  else if (depth === 3) districts.push(row);
  else if (depth === 4) villages.push(row);
}

console.log(`   📊 Provinces: ${provinces.length}`);
console.log(`   📊 Regencies: ${regencies.length}`);
console.log(`   📊 Districts: ${districts.length}`);
console.log(`   📊 Villages: ${villages.length}`);

// Generate SQLite INSERT statements (batch 500 per INSERT for performance)
function generateInserts(table: string, data: typeof rows, extraField?: string): string[] {
  const lines: string[] = [];
  const batchSize = 500;

  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    const values = batch.map(r => {
      const name = r.name.replace(/'/g, "''");
      if (extraField) {
        // Extract parent code (e.g., '11.01' from '11.01.01')
        const parentCode = r.code.split('.').slice(0, -1).join('.');
        return `('${r.code}','${name}','${parentCode}')`;
      }
      return `('${r.code}','${name}')`;
    });

    const cols = extraField ? 'code, name, ' + extraField : 'code, name';
    lines.push(`INSERT INTO ${table} (${cols}) VALUES`);
    lines.push(values.join(',\n') + ';');
    lines.push('');
  }

  return lines;
}

const output: string[] = [
  '-- Nusakit API D1 Seed Data',
  '-- Generated from cahyadsn/wilayah (Kepmendagri No. 300.2.2-2138 Tahun 2025)',
  '-- License: MIT (cahyadsn/wilayah)',
  '',
  'BEGIN TRANSACTION;',
  '',
  '-- Provinces',
  ...generateInserts('provinces', provinces),
  '',
  '-- Regencies',
  ...generateInserts('regencies', regencies, 'province_code'),
  '',
  '-- Districts',
  ...generateInserts('districts', districts, 'regency_code'),
  '',
  '-- Villages',
  ...generateInserts('villages', villages, 'district_code'),
  '',
  'COMMIT;',
];

const outputPath = join(process.cwd(), 'seed.sql');
writeFileSync(outputPath, output.join('\n'), 'utf-8');

const sizeMB = (Buffer.byteLength(output.join('\n')) / 1024 / 1024).toFixed(2);
console.log(`\n🎉 Generated ${outputPath} (${sizeMB} MB)`);
console.log('   Next: wrangler d1 execute nusakit-db --file=seed.sql --remote');
