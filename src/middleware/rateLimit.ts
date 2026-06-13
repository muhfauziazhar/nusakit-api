/**
 * Per-IP rate limiting for Hono, backed by Cloudflare KV.
 *
 * Uses a fixed-window counter (one KV key per IP per window). KV is eventually
 * consistent and caps writes at ~1/sec per key, so this is a lightweight
 * best-effort limiter — for strict guarantees use a Durable Object or the
 * Workers Rate Limiting binding. It fails open: if KV is missing or errors,
 * the request is allowed through.
 */

import type { Context, Next } from 'hono';
import { fail } from '../types.js';

interface RateLimitOptions {
  /** Max requests allowed per window. Default: 120 */
  limit?: number;
  /** Window length in seconds. Default: 60 */
  windowSeconds?: number;
}

function clientIp(c: Context): string {
  return (
    c.req.header('CF-Connecting-IP') ||
    c.req.header('X-Forwarded-For')?.split(',')[0]?.trim() ||
    'unknown'
  );
}

export function rateLimit(options: RateLimitOptions = {}) {
  const limit = options.limit ?? 120;
  const windowSeconds = options.windowSeconds ?? 60;

  return async (c: Context, next: Next) => {
    const kv = (c.env as { KV?: KVNamespace }).KV;
    if (!kv) return next(); // fail open when KV is unavailable

    const window = Math.floor(Date.now() / 1000 / windowSeconds);
    const key = `rl:${clientIp(c)}:${window}`;

    let count = 0;
    try {
      count = Number(await kv.get(key)) || 0;
    } catch {
      return next(); // fail open on KV read errors
    }

    if (count >= limit) {
      const retryAfter = windowSeconds - (Math.floor(Date.now() / 1000) % windowSeconds);
      return c.json(fail('Terlalu banyak permintaan. Coba lagi sebentar lagi.'), 429, {
        'Retry-After': String(retryAfter),
        'X-RateLimit-Limit': String(limit),
        'X-RateLimit-Remaining': '0',
      });
    }

    // Increment in the background so we don't add latency to the response.
    c.executionCtx.waitUntil(
      kv.put(key, String(count + 1), { expirationTtl: windowSeconds + 1 }).catch(() => {})
    );

    await next();

    c.res.headers.set('X-RateLimit-Limit', String(limit));
    c.res.headers.set('X-RateLimit-Remaining', String(Math.max(0, limit - count - 1)));
  };
}
