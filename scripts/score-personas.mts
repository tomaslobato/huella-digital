/**
 * Puntajes de tres personas de referencia.
 * Correr: pnpm score-personas
 */
import { scoreAnswers, type AnswerMap } from "../src/data/quiz.ts";

const personas: { id: string; label: string; answers: AnswerMap }[] = [
  {
    id: "cotidiana",
    label:
      "iPhone, Gmail, IA de vez en cuando, sin VPN, Instagram+TikTok+YouTube+X, 2 h/día, casi no publica, login con Google, Windows, Brave",
    answers: {
      networks: ["instagram", "tiktok", "youtube", "x"],
      time: "2",
      publish: "almost-never",
      login: ["google"],
      email: "gmail",
      phone: "iphone",
      os: "windows",
      browser: "brave",
      vpn: "no",
      "ai-daily": "sometimes",
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

if (cotidiana.score < 40 || cotidiana.score > 50 || cotidiana.stars !== 3) {
  console.error(
    `La persona cotidiana debería quedar en 40–50 y 3 estrellas. Salió ${cotidiana.score} (${cotidiana.stars}).`,
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
