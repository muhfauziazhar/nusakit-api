import { Hono } from 'hono';
import type { Env } from '../types.js';
import { ok, fail } from '../types.js';
import { formatRupiah, parseRupiah, terbilang, terbilangRupiah } from '../lib/rupiah.js';

export const rupiahRoutes = new Hono<{ Bindings: Env }>();

// GET /v1/rupiah/format?amount=1500000
rupiahRoutes.get('/format', async (c) => {
  const amountStr = c.req.query('amount');
  if (!amountStr) return c.json(fail('Query parameter "amount" wajib diisi.'), 400);

  const amount = parseFloat(amountStr);
  if (isNaN(amount)) return c.json(fail('"amount" harus berupa angka.'), 400);

  const symbol = c.req.query('symbol') !== 'false';
  const decimals = parseInt(c.req.query('decimals') || '0');

  return c.json(ok({
    amount,
    formatted: formatRupiah(amount, { symbol, decimals }),
  }), 200, {
    'Cache-Control': 'public, max-age=86400',
  });
});

// GET /v1/rupiah/terbilang?amount=1500000
rupiahRoutes.get('/terbilang', async (c) => {
  const amountStr = c.req.query('amount');
  if (!amountStr) return c.json(fail('Query parameter "amount" wajib diisi.'), 400);

  const amount = parseFloat(amountStr);
  if (isNaN(amount)) return c.json(fail('"amount" harus berupa angka.'), 400);

  return c.json(ok({
    amount,
    terbilang: terbilang(amount),
    terbilangRupiah: terbilangRupiah(amount),
  }), 200, {
    'Cache-Control': 'public, max-age=86400',
  });
});

// GET /v1/rupiah/parse?input=Rp%201.500.000
rupiahRoutes.get('/parse', async (c) => {
  const input = c.req.query('input');
  if (!input) return c.json(fail('Query parameter "input" wajib diisi.'), 400);

  const amount = parseRupiah(input);
  if (isNaN(amount)) return c.json(fail('Input tidak bisa di-parse menjadi angka.'), 400);

  return c.json(ok({
    input,
    amount,
    formatted: formatRupiah(amount),
  }), 200, {
    'Cache-Control': 'public, max-age=86400',
  });
});
