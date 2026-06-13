/**
 * Kode Pos routes — postal code lookup backed by D1 (table `kodepos`).
 *  - GET /v1/kodepos/wilayah/:code  → forward: village code → postal code
 *  - GET /v1/kodepos/:postalCode    → reverse: postal code → list of areas
 */

import { Hono } from 'hono';
import type { Env } from '../types.js';
import { ok, fail } from '../types.js';
import { isValidPostalCode, normalizeWilayahCode, wilayahDepth } from '../lib/kodepos.js';

export const kodeposRoutes = new Hono<{ Bindings: Env }>();

// Joins a kodepos row up to province level. `?` is bound by the caller.
const HIERARCHY_SELECT = `
  SELECT k.postal_code AS postalCode,
         v.code AS villageCode, v.name AS village,
         d.code AS districtCode, d.name AS district,
         r.code AS regencyCode, r.name AS regency,
         p.code AS provinceCode, p.name AS province
  FROM kodepos k
  JOIN villages v ON v.code = k.village_code
  JOIN districts d ON d.code = v.district_code
  JOIN regencies r ON r.code = d.regency_code
  JOIN provinces p ON p.code = r.province_code
`;

// Guard: this module needs D1.
kodeposRoutes.use('*', async (c, next) => {
  if (!c.env.DB) {
    return c.json(fail('D1 database belum dikonfigurasi. Hubungi admin untuk setup.'), 503);
  }
  await next();
});

// ─── Forward: village code → postal code ─────────────────────
kodeposRoutes.get('/wilayah/:code', async (c) => {
  const code = normalizeWilayahCode(c.req.param('code'));
  if (wilayahDepth(code) !== 4) {
    return c.json(fail('Gunakan kode desa/kelurahan (4 level, mis. 32.04.11.2001).'), 400);
  }

  const row = await c.env.DB!.prepare(`${HIERARCHY_SELECT} WHERE k.village_code = ?`)
    .bind(code)
    .first();

  if (!row) return c.json(fail(`Kode pos untuk wilayah "${code}" tidak ditemukan.`), 404);

  return c.json(ok(row), 200, {
    'Cache-Control': 'public, max-age=86400, s-maxage=604800',
  });
});

// ─── Reverse: postal code → list of areas ────────────────────
kodeposRoutes.get('/:postalCode', async (c) => {
  const postalCode = c.req.param('postalCode').trim();
  if (!isValidPostalCode(postalCode)) {
    return c.json(fail('Kode pos harus 5 digit angka.'), 400);
  }

  const limit = Math.min(parseInt(c.req.query('limit') || '50'), 200);

  const result = await c.env.DB!.prepare(
    `${HIERARCHY_SELECT} WHERE k.postal_code = ? ORDER BY k.village_code LIMIT ?`
  )
    .bind(postalCode, limit)
    .all();

  const areas = result.results ?? [];
  if (areas.length === 0) {
    return c.json(fail(`Tidak ada wilayah dengan kode pos "${postalCode}".`), 404);
  }

  return c.json(ok({ postalCode, count: areas.length, areas }), 200, {
    'Cache-Control': 'public, max-age=86400, s-maxage=604800',
  });
});
