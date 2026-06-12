import { Hono } from 'hono';
import type { Env } from '../types.js';
import { ok, fail } from '../types.js';
import { validatePhone, detectOperator } from '../lib/phone.js';

export const phoneRoutes = new Hono<{ Bindings: Env }>();

// POST /v1/phone/validate
phoneRoutes.post('/validate', async (c) => {
  let body: { phone?: string };
  try {
    body = await c.req.json();
  } catch {
    return c.json(fail('Invalid JSON body.'), 400);
  }

  if (!body.phone) return c.json(fail('Field "phone" wajib diisi.'), 400);

  const result = validatePhone(body.phone);
  if (!result.valid) return c.json(ok({ valid: false, reason: result.reason }));
  return c.json(ok({ valid: true, info: result.info }));
});

// GET /v1/phone/operator?phone=xxx
phoneRoutes.get('/operator', async (c) => {
  const phone = c.req.query('phone');
  if (!phone) return c.json(fail('Query parameter "phone" wajib diisi.'), 400);

  const operator = detectOperator(phone);
  const result = validatePhone(phone);

  return c.json(ok({
    valid: result.valid,
    operator,
    ...(result.info ? { info: result.info } : {}),
  }), 200, {
    'Cache-Control': 'public, max-age=3600',
  });
});
