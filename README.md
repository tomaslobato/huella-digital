# Huella Digital

Experiencia web de concientización sobre privacidad: respondés un cuestionario y recibís una puntuación de **1 a 5 estrellas**, tips según cada respuesta, tutorial del celular y consejos sobre fotos e IA.

## Flujo

1. **Landing** — qué es la huella digital y *Empezar test*.
2. **Cuestionario** (pasos dinámicos):
   - Redes que usás y tiempo diario
   - Si publicás tu vida, qué tipo de posts, cada cuánto y quién los ve
   - Cómo iniciás sesión
   - Android / iPhone / otro (+ tutorial de ajustes)
   - Dónde guardás fotos (Google Fotos, iCloud, etc.)
   - Uso de IA: frecuencia, para qué, si le contás lo personal
3. **Resultado** — estrellas (1–2 terrible, 3 promedio, 4–5 muy buen nivel), tips por sección y tutorial.

Nada se guarda ni se envía: corre solo en el navegador.

## Stack

- Next.js (App Router) + React + TypeScript
- Tailwind CSS + shadcn/ui

## Cómo correrlo

Requiere [pnpm](https://pnpm.io/installation).

```bash
pnpm install
pnpm dev --port 4321
```

Abrí [http://127.0.0.1:4321](http://127.0.0.1:4321).

```bash
pnpm build
pnpm start --port 4321
```

## Nota

La puntuación es orientativa. Políticas y menús de cada app/sistema cambian: verificá siempre los centros oficiales de privacidad.
