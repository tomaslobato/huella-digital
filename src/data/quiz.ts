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
    hint: "Cuantas más usás, más se agranda tu huella digital.",
    type: "multi",
    options: [
      { id: "instagram", label: "Instagram", impact: -3 },
      { id: "tiktok", label: "TikTok", impact: -4 },
      { id: "youtube", label: "YouTube", impact: -3 },
      { id: "x", label: "X (Twitter)", impact: -3 },
      { id: "facebook", label: "Facebook", impact: -3 },
      { id: "whatsapp", label: "WhatsApp", impact: 0 },
      { id: "telegram", label: "Telegram", impact: 0 },
      { id: "reddit", label: "Reddit", impact: -3 },
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
        impact: -5,
      },
      {
        id: "apple",
        label: "Con Apple (Sign in with Apple)",
        impact: -2,
      },
      {
        id: "facebook",
        label: "Con Facebook / Meta",
        impact: -6,
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
      { id: "gmail", label: "Gmail", impact: -2 },
      { id: "outlook", label: "Outlook / Hotmail", impact: -2 },
      { id: "yahoo", label: "Yahoo Mail", impact: -2 },
      { id: "icloud-mail", label: "iCloud Mail", impact: -2 },
      { id: "proton", label: "Proton Mail", impact: 5 },
      { id: "tuta", label: "Tuta", impact: 5 },
      { id: "other", label: "Otro", impact: 0 },
    ],
  },
  {
    id: "phone",
    title: "¿Qué celular usás?",
    type: "single",
    options: [
      { id: "iphone", label: "iPhone", impact: 0 },
      { id: "samsung", label: "Samsung", impact: 0 },
      { id: "android-other", label: "Otro Android", impact: 0 },
    ],
  },
  {
    id: "os",
    title: "¿Qué sistema usás en la computadora?",
    type: "single",
    options: [
      { id: "windows", label: "Windows", impact: -2 },
      { id: "macos", label: "macOS (Apple)", impact: -1 },
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
      { id: "no", label: "No", impact: 0 },
      { id: "sometimes", label: "A veces", impact: 0 },
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
      { id: "yes-heavy", label: "Sí, varias veces por día", impact: -4 },
      { id: "yes", label: "Sí, casi todos los días", impact: -3 },
      { id: "sometimes", label: "De vez en cuando", impact: 0 },
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
        impact: -1,
      },
      {
        id: "ideas",
        label: "Ideas, lluvia de ideas o entretenimiento",
        impact: -2,
      },
      {
        id: "life",
        label: "Consejos de vida, salud, relaciones o dinero",
        impact: -5,
      },
      {
        id: "docs",
        label: "Pegar documentos, correos o datos de cuentas",
        impact: -6,
      },
      {
        id: "images",
        label: "Subir fotos o capturas para que las analice",
        impact: -5,
      },
      {
        id: "generate-media",
        label: "Generar imágenes, audio o video",
        impact: -3,
      },
      {
        id: "voice",
        label: "Asistentes de voz del teléfono o parlantes",
        impact: -3,
      },
      {
        id: "other",
        label: "Otro",
        impact: -2,
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
        impact: -7,
      },
      {
        id: "some",
        label: "A veces suelto datos míos sin darme cuenta",
        impact: -4,
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

export type TipPart = string | { label: string; href: string };

export type Tip = {
  from: string;
  section: string;
  parts: TipPart[];
};

/** Páginas en español que explican el término, abiertas desde el consejo. */
export const EXPLAIN = {
  nas: "https://es.wikipedia.org/wiki/Almacenamiento_conectado_en_red",
  vpn: "https://es.wikipedia.org/wiki/Red_privada_virtual",
  e2ee: "https://es.wikipedia.org/wiki/Cifrado_de_extremo_a_extremo",
  isp: "https://es.wikipedia.org/wiki/Proveedor_de_servicios_de_internet",
  metadata: "https://es.wikipedia.org/wiki/Metadato",
  /** Privacidad en la publicidad de Android (temas y anuncios del sistema). */
  adId: "https://support.google.com/android/answer/13720755?hl=es",
  /** Id. de publicidad de Windows 11. No reutilizar el enlace de Android. */
  windowsAdId:
    "https://support.microsoft.com/es-es/windows/privacy/privacy-settings-for-recommendations-offers-in-windows-11",
  diagnostics:
    "https://support.microsoft.com/es-es/windows/privacy/diagnostics-feedback-and-privacy-in-windows",
  adp: "https://support.apple.com/es-es/108756",
  tracker: "https://es.wikipedia.org/wiki/Rastreador_web",
  googleApps: "https://myaccount.google.com/connections?hl=es",
  youtubeActivity: "https://myactivity.google.com/product/youtube?hl=es",
  yahooPrivacy:
    "https://legal.yahoo.com/us/es/yahoo/privacy/advertising/index.html",
  microsoftAds:
    "https://support.microsoft.com/es-es/accounts-billing/security/personalized-ads-and-your-privacy",
} as const;

function L(label: string, href: string): TipPart {
  return { label, href };
}

export type TutorialStep = {
  title: string;
  detail: string;
  /** Explicación en español del término técnico del paso. */
  link?: { label: string; href: string };
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
  phone: "Teléfono",
  vpn: "VPN",
  os: "Computadora",
  browser: "Navegador",
  search: "Buscador",
  photos: "Tus fotos",
  "ai-daily": "Inteligencia artificial",
  "ai-how": "Inteligencia artificial",
  "ai-personal": "Inteligencia artificial",
};

function tip(from: string, parts: TipPart[], section?: string): Tip {
  return { from, section: section ?? SECTION[from] ?? from, parts };
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
    answers.email === "gmail",
    phone === "samsung" || phone === "android-other",
    photos.includes("google-photos"),
    browser === "chrome",
  ].filter(Boolean).length;
  // Cada servicio ya resta solo. El extra es solo si el ecosistema es muy cerrado.
  if (googleSignals >= 4) delta -= 2;
  else if (googleSignals >= 3) delta -= 1;

  const metaSignals = [
    networks.includes("instagram") || networks.includes("facebook"),
    logins.includes("facebook"),
  ].filter(Boolean).length;
  if (metaSignals >= 2) delta -= 1;

  const appleSignals = [
    phone === "iphone",
    os === "macos",
    logins.includes("apple"),
    photos.includes("icloud"),
    answers.email === "icloud-mail",
    browser === "safari",
  ].filter(Boolean).length;
  if (appleSignals >= 4) delta -= 1;

  const microsoftSignals = [
    os === "windows",
    answers.email === "outlook",
    photos.includes("onedrive"),
    browser === "edge",
  ].filter(Boolean).length;
  if (microsoftSignals >= 3) delta -= 1;

  if (aiDaily === "yes-heavy" || aiDaily === "yes") {
    const how = asList(answers["ai-how"]);
    const heavyHow = how.filter((id) =>
      ["life", "docs", "images", "voice"].includes(id),
    ).length;
    if (heavyHow >= 2) delta -= 1;

    const personal =
      typeof answers["ai-personal"] === "string"
        ? answers["ai-personal"]
        : "";
    if (personal === "therapist" || personal === "a-lot") delta -= 2;
    else if (personal === "some") delta -= 1;
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
      if (q.id === "networks" && !value.includes("none")) {
        const counted = ids.filter(
          (id) =>
            !(NETWORKS_EXEMPT_FROM_COUNT as readonly string[]).includes(id),
        );
        if (counted.length >= 5) raw -= 2;
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

  if (noNetworks || !lightPublish) return null;

  return "Pausá el historial y desactivá los anuncios personalizados en cada red, aunque no publiques.";
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
  "whatsapp",
  "telegram",
  "reddit",
] as const;

/** WhatsApp y Telegram no suman a la penalización por usar muchas redes. */
export const NETWORKS_EXEMPT_FROM_COUNT = ["whatsapp", "telegram"] as const;

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

  const metaNames: Record<string, string> = {
    instagram: "Instagram",
    facebook: "Facebook",
    whatsapp: "WhatsApp",
  };
  const metaApps = networkIds.filter((id) => id in metaNames);
  const hasMetaLogin = logins.includes("facebook");
  if (metaApps.length > 0 || hasMetaLogin) {
    const bits: string[] = [];
    const social = metaApps.filter((id) => id !== "whatsapp");
    if (social.length > 0) {
      bits.push(
        `Usás ${joinParts(social.map((id) => metaNames[id]))}: la actividad, las fotos, las historias y los mensajes van al mismo perfil publicitario de Meta`,
      );
    }
    if (metaApps.includes("whatsapp")) {
      bits.push(
        "Usás WhatsApp: los mensajes van cifrados, pero el número, los contactos y los metadatos quedan en Meta",
      );
    }
    if (hasMetaLogin) {
      bits.push(
        "«Continuar con Facebook» vincula otras apps a esa misma red de contactos",
      );
    }
    const metaName = metaApps.includes("whatsapp")
      ? social.length > 0
        ? "Meta (Facebook / Instagram / WhatsApp)"
        : "Meta (WhatsApp)"
      : "Meta (Facebook / Instagram)";
    dest.push({
      id: "meta",
      name: metaName,
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
  if (email === "icloud-mail") {
    appleBits.push("iCloud Mail");
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

  if (email === "yahoo") {
    dest.push({
      id: "yahoo",
      name: "Yahoo",
      note: "Yahoo Mail guarda el correo, los contactos y el contenido de los mensajes. No tiene cifrado de extremo a extremo y usa la cuenta para anuncios.",
    });
  }
  if (email === "other") {
    dest.push({
      id: "email",
      name: "Tu proveedor de correo",
      note: "El correo, los contactos y, en muchos casos, el contenido de los mensajes quedan en esa empresa.",
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
  const phone = typeof answers.phone === "string" ? answers.phone : "";
  const browser = typeof answers.browser === "string" ? answers.browser : "";
  const logins = asList(answers.login);

  if (networkIds.includes("tiktok")) {
    tips.push(
      tip("networks", [
        "Usás TikTok: Ajustes y privacidad > Privacidad. Activá Cuenta privada y desactivá Sincronizar contactos. En Anuncios, desactivá los anuncios personalizados.",
      ]),
    );
  }
  if (networkIds.includes("instagram")) {
    tips.push(
      tip("networks", [
        "Usás Instagram: Configuración y actividad > Centro de cuentas > Actividad de otras empresas. Desconectala. En Privacidad, desactivá las sugerencias a contactos.",
      ]),
    );
  }
  if (networkIds.includes("facebook")) {
    tips.push(
      tip("networks", [
        "Usás Facebook: Centro de cuentas > Actividad de otras empresas. Desconectala. En Preferencias de anuncios, desactivá los anuncios a partir de datos de socios.",
      ]),
    );
  }
  if (networkIds.includes("whatsapp")) {
    tips.push(
      tip(
        "networks",
        [
          "Usás WhatsApp: Ajustes > Privacidad. En Última vez y en línea, Foto del perfil e Info, elegí Mis contactos.",
        ],
        "Mensajería",
      ),
    );
  }
  if (networkIds.includes("telegram")) {
    tips.push(
      tip(
        "networks",
        [
          "Usás Telegram: Ajustes > Privacidad y seguridad. Desactivá Sincronizar contactos. En Número de teléfono, elegí Nadie.",
        ],
        "Mensajería",
      ),
    );
  }
  if (networkIds.includes("youtube")) {
    tips.push(
      tip("networks", [
        "Usás YouTube: entrá a ",
        L("Mi actividad de YouTube", EXPLAIN.youtubeActivity),
        ". Pausá el Historial de YouTube y activá el borrado automático.",
      ]),
    );
  }
  if (networkIds.includes("x")) {
    tips.push(
      tip("networks", [
        "Usás X: Configuración y privacidad > Privacidad y seguridad > Privacidad. Desactivá la ubicación precisa. En Preferencias de anuncios, desactivá la personalización.",
      ]),
    );
  }
  if (networkIds.includes("reddit")) {
    tips.push(
      tip("networks", [
        "Usás Reddit: Configuración > Cuenta. Desactivá Personalizar anuncios.",
      ]),
    );
  }

  if (isValidTimeAnswer(answers)) {
    const { hours } = parseTimeHours(answers);
    const cap =
      hours > 0
        ? ` Poné el tope por debajo de ${hours} ${hours === 1 ? "hora" : "horas"}.`
        : " Dejá un tope bajo.";
    const timePath =
      phone === "iphone"
        ? `Usás iPhone: Configuración > Tiempo en pantalla > Límites de tiempo.${cap}`
        : phone === "samsung"
          ? `Usás Samsung: Ajustes > Bienestar digital y controles parentales > Panel > límites de la app.${cap}`
          : `Usás Android: Configuración > Bienestar digital y controles parentales > Panel > límites de la app.${cap}`;
    tips.push(tip("time", [timePath]));
  }

  if (typeof answers.publish === "string" && answers.publish !== "") {
    const bits: string[] = [];
    if (networkIds.includes("instagram")) {
      bits.push(
        "Usás Instagram: Centro de cuentas > Preferencias de anuncios. Desactivá los anuncios personalizados.",
      );
    }
    if (networkIds.includes("facebook")) {
      bits.push(
        "Usás Facebook: Centro de cuentas > Preferencias de anuncios. Desactivá los anuncios personalizados.",
      );
    }
    if (networkIds.includes("tiktok")) {
      bits.push(
        "Usás TikTok: Anuncios: desactivá los anuncios personalizados.",
      );
    }
    if (networkIds.includes("x")) {
      bits.push(
        "Usás X: Preferencias de anuncios: desactivá la personalización.",
      );
    }
    if (networkIds.includes("youtube")) {
      bits.push(
        "Usás YouTube: Historial > pausá el historial y desactivá los anuncios personalizados.",
      );
    }
    if (bits.length === 0 && networkIds.length > 0) {
      bits.push(
        "En cada red que usás: desactivá los anuncios personalizados.",
      );
    }
    if (bits.length > 0) {
      for (const bit of bits) tips.push(tip("publish", [bit]));
    }
  }

  const postTypes = asList(answers["post-types"]);
  if (postTypes.includes("location")) {
    tips.push(
      tip("post-types", [
        "Al publicar, desactivá Agregar ubicación. En la cámara del teléfono, desactivá las etiquetas de ubicación.",
      ]),
    );
  }
  if (postTypes.includes("family")) {
    tips.push(
      tip("post-types", [
        "No etiquetes a familiares ni a menores. Al publicar, desactivá Agregar ubicación.",
      ]),
    );
  }
  if (postTypes.includes("face-routine")) {
    tips.push(
      tip("post-types", [
        "Publicá la historia en Mejores amigos, no en Público. Desactivá Guardar en el archivo de historias.",
      ]),
    );
  }
  if (postTypes.includes("work")) {
    tips.push(
      tip("post-types", [
        "Publicá el trabajo solo en la cuenta profesional. Borrá las capturas que muestren correos o tableros.",
      ]),
    );
  }
  if (postTypes.includes("opinions")) {
    tips.push(
      tip("post-types", [
        "Publicá esas opiniones en la cuenta que no tenga tu nombre ni tu foto.",
      ]),
    );
  }
  if (postTypes.length === 1 && postTypes[0] === "light") {
    tips.push(
      tip("post-types", [
        "Al publicar, desactivá las etiquetas de personas y de ubicación.",
      ]),
    );
  }

  if (logins.includes("google")) {
    tips.push(
      tip("login", [
        "Usás “Continuar con Google”: en Datos y privacidad, abrí ",
        L("Aplicaciones y servicios de terceros", EXPLAIN.googleApps),
        ". Sacá las apps que no uses.",
      ]),
    );
  }
  if (logins.includes("facebook")) {
    tips.push(
      tip("login", [
        "Usás “Continuar con Facebook”: Centro de cuentas > Tu información y permisos > Aplicaciones y sitios web. Quitá las apps que no uses.",
      ]),
    );
  }
  if (logins.includes("apple")) {
    tips.push(
      tip("login", [
        "Usás “Iniciar sesión con Apple”: Configuración > [tu nombre] > Iniciar sesión con Apple. En cada app, activá Ocultar mi correo.",
      ]),
    );
  }
  if (logins.includes("email-same")) {
    tips.push(
      tip("login", [
        "Usás el mismo correo en todos lados: no lo uses para entrar en todos los sitios. En cada alta nueva, usá un alias distinto.",
      ]),
    );
  }

  const mailFarther: TipPart[] = [
    " Si querés ir más lejos, pasate a Proton Mail: tiene ",
    L("cifrado de extremo a extremo", EXPLAIN.e2ee),
    ".",
  ];
  const positiveMail: TipPart[] = [
    "Usás Proton Mail: el correo ya va con ",
    L("cifrado de extremo a extremo", EXPLAIN.e2ee),
    ". No reenvíes los mensajes a Gmail ni a Outlook.",
  ];
  if (answers.email === "gmail") {
    tips.push(
      tip("email", [
        "Usás Gmail: Configuración > Ver toda la configuración > General. Desactivá las funciones inteligentes en Gmail, Chat y Meet, y las funciones inteligentes en otros productos de Google.",
        ...mailFarther,
      ]),
    );
  } else if (answers.email === "outlook") {
    tips.push(
      tip("email", [
        "Usás Outlook: Configuración > General > Privacidad. Desactivá las experiencias conectadas. En la cuenta Microsoft, desactivá los ",
        L("anuncios personalizados", EXPLAIN.microsoftAds),
        ".",
        ...mailFarther,
      ]),
    );
  } else if (answers.email === "yahoo") {
    tips.push(
      tip("email", [
        "Usás Yahoo Mail: en los ",
        L("controles de privacidad", EXPLAIN.yahooPrivacy),
        ", desactivá Publicidad personalizada y Análisis de las comunicaciones.",
        ...mailFarther,
      ]),
    );
  } else if (answers.email === "icloud-mail") {
    tips.push(
      tip("email", [
        "Usás iCloud Mail: Configuración > [tu nombre] > iCloud > activá la ",
        L("Protección de datos avanzada", EXPLAIN.adp),
        ".",
      ]),
    );
  } else if (answers.email === "proton") {
    tips.push(tip("email", positiveMail));
  }

  if (browser === "chrome") {
    tips.push(
      tip("browser", [
        "Usás Chrome: Configuración > Tú y Google > Sincronización y servicios de Google. Desactivá la sincronización y Ayudar a mejorar las funciones y el rendimiento de Chrome. En Privacidad y seguridad > Privacidad de los anuncios, desactivá los temas de anuncios. Si querés ir más lejos, pasate a Firefox o Brave.",
      ]),
    );
  } else if (browser === "edge") {
    tips.push(
      tip("browser", [
        "Usás Edge: Configuración > Privacidad, búsqueda y servicios. Elegí Prevención de seguimiento: Estricta. Desactivá la personalización de anuncios y la sincronización. Si querés ir más lejos, pasate a Firefox o Brave.",
      ]),
    );
  } else if (browser === "safari") {
    tips.push(
      tip("browser", [
        "Usás Safari: Configuración > Apps > Safari. Activá Impedir seguimiento entre sitios. Configuración > [tu nombre] > iCloud > activá Retransmisión privada.",
      ]),
    );
  } else if (browser === "firefox") {
    tips.push(
      tip("browser", [
        "Usás Firefox: Ajustes > Privacidad y seguridad. Elegí Protección contra ",
        L("rastreo", EXPLAIN.tracker),
        " mejorada: Estricta. Desactivá Enviar datos técnicos y de interacción a Mozilla.",
      ]),
    );
  } else if (browser === "brave") {
    tips.push(
      tip("browser", [
        "Usás Brave: Ajustes > Escudos. Dejá el bloqueo de ",
        L("rastreadores", EXPLAIN.tracker),
        " y anuncios en Agresivo.",
      ]),
    );
  } else if (browser === "other") {
    const other =
      typeof answers[otherTextKey("browser")] === "string"
        ? String(answers[otherTextKey("browser")]).trim()
        : "";
    tips.push(
      tip("browser", [
        other
          ? `Usás ${other}: desactivá la sincronización de la cuenta y el envío de datos de uso. Activá el bloqueo de `
          : "Usás otro navegador: desactivá la sincronización de la cuenta y el envío de datos de uso. Activá el bloqueo de ",
        L("rastreadores", EXPLAIN.tracker),
        ".",
      ]),
    );
  }

  const usesGoogleSearch =
    browser === "chrome" ||
    logins.includes("google") ||
    networkIds.includes("youtube");
  if (usesGoogleSearch) {
    tips.push(
      tip("search", [
        "Usás la Búsqueda de Google: en ",
        L("Mi actividad", "https://myactivity.google.com/activitycontrols?hl=es"),
        ", abrí Actividad en la Web y en aplicaciones y desactivala. Desmarcá Incluir el historial de Chrome.",
      ]),
    );
  } else if (browser === "edge") {
    tips.push(
      tip("search", [
        "Usás Bing: Edge > Configuración > Privacidad, búsqueda y servicios > Barra de direcciones y búsqueda. Desactivá las sugerencias de búsqueda y los resultados de Bing personalizados.",
      ]),
    );
  }

  if (answers.vpn === "no" || answers.vpn === "sometimes") {
    tips.push(
      tip("vpn", [
        answers.vpn === "sometimes"
          ? "Cuando la "
          : "Sin una ",
        L("VPN", EXPLAIN.vpn),
        answers.vpn === "sometimes"
          ? " está apagada, tu "
          : ", tu ",
        L("proveedor de internet", EXPLAIN.isp),
        " ve qué sitios visitás. Instalá Mullvad, Proton VPN o Surfshark y dejala conectada siempre. ",
        phone === "iphone"
          ? "En el iPhone: Configuración > General > VPN y administración de dispositivos."
          : phone === "samsung"
            ? "En el Samsung: Ajustes > Conexiones > Más ajustes de conexión > VPN."
            : "En Android: Configuración > Red e internet > VPN.",
      ]),
    );
  }

  if (answers["ai-daily"] && answers["ai-daily"] !== "no") {
    tips.push(
      tip("ai-daily", [
        "Usás inteligencia artificial: en ChatGPT, Configuración > Controles de datos > desactivá Mejorar el modelo para todos. En Gemini, Actividad de las apps de Gemini > Desactivar. Borrá los chats viejos.",
      ]),
    );

    const aiHow = asList(answers["ai-how"]);
    if (aiHow.includes("study-work") || aiHow.includes("docs")) {
      tips.push(
        tip("ai-how", [
          "Usás inteligencia artificial: antes de pegar un texto, borrá nombres, correos y números.",
        ]),
      );
    }
    if (aiHow.includes("images") || aiHow.includes("generate-media")) {
      tips.push(
        tip("ai-how", [
          "Usás inteligencia artificial: antes de subir una foto, sacale los ",
          L("metadatos", EXPLAIN.metadata),
          " y recortá documentos y caras.",
        ]),
      );
    }
    if (aiHow.includes("voice")) {
      tips.push(
        tip("ai-how", [
          "Usás inteligencia artificial: en el asistente de voz, desactivá Guardar actividad de audio y Mejorar el servicio con tus grabaciones.",
        ]),
      );
    }
    if (aiHow.includes("life") || answers["ai-personal"] === "a-lot" || answers["ai-personal"] === "therapist" || answers["ai-personal"] === "some") {
      tips.push(
        tip("ai-personal", [
          "Usás inteligencia artificial: no escribas nombre, dirección ni datos de salud. Borrá los chats que ya los tengan.",
        ]),
      );
    }
  }

  return tips;
}

/**
 * Rutas de Android de base (Pixel / Android 14–16), en el orden en que se tocan.
 * En Samsung el gestor de permisos se llama Administrador de permisos; el resto coincide.
 */
function baseAndroidSteps(skin: "stock" | "samsung"): TutorialStep[] {
  const settings = skin === "samsung" ? "Ajustes" : "Configuración";
  const permissionPath =
    skin === "samsung"
      ? `Abrí ${settings} > Seguridad y privacidad > Privacidad > Administrador de permisos (en Android de base se llama Gestor de permisos).`
      : `Abrí ${settings} > Seguridad y privacidad > Privacidad > Gestor de permisos.`;

  const steps: TutorialStep[] = [
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
        "Abrí Ajustes > Google > Todos los servicios. En Privacidad y seguridad, tocá Anuncios > Eliminar ID de publicidad y confirmá. Si no aparece, andá a Ajustes > Seguridad y privacidad > Más ajustes de privacidad > Anuncios > Eliminar ID de publicidad. Sin ese identificador, las apps no pueden seguirte para anuncios personalizados.",
      link: { label: "ID de publicidad", href: EXPLAIN.adId },
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

  if (settings === "Ajustes") return steps;
  return steps.map((step) => ({
    ...step,
    detail: step.detail.replaceAll("Ajustes >", `${settings} >`),
  }));
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
          title: "Seguimiento entre apps",
          detail:
            "Configuración > Privacidad y seguridad > Seguimiento. Desactivá “Permitir que las apps soliciten seguimiento”.",
        },
        {
          title: "Ubicación precisa",
          detail:
            "Configuración > Privacidad y seguridad > Localización. En cada app, elegí “Nunca” o “Al usar”. Desactivá la ubicación precisa, salvo en mapas.",
        },
        {
          title: "Apple ID e iCloud",
          detail:
            "Configuración > [tu nombre] > iCloud: desmarcá las apps que no necesiten sincronizar. Con iCloud+: activá Retransmisión privada y Ocultar mi correo.",
        },
        {
          title: "Protección de datos avanzada",
          detail:
            "Configuración > [tu nombre] > iCloud > Protección de datos avanzada. Activala. Cifra de extremo a extremo las fotos, la copia del iPhone y el resto de los datos de iCloud que Apple puede leer con la protección estándar.",
          link: { label: "Protección de datos avanzada", href: EXPLAIN.adp },
        },
        {
          title: "Safari anti‑rastreo",
          detail:
            "Configuración > Apps > Safari > Impedir seguimiento entre sitios. Si querés, usá la navegación privada con Face ID o Touch ID.",
        },
        {
          title: "Fotos, micrófono y contactos",
          detail:
            "En Privacidad y seguridad, dejá Fotos en “Ninguna” o “Seleccionadas” y revisá Micrófono y Contactos.",
        },
        {
          title: "Análisis y anuncios de Apple",
          detail:
            "Configuración > Privacidad y seguridad > Análisis y mejoras: desactivá Compartir análisis del iPhone. En Publicidad de Apple, desactivá Anuncios personalizados.",
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
          title: "Diagnósticos y comentarios",
          detail:
            "Configuración > Privacidad y seguridad > Diagnósticos y comentarios. Desactivá Enviar datos de diagnóstico opcionales, Ofertas personalizadas y Mejorar la entrada manuscrita y la escritura.",
          link: { label: "datos de diagnóstico", href: EXPLAIN.diagnostics },
        },
        {
          title: "ID de publicidad",
          detail:
            "Configuración > Privacidad y seguridad > Recomendaciones y ofertas. Desactivá “Permitir que las aplicaciones muestren anuncios personalizados mediante mi id. de publicidad”.",
          link: { label: "ID de publicidad", href: EXPLAIN.windowsAdId },
        },
        {
          title: "General",
          detail:
            "Privacidad y seguridad > General: desactivá las sugerencias en Configuración y el seguimiento de inicios de aplicaciones.",
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
            "Configuración del Sistema > Privacidad y seguridad. Revisá Ubicación, Cámara, Micrófono, Fotos y Contactos, y dejá solo lo imprescindible en cada app.",
        },
        {
          title: "Análisis y mejoras",
          detail:
            "Privacidad y seguridad > Análisis y mejoras: desactivá Compartir análisis de la Mac y Compartir con desarrolladores de apps.",
        },
        {
          title: "Apple ID e iCloud",
          detail:
            "Configuración del Sistema > [tu nombre] > iCloud: desmarcá las apps que no necesiten sincronizar. Con iCloud+: activá Retransmisión privada y Ocultar mi correo.",
        },
        {
          title: "Protección de datos avanzada",
          detail:
            "Configuración del Sistema > [tu nombre] > iCloud > Protección de datos avanzada. Activala.",
          link: { label: "Protección de datos avanzada", href: EXPLAIN.adp },
        },
        {
          title: "Safari anti‑rastreo",
          detail:
            "Safari > Configuración > Privacidad: activá Impedir seguimiento entre sitios. Dejá solo las extensiones que realmente usás.",
        },
        {
          title: "Anuncios de Apple",
          detail:
            "Privacidad y seguridad > Publicidad de Apple: desactivá Anuncios personalizados.",
        },
        {
          title: "Siri y dictado",
          detail:
            "Configuración del Sistema > Siri (o Apple Intelligence y Siri). Si no la usás, desactivala. Desactivá Mejorar Siri y Dictado.",
        },
      ],
    };
  }

  return null;
}

function buildPhotoAdvice(photos: string | string[] | undefined): Tip[] {
  const list = asList(photos);
  if (list.length === 0) return [];
  if (list.includes("local") && list.length === 1) return [];

  const hasGoogle = list.includes("google-photos");
  const hasIcloud = list.includes("icloud");
  const hasOnedrive = list.includes("onedrive");
  const hasOther = list.includes("other-cloud");
  const tips: Tip[] = [];
  const farther: TipPart[] = [
    " Si querés ir más lejos, guardá las fotos en un ",
    L("NAS", EXPLAIN.nas),
    " o un disco externo.",
  ];

  const clouds = [hasGoogle, hasIcloud, hasOnedrive, hasOther].filter(
    Boolean,
  ).length;
  if (clouds >= 2) {
    const parts: TipPart[] = [
      "Tenés tus fotos en más de una nube, así que más empresas tienen acceso a ellas. Quedate con una sola, la más simple, y apagá la sincronización de las otras.",
    ];
    if (hasGoogle && hasIcloud) {
      parts.push(
        " Entre Google Fotos e iCloud, quedate con iCloud y activá la ",
        L("Protección de datos avanzada", EXPLAIN.adp),
        ".",
      );
    }
    tips.push(tip("photos", parts));
  }

  if (hasGoogle) {
    tips.push(
      tip("photos", [
        "Usás Google Fotos: en Ajustes, activá “Ocultar datos de ubicación de las fotos”. Desactivá la agrupación de rostros y el historial de ubicaciones.",
        ...farther,
      ]),
    );
  }
  if (hasIcloud) {
    tips.push(
      tip("photos", [
        "Usás iCloud: Configuración > [tu nombre] > iCloud > ",
        L("Protección de datos avanzada", EXPLAIN.adp),
        ": activala. Cifra de ",
        L("extremo a extremo", EXPLAIN.e2ee),
        " las fotos y la copia de iCloud.",
        ...farther,
      ]),
    );
  }
  if (hasOnedrive) {
    tips.push(
      tip("photos", [
        "Usás OneDrive: Configuración > Cuentas > Elegir carpetas. Sacá las fotos de la sincronización. En onedrive.live.com > Configuración > Opciones, desactivá el etiquetado de fotos.",
        ...farther,
      ]),
    );
  }
  if (hasOther) {
    tips.push(
      tip("photos", [
        "Usás otra nube: en los ajustes del servicio, desactivá el análisis de fotos y el uso para mejorar el producto.",
        ...farther,
      ]),
    );
  }

  return tips;
}
