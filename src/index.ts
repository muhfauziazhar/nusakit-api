import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';

import type { Env } from './types.js';
import { wilayahRoutes } from './routes/wilayah.js';
import { nikRoutes } from './routes/nik.js';
import { npwpRoutes } from './routes/npwp.js';
import { phoneRoutes } from './routes/phone.js';
import { rupiahRoutes } from './routes/rupiah.js';
import { bankRoutes } from './routes/bank.js';
import { dummyRoutes } from './routes/dummy.js';
import { qrisRoutes } from './routes/qris.js';
import { landingPage } from './landing.js';

const app = new Hono<{ Bindings: Env }>();

// ─── Global Middleware ───────────────────────────────────────
app.use('*', logger());
app.use('*', prettyJSON());
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type'],
}));

// ─── Landing Page ────────────────────────────────────────────
app.get('/', landingPage);

// ─── Health Check ────────────────────────────────────────────
app.get('/health', (c) => c.json({
  status: 'ok',
  service: 'nusakit-api',
  timestamp: new Date().toISOString(),
}));

// ─── API Routes ──────────────────────────────────────────────
app.route('/v1/wilayah', wilayahRoutes);
app.route('/v1/nik', nikRoutes);
app.route('/v1/npwp', npwpRoutes);
app.route('/v1/phone', phoneRoutes);
app.route('/v1/rupiah', rupiahRoutes);
app.route('/v1/bank', bankRoutes);
app.route('/v1/dummy', dummyRoutes);
app.route('/v1/qris', qrisRoutes);

// ─── OpenAPI Spec ────────────────────────────────────────────
app.get('/openapi.json', (c) => {
  return c.json({
    openapi: '3.1.0',
    info: {
      title: 'Nusakit API',
      version: '1.0.0',
      description: 'Indonesian Data Validation API — NIK, NPWP, Phone, Rupiah, Bank, Wilayah & Kode Pos',
      contact: { name: 'Muhammad Fauzi Azhar', url: 'https://github.com/muhfauziazhar' },
      license: { name: 'MIT', url: 'https://opensource.org/licenses/MIT' },
    },
    servers: [
      { url: 'https://nusakit.my.id', description: 'Production' },
      { url: 'http://localhost:8787', description: 'Local Development' },
    ],
    paths: {
      '/v1/wilayah/provinces': { get: { tags: ['Wilayah'], summary: 'List all provinces', parameters: [{ name: 'q', in: 'query', schema: { type: 'string' }, description: 'Search by name' }] } },
      '/v1/wilayah/provinces/{code}': { get: { tags: ['Wilayah'], summary: 'Get province by code', parameters: [{ name: 'code', in: 'path', required: true, schema: { type: 'string' } }] } },
      '/v1/wilayah/regencies/{provinceCode}': { get: { tags: ['Wilayah'], summary: 'List regencies in a province' } },
      '/v1/wilayah/districts/{regencyCode}': { get: { tags: ['Wilayah'], summary: 'List districts in a regency' } },
      '/v1/wilayah/villages/{districtCode}': { get: { tags: ['Wilayah'], summary: 'List villages in a district' } },
      '/v1/wilayah/search': { get: { tags: ['Wilayah'], summary: 'Search any region by name', parameters: [{ name: 'q', in: 'query', required: true, schema: { type: 'string' } }, { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } }] } },
      '/v1/nik/validate': { post: { tags: ['NIK'], summary: 'Validate and parse NIK', requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { nik: { type: 'string' } }, required: ['nik'] } } } } } },
      '/v1/npwp/validate': { post: { tags: ['NPWP'], summary: 'Validate NPWP' } },
      '/v1/phone/validate': { post: { tags: ['Phone'], summary: 'Validate Indonesian phone number' } },
      '/v1/rupiah/format': { get: { tags: ['Rupiah'], summary: 'Format number to Rupiah', parameters: [{ name: 'amount', in: 'query', required: true, schema: { type: 'number' } }] } },
      '/v1/rupiah/terbilang': { get: { tags: ['Rupiah'], summary: 'Convert number to Indonesian words' } },
      '/v1/bank': { get: { tags: ['Bank'], summary: 'List all banks' } },
      '/v1/bank/{code}': { get: { tags: ['Bank'], summary: 'Get bank by code' } },
      '/v1/qris/convert': { post: { tags: ['QRIS'], summary: 'Convert static QRIS to dynamic with amount and optional fee', requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { qris: { type: 'string' }, amount: { type: 'number' }, feeType: { type: 'string', enum: ['rupiah', 'percent'] }, feeValue: { type: 'number' } }, required: ['qris', 'amount'] } } } } } },
      '/v1/qris/parse': { post: { tags: ['QRIS'], summary: 'Parse QRIS payload info', requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { qris: { type: 'string' } }, required: ['qris'] } } } } } },
    },
  });
});

// ─── 404 Handler ─────────────────────────────────────────────
app.notFound((c) => c.json({ success: false, error: 'Not Found', path: c.req.path }, 404));

// ─── Error Handler ───────────────────────────────────────────
app.onError((err, c) => {
  console.error(err);
  return c.json({ success: false, error: 'Internal Server Error', message: err.message }, 500);
});

export default app;
