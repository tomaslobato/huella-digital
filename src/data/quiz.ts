export type AnswerMap = Record<string, string | string[]>;

export type QuestionOption = {
  id: string;
  label: string;
  impact: number;
  /** Si true, al elegirlo se pide un número de horas (1–16) */
  customHours?: boolean;
  /** Si true, al elegirlo se pide un texto libre */
  customText?: boolean;
  /** Etiqueta del input de texto libre */
  customTextLabel?: string;
  /** Placeholder del input de texto libre */
  customTextPlaceholder?: string;
};

/** Clave en AnswerMap para el texto libre de una opción “Otro”. */
export function otherTextKey(questionId: string): string {
  return `${questionId}Other`;
}

/** @deprecated usar otherTextKey("ai-how") */
export const AI_HOW_OTHER_KEY = otherTextKey("ai-how");

export type Question = {
  id: string;
  title: string;
  hint?: string;
  type: "single" | "multi" | "hours";
  options: QuestionOption[];
  /** Si devuelve true, esta pregunta se salta */
  skipIf?: (answers: AnswerMap) => boolean;
};

/** Rango del selector de horas en redes (0–16). */
export const TIME_HOURS_MIN = 0;
export const TIME_HOURS_MAX = 16;
/** @deprecated usar TIME_HOURS_MIN */
export const TIME_CUSTOM_MIN = TIME_HOURS_MIN;
/** @deprecated usar TIME_HOURS_MAX */
export const TIME_CUSTOM_MAX = TIME_HOURS_MAX;

export const questions: Question[] = [
  {
    id: "networks",
    title: "¿Qué redes sociales usás más?",
    hint: "Marcá todas las que tengas activas.",
    type: "multi",
    options: [
      { id: "instagram", label: "Instagram", impact: -7 },
      { id: "tiktok", label: "TikTok", impact: -9 },
      { id: "youtube", label: "YouTube", impact: -5 },
      { id: "x", label: "X (Twitter)", impact: -7 },
      { id: "facebook", label: "Facebook", impact: -7 },
      { id: "telegram", label: "Telegram", impact: -5 },
      { id: "reddit", label: "Reddit", impact: -4 },
      { id: "none", label: "Ninguna de estas", impact: 8 },
    ],
  },
  {
    id: "time",
    title: "¿Cuánto tiempo pasás al día en redes sociales?",
    hint: "Horas aproximadas al día.",
    type: "hours",
    skipIf: (a) => {
      const nets = Array.isArray(a.networks) ? a.networks : [];
      return nets.length === 0 || nets.includes("none");
    },
    options: [],
  },
  {
    id: "publish",
    title: "¿Con qué frecuencia subís contenido a redes?",
    hint: "Publicaciones, historias, reels… lo que las empresas guardan de vos.",
    type: "single",
    skipIf: (a) => {
      const nets = Array.isArray(a.networks) ? a.networks : [];
      return nets.length === 0 || nets.includes("none");
    },
    options: [
      {
        id: "creator",
        label: "Soy creador de contenido",
        /** Bajo si el contenido no es personal; el golpe fuerte viene de post-types. */
        impact: -5,
      },
      {
        id: "always",
        label: "Diariamente: casi todos los días publico algo",
        impact: -10,
      },
      {
        id: "sometimes",
        label: "A veces: cuando quiero compartir algo",
        impact: -6,
      },
      {
        id: "occasionally",
        label: "Ocasionalmente: solo en momentos puntuales",
        impact: -2,
      },
      {
        id: "almost-never",
        label: "Casi nunca: casi no subo nada",
        impact: 8,
      },
    ],
  },
  {
    id: "post-types",
    title: "¿Qué tipo de contenido solés subir?",
    hint: "Podés marcar varias.",
    type: "multi",
    skipIf: (a) => {
      const nets = Array.isArray(a.networks) ? a.networks : [];
      if (nets.length === 0 || nets.includes("none")) return true;
      return a.publish !== "creator" && a.publish !== "always";
    },
    options: [
      {
        id: "face-routine",
        label: "Fotos de mi cara / rutina diaria",
        impact: -6,
      },
      {
        id: "location",
        label: "Ubicación, viajes o “estoy aquí”",
        impact: -10,
      },
      {
        id: "family",
        label: "Familia, pareja o amigos identificables",
        impact: -8,
      },
      {
        id: "work",
        label: "Trabajo, oficina o clientes",
        impact: -5,
      },
      {
        id: "opinions",
        label: "Opiniones políticas / personales fuertes",
        impact: -4,
      },
      {
        id: "light",
        label: "Sin datos personales (memes, clips, arte…)",
        impact: 6,
      },
    ],
  },
  {
    id: "login",
    title: "¿Cómo solés iniciar sesión en apps y sitios?",
    hint: "Podés marcar varias.",
    type: "multi",
    options: [
      {
        id: "google",
        label: "Con Google (Continuar con Google)",
        impact: -10,
      },
      {
        id: "apple",
        label: "Con Apple (Sign in with Apple)",
        impact: -2,
      },
      {
        id: "facebook",
        label: "Con Facebook / Meta",
        impact: -12,
      },
      {
        id: "email-same",
        label: "Correo y la misma contraseña en casi todos lados",
        impact: -14,
      },
      {
        id: "email-unique",
        label: "Correo y contraseñas distintas",
        impact: 6,
      },
      {
        id: "manager",
        label: "Gestor de contraseñas",
        impact: 12,
      },
      {
        id: "manager-2fa",
        label: "Gestor de contraseñas y verificación en dos pasos, si se puede",
        impact: 16,
      },
    ],
  },
  {
    id: "email",
    title: "¿Qué correo usás?",
    hint: "La cuenta con la que leés el mail del día a día.",
    type: "single",
    options: [
      // Mismo ajuste chico: ninguno de estos es un correo privado.
      { id: "gmail", label: "Gmail", impact: -4 },
      { id: "outlook", label: "Outlook", impact: -4 },
      { id: "popular", label: "Otros populares", impact: -4 },
      { id: "private", label: "Otros privados", impact: 5 },
      { id: "proton", label: "Proton Mail", impact: 5 },
    ],
  },
  {
    id: "phone",
    title: "¿Qué celular usás?",
    type: "single",
    options: [
      { id: "iphone", label: "iPhone", impact: 1 },
      { id: "samsung", label: "Samsung", impact: 0 },
      { id: "android-other", label: "Otro Android", impact: 0 },
    ],
  },
  {
    id: "os",
    title: "¿Qué sistema usás en la computadora?",
    type: "single",
    options: [
      { id: "windows", label: "Windows", impact: -3 },
      { id: "macos", label: "macOS (Apple)", impact: 1 },
      { id: "linux", label: "Linux", impact: 4 },
    ],
  },
  {
    id: "browser",
    title: "¿Qué navegador usás más?",
    type: "single",
    options: [
      { id: "chrome", label: "Chrome", impact: -6 },
      { id: "safari", label: "Safari", impact: 2 },
      { id: "edge", label: "Edge", impact: -5 },
      { id: "brave", label: "Brave", impact: 8 },
      { id: "firefox", label: "Firefox", impact: 6 },
      {
        id: "other",
        label: "Otro",
        impact: 0,
        customText: true,
        customTextLabel: "¿Cuál?",
        customTextPlaceholder: "Ej.: Opera, Vivaldi, Orion…",
      },
    ],
  },
  {
    id: "vpn",
    title: "¿Usás una VPN?",
    hint: "Cifra el tráfico entre tu dispositivo y un servidor intermedio.",
    type: "single",
    options: [
      // Ajuste chico: Siempre suma un poco, No resta un poco.
      { id: "no", label: "No", impact: -3 },
      { id: "sometimes", label: "A veces", impact: -1 },
      { id: "always", label: "Siempre", impact: 3 },
    ],
  },
  {
    id: "photos",
    title: "¿Dónde guardás tus fotos?",
    hint: "Podés marcar varias.",
    type: "multi",
    options: [
      { id: "google-photos", label: "Google Fotos", impact: -8 },
      { id: "icloud", label: "iCloud Fotos", impact: -2 },
      { id: "onedrive", label: "OneDrive", impact: -6 },
      {
        id: "other-cloud",
        label: "Otro servicio en la nube (Dropbox…)",
        impact: -5,
      },
      {
        id: "local",
        label: "Solo en el teléfono / disco, sin nube",
        impact: 10,
      },
    ],
  },
  {
    id: "ai-daily",
    title: "¿Usás inteligencia artificial a diario?",
    hint: "ChatGPT, Gemini, Claude, Copilot, asistentes del teléfono…",
    type: "single",
    options: [
      { id: "yes-heavy", label: "Sí, varias veces por día", impact: -8 },
      { id: "yes", label: "Sí, casi todos los días", impact: -5 },
      { id: "sometimes", label: "De vez en cuando", impact: -1 },
      { id: "no", label: "Casi no / no uso", impact: 6 },
    ],
  },
  {
    id: "ai-how",
    title: "¿Para qué usás la inteligencia artificial?",
    hint: "Podés marcar varias.",
    type: "multi",
    skipIf: (a) => a["ai-daily"] === "no",
    options: [
      {
        id: "study-work",
        label: "Estudio o trabajo (textos, código, resúmenes)",
        impact: -2,
      },
      {
        id: "ideas",
        label: "Ideas, lluvia de ideas o entretenimiento",
        impact: -3,
      },
      {
        id: "life",
        label: "Consejos de vida, salud, relaciones o dinero",
        impact: -9,
      },
      {
        id: "docs",
        label: "Pegar documentos, correos o datos de cuentas",
        impact: -12,
      },
      {
        id: "images",
        label: "Subir fotos o capturas para que las analice",
        impact: -10,
      },
      {
        id: "generate-media",
        label: "Generar imágenes, audio o video",
        impact: -5,
      },
      {
        id: "voice",
        label: "Asistentes de voz del teléfono o parlantes",
        impact: -6,
      },
      {
        id: "other",
        label: "Otro",
        impact: -3,
        customText: true,
        customTextLabel: "Contanos para qué",
        customTextPlaceholder: "Ej.: traducir correos, planificar viajes…",
      },
    ],
  },
  {
    id: "ai-personal",
    title: "¿Le contás cosas personales a la inteligencia artificial?",
    type: "single",
    skipIf: (a) => a["ai-daily"] === "no",
    options: [
      {
        id: "therapist",
        label: "Es mi psicólogo",
        impact: -16,
      },
      {
        id: "a-lot",
        label: "Sí: nombre real, trabajo, problemas, gente cercana…",
        impact: -14,
      },
      {
        id: "some",
        label: "A veces suelto datos míos sin darme cuenta",
        impact: -8,
      },
      {
        id: "careful",
        label: "Procuro anonimizar: sin nombres ni datos sensibles",
        impact: 4,
      },
      {
        id: "never",
        label: "Nunca: solo consultas genéricas",
        impact: 10,
      },
    ],
  },
];

