import { createClient, type Client } from "@libsql/client";
import {
  TIME_HOURS_MAX,
  TIME_HOURS_MIN,
  otherTextKey,
  questions,
  scoreAnswers,
  type AnswerMap,
  type Question,
} from "@/data/quiz";

/** Tope del texto libre de “Otro”. El resto se descarta. */
export const QUIZ_FREE_TEXT_MAX = 60;

/**
 * Misma forma que db/schema.sql. Se aplica en el primer insert
 * (CREATE TABLE IF NOT EXISTS) por si la base todavía no tiene la tabla.
 */
const SCHEMA_STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS quiz_responses (
    id TEXT PRIMARY KEY,
    created_at TEXT NOT NULL,
    answers TEXT NOT NULL,
    score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
    stars INTEGER NOT NULL CHECK (stars >= 1 AND stars <= 5)
  )`,
  `CREATE INDEX IF NOT EXISTS quiz_responses_created_at_idx
    ON quiz_responses (created_at)`,
] as const;

/** Opciones que, en el cuestionario, no se pueden combinar con otras. */
const EXCLUSIVE_OPTION_IDS = new Set(["none", "local"]);

const MAX_MULTI_VALUES = 32;

export type StoredQuizResponse = {
  answers: AnswerMap;
  score: number;
  stars: number;
};

/** ISO-8601 UTC truncado a la hora. No es el instante exacto del envío. */
export function hourBucketIso(now = new Date()): string {
  const bucket = new Date(now.getTime());
  bucket.setUTCMinutes(0, 0, 0);
  return bucket.toISOString();
}

function limitFreeText(value: string): string {
  const cleaned = value
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return Array.from(cleaned).slice(0, QUIZ_FREE_TEXT_MAX).join("");
}

/**
 * Deja solo ids de pregunta y de opción conocidos.
 * El texto de “Otro” se recorta. Las preguntas que el quiz saltea no se guardan.
 * Devuelve null si el envío no es un cuestionario completo.
 */
export function sanitizeQuizAnswers(input: unknown): AnswerMap | null {
  if (!isPlainObject(input)) return null;

  let answers: AnswerMap = {};
  for (const question of questions) {
    answers = { ...answers, ...sanitizeQuestion(question, input) };
  }

  for (const question of questions) {
    if (!question.skipIf?.(answers)) continue;
    delete answers[question.id];
    delete answers[otherTextKey(question.id)];
  }

  if (!isComplete(answers)) return null;
  return answers;
}

export function buildQuizResponse(input: unknown): StoredQuizResponse | null {
  const answers = sanitizeQuizAnswers(input);
  if (!answers) return null;
  const scored = scoreAnswers(answers);
  return { answers, score: scored.score, stars: scored.stars };
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function sanitizeQuestion(
  question: Question,
  raw: Record<string, unknown>,
): AnswerMap {
  if (question.type === "hours") {
    const hours = parseHours(raw[question.id]);
    if (hours === null) return {};
    return { [question.id]: String(hours) };
  }

  const allowed = new Set(question.options.map((option) => option.id));
  let selected: string[] = [];

  if (question.type === "multi") {
    const value = raw[question.id];
    if (!Array.isArray(value) || value.length > MAX_MULTI_VALUES) return {};
    const picked = new Set<string>();
    for (const item of value) {
      if (typeof item === "string" && allowed.has(item)) picked.add(item);
    }
    if (picked.size === 0) return {};
    const exclusive = question.options.find(
      (option) => EXCLUSIVE_OPTION_IDS.has(option.id) && picked.has(option.id),
    );
    selected = exclusive
      ? [exclusive.id]
      : question.options
          .map((option) => option.id)
          .filter((id) => picked.has(id));
  } else {
    const value = raw[question.id];
    if (typeof value !== "string" || !allowed.has(value)) return {};
    selected = [value];
  }

  const answers: AnswerMap = {
    [question.id]: question.type === "multi" ? selected : selected[0],
  };

  const textOption = question.options.find((option) => option.customText);
  if (!textOption || !selected.includes(textOption.id)) return answers;

  const textValue = raw[otherTextKey(question.id)];
  const text = typeof textValue === "string" ? limitFreeText(textValue) : "";
  if (text.length > 0) answers[otherTextKey(question.id)] = text;
  return answers;
}

function parseHours(value: unknown): number | null {
  if (typeof value !== "string" && typeof value !== "number") return null;
  const text = String(value).trim();
  if (!/^\d+$/.test(text)) return null;
  const hours = Number(text);
  if (hours < TIME_HOURS_MIN || hours > TIME_HOURS_MAX) return null;
  return hours;
}

function isComplete(answers: AnswerMap): boolean {
  for (const question of questions) {
    if (question.skipIf?.(answers)) continue;
    const value = answers[question.id];
    const selected = Array.isArray(value)
      ? value
      : typeof value === "string"
        ? [value]
        : [];
    if (selected.length === 0) return false;

    const missingRequiredText = question.options.some((option) => {
      if (!option.customText || option.customTextOptional) return false;
      if (!selected.includes(option.id)) return false;
      const text = answers[otherTextKey(question.id)];
      return typeof text !== "string" || text.length === 0;
    });
    if (missingRequiredText) return false;
  }
  return true;
}

let cachedClient: { url: string; token: string; client: Client } | null = null;
let schemaReady: Promise<void> | null = null;

function getClient(): Client | null {
  const url = process.env.TURSO_DATABASE_URL?.trim() ?? "";
  const token = process.env.TURSO_AUTH_TOKEN?.trim() ?? "";
  if (!url || !token) return null;
  if (
    !cachedClient ||
    cachedClient.url !== url ||
    cachedClient.token !== token
  ) {
    cachedClient = { url, token, client: createClient({ url, authToken: token }) };
    schemaReady = null;
  }
  return cachedClient.client;
}

function ensureSchema(client: Client): Promise<void> {
  if (!schemaReady) {
    schemaReady = client
      .batch([...SCHEMA_STATEMENTS], "write")
      .then(() => undefined)
      .catch((error: unknown) => {
        schemaReady = null;
        throw error;
      });
  }
  return schemaReady;
}

export type StoreQuizResult = "stored" | "skipped" | "invalid" | "failed";

/**
 * Inserta una fila o no hace nada si faltan las credenciales.
 * No registra el cuerpo ni datos de la request.
 */
export async function storeQuizResponse(
  input: unknown,
): Promise<StoreQuizResult> {
  const response = buildQuizResponse(input);
  if (!response) return "invalid";

  const client = getClient();
  if (!client) return "skipped";

  try {
    await ensureSchema(client);
    await client.execute({
      sql: `INSERT INTO quiz_responses (id, created_at, answers, score, stars)
            VALUES (?, ?, ?, ?, ?)`,
      args: [
        crypto.randomUUID(),
        hourBucketIso(),
        JSON.stringify(response.answers),
        response.score,
        response.stars,
      ],
    });
    return "stored";
  } catch {
    return "failed";
  }
}
