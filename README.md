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
3. **Resultado** — estrellas (1 terrible, 2 malo, 3 promedio, 4 muy buen nivel, 5 excelente), tips por sección y tutorial.

Las respuestas se guardan de forma anónima.

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

## Nota

La puntuación es orientativa. Políticas y menús de cada app/sistema cambian: verifica siempre los centros oficiales de privacidad.