/** Índices de preguntas visibles según respuestas actuales */
export function visibleQuestionIndexes(answers: AnswerMap): number[] {
  return questions
    .map((q, i) => ({ q, i }))
    .filter(({ q }) => !(q.skipIf?.(answers) ?? false))
    .map(({ i }) => i);
}

export type Tip = {
  from: string;
  section: string;
  text: string;
};

export type TutorialStep = {
  title: string;
  detail: string;
};

export type UsageComparison = {
  userSocialHours: number;
  userSocialLabel: string;
  avgSocialHours: number;
  userPhoneHours: number;
  avgPhoneHours: number;
  socialDeltaHours: number;
  phoneDeltaHours: number;
  socialVerdict: string;
  phoneVerdict: string;
  blurb: string;
};

export type GuidedTutorial = {
  platform: string;
  title: string;
  intro: string;
  steps: TutorialStep[];
};

export type ScoreResult = {
  stars: number;
  score: number;
  label: string;
  summary: string;
  encouragement: string;
  comparison: UsageComparison;
  tips: Tip[];
  phoneTutorial: GuidedTutorial | null;
  osTutorial: GuidedTutorial | null;
  photoAdvice: Tip[];
  /** Destinos de datos (empresas / ecosistemas), no solo redes. */
  networksDetail: DataDestination[];
  /**
   * Aviso aparte (no viñeta) para quien publica poco o nada:
   * el consumo también alimenta a las plataformas.
   */
  networksWatchNote: string | null;
};

export const GRAPHENEOS_URL = "https://grapheneos.org/";
export const LINUX_URL = "https://ubuntu.com/desktop";

export type DataDestination = {
  id: string;
  name: string;
  note: string;
};

/**
 * Promedios orientativos diarios para Latinoamérica y España
 * (síntesis aproximada a partir de DataReportal / GWI y usos de smartphone por país).
 */
export const AVG_SOCIAL_HOURS = 3.1;
export const AVG_PHONE_HOURS = 4.6;

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export function parseTimeHours(answers: AnswerMap): {
  hours: number;
  label: string;
} {
  const raw = Number(typeof answers.time === "string" ? answers.time : NaN);
  const hours = clamp(
    Number.isFinite(raw) ? raw : 2,
    TIME_HOURS_MIN,
    TIME_HOURS_MAX,
  );
  if (hours === 0) {
    return { hours: 0, label: "casi nada / 0 horas" };
  }
  return {
    hours,
    label: `${hours} hora${hours === 1 ? "" : "s"} al día`,
  };
}

export function timeImpact(answers: AnswerMap): number {
  const { hours } = parseTimeHours(answers);
  if (hours <= 0) return 10;
  if (hours < 1) return 4;
  if (hours <= 3) return -6;
  if (hours <= 5) return -12;
  // Más horas = peor impacto (tope -22)
  return -Math.min(22, 12 + Math.round((hours - 5) * 1.5));
}

export function isValidTimeAnswer(answers: AnswerMap): boolean {
  if (typeof answers.time !== "string" || answers.time === "") return false;
  const raw = Number(answers.time);
  return (
    Number.isFinite(raw) &&
    Number.isInteger(raw) &&
    raw >= TIME_HOURS_MIN &&
    raw <= TIME_HOURS_MAX
  );
}

/** Valida preguntas con opción “Otro” + texto (single o multi). */
export function isValidOtherTextAnswer(
  answers: AnswerMap,
  questionId: string,
): boolean {
  const value = answers[questionId];
  const selected = asList(value);
  if (selected.length === 0) return false;
  if (!selected.includes("other")) return true;
  const other =
    typeof answers[otherTextKey(questionId)] === "string"
      ? String(answers[otherTextKey(questionId)]).trim()
      : "";
  return other.length > 0;
}

export function isValidAiHowAnswer(answers: AnswerMap): boolean {
  return isValidOtherTextAnswer(answers, "ai-how");
}

const SECTION: Record<string, string> = {
  networks: "Redes sociales",
  time: "Tiempo en pantallas",
  publish: "Publicaciones",
  "post-types": "Publicaciones",
  login: "Inicio de sesión",
  email: "Correo",
  phone: "Dispositivos",
  vpn: "VPN",
  os: "Dispositivos",
  browser: "Dispositivos",
  photos: "Tus fotos",
  "ai-daily": "Inteligencia artificial",
  "ai-how": "Inteligencia artificial",
  "ai-personal": "Inteligencia artificial",
};

function tip(from: string, text: string): Tip {
  return { from, section: SECTION[from] ?? from, text };
}

function asList(value: string | string[] | undefined): string[] {
  if (Array.isArray(value)) return value;
  if (typeof value === "string" && value.length > 0) return [value];
  return [];
}

/** Tipos de post que exponen identidad / vida personal. */
const PERSONAL_POST_TYPES = [
  "face-routine",
  "location",
  "family",
  "opinions",
] as const;

/**
 * Penaliza cuando varias respuestas apuntan al mismo ecosistema
 * (Google, Meta, Apple, Microsoft) o a IA intensa.
 */
