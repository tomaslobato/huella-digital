import { allowRequest, requestRateKey } from "@/lib/memory-rate-limit";
import { storeQuizResponse } from "@/lib/quiz-response";

const MAX_BODY_BYTES = 8 * 1024;

function empty(status: number, retryAfter?: string): Response {
  const headers = new Headers({ "Cache-Control": "no-store" });
  if (retryAfter) headers.set("Retry-After", retryAfter);
  return new Response(null, { status, headers });
}

async function readLimitedBody(request: Request): Promise<string | null> {
  const declared = request.headers.get("content-length");
  if (declared !== null) {
    const size = Number(declared);
    if (!Number.isFinite(size) || size < 0 || size > MAX_BODY_BYTES) {
      return null;
    }
  }

  if (!request.body) return "";

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    if (!value) continue;
    total += value.byteLength;
    if (total > MAX_BODY_BYTES) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }

  const body = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(body);
}

export async function POST(request: Request) {
  if (!allowRequest(requestRateKey(request))) {
    return empty(429, "60");
  }

  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return empty(415);
  }

  const text = await readLimitedBody(request);
  if (text === null) return empty(413);
  if (text.length === 0) return empty(400);

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return empty(400);
  }

  if (
    typeof parsed !== "object" ||
    parsed === null ||
    Array.isArray(parsed) ||
    !("answers" in parsed)
  ) {
    return empty(400);
  }

  const result = await storeQuizResponse(parsed.answers);
  if (result === "invalid") return empty(400);
  if (result === "failed") return empty(500);
  return empty(204);
}
