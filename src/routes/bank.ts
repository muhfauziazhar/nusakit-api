import { Hono } from 'hono';
import type { Env } from '../types.js';
import { ok, fail } from '../types.js';
import { BANKS, findBank, searchBank, validateAccount } from '../lib/bank.js';

export const bankRoutes = new Hono<{ Bindings: Env }>();

// GET /v1/bank — list all banks
bankRoutes.get('/', async (c) => {
  const q = c.req.query('q');
  if (q) {
    return c.json(ok(searchBank(q)), 200, {
      'Cache-Control': 'public, max-age=86400, s-maxage=31536000',
    });
  }
  return c.json(ok(BANKS), 200, {
    'Cache-Control': 'public, max-age=86400, s-maxage=31536000',
  });
});

// GET /v1/bank/:code — get bank by code
bankRoutes.get('/:code', async (c) => {
  const code = c.req.param('code');
  const bank = findBank(code);
  if (!bank) return c.json(fail(`Bank dengan kode "${code}" tidak ditemukan.`), 404);

  return c.json(ok(bank), 200, {
    'Cache-Control': 'public, max-age=86400, s-maxage=31536000',
  });
});

// POST /v1/bank/validate-account
bankRoutes.post('/validate-account', async (c) => {
  let body: { bankCode?: string; account?: string };
  try {
    body = await c.req.json();
  } catch {
    return c.json(fail('Invalid JSON body.'), 400);
  }

  if (!body.bankCode) return c.json(fail('Field "bankCode" wajib diisi.'), 400);
  if (!body.account) return c.json(fail('Field "account" wajib diisi.'), 400);

  const result = validateAccount(body.bankCode, body.account);
  return c.json(ok(result));
});