function ecosystemConcentrationImpact(answers: AnswerMap): number {
  let delta = 0;
  const networks = asList(answers.networks);
  const logins = asList(answers.login);
  const photos = asList(answers.photos);
  const phone = typeof answers.phone === "string" ? answers.phone : "";
  const os = typeof answers.os === "string" ? answers.os : "";
  const aiDaily =
    typeof answers["ai-daily"] === "string" ? answers["ai-daily"] : "no";

  const browser =
    typeof answers.browser === "string" ? answers.browser : "";

  const googleSignals = [
    networks.includes("youtube"),
    logins.includes("google"),
    phone === "samsung" || phone === "android-other",
    photos.includes("google-photos"),
    browser === "chrome",
  ].filter(Boolean).length;
  if (googleSignals >= 3) delta -= 5;
  else if (googleSignals >= 2) delta -= 2;

  const metaSignals = [
    networks.includes("instagram") || networks.includes("facebook"),
    logins.includes("facebook"),
  ].filter(Boolean).length;
  if (metaSignals >= 2) delta -= 3;

  const appleSignals = [
    phone === "iphone",
    os === "macos",
    logins.includes("apple"),
    photos.includes("icloud"),
    browser === "safari",
  ].filter(Boolean).length;
  if (appleSignals >= 3) delta -= 2;

  const microsoftSignals = [
    os === "windows",
    photos.includes("onedrive"),
    browser === "edge",
  ].filter(Boolean).length;
  if (microsoftSignals >= 2) delta -= 3;

  if (aiDaily === "yes-heavy" || aiDaily === "yes") {
    const how = asList(answers["ai-how"]);
    const heavyHow = how.filter((id) =>
      ["life", "docs", "images", "voice"].includes(id),
    ).length;
    if (heavyHow >= 2) delta -= 3;

    const personal =
      typeof answers["ai-personal"] === "string"
        ? answers["ai-personal"]
        : "";
    if (personal === "therapist" || personal === "a-lot") delta -= 4;
    else if (personal === "some") delta -= 2;
  }

  return delta;
}

export function scoreAnswers(answers: AnswerMap): ScoreResult {
  let raw = 58;

  for (const q of questions) {
    if (q.skipIf?.(answers)) continue;
    const value = answers[q.id];
    if (value == null) continue;

    if (q.type === "multi" && Array.isArray(value)) {
      const ids = value.includes("none")
        ? value.filter((id) => id === "none")
        : value.filter((id) => id !== "none");
      for (const optId of ids) {
        const opt = q.options.find((o) => o.id === optId);
        if (opt) raw += opt.impact;
      }
      if (q.id === "networks" && !value.includes("none") && ids.length >= 5) {
        raw -= 5;
      }
      // Contenido personal (cara, ubicación, familia, opiniones) acumula más riesgo.
      if (q.id === "post-types") {
        const personal = ids.filter((id) =>
          (PERSONAL_POST_TYPES as readonly string[]).includes(id),
        );
        if (personal.length >= 3) raw -= 6;
        else if (personal.length >= 2) raw -= 3;
        // Creador sin datos personales: el volumen no debería hundir la nota.
        if (answers.publish === "creator" && personal.length === 0) {
          raw += 4;
        }
      }
      // Varias nubes = el mismo álbum en más empresas.
      if (q.id === "photos") {
        const clouds = ids.filter((id) => id !== "local");
        if (clouds.length >= 3) raw -= 7;
        else if (clouds.length >= 2) raw -= 4;
      }
    } else if (typeof value === "string") {
      if (q.id === "time") {
        raw += timeImpact(answers);
        continue;
      }
      const opt = q.options.find((o) => o.id === value);
      if (opt) raw += opt.impact;
    }
  }

  raw += ecosystemConcentrationImpact(answers);

  const score = Math.round(clamp(raw, 0, 100));
  const stars =
    score <= 20 ? 1 : score <= 40 ? 2 : score <= 60 ? 3 : score <= 80 ? 4 : 5;

  const labels: Record<number, string> = {
    1: "Nivel terrible de privacidad",
    2: "Nivel malo de privacidad",
    3: "Nivel promedio de privacidad",
    4: "Muy buen nivel de privacidad",
    5: "Excelente nivel de privacidad",
  };

  const summaries: Record<number, string> = {
    1: "Tu huella digital está muy expuesta. Las redes, el tipo de publicaciones, cómo entrás, el sistema, la nube o la inteligencia artificial dejan un rastro fácil de seguir.",
    2: "Hay varias puertas abiertas en tu día a día digital. Todavía estás a tiempo de cerrarlas.",
    3: "Ni tan expuesto ni tan protegido: un nivel intermedio, con margen claro para mejorar.",
    4: "Tus hábitos ya limitan bastante el rastro. Vas por un camino sólido.",
    5: "Cuidás bien qué compartís y con quién. La privacidad se nota en tus respuestas.",
  };

  const encouragements: Record<number, string> = {
    1: "Cada ajuste cuenta. Empezá por uno hoy; no hace falta que sea perfecto.",
    2: "Con un par de cambios concretos ya vas a notar la diferencia.",
    3: "Vas por buen camino. Sumá un hábito nuevo esta semana.",
    4: "Se nota que pensás antes de compartir. Seguí afinando los detalles.",
    5: "Excelente cuidado. Compartí lo que aprendiste con alguien cercano.",
  };

  const networkIds = normalizeNetworks(
    Array.isArray(answers.networks) ? answers.networks : [],
  );

  return {
    stars,
    score,
    label: labels[stars],
    summary: summaries[stars],
    encouragement: encouragements[stars],
    comparison: buildComparison(answers),
    tips: buildTips(answers, networkIds),
    phoneTutorial: buildPhoneTutorial(answers.phone),
    osTutorial: buildOsTutorial(answers.os),
    photoAdvice: buildPhotoAdvice(answers.photos),
    networksDetail: buildDestinations(answers, networkIds),
    networksWatchNote: buildNetworksWatchNote(answers, networkIds),
  };
}

function buildNetworksWatchNote(
  answers: AnswerMap,
  networkIds: string[],
): string | null {
  const noNetworks = networkIds.length === 0;
  const publish =
    typeof answers.publish === "string" ? answers.publish : "";
  const lightPublish =
    publish === "occasionally" || publish === "almost-never";

  if (!noNetworks && !lightPublish) return null;

  return "Aunque tengas un perfil anónimo o no publiques nada, estas empresas se alimentan de lo que mirás: cada video, me gusta y tiempo de scroll arma tu perfil publicitario.";
}

function buildComparison(answers: AnswerMap): UsageComparison {
  const nets = Array.isArray(answers.networks) ? answers.networks : [];
  const noSocial = nets.length === 0 || nets.includes("none");
  const social = noSocial
    ? { hours: 0, label: "Sin redes activas" }
    : parseTimeHours(answers);

  // Estimación de tiempo de pantalla: redes + margen de otras apps.
  const phonePad = noSocial
    ? 2.5
    : social.hours <= 1
      ? 1.8
      : social.hours <= 3
        ? 2.2
        : social.hours <= 5
          ? 1.6
          : 1.2;
  const userPhoneHours = Math.round((social.hours + phonePad) * 10) / 10;

  const socialDelta = Math.round((social.hours - AVG_SOCIAL_HOURS) * 10) / 10;
  const phoneDelta = Math.round((userPhoneHours - AVG_PHONE_HOURS) * 10) / 10;

  const socialVerdict = noSocial
    ? "No usás las redes del listado: menos perfil publicitario típico."
    : socialDelta <= -0.5
      ? "Estás por debajo del promedio de redes."
      : socialDelta >= 0.5
        ? "Estás por encima del promedio de redes."
        : "Estás cerca del promedio de redes.";

  const phoneVerdict =
    phoneDelta <= -0.5
      ? "Tu uso estimado de teléfono es menor al promedio."
      : phoneDelta >= 0.5
        ? "Tu uso estimado de teléfono supera al promedio."
        : "Tu uso estimado de teléfono ronda el promedio.";

  const blurb = noSocial
    ? "Sin redes activas ya reducís una gran parte del rastro. El resto de la huella sigue en cómo entrás, la nube, el dispositivo y la inteligencia artificial."
    : socialDelta >= 1.5
      ? "Cuanto más tiempo pasás en las redes, más señales juntan las plataformas sobre vos. Bajar un poco el desplazamiento ya reduce la huella."
      : socialDelta <= -1
        ? "Menos horas en redes suele significar menos perfil publicitario. Buen punto de partida."
        : "Estar cerca del promedio no es neutro: en Latinoamérica y España ese promedio ya es alto. Cualquier recorte cuenta.";

  return {
    userSocialHours: social.hours,
    userSocialLabel: social.label,
    avgSocialHours: AVG_SOCIAL_HOURS,
    userPhoneHours,
    avgPhoneHours: AVG_PHONE_HOURS,
    socialDeltaHours: socialDelta,
    phoneDeltaHours: phoneDelta,
    socialVerdict,
    phoneVerdict,
    blurb,
  };
}

