-- Respuestas anónimas del cuestionario Huella Digital.
-- La app también ejecuta estas sentencias (CREATE TABLE IF NOT EXISTS)
-- en el primer guardado. No agregues columnas de IP, user agent, cookies,
-- referrer ni ningún otro identificador.
--
-- created_at: hora UTC truncada, formato YYYY-MM-DDTHH:00:00.000Z.
-- answers: JSON. Claves = ids de src/data/quiz.ts, más "<pregunta>Other"
-- para el texto de "Otro" (recortado a 60 caracteres). Valores = id de
-- opción, lista de ids, u horas del día ("0"–"16").

CREATE TABLE IF NOT EXISTS quiz_responses (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  answers TEXT NOT NULL,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  stars INTEGER NOT NULL CHECK (stars >= 1 AND stars <= 5)
);

CREATE INDEX IF NOT EXISTS quiz_responses_created_at_idx
  ON quiz_responses (created_at);
