/**
 * Puntajes de tres personas de referencia.
 * Correr: pnpm score-personas
 */
import {
  questions,
  scoreAnswers,
  visibleQuestionIndexes,
  type AnswerMap,
} from "../src/data/quiz.ts";

const personas: { id: string; label: string; answers: AnswerMap }[] = [
  {
    id: "cotidiana",
    label:
      "iPhone, Gmail, fotos en iCloud, IA de vez en cuando para estudio y a veces con datos propios, sin VPN, Instagram+TikTok+YouTube+X, 2 h/día, casi no publica, login con Google, Windows, Brave",
    answers: {
      networks: ["instagram", "tiktok", "youtube", "x"],
      time: "2",
      publish: "almost-never",
      // La pregunta no se muestra si publica "casi nunca"; queda igual el caso realista.
      "post-types": ["light"],
      login: ["google"],
      email: "gmail",
      phone: "iphone",
      os: "windows",
      browser: "brave",
      vpn: "no",
      photos: ["icloud"],
      "ai-daily": "sometimes",
      "ai-how": ["study-work"],
      "ai-personal": "some",
    },
  },
  {
    id: "privada",
    label:
      "Sin redes, gestor y verificación en dos pasos, Proton Mail, iPhone, Linux, Brave, VPN siempre, fotos solo en el dispositivo, sin IA",
    answers: {
      networks: ["none"],
      login: ["manager-2fa"],
      email: "proton",
      phone: "iphone",
      os: "linux",
      browser: "brave",
      vpn: "always",
      photos: ["local"],
      "ai-daily": "no",
    },
  },
  {
    id: "expuesta",
    label:
      "Todas las redes, 8 h/día, publica a diario con ubicación y familia, Google + Facebook + misma contraseña, Gmail, Samsung, Windows, Chrome, sin VPN, tres nubes, IA como psicólogo",
    answers: {
      networks: [
        "instagram",
        "tiktok",
        "youtube",
        "x",
        "facebook",
        "reddit",
        "whatsapp",
        "telegram",
      ],
      time: "8",
      publish: "always",
      "post-types": ["face-routine", "location", "family", "work", "opinions"],
      login: ["google", "facebook", "email-same"],
      email: "gmail",
      phone: "samsung",
      os: "windows",
      browser: "chrome",
      vpn: "no",
      photos: ["google-photos", "onedrive", "other-cloud"],
      "ai-daily": "yes-heavy",
      "ai-how": ["life", "docs", "images", "voice"],
      "ai-personal": "therapist",
    },
  },
];

let failed = false;

for (const persona of personas) {
  const result = scoreAnswers(persona.answers);
  console.log(
    `${persona.id}\t${result.score}/100\t${result.stars} estrellas\t${result.label}`,
  );
  console.log(`  ${persona.label}`);
}

const cotidiana = scoreAnswers(personas[0].answers);
const privada = scoreAnswers(personas[1].answers);
const expuesta = scoreAnswers(personas[2].answers);

const missing = visibleQuestionIndexes(personas[0].answers)
  .map((i) => questions[i].id)
  .filter((id) => {
    const value = personas[0].answers[id];
    if (Array.isArray(value)) return value.length === 0;
    return typeof value !== "string" || value === "";
  });
if (missing.length > 0) {
  console.error(
    `A la persona cotidiana le faltan respuestas visibles: ${missing.join(", ")}.`,
  );
  failed = true;
}
if (cotidiana.score < 27 || cotidiana.score > 35 || cotidiana.stars !== 2) {
  console.error(
    `La persona cotidiana debería quedar en 27–35 y 2 estrellas. Salió ${cotidiana.score} (${cotidiana.stars}).`,
  );
  failed = true;
}
if (privada.stars < 5) {
  console.error(
    `La persona privada debería tener 5 estrellas. Salió ${privada.score} (${privada.stars}).`,
  );
  failed = true;
}
if (expuesta.stars !== 1) {
  console.error(
    `La persona expuesta debería tener 1 estrella. Salió ${expuesta.score} (${expuesta.stars}).`,
  );
  failed = true;
}

if (failed) process.exit(1);