const KNOWN_NETWORKS = [
  "instagram",
  "tiktok",
  "youtube",
  "x",
  "facebook",
  "telegram",
  "reddit",
] as const;

function normalizeNetworks(ids: string[]): string[] {
  if (ids.includes("none") && ids.length === 1) return [];
  return ids.filter(
    (id) => id !== "none" && (KNOWN_NETWORKS as readonly string[]).includes(id),
  );
}

function joinParts(parts: string[]): string {
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0];
  if (parts.length === 2) return `${parts[0]} y ${parts[1]}`;
  return `${parts.slice(0, -1).join(", ")} y ${parts[parts.length - 1]}`;
}

/** Empresas / ecosistemas a los que van tus datos, agrupados de forma simple. */
function buildDestinations(
  answers: AnswerMap,
  networkIds: string[],
): DataDestination[] {
  const dest: DataDestination[] = [];
  const logins = asList(answers.login);
  const photos = asList(answers.photos);
  const phone = typeof answers.phone === "string" ? answers.phone : "";
  const os = typeof answers.os === "string" ? answers.os : "";
  const browser =
    typeof answers.browser === "string" ? answers.browser : "";
  const email = typeof answers.email === "string" ? answers.email : "";
  const vpn = typeof answers.vpn === "string" ? answers.vpn : "";
  const aiDaily =
    typeof answers["ai-daily"] === "string" ? answers["ai-daily"] : "no";

  const metaApps = networkIds.filter(
    (id) => id === "instagram" || id === "facebook",
  );
  const hasMetaLogin = logins.includes("facebook");
  if (metaApps.length > 0 || hasMetaLogin) {
    const bits: string[] = [];
    if (metaApps.length > 0) {
      bits.push(
        `Usás ${joinParts(
          metaApps.map((id) => (id === "instagram" ? "Instagram" : "Facebook")),
        )}: la actividad, las fotos, las historias y los mensajes van al mismo perfil publicitario de Meta`,
      );
    }
    if (hasMetaLogin) {
      bits.push(
        "«Continuar con Facebook» vincula otras apps a esa misma red de contactos",
      );
    }
    dest.push({
      id: "meta",
      name: "Meta (Facebook / Instagram)",
      note: `${bits.join(". ")}. Los datos se cruzan entre productos Meta para anuncios y recomendaciones.`,
    });
  }

  const googleBits: string[] = [];
  if (networkIds.includes("youtube")) {
    googleBits.push(
      "YouTube (historial, búsquedas y recomendaciones viven en tu cuenta Google)",
    );
  }
  if (logins.includes("google")) {
    googleBits.push(
      "«Continuar con Google» en otras apps y sitios",
    );
  }
  if (phone === "samsung" || phone === "android-other") {
    googleBits.push(
      "Android (ubicación, apps, respaldos y servicios Google Play)",
    );
  }
  if (photos.includes("google-photos")) {
    googleBits.push(
      "Google Fotos (caras, lugares y álbumes en la nube de Google)",
    );
  }
  if (browser === "chrome") {
    googleBits.push(
      "Chrome (historial, sincronización y datos de uso ligados a tu cuenta de Google)",
    );
  }
  if (email === "gmail") {
    googleBits.push(
      "Gmail (correo, contactos y el contenido de los mensajes)",
    );
  }
  if (googleBits.length > 0) {
    dest.push({
      id: "google",
      name: "Google",
      note: `Tus datos llegan a Google por: ${joinParts(googleBits)}. Todo se concentra en la misma cuenta y alimenta anuncios, Búsqueda y YouTube.`,
    });
  }

  const appleBits: string[] = [];
  if (phone === "iphone") {
    appleBits.push("iPhone (iCloud, App Store, Siri y telemetría del dispositivo)");
  }
  if (os === "macos") {
    appleBits.push("macOS");
  }
  if (logins.includes("apple")) {
    appleBits.push("Sign in with Apple");
  }
  if (photos.includes("icloud")) {
    appleBits.push("iCloud Fotos");
  }
  if (browser === "safari") {
    appleBits.push("Safari");
  }
  if (appleBits.length > 0) {
    dest.push({
      id: "apple",
      name: "Apple",
      note: `Ecosistema Apple activo: ${joinParts(appleBits)}. Suele ser más cerrado que Google/Meta, pero sigue siendo una cuenta central con acceso a mucho de tu día a día.`,
    });
  }

  const microsoftBits: string[] = [];
  if (os === "windows") {
    microsoftBits.push(
      "Windows (datos de uso, cuenta Microsoft y sincronización del sistema)",
    );
  }
  if (photos.includes("onedrive")) {
    microsoftBits.push("OneDrive (archivos y fotos en la nube de Microsoft)");
  }
  if (browser === "edge") {
    microsoftBits.push("Edge (historial y sincronización con la cuenta Microsoft)");
  }
  if (email === "outlook") {
    microsoftBits.push("Outlook (correo y contactos en la cuenta Microsoft)");
  }
  if (microsoftBits.length > 0) {
    dest.push({
      id: "microsoft",
      name: "Microsoft",
      note: `${joinParts(microsoftBits)}. Con una cuenta Microsoft esos datos se cruzan con Outlook, Edge y, si lo usás, Copilot.`,
    });
  }

  if (networkIds.includes("tiktok")) {
    dest.push({
      id: "tiktok",
      name: "TikTok (ByteDance)",
      note: "Cada video visto entrena un perfil muy fino. Los datos pueden procesarse en infraestructura de ByteDance.",
    });
  }
  if (networkIds.includes("x")) {
    dest.push({
      id: "x",
      name: "X (Twitter)",
      note: "La línea de tiempo, los me gusta y los mensajes directos alimentan anuncios y, según la configuración, el entrenamiento de modelos.",
    });
  }
  if (networkIds.includes("telegram")) {
    dest.push({
      id: "telegram",
      name: "Telegram",
      note: "Los chats en la nube (salvo los chats secretos), los contactos y los bots pueden exponer datos. El número queda vinculado a la cuenta.",
    });
  }
  if (networkIds.includes("reddit")) {
    dest.push({
      id: "reddit",
      name: "Reddit",
      note: "Las publicaciones y los intereses del feed se usan para personalizar y para publicidad. El historial queda en la cuenta.",
    });
  }

  if (photos.includes("other-cloud")) {
    dest.push({
      id: "other-cloud",
      name: "Otras nubes (Dropbox…)",
      note: "Archivos y fotos en servicios de terceros: suelen indexar contenido y quedan atados a esa cuenta.",
    });
  }

  if (email === "popular") {
    dest.push({
      id: "email",
      name: "Proveedor de correo popular",
      note: "El correo, los contactos y, en muchos casos, el contenido de los mensajes quedan en esa empresa. No es un servicio con cifrado de extremo a extremo.",
    });
  }

  if (vpn === "no" || vpn === "sometimes") {
    dest.push({
      id: "isp",
      name: "Tu proveedor de internet (ISP)",
      note:
        vpn === "no"
          ? "Sin VPN, tus datos de navegación también llegan a tu proveedor de internet: puede ver qué sitios visitás. El dominio de cada conexión queda en sus registros, aunque el contenido HTTPS vaya cifrado."
          : "Como la VPN no está siempre activa, el resto del tiempo tus datos de navegación también llegan a tu proveedor de internet: puede ver qué sitios visitás.",
    });
  }

  if (aiDaily !== "no") {
    const intensity =
      aiDaily === "yes-heavy"
        ? "varias veces al día"
        : aiDaily === "yes"
          ? "casi todos los días"
          : "de vez en cuando";
    dest.push({
      id: "ai",
      name: "Empresas de inteligencia artificial",
      note: `Usás inteligencia artificial ${intensity}. Lo que escribís, los archivos que pegás y el contexto de la conversación van a OpenAI, Google, Anthropic, Microsoft u otros. Según la configuración de cada uno, pueden usarlos para mejorar sus modelos.`,
    });
  }

  return dest;
}

