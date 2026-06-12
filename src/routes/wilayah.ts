/**
 * Wilayah routes — hierarchical region data from D1.
 * Supports provinces, regencies, districts, villages + search.
 */

import { Hono } from 'hono';
import type { Env } from '../types.js';
import { ok, fail } from '../types.js';

export const wilayahRoutes = new Hono<{ Bindings: Env }>();

// Guard: check if D1 is available
wilayahRoutes.use('*', async (c, next) => {
  if (!c.env.DB) {
    return c.json(fail('D1 database belum dikonfigurasi. Hubungi admin untuk setup.'), 503);
  }
  await next();
});

// ─── List all provinces ──────────────────────────────────────
wilayahRoutes.get('/provinces', async (c) => {
  const q = c.req.query('q');
  let sql = 'SELECT code, name FROM provinces';
  const params: string[] = [];

  if (q) {
    sql += ' WHERE name LIKE ?';
    params.push(`%${q}%`);
  }
  sql += ' ORDER BY code';

  const result = await c.env.DB.prepare(sql).bind(...params).all();
  return c.json(ok(result.results), 200, {
    'Cache-Control': 'public, max-age=86400, s-maxage=31536000',
  });
});

// ─── Get province by code ────────────────────────────────────
wilayahRoutes.get('/provinces/:code', async (c) => {
  const code = c.req.param('code');
  const result = await c.env.DB.prepare(
    'SELECT code, name FROM provinces WHERE code = ?'
  ).bind(code).first();

  if (!result) return c.json(fail(`Provinsi dengan kode "${code}" tidak ditemukan.`), 404);
  return c.json(ok(result), 200, {
    'Cache-Control': 'public, max-age=86400, s-maxage=31536000',
  });
});

// ─── List regencies in a province ────────────────────────────
wilayahRoutes.get('/regencies/:provinceCode', async (c) => {
  const provinceCode = c.req.param('provinceCode');
  const q = c.req.query('q');

  let sql = 'SELECT code, name, province_code FROM regencies WHERE province_code = ?';
  const params: string[] = [provinceCode];

  if (q) {
    sql += ' AND name LIKE ?';
    params.push(`%${q}%`);
  }
  sql += ' ORDER BY code';

  const result = await c.env.DB.prepare(sql).bind(...params).all();
  return c.json(ok(result.results), 200, {
    'Cache-Control': 'public, max-age=86400, s-maxage=31536000',
  });
});

// ─── List districts in a regency ─────────────────────────────
wilayahRoutes.get('/districts/:regencyCode', async (c) => {
  const regencyCode = c.req.param('regencyCode');
  const q = c.req.query('q');

  let sql = 'SELECT code, name, regency_code FROM districts WHERE regency_code = ?';
  const params: string[] = [regencyCode];

  if (q) {
    sql += ' AND name LIKE ?';
    params.push(`%${q}%`);
  }
  sql += ' ORDER BY code';

  const result = await c.env.DB.prepare(sql).bind(...params).all();
  return c.json(ok(result.results), 200, {
    'Cache-Control': 'public, max-age=86400, s-maxage=604800',
  });
});

// ─── List villages in a district ─────────────────────────────
wilayahRoutes.get('/villages/:districtCode', async (c) => {
  const districtCode = c.req.param('districtCode');
  const q = c.req.query('q');

  let sql = 'SELECT code, name, district_code FROM villages WHERE district_code = ?';
  const params: string[] = [districtCode];

  if (q) {
    sql += ' AND name LIKE ?';
    params.push(`%${q}%`);
  }
  sql += ' ORDER BY code';

  const result = await c.env.DB.prepare(sql).bind(...params).all();
  return c.json(ok(result.results), 200, {
    'Cache-Control': 'public, max-age=86400, s-maxage=604800',
  });
});

// ─── Search any region by name (across all levels) ───────────
wilayahRoutes.get('/search', async (c) => {
  const q = c.req.query('q');
  const limit = Math.min(parseInt(c.req.query('limit') || '20'), 100);

  if (!q || q.length < 2) {
    return c.json(fail('Query parameter "q" harus minimal 2 karakter.'), 400);
  }

  const searchPattern = `%${q}%`;

  // Search across all 4 levels using UNION ALL
  const sql = `
    SELECT code, name, 'province' as level FROM provinces WHERE name LIKE ?
    UNION ALL
    SELECT code, name, 'regency' as level FROM regencies WHERE name LIKE ?
    UNION ALL
    SELECT code, name, 'district' as level FROM districts WHERE name LIKE ?
    UNION ALL
    SELECT code, name, 'village' as level FROM villages WHERE name LIKE ?
    LIMIT ?
  `;

  const result = await c.env.DB.prepare(sql)
    .bind(searchPattern, searchPattern, searchPattern, searchPattern, limit)
    .all();

  return c.json(ok(result.results));
});

// ─── Get full hierarchy for a code ───────────────────────────
wilayahRoutes.get('/lookup/:code', async (c) => {
  const code = c.req.param('code');
  const parts = code.split('.');

  const result: Record<string, unknown> = {};

  if (parts.length >= 1) {
    const prov = await c.env.DB.prepare('SELECT code, name FROM provinces WHERE code = ?').bind(parts[0]).first();
    if (prov) result.province = prov;
  }
  if (parts.length >= 2) {
    const reg = await c.env.DB.prepare('SELECT code, name FROM regencies WHERE code = ?').bind(`${parts[0]}.${parts[1]}`).first();
    if (reg) result.regency = reg;
  }
  if (parts.length >= 3) {
    const dist = await c.env.DB.prepare('SELECT code, name FROM districts WHERE code = ?').bind(`${parts[0]}.${parts[1]}.${parts[2]}`).first();
    if (dist) result.district = dist;
  }
  if (parts.length >= 4) {
    const vil = await c.env.DB.prepare('SELECT code, name FROM villages WHERE code = ?').bind(code).first();
    if (vil) result.village = vil;
  }

  if (Object.keys(result).length === 0) {
    return c.json(fail(`Kode wilayah "${code}" tidak ditemukan.`), 404);
  }

  return c.json(ok(result), 200, {
    'Cache-Control': 'public, max-age=86400, s-maxage=604800',
  });
});
