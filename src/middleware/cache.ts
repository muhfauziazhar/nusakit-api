/**
 * KV Cache middleware for Hono.
 * Caches GET responses in Cloudflare KV with configurable TTL.
 */

import type { Context, Next } from 'hono';

interface CacheOptions {
  /** KV binding name */
  kvBinding: string;
  /** Cache TTL in seconds. Default: 86400 (24h) */
  ttl?: number;
  /** Key prefix. Default: 'cache:' */
  prefix?: string;
}

/**
 * Generate a cache key from the request URL.
 */
function cacheKey(prefix: string, url: string): string {
  // Normalize URL: remove origin, keep path + query
  const u = new URL(url);
  return `${prefix}${u.pathname}${u.search}`;
}

/**
 * KV cache middleware — only caches GET requests.
 * Usage:
 *   app.get('/provinces', kvCache('provinces:all', 86400), handler);
 */
export function kvCache(key: string, ttl: number = 86400) {
  return async (c: Context, next: Next) => {
    const kv = (c.env as any).KV as KVNamespace | undefined;

    // Try cache first
    if (kv) {
      const cached = await kv.get(`cache:${key}`, 'json');
      if (cached) {
        return c.json(cached, 200, {
          'X-Cache': 'HIT',
          'Cache-Control': `public, max-age=${Math.min(ttl, 3600)}`,
        });
      }
    }

    // Cache miss — run handler
    await next();

    // Store response in KV if successful
    if (kv && c.res.status === 200) {
      try {
        const body = await c.res.clone().json();
        await kv.put(`cache:${key}`, JSON.stringify(body), {
          expirationTtl: ttl,
        });
        c.res.headers.set('X-Cache', 'MISS');
      } catch {
        // Ignore serialization errors
      }
    }
  };
}

/**
 * Invalidate a cache key.
 */
export async function invalidateCache(kv: KVNamespace, key: string) {
  await kv.delete(`cache:${key}`);
}