function buildTips(answers: AnswerMap, networkIds: string[]): Tip[] {
  const tips: Tip[] = [];

  if (networkIds.length > 0) {
    if (networkIds.includes("tiktok")) {
      tips.push(
        tip(
          "networks",
          "TikTok: poné la cuenta en privada, no sincronices contactos y limitá los anuncios personalizados.",
        ),
      );
    }
    if (networkIds.includes("instagram")) {
      tips.push(
        tip(
          "networks",
          "Instagram: desactivá la actividad fuera de Meta, limitá quién ve tus historias y apagá las sugerencias a contactos.",
        ),
      );
    }
    if (networkIds.includes("facebook")) {
      tips.push(
        tip(
          "networks",
          "Facebook: desactivá la actividad fuera de Meta, revisá quién puede ver tus publicaciones y apagá las sugerencias a contactos.",
        ),
      );
    }
    if (networkIds.includes("telegram")) {
      tips.push(
        tip(
          "networks",
          "Telegram: desactivá sincronizar contactos, revisá quién puede encontrarte por número y usá chats secretos para lo sensible.",
        ),
      );
    }
    if (networkIds.includes("youtube")) {
      tips.push(
        tip(
          "networks",
          "YouTube: pausá el historial en myactivity.google.com y activá el borrado automático cada 3 o 18 meses.",
        ),
      );
    }
    if (networkIds.includes("x")) {
      tips.push(
        tip(
          "networks",
          "X: sacá la ubicación de las publicaciones, limitá los mensajes directos y revisá la personalización de anuncios.",
        ),
      );
    }
    if (networkIds.includes("reddit")) {
      tips.push(
        tip(
          "networks",
          "Reddit: usá un nombre sin datos reales y apagá la personalización de anuncios. Si más adelante querés ir más lejos, evitá entrar con otra red social.",
        ),
      );
    }
  }

  if (isValidTimeAnswer(answers)) {
    const { hours } = parseTimeHours(answers);
    if (hours <= 0) {
      tips.push(
        tip(
          "time",
          "Poco tiempo en redes: menos señales para los algoritmos. Mantené los límites de pantalla.",
        ),
      );
    } else if (hours <= 1) {
      tips.push(
        tip(
          "time",
          "Una hora o menos es manejable. Evitá el scroll infinito de noche.",
        ),
      );
    } else if (hours <= 3) {
      tips.push(
        tip(
          "time",
          "1–3 horas diarias arman un perfil muy rico. Usá límites por app y apagá las notificaciones que no necesitás.",
        ),
      );
    } else if (hours <= 5) {
      tips.push(
        tip(
          "time",
          "3–5 horas: ya estás por encima del promedio de Latinoamérica y España. Probá un tope diario y dejá el teléfono fuera del dormitorio.",
        ),
      );
    } else {
      tips.push(
        tip(
          "time",
          `${hours} horas en redes es mucho rastro diario. Empezá recortando 30 minutos por día; los límites por app y la escala de grises ayudan.`,
        ),
      );
    }
  }

  switch (answers.publish) {
    case "creator":
      tips.push(
        tip(
          "publish",
          "Como creador, separá la cuenta personal de la profesional, revisá los derechos de imagen y limitá qué datos personales aparecen en la biografía, las transmisiones en vivo y las colaboraciones.",
        ),
      );
      break;
    case "always":
      tips.push(
        tip(
          "publish",
          "Publicar a diario deja un historial denso. Podés seguir publicando: bajá un poco la frecuencia y desactivá el uso de tu actividad para personalizar anuncios.",
        ),
      );
      break;
    case "sometimes":
      tips.push(
        tip(
          "publish",
          "Aunque publiques poco, los me gusta, los guardados y el tiempo de visión también cuentan. Revisá el centro de privacidad de cada red.",
        ),
      );
      break;
    case "occasionally":
      tips.push(
        tip(
          "publish",
          "Publicar de vez en cuando igual deja historial. Pedí una copia de tus datos y borrá las publicaciones viejas que ya no quieras dejar ahí.",
        ),
      );
      break;
    case "almost-never":
      tips.push(
        tip(
          "publish",
          "Casi no publicar reduce lo que la empresa guarda de tu contenido. El scroll y las interacciones siguen contando: limitá los anuncios personalizados.",
        ),
      );
      break;
  }

  {
    const postTypes = asList(answers["post-types"]);
    if (postTypes.includes("location")) {
      tips.push(
        tip(
          "post-types",
          "Los check-ins y los viajes en el momento avisan dónde estás. Seguí compartiendo lugares, pero publicalos cuando ya te fuiste.",
        ),
      );
    }
    if (postTypes.includes("family")) {
      tips.push(
        tip(
          "post-types",
          "Familia y menores en fotos: pedí consentimiento, tapá caras si hace falta y evitá colegios o direcciones de fondo.",
        ),
      );
    }
    if (postTypes.includes("face-routine")) {
      tips.push(
        tip(
          "post-types",
          "La cara y la rutina alimentan el reconocimiento y los horarios. Mezclá ángulos, evitá el mismo fondo todos los días y limitá las historias que quedan guardadas.",
        ),
      );
    }
    if (postTypes.includes("work")) {
      tips.push(
        tip(
          "post-types",
          "Trabajo y clientes en redes pueden filtrar datos de terceros. Separá la cuenta personal de la profesional y borrá las capturas que muestren correos o tableros.",
        ),
      );
    }
    if (postTypes.includes("opinions")) {
      tips.push(
        tip(
          "post-types",
          "Las opiniones fuertes quedan indexadas. Si vas a debatir, usá la cuenta que tenga menos datos personales cruzados.",
        ),
      );
    }
    if (postTypes.length === 1 && postTypes[0] === "light") {
      tips.push(
        tip(
          "post-types",
          "Solo contenido sin datos tuyos: buen criterio. Evitá que otros te etiqueten con ubicación o con la cara.",
        ),
      );
    }
  }

  {
    const logins = asList(answers.login);
    if (logins.includes("google")) {
      tips.push(
        tip(
          "login",
          "“Continuar con Google” une tu identidad entre sitios. Podés seguir usándolo: en la cuenta de Google revisá qué apps tienen acceso y sacá las que no uses. Si más adelante querés ir más lejos, creá las cuentas nuevas con un correo propio.",
        ),
      );
    }
    if (logins.includes("facebook")) {
      tips.push(
        tip(
          "login",
          "Entrar con Facebook le muestra a Meta qué otras apps usás. En la configuración de Facebook revisá las apps conectadas y sacá las que no uses. Si más adelante querés ir más lejos, pasá las cuentas importantes a un correo con contraseña propia.",
        ),
      );
    }
    if (logins.includes("apple")) {
      tips.push(
        tip(
          "login",
          "Sign in with Apple, con “ocultar mi correo”, es una buena opción. Usalo cuando te sirva y revisá en tu Apple ID qué apps quedaron vinculadas.",
        ),
      );
    }
    if (logins.includes("email-same")) {
      tips.push(
        tip(
          "login",
          "La misma contraseña en todos lados es un riesgo alto. Pasala a un gestor y activá la verificación en dos pasos en el correo.",
        ),
      );
    } else if (
      logins.includes("email-unique") &&
      !logins.includes("manager") &&
      !logins.includes("manager-2fa")
    ) {
      tips.push(
        tip(
          "login",
          "Contraseñas distintas: buen piso. Sumá un gestor y la verificación en dos pasos.",
        ),
      );
    }
    // manager-2fa: sin consejo — ya está en el mejor hábito.
    if (logins.includes("manager") && !logins.includes("manager-2fa")) {
      tips.push(
        tip(
          "login",
          "Muy bien con el gestor de contraseñas. Activá la verificación en dos pasos en el correo, los bancos y las redes cuando la app lo permita (mejor una app o una llave que el SMS).",
        ),
      );
    }
  }

  {
    const privateMail =
      "Si más adelante querés ir más lejos, Proton Mail u otro correo con cifrado de extremo a extremo es una alternativa.";
    switch (answers.email) {
      case "gmail":
        tips.push(
          tip(
            "email",
            `Podés seguir con Gmail y cerrarlo un poco: activá la verificación en dos pasos, revisá el Panel de privacidad de Google y no mandes por ahí lo más sensible. ${privateMail}`,
          ),
        );
        break;
      case "outlook":
        tips.push(
          tip(
            "email",
            `Podés seguir con Outlook y cerrarlo un poco: activá la verificación en dos pasos, revisá la privacidad de tu cuenta Microsoft y no mandes por ahí lo más sensible. ${privateMail}`,
          ),
        );
        break;
      case "popular":
        tips.push(
          tip(
            "email",
            `Podés seguir con ese correo y cerrarlo un poco: activá la verificación en dos pasos, revisá qué datos usa el proveedor para anuncios y no mandes por ahí lo más sensible. ${privateMail}`,
          ),
        );
        break;
    }
  }

  switch (answers.os) {
    case "linux":
      break;
    case "windows":
      tips.push(
        tip(
          "os",
          "En Windows desactivá la telemetría opcional y revisá Configuración > Privacidad y seguridad. Si más adelante querés ir más lejos, una cuenta local sincroniza menos con Microsoft.",
        ),
      );
      break;
    case "macos":
      tips.push(
        tip(
          "os",
          "En macOS revisá los permisos en Privacidad y seguridad, desactivá el análisis y Siri si no los usás, y dejá activo Relé privado si tenés iCloud+.",
        ),
      );
      break;
  }

  switch (answers.browser) {
    case "brave":
    case "firefox":
      break;
    case "safari":
      tips.push(
        tip(
          "browser",
          "En Safari activá Impedir seguimiento entre sitios y, si tenés iCloud+, Relé privado. Dejá solo las extensiones que realmente usás.",
        ),
      );
      break;
    case "chrome":
      tips.push(
        tip(
          "browser",
          "Podés seguir con Chrome: desactivá la sincronización si no la necesitás y limitá la telemetría en Privacidad y seguridad. Si más adelante querés ir más lejos, Firefox o Brave son una alternativa para el día a día.",
        ),
      );
      break;
    case "edge":
      tips.push(
        tip(
          "browser",
          "Podés seguir con Edge: desactivá la sincronización y la personalización en Privacidad. Si más adelante querés ir más lejos, Firefox o Brave son una alternativa.",
        ),
      );
      break;
    case "other": {
      const other =
        typeof answers[otherTextKey("browser")] === "string"
          ? String(answers[otherTextKey("browser")]).trim()
          : "";
      tips.push(
        tip(
          "browser",
          other
            ? `Con ${other} podés seguir igual: revisá la sincronización, la telemetría y el bloqueo de rastreadores. Si más adelante querés ir más lejos, evitá entrar con Google o Microsoft solo por comodidad.`
            : "En el navegador que uses, revisá la sincronización, la telemetría y sumá un bloqueador de rastreadores de confianza.",
        ),
      );
      break;
    }
  }

  if (answers.vpn === "no" || answers.vpn === "sometimes") {
    const lead =
      answers.vpn === "no"
        ? "Si no usás una VPN, tus datos de navegación también van a tu proveedor de internet (ISP): puede ver qué sitios visitás."
        : "Si la VPN solo la usás a veces, el resto del tiempo tus datos de navegación también van a tu proveedor de internet (ISP): puede ver qué sitios visitás.";
    tips.push(
      tip(
        "vpn",
        `${lead} Usá una VPN de confianza, como Proton VPN, Surfshark u otra opción segura y de buena reputación (por ejemplo, Mullvad).`,
      ),
    );
  }

  if (answers["ai-daily"] && answers["ai-daily"] !== "no") {
    switch (answers["ai-daily"]) {
      case "yes-heavy":
        tips.push(
          tip(
            "ai-daily",
            "Usarla varias veces al día acumula historial en el proveedor. Desactivá “usar chats para entrenar” si la app lo permite y borrá cada tanto los hilos que ya no necesites.",
          ),
        );
        break;
      case "yes":
        tips.push(
          tip(
            "ai-daily",
            "En el uso diario, tratala como un tercero con servidores propios. Evitá pegar secretos del trabajo o datos médicos.",
          ),
        );
        break;
      case "sometimes":
        tips.push(
          tip(
            "ai-daily",
            "El uso ocasional también deja registros. Revisá la privacidad de la herramienta que más uses.",
          ),
        );
        break;
    }

    {
      const aiHow = asList(answers["ai-how"]);
      if (aiHow.includes("study-work")) {
        tips.push(
          tip(
            "ai-how",
            "Para estudio o trabajo, sacá nombres, identificadores y datos de clientes antes de pegar un texto. Preferí ejemplos ficticios.",
          ),
        );
      }
      if (aiHow.includes("ideas")) {
        tips.push(
          tip(
            "ai-how",
            "Ideas y ocio: el riesgo es bajo si no mezclás datos reales. Recortá las capturas para que no se vean notificaciones ni correos.",
          ),
        );
      }
      if (aiHow.includes("life")) {
        tips.push(
          tip(
            "ai-how",
            "Para consejos de vida, salud o dinero, escribí en genérico y sin datos que te identifiquen. Si más adelante querés ir más lejos, lo íntimo conviene hablarlo con una persona.",
          ),
        );
      }
      if (aiHow.includes("docs")) {
        tips.push(
          tip(
            "ai-how",
            "Antes de pegar un documento o un correo, sacá nombres, números y datos de otras personas. Si el texto es confidencial, resumilo vos. Si más adelante querés ir más lejos, hay herramientas locales que no lo suben.",
          ),
        );
      }
      if (aiHow.includes("images")) {
        tips.push(
          tip(
            "ai-how",
            "Antes de subir una foto a una IA, recortá documentos y caras que no quieras mostrar y sacá los metadatos. Si la imagen es muy sensible, mejor no la subas.",
          ),
        );
      }
      if (aiHow.includes("generate-media")) {
        tips.push(
          tip(
            "ai-how",
            "Al generar imágenes o audio, no subas fotos de personas reales sin permiso y cuidá que el pedido no lleve datos que las identifiquen.",
          ),
        );
      }
      if (aiHow.includes("voice")) {
        tips.push(
          tip(
            "ai-how",
            "Los asistentes de voz escuchan el entorno. Revisá el historial de grabaciones y desactivá “mejorar el servicio” con tus audios.",
          ),
        );
      }
      if (aiHow.includes("other")) {
        const other =
          typeof answers[otherTextKey("ai-how")] === "string"
            ? String(answers[otherTextKey("ai-how")]).trim()
            : "";
        tips.push(
          tip(
            "ai-how",
            other
              ? `Sobre “${other}”: la misma regla que en el resto. Sacá nombres y documentos, y no pegues datos que no quieras dejar en el proveedor.`
              : "En cualquier otro uso, no pegues datos que te identifiquen y revisá si el proveedor entrena con tus chats.",
          ),
        );
      }
    }

    switch (answers["ai-personal"]) {
      case "a-lot":
        tips.push(
          tip(
            "ai-personal",
            "Contarle tu vida a la IA arma un archivo íntimo en el proveedor. En los chats nuevos evitá nombres y datos identificables, y borrá los hilos viejos que ya no necesites.",
          ),
        );
        break;
      case "therapist":
        tips.push(
          tip(
            "ai-personal",
            "Una IA no reemplaza a un profesional ni es confidencial. Para lo emocional, una persona es mejor; si igual la usás, no pongas datos que te identifiquen.",
          ),
        );
        break;
      case "some":
        tips.push(
          tip(
            "ai-personal",
            "Los “se me escapó” suman. Antes de enviar, reemplazá los nombres por iniciales y sacá direcciones, documento y teléfonos.",
          ),
        );
        break;
      case "careful":
        break;
      case "never":
        tips.push(
          tip(
            "ai-personal",
            "Solo consultas genéricas: excelente. Mantené esa regla aunque el chat parezca privado.",
          ),
        );
        break;
    }
  }

  const photos = asList(answers.photos);
  if (answers.phone === "iphone" && !photos.includes("icloud")) {
    tips.push(
      tip(
        "phone",
        "Si el iPhone se respalda en iCloud, activá la Protección avanzada de datos (ADP). Cifra de extremo a extremo las fotos y la mayoría de los datos de iCloud, así Apple no puede leerlos. La encontrás en Ajustes > [tu nombre] > iCloud > Protección avanzada de datos.",
      ),
    );
  }

  return tips;
}

