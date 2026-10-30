# Huella Digital

Experiencia web de concientización sobre privacidad: respondes un cuestionario y recibes una puntuación de **1 a 5 estrellas**, tips según cada respuesta, tutorial del celular y consejos sobre fotos e IA.

## Flujo

1. **Landing** — qué es la huella digital y *Empezar test*.
2. **Cuestionario** (pasos dinámicos):
   - Redes que usas y tiempo diario
   - Si publicas en redes (datos que guardan las plataformas)
   - Cómo inicias sesión
   - Android / iPhone / otro (+ tutorial de ajustes)
   - Dónde guardas fotos (Google Fotos, iCloud, etc.)
   - Uso de IA: frecuencia, para qué, si le cuentas lo personal
3. **Resultado** — estrellas (1 muy bajo, 2 bajo, 3 aceptable, 4 muy buen nivel, 5 excelente), tips por sección y tutorial.

Las respuestas completas se guardan de forma anónima en Turso, solo para estadísticas. Si no hay base configurada, el quiz sigue funcionando y no se guarda nada. Ver [Base de datos](#base-de-datos).

## Stack

- Next.js (App Router) + React + TypeScript
- Tailwind CSS + shadcn/ui

## Cómo correrlo

Requiere [pnpm](https://pnpm.io/installation).

```bash
pnpm install
pnpm dev --port 4321
```

Abre [http://127.0.0.1:4321](http://127.0.0.1:4321).

```bash
pnpm build
pnpm start --port 4321
```

## Base de datos

Cada quiz terminado manda las respuestas una sola vez, al llegar a la puntuación. `POST /api/responses` las valida contra los ids de `src/data/quiz.ts`, recalcula estrellas y puntaje, y descarta cualquier otro campo. No se guarda IP, user agent, cookies, referrer ni otro identificador. `created_at` se trunca a la hora UTC. El texto libre de “Otro” se recorta a 60 caracteres.

Si faltan `TURSO_DATABASE_URL` o `TURSO_AUTH_TOKEN`, la ruta responde y no escribe nada.

### Crear la base

La app ejecuta `CREATE TABLE IF NOT EXISTS` en el primer guardado. El esquema de referencia está en [`db/schema.sql`](db/schema.sql). Para crearla a mano con el [CLI de Turso](https://docs.turso.tech/cli/introduction):

```bash
turso db create huella-digital
turso db shell huella-digital < db/schema.sql
```

En Vercel, la integración de Turso del Marketplace inyecta las variables. Para copiarlas a mano:

```bash
turso db show huella-digital --url
turso db tokens create huella-digital
```

### Variables de entorno

Nombres exactos (los que define la integración):

- `TURSO_DATABASE_URL`
- `TURSO_AUTH_TOKEN`

En local, un `.env.local` que no se commitea (hay un modelo en [`.env.example`](.env.example)):

```bash
TURSO_DATABASE_URL=libsql://tu-base-tu-org.turso.io
TURSO_AUTH_TOKEN=
```

En Vercel, configúralas en Production y, si los previews también deben guardar estadísticas, en Preview. Sin ellas, ese entorno no guarda nada y el quiz no se rompe.

## Nota

La puntuación es orientativa. Políticas y menús de cada app/sistema cambian: verifica siempre los centros oficiales de privacidad.
