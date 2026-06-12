import { Hono } from 'hono';
import type { Env } from '../types.js';
import { ok, fail } from '../types.js';
import { validateNpwp, formatNpwp } from '../lib/npwp.js';

export const npwpRoutes = new Hono<{ Bindings: Env }>();

// POST /v1/npwp/validate
npwpRoutes.post('/validate', async (c) => {
  let body: { npwp?: string };
  try {
    body = await c.req.json();
  } catch {
    return c.json(fail('Invalid JSON body.'), 400);
  }

  if (!body.npwp) return c.json(fail('Field "npwp" wajib diisi.'), 400);

  const result = validateNpwp(body.npwp);
  if (!result.valid) return c.json(ok({ valid: false, reason: result.reason }));
  return c.json(ok({ valid: true, info: result.info }));
});

// GET /v1/npwp/format?npwp=xxx
npwpRoutes.get('/format', async (c) => {
  const npwp = c.req.query('npwp');
  if (!npwp) return c.json(fail('Query parameter "npwp" wajib diisi.'), 400);

  const result = validateNpwp(npwp);
  if (!result.valid) return c.json(ok({ valid: false, reason: result.reason }));

  const clean = (npwp || '').replace(/\D/g, '');
  return c.json(ok({
    valid: true,
    raw: clean,
    formatted: result.info?.format === 15 ? formatNpwp(clean) : clean,
    format: result.info?.format,
  }), 200, {
    'Cache-Control': 'public, max-age=3600',
  });
});