/**
 * Rutas de Android de base (Pixel / Android 14–16), en el orden en que se tocan.
 * En Samsung el gestor de permisos se llama Administrador de permisos; el resto coincide.
 */
function baseAndroidSteps(skin: "stock" | "samsung"): TutorialStep[] {
  const permissionPath =
    skin === "samsung"
      ? "Abrí Ajustes > Seguridad y privacidad > Privacidad > Administrador de permisos (en Android de base se llama Gestor de permisos)."
      : "Abrí Ajustes > Seguridad y privacidad > Privacidad > Gestor de permisos.";

  return [
    {
      title: "Gestor de permisos",
      detail: `${permissionPath} Tocá Ubicación, después Contactos, Micrófono, Cámara, Fotos y videos y SMS. En cada lista, entrá a las apps que no necesitan ese dato y elegí No permitir. En Ubicación, dejá “Permitir solo si la aplicación está en uso” o “Preguntar siempre”, y desactivá la ubicación precisa salvo en mapas.`,
    },
    {
      title: "Ubicación del teléfono",
      detail:
        "Abrí Ajustes > Ubicación. Si no la necesitás encendida siempre, desactivá Usar ubicación. Si la dejás activa, tocá Permisos de ubicación de las aplicaciones y aplicá el mismo criterio del paso anterior. Después entrá a Ajustes > Ubicación > Servicios de ubicación y desactivá Precisión de la ubicación (Mejorar la precisión de la ubicación), Escaneo de Wi‑Fi y Escaneo de Bluetooth.",
    },
    {
      title: "Cronología y actividad de Google",
      detail:
        "Abrí Ajustes > Google > Gestionar tu cuenta de Google > Datos y privacidad > Configuración del historial. Tocá Cronología (antes, Historial de ubicaciones) y desactivala; si ofrece borrar las visitas guardadas, confirmá. Volvé, tocá Actividad en la Web y en Aplicaciones y elegí Desactivar (o Desactivar y eliminar actividad). Desmarcá “Incluir el historial de Chrome y la actividad de sitios, aplicaciones y dispositivos que usan los servicios de Google” y “Incluir actividad de voz y audio”.",
    },
    {
      title: "Eliminar el ID de publicidad",
      detail:
        "Abrí Ajustes > Seguridad y privacidad > Privacidad > Controles de privacidad > Anuncios. Tocá Eliminar ID de publicidad y confirmá. Si ese menú no está, andá a Ajustes > Google > Todos los servicios > Privacidad y seguridad > Anuncios > Eliminar ID de publicidad. Sin ese identificador, las apps no pueden seguirte para anuncios personalizados.",
    },
    {
      title: "Permisos de apps que no usás",
      detail:
        "Abrí Ajustes > Aplicaciones > Ver todas las aplicaciones. Entrá a una app que casi no abras, bajá hasta Ajustes de aplicación sin usar y activá Pausar actividad de la aplicación si no se usa. Repetilo en el resto de las apps ocasionales: Android les saca cámara, micrófono, ubicación y los demás permisos cuando pasan un tiempo sin abrirse.",
    },
    {
      title: "Cámara y micrófono",
      detail:
        "Abrí Ajustes > Seguridad y privacidad > Privacidad > Controles de privacidad. Desactivá Acceso a la cámara y Acceso al micrófono. Mientras estén apagados, ninguna app puede usarlos aunque tenga el permiso concedido. Volvé a activarlos solo para una foto, un audio o una llamada.",
    },
    {
      title: "Copia de seguridad",
      detail:
        "Abrí Ajustes > Google > Todos los servicios. En Copia de seguridad y restauración, tocá Copia de seguridad. Mirá qué se sube a tu cuenta de Google: Fotos y videos, y Datos del dispositivo (apps, SMS, contactos, historial de llamadas y ajustes). Desactivá Copia de seguridad de Google One si no querés ese respaldo, o dejala solo si la cuenta es la tuya.",
    },
    {
      title: "Localizador (Encontrar mi dispositivo)",
      detail:
        "Abrí Ajustes > Seguridad y privacidad > Localizador. Si no aparece, probá Ajustes > Seguridad > Localizador o Ajustes > Google > Todos los servicios > Localizador: en versiones anteriores se llama Encontrar mi dispositivo. Activá Permitir que se localice el dispositivo para poder hacer sonar, bloquear o borrar el teléfono si lo perdés; la ubicación queda en tu cuenta de Google. Después tocá Encontrar dispositivos sin conexión y elegí Desactivado o Sin red si no querés que participe en la red de otros Android.",
    },
    {
      title: "Pantalla de bloqueo y diagnóstico",
      detail:
        "Abrí Ajustes > Seguridad y privacidad > Más seguridad y privacidad. Tocá Notificaciones en la pantalla de bloqueo y elegí no mostrar el contenido hasta desbloquear. Volvé a esa pantalla, desactivá Uso y diagnóstico y también Personalizar con datos de apps, si está.",
    },
  ];
}

