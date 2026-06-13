import { Hono } from 'hono';
import type { Env } from '../types.js';
import { ok, fail } from '../types.js';
import { convertToDynamic, parseQris, extractInfo, type FeeType } from '../lib/qris.js';

export const qrisRoutes = new Hono<{ Bindings: Env }>();

// POST /v1/qris/convert — konversi QRIS statis menjadi dinamis
qrisRoutes.post('/convert', async (c) => {
  let body: { qris?: string; amount?: number; feeType?: FeeType; feeValue?: number };
  try {
    body = await c.req.json();
  } catch {
    return c.json(fail('Invalid JSON body.'), 400);
  }

  if (!body.qris) return c.json(fail('Field "qris" wajib diisi.'), 400);
  if (body.amount === undefined) return c.json(fail('Field "amount" wajib diisi.'), 400);
  if (body.feeType && !['rupiah', 'percent'].includes(body.feeType)) {
    return c.json(fail('Field "feeType" harus "rupiah" atau "percent".'), 400);
  }

  const result = convertToDynamic(body.qris, {
    amount: Number(body.amount),
    feeType: body.feeType,
    feeValue: body.feeValue === undefined ? undefined : Number(body.feeValue),
  });

  if (!result.success) return c.json(fail(result.reason ?? 'Konversi gagal.'), 400);
  return c.json(ok({ qris: result.qris, info: result.info }));
});

// POST /v1/qris/parse — baca informasi dari payload QRIS
qrisRoutes.post('/parse', async (c) => {
  let body: { qris?: string };
  try {
    body = await c.req.json();
  } catch {
    return c.json(fail('Invalid JSON body.'), 400);
  }

  if (!body.qris) return c.json(fail('Field "qris" wajib diisi.'), 400);

  const fields = parseQris(body.qris.trim());
  if (!fields || fields[0]?.tag !== '00') {
    return c.json(fail('Payload QRIS tidak valid (struktur TLV rusak).'), 400);
  }

  return c.json(ok({ info: extractInfo(fields), fields }));
});
