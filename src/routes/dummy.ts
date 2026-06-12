import { Hono } from 'hono';
import type { Env } from '../types.js';
import { ok, fail } from '../types.js';
import { dummyNik, dummyPhone, dummyNpwp } from '../lib/dummy.js';

export const dummyRoutes = new Hono<{ Bindings: Env }>();

// POST /v1/dummy/nik
dummyRoutes.post('/nik', async (c) => {
  let body: { provinceCode?: string; gender?: 'L' | 'P'; birthYear?: number; count?: number } = {};
  try {
    body = await c.req.json().catch(() => ({}));
  } catch {
    // empty body is fine for dummy generation
  }

  const count = Math.min(body.count || 1, 100);
  const results = [];

  for (let i = 0; i < count; i++) {
    results.push(dummyNik({
      provinceCode: body.provinceCode,
      gender: body.gender,
      birthYear: body.birthYear,
    }));
  }

  return c.json(ok({
    count,
    niks: results,
    disclaimer: 'Data dummy untuk testing saja — BUKAN NIK asli yang terdaftar di Dukcapil.',
  }), 200, {
    'Cache-Control': 'no-store',
  });
});

// POST /v1/dummy/phone
dummyRoutes.post('/phone', async (c) => {
  let body: { count?: number } = {};
  try {
    body = await c.req.json().catch(() => ({}));
  } catch {
    // empty body is fine
  }

  const count = Math.min(body.count || 1, 100);
  const results = [];
  for (let i = 0; i < count; i++) results.push(dummyPhone());

  return c.json(ok({
    count,
    phones: results,
    disclaimer: 'Nomor dummy untuk testing saja — BUKAN nomor asli.',
  }), 200, {
    'Cache-Control': 'no-store',
  });
});

// POST /v1/dummy/npwp
dummyRoutes.post('/npwp', async (c) => {
  let body: { count?: number } = {};
  try {
    body = await c.req.json().catch(() => ({}));
  } catch {
    // empty body is fine
  }

  const count = Math.min(body.count || 1, 100);
  const results = [];
  for (let i = 0; i < count; i++) results.push(dummyNpwp());

  return c.json(ok({
    count,
    npwps: results,
    disclaimer: 'NPWP dummy untuk testing saja — BUKAN NPWP asli yang terdaftar di DJP.',
  }), 200, {
    'Cache-Control': 'no-store',
  });
});