/** Ajustes que solo existen en One UI, después de los de Android de base. */
function samsungOnlySteps(): TutorialStep[] {
  return [
    {
      title: "Anuncios de Samsung",
      detail:
        "Abrí Ajustes > Seguridad y privacidad > Más ajustes de privacidad > Anuncios. Tocá Eliminar ID de publicidad y confirmá. En esa pantalla desactivá las sugerencias y la medición de anuncios, si aparecen. Este identificador es el de Samsung, aparte del de Google.",
    },
    {
      title: "Diagnóstico y personalización",
      detail:
        "Seguí en Ajustes > Seguridad y privacidad > Más ajustes de privacidad. Desactivá Enviar datos de diagnóstico. Si ves Servicio de personalización o Personalización con datos de apps, desactivalo también: manda el uso del teléfono a Samsung o a Android para armar un perfil.",
    },
    {
      title: "Cuenta Samsung",
      detail:
        "Abrí Ajustes > Cuentas y copia de seguridad > Administrar cuentas > Samsung account. Si el menú dice Cuentas y respaldo, es el mismo lugar. Tocá Sincronizar cuenta y desmarcá lo que no quieras subir: contactos, calendario, notas e Internet de Samsung.",
    },
    {
      title: "Galaxy AI",
      detail:
        "Abrí Ajustes > Galaxy AI. Si no está, andá a Ajustes > Funciones avanzadas > Inteligencia avanzada. Entrá a cada función y desactivá el procesamiento en la nube y la opción de usar tus datos para mejorar los servicios.",
    },
    {
      title: "Samsung Cloud",
      detail:
        "Abrí Ajustes > Cuentas y copia de seguridad > Samsung Cloud (o Cuentas y respaldo > Samsung Cloud). Revisá fotos, contactos y ajustes que se están sincronizando y desactivá cada ítem que no quieras en la nube de Samsung.",
    },
    {
      title: "Find My Mobile",
      detail:
        "Abrí Ajustes > Seguridad y privacidad > Protección ante dispositivos perdidos > Find My Mobile. Si no ves ese título, buscá “Find My Mobile” o “Buscar mi móvil” en el buscador de Ajustes. Activá Permitir encontrar este teléfono solo para poder recuperarlo: la ubicación queda en tu cuenta de Samsung. Revisá Enviar la última ubicación y dejala activa únicamente en esa cuenta.",
    },
    {
      title: "Carpeta segura",
      detail:
        "Abrí Ajustes > Seguridad y privacidad > Más ajustes de seguridad > Carpeta segura. Tocá Continuar, aceptá los permisos y elegí un PIN, patrón o contraseña distinto del desbloqueo del teléfono. Cuando termine, mové ahí las apps y los archivos sensibles. En One UI 8 podés ocultarla desde el ícono de Carpeta segura en los ajustes rápidos.",
    },
    {
      title: "Apps preinstaladas",
      detail:
        "Abrí Ajustes > Aplicaciones > Ver todas las aplicaciones. Entrá a cada app de Samsung o de tu operador que no uses, tocá Desinstalar y, si el sistema no deja, tocá Desactivar.",
    },
  ];
}

const PHONE_INTRO =
  "Seguí esta guía para configurar mejor tu teléfono y cuidar más tu privacidad.";

const OS_INTRO =
  "Seguí esta guía para configurar mejor tu computadora y cuidar más tu privacidad.";

