import { Hono } from 'hono';
import type { Env } from '../types.js';
import { ok, fail } from '../types.js';
import { validateNik } from '../lib/nik.js';

export const nikRoutes = new Hono<{ Bindings: Env }>();

// POST /v1/nik/validate
nikRoutes.post('/validate', async (c) => {
  let body: { nik?: string };
  try {
    body = await c.req.json();
  } catch {
    return c.json(fail('Invalid JSON body.'), 400);
  }

  if (!body.nik) return c.json(fail('Field "nik" wajib diisi.'), 400);

  const result = validateNik(body.nik);
  if (!result.valid) return c.json(ok({ valid: false, reason: result.reason }));
  return c.json(ok({ valid: true, info: result.info }));
});

// GET /v1/nik/validate?nik=xxx (convenience, cacheable for same NIK)
nikRoutes.get('/validate', async (c) => {
  const nik = c.req.query('nik');
  if (!nik) return c.json(fail('Query parameter "nik" wajib diisi.'), 400);

  const result = validateNik(nik);
  if (!result.valid) return c.json(ok({ valid: false, reason: result.reason }));
  return c.json(ok({ valid: true, info: result.info }), 200, {
    'Cache-Control': 'public, max-age=3600',
  });
});
