/**
 * Tope corto en memoria del proceso. La clave no se escribe en la base,
 * en logs ni en ningún otro lado, y desaparece cuando el proceso termina.
 */
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 8;
const MAX_KEYS = 1_000;

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export function allowRequest(key: string, now = Date.now()): boolean {
  if (buckets.size > MAX_KEYS) {
    for (const [storedKey, bucket] of buckets) {
      if (bucket.resetAt <= now) buckets.delete(storedKey);
    }
    if (buckets.size > MAX_KEYS) buckets.clear();
  }

  const current = buckets.get(key);
  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (current.count >= MAX_PER_WINDOW) return false;
  current.count += 1;
  return true;
}

/**
 * IP que pone la plataforma (x-real-ip), no el primer valor de
 * x-forwarded-for, que el cliente puede falsificar. Solo vive en memoria.
 */
export function requestRateKey(request: Request): string {
  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp.slice(0, 64);

  const forwarded = request.headers.get("x-forwarded-for");
  const hops = forwarded
    ?.split(",")
    .map((hop) => hop.trim())
    .filter(Boolean);
  const lastHop = hops?.at(-1);
  if (lastHop) return lastHop.slice(0, 64);

  return "local";
}