function buildPhoneTutorial(
  phone: string | string[] | undefined,
): GuidedTutorial | null {
  if (phone === "iphone") {
    return {
      platform: "iphone",
      title: "iPhone",
      intro: PHONE_INTRO,
      steps: [
        {
          title: "App Tracking Transparency",
          detail:
            "Ajustes > Privacidad y seguridad > Seguimiento. Desactivá “Permitir que las apps soliciten seguimiento”.",
        },
        {
          title: "Ubicación precisa",
          detail:
            "Ajustes > Privacidad y seguridad > Localización. En cada app, elegí “Nunca” o “Al usar”. Desactivá la ubicación precisa, salvo en mapas.",
        },
        {
          title: "Apple ID e iCloud",
          detail:
            "Ajustes > [tu nombre] > iCloud: desmarcá las apps que no necesiten sincronizar. Con iCloud+: Relé privado y Ocultar mi correo.",
        },
        {
          title: "Protección avanzada de datos",
          detail:
            "Si usás iCloud para las fotos o la copia de seguridad, abrí Ajustes > [tu nombre] > iCloud > Protección avanzada de datos y activala. Cifra de extremo a extremo tus fotos y la mayoría de los datos de iCloud, así Apple no puede leerlos.",
        },
        {
          title: "Safari anti‑rastreo",
          detail:
            "Ajustes > Safari > Impedir seguimiento entre sitios. Si querés, usá la navegación privada con Face ID o Touch ID.",
        },
        {
          title: "Fotos, micrófono y contactos",
          detail:
            "En Privacidad y seguridad, dejá Fotos en “Ninguna” o “Seleccionadas” y revisá Micrófono y Contactos.",
        },
        {
          title: "Analítica y anuncios Apple",
          detail:
            "Limitá el envío de datos de análisis. En Medios y compras > Controles de anuncios, reducí la personalización.",
        },
      ],
    };
  }

  if (phone === "samsung") {
    return {
      platform: "samsung",
      title: "Samsung",
      intro:
        "Seguí los pasos en orden. Primero van los ajustes de Android de base, que también están en tu Galaxy. Después, los propios de Samsung. En cada uno está dónde tocar.",
      steps: [...baseAndroidSteps("samsung"), ...samsungOnlySteps()],
    };
  }

  if (phone === "android-other") {
    return {
      platform: "android-other",
      title: "Android",
      intro:
        "Seguí los pasos en orden. Son los menús de Android de base (Pixel y teléfonos sin capa del fabricante). En cada uno está dónde tocar.",
      steps: baseAndroidSteps("stock"),
    };
  }

  return null;
}

function buildOsTutorial(
  os: string | string[] | undefined,
): GuidedTutorial | null {
  if (os === "windows") {
    return {
      platform: "windows",
      title: "Windows",
      intro: OS_INTRO,
      steps: [
        {
          title: "Diagnósticos y telemetría",
          detail:
            "Configuración > Privacidad y seguridad > Diagnósticos y comentarios. Elegí los datos de diagnóstico necesarios y desactivá las experiencias personalizadas y la mejora de la escritura.",
        },
        {
          title: "ID de publicidad y general",
          detail:
            "Privacidad y seguridad > General: desactivá el id. de publicidad, las sugerencias en Configuración y el seguimiento de inicio de apps.",
        },
        {
          title: "Cuenta local",
          detail:
            "Podés seguir con tu cuenta Microsoft. Si más adelante querés ir más lejos, una cuenta local sincroniza menos actividad con la nube.",
        },
        {
          title: "Ubicación y permisos",
          detail:
            "Privacidad y seguridad > Ubicación: apagá el servicio si no lo necesitás, o dejalo solo en las apps que sí. Revisá también Cámara, Micrófono y Contactos.",
        },
        {
          title: "Actividad e historial",
          detail:
            "Privacidad y seguridad > Historial de actividad: desactivá el envío a Microsoft. Revisá también qué indexa la búsqueda de Windows.",
        },
        {
          title: "OneDrive y Edge",
          detail:
            "Si usás OneDrive, revisá qué carpetas se están copiando. Si no lo usás, podés pausar esa copia. En Edge, desactivá la sincronización y la personalización de anuncios. Si más adelante querés ir más lejos, Firefox o Brave son una alternativa.",
        },
      ],
    };
  }

  if (os === "macos") {
    return {
      platform: "macos",
      title: "macOS",
      intro: OS_INTRO,
      steps: [
        {
          title: "Privacidad y seguridad",
          detail:
            "Ajustes del Sistema > Privacidad y seguridad. Revisá Ubicación, Cámara, Micrófono, Fotos y Contactos, y dejá solo lo imprescindible en cada app.",
        },
        {
          title: "Análisis y mejoras",
          detail:
            "Privacidad y seguridad > Análisis y mejoras: desactivá compartir el análisis de la Mac y de las apps con Apple y los desarrolladores, si no lo querés.",
        },
        {
          title: "Apple ID e iCloud",
          detail:
            "Ajustes > [tu nombre] > iCloud: desmarcá las apps que no necesiten sincronizar. Con iCloud+: activá Relé privado y Ocultar mi correo.",
        },
        {
          title: "Protección avanzada de datos",
          detail:
            "Si usás iCloud para las fotos o la copia de seguridad, abrí Ajustes > [tu nombre] > iCloud > Protección avanzada de datos y activala. Cifra de extremo a extremo tus fotos y la mayoría de los datos de iCloud, así Apple no puede leerlos.",
        },
        {
          title: "Safari anti‑rastreo",
          detail:
            "Safari > Ajustes > Privacidad: activá Impedir seguimiento entre sitios. Dejá solo las extensiones que realmente usás.",
        },
        {
          title: "Anuncios de Apple",
          detail:
            "Privacidad y seguridad > Publicidad de Apple: desactivá los anuncios personalizados.",
        },
        {
          title: "Siri y dictado",
          detail:
            "Si no usás Siri, desactivala. Revisá Mejorar Siri y Dictado para no enviar audio a Apple.",
        },
      ],
    };
  }

  return null;
}

const PHOTO_ALT =
  "Si más adelante querés ir más lejos, una mejor alternativa es guardar la copia en un NAS o un disco externo, en vez de la nube.";

function buildPhotoAdvice(photos: string | string[] | undefined): Tip[] {
  const list = asList(photos);
  if (list.length === 0) return [];
  if (list.includes("local") && list.length === 1) return [];

  const hasGoogle = list.includes("google-photos");
  const hasIcloud = list.includes("icloud");
  const hasOnedrive = list.includes("onedrive");
  const hasOther = list.includes("other-cloud");
  const tips: Tip[] = [];

  const clouds = [hasGoogle, hasIcloud, hasOnedrive, hasOther].filter(
    Boolean,
  ).length;
  if (clouds >= 2) {
    tips.push(
      tip(
        "photos",
        "Tenés tus fotos copiadas en más de una nube, así que más empresas tienen acceso a ellas. Dejá una sola sincronización activa y apagá las otras, sin borrar nada hasta confirmar que la copia que te importa está completa.",
      ),
    );
  }

  if (hasGoogle) {
    tips.push(
      tip(
        "photos",
        `Podés seguir con Google Fotos y ajustarlo: en los ajustes activá “Ocultar datos de ubicación de las fotos” para no compartir la geolocalización al compartir álbumes; revisá cada tanto los permisos de los álbumes compartidos y bloqueá a quien no quieras; activá la verificación en dos pasos y mirá la actividad en el Panel de privacidad de Google; y, si querés limitar el rastreo, desactivá la agrupación de rostros o el historial de ubicaciones. ${PHOTO_ALT}`,
      ),
    );
  }
  if (hasIcloud) {
    tips.push(
      tip(
        "photos",
        `Podés seguir con iCloud Fotos. Activá la Protección avanzada de datos (ADP): cifra de extremo a extremo tus fotos y la mayoría de los datos de iCloud, así Apple no puede leerlos. La encontrás en Ajustes > [tu nombre] > iCloud > Protección avanzada de datos. Revisá también con quién compartís álbumes y qué apps están sincronizando. ${PHOTO_ALT}`,
      ),
    );
  }
  if (hasOnedrive) {
    tips.push(
      tip(
        "photos",
        `Podés seguir con OneDrive: revisá qué carpetas se sincronizan, sacá de los álbumes compartidos a quien no corresponda y activá la verificación en dos pasos de la cuenta Microsoft. ${PHOTO_ALT}`,
      ),
    );
  }
  if (hasOther) {
    tips.push(
      tip(
        "photos",
        `En esa otra nube, revisá los álbumes compartidos, desactivá el uso de tus fotos para mejorar el servicio si aparece esa opción y activá la verificación en dos pasos. ${PHOTO_ALT}`,
      ),
    );
  }

  if (tips.length === 0 && list.includes("local")) {
    tips.push(
      tip(
        "photos",
        `Si mezclás la nube con el teléfono, revisá que no queden álbumes viejos compartidos en un servicio que ya casi no usás. ${PHOTO_ALT}`,
      ),
    );
  }

  return tips;
}
