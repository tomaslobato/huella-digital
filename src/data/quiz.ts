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
    title: "¿Qué redes sociales usas más?",
    hint: "Marca todas las que tengas activas.",
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
    title: "¿Cuánto tiempo pasas al día en redes sociales?",
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
    title: "¿Con qué frecuencia le das contenido nuevo a las redes?",
    hint: "Posts, stories, reels… lo que las empresas guardan de ti.",
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
    title: "¿Qué tipo de contenido sueles subir?",
    hint: "Puedes marcar varias.",
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
    title: "¿Cómo sueles iniciar sesión en apps y sitios?",
    hint: "Puedes marcar varias.",
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
        label: "Gestor de contraseñas + 2FA si es posible",
        impact: 16,
      },
    ],
  },
  {
    id: "phone",
    title: "¿Qué tipo de celular usas?",
    type: "single",
    options: [
      { id: "iphone", label: "iPhone", impact: 1 },
      { id: "samsung", label: "Samsung", impact: 0 },
      { id: "android-other", label: "Otro Android", impact: 0 },
    ],
  },
  {
    id: "os",
    title: "¿Qué sistema usas en la computadora?",
    type: "single",
    options: [
      { id: "windows", label: "Windows", impact: -3 },
      { id: "macos", label: "macOS (Apple)", impact: 1 },
      { id: "linux", label: "Linux", impact: 4 },
    ],
  },
  {
    id: "browser",
    title: "¿Qué navegador usas más?",
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
    id: "photos",
    title: "¿Dónde guardas tus fotos?",
    hint: "Puedes marcar varias.",
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
    title: "¿Usas inteligencia artificial a diario?",
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
    title: "¿Para qué usas la inteligencia artificial?",
    hint: "Puedes marcar varias.",
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
        label: "Ideas, brainstorming o entretenimiento",
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
        customTextLabel: "Cuéntanos para qué",
        customTextPlaceholder: "Ej.: traducir correos, planificar viajes…",
      },
    ],
  },
  {
    id: "ai-personal",
    title: "¿Le cuentas cosas personales a la inteligencia artificial?",
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
  photoAdvice: Tip | null;
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
  phone: "Dispositivos",
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
    1: "Tu huella digital está muy expuesta. Redes, tipo de posts, login, sistema, nube o IA dejan un rastro fácil de seguir.",
    2: "Hay varias puertas abiertas en tu día a día digital. Todavía estás a tiempo de cerrarlas.",
    3: "Ni tan expuesto ni tan protegido: un nivel intermedio, con margen claro para mejorar.",
    4: "Tus hábitos ya limitan bastante el rastro. Vas por un camino sólido.",
    5: "Cuidas bien qué compartes y con quién. La privacidad se nota en tus respuestas.",
  };

  const encouragements: Record<number, string> = {
    1: "Cada ajuste cuenta. Empieza por uno hoy; no hace falta ser perfecto.",
    2: "Con un par de cambios concretos ya vas a notar la diferencia.",
    3: "Vas por buen camino. Suma un hábito nuevo esta semana.",
    4: "Se nota que piensas antes de compartir. Sigue afinando detalles.",
    5: "Excelente cuidado. Comparte lo aprendido con alguien cercano.",
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

  return "Aunque tengas un perfil anónimo o no publiques nada, estas empresas se alimentan de lo que miras: cada video, like y tiempo de scroll arma tu perfil publicitario.";
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
    ? "No usas las redes del listado: menos perfil publicitario típico."
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
    ? "Sin redes activas ya reduces una gran parte del rastro. El resto de la huella sigue en login, nube, dispositivo e IA."
    : socialDelta >= 1.5
      ? "Cuanto más tiempo en feeds, más señales acumulan las plataformas sobre ti. Bajar un poco el scroll ya reduce la huella."
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
        `Usas ${joinParts(
          metaApps.map((id) => (id === "instagram" ? "Instagram" : "Facebook")),
        )}: actividad, fotos, stories y mensajes van al mismo perfil publicitario de Meta`,
      );
    }
    if (hasMetaLogin) {
      bits.push(
        "«Continuar con Facebook» vincula otras apps a ese mismo grafo social",
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
      "Chrome (historial, sync y telemetría ligados a tu cuenta Google)",
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
      "Windows (telemetría, cuenta Microsoft y sync del sistema)",
    );
  }
  if (photos.includes("onedrive")) {
    microsoftBits.push("OneDrive (archivos y fotos en la nube de Microsoft)");
  }
  if (browser === "edge") {
    microsoftBits.push("Edge (historial y sync con cuenta Microsoft)");
  }
  if (microsoftBits.length > 0) {
    dest.push({
      id: "microsoft",
      name: "Microsoft",
      note: `${joinParts(microsoftBits)}. Con una cuenta Microsoft esos datos se cruzan con Outlook, Edge y, si lo usas, Copilot.`,
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
      note: "Timeline, likes y DMs alimentan anuncios y, según la configuración, entrenamiento de modelos.",
    });
  }
  if (networkIds.includes("telegram")) {
    dest.push({
      id: "telegram",
      name: "Telegram",
      note: "Chats en la nube (salvo secret chats), contactos y bots pueden exponer datos; el número queda vinculado a la cuenta.",
    });
  }
  if (networkIds.includes("reddit")) {
    dest.push({
      id: "reddit",
      name: "Reddit",
      note: "Posts e intereses del feed se usan para personalización y publicidad; el historial queda en la cuenta.",
    });
  }

  if (photos.includes("other-cloud")) {
    dest.push({
      id: "other-cloud",
      name: "Otras nubes (Dropbox…)",
      note: "Archivos y fotos en servicios de terceros: suelen indexar contenido y quedan atados a esa cuenta.",
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
      note: `Usas IA ${intensity}. Prompts, archivos pegados y contexto de conversación van a OpenAI, Google, Anthropic, Microsoft u otros proveedores — y pueden alimentar mejora de modelos según la configuración de cada uno.`,
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
          "TikTok: cuenta privada, sin sincronizar contactos y con anuncios personalizados limitados.",
        ),
      );
    }
    if (networkIds.includes("instagram")) {
      tips.push(
        tip(
          "networks",
          "Instagram: desactiva actividad fuera de Meta, limita audiencia de stories y apaga sugerencias a contactos.",
        ),
      );
    }
    if (networkIds.includes("facebook")) {
      tips.push(
        tip(
          "networks",
          "Facebook: desactiva actividad fuera de Meta, revisa audiencia de posts y apaga sugerencias a contactos.",
        ),
      );
    }
    if (networkIds.includes("telegram")) {
      tips.push(
        tip(
          "networks",
          "Telegram: desactiva sincronizar contactos, revisa quién puede encontrarte por número y usa secret chats para lo sensible.",
        ),
      );
    }
    if (networkIds.includes("youtube")) {
      tips.push(
        tip(
          "networks",
          "YouTube: pausa el historial en myactivity.google.com y activa borrado automático cada 3 o 18 meses.",
        ),
      );
    }
    if (networkIds.includes("x")) {
      tips.push(
        tip(
          "networks",
          "X: saca ubicación de posts, limita DM y revisa personalización de anuncios.",
        ),
      );
    }
    if (networkIds.includes("reddit")) {
      tips.push(
        tip(
          "networks",
          "Reddit: usuario sin datos reales, sin personalización de anuncios y sin login social si puedes.",
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
          "Poco tiempo en redes: menos señales para los algoritmos. Mantén límites de pantalla.",
        ),
      );
    } else if (hours <= 1) {
      tips.push(
        tip(
          "time",
          "Una hora o menos es manejable. Evita el scroll infinito de noche.",
        ),
      );
    } else if (hours <= 3) {
      tips.push(
        tip(
          "time",
          "1–3 horas diarias arman un perfil muy rico. Usa límites por app y apaga notificaciones no esenciales.",
        ),
      );
    } else if (hours <= 5) {
      tips.push(
        tip(
          "time",
          "3–5 horas: ya estás por encima del promedio de Latinoamérica y España. Prueba un tope diario y saca el teléfono del dormitorio.",
        ),
      );
    } else {
      tips.push(
        tip(
          "time",
          `${hours} horas en redes es muchísimo rastro diario. Empieza recortando 30 minutos por día; límites por app y escala de grises ayudan.`,
        ),
      );
    }
  }

  switch (answers.publish) {
    case "creator":
      tips.push(
        tip(
          "publish",
          "Como creador, tu perfil es un archivo público enorme. Separa cuenta personal/profesional, revisa derechos de imagen y limita qué datos personales aparecen en bio, lives y collabs.",
        ),
      );
      break;
    case "always":
      tips.push(
        tip(
          "publish",
          "Publicar a diario deja un historial denso en la plataforma (y a menudo alimenta anuncios y modelos). Baja la frecuencia y desactiva el uso de tu actividad para personalización.",
        ),
      );
      break;
    case "sometimes":
      tips.push(
        tip(
          "publish",
          "Aunque publiques poco, likes, guards y tiempo de visión también son datos para la empresa. Revisa el centro de privacidad de cada red.",
        ),
      );
      break;
    case "occasionally":
      tips.push(
        tip(
          "publish",
          "Publicar de vez en cuando igual deja historial en la empresa. Pide descarga de tus datos y borra piezas viejas que ya no quieras que existan ahí.",
        ),
      );
      break;
    case "almost-never":
      tips.push(
        tip(
          "publish",
          "Casi no publicar reduce lo que la empresa guarda de tu contenido. El scroll y las interacciones siguen contando: limita anuncios personalizados.",
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
          "Check‑ins y viajes en tiempo real avisan dónde estás (y dónde no estás en casa). Publica lugares recién cuando ya te fuiste.",
        ),
      );
    }
    if (postTypes.includes("family")) {
      tips.push(
        tip(
          "post-types",
          "Familia y menores en fotos: pide consentimiento, tapa caras si hace falta y evita colegios o direcciones de fondo.",
        ),
      );
    }
    if (postTypes.includes("face-routine")) {
      tips.push(
        tip(
          "post-types",
          "Cara + rutina alimentan reconocimiento facial y horarios. Mezcla ángulos, evita el mismo fondo todos los días y limita stories permanentes.",
        ),
      );
    }
    if (postTypes.includes("work")) {
      tips.push(
        tip(
          "post-types",
          "Trabajo y clientes en redes pueden filtrar datos de terceros. Separa cuenta personal/profesional y borra capturas con correos o tableros.",
        ),
      );
    }
    if (postTypes.includes("opinions")) {
      tips.push(
        tip(
          "post-types",
          "Opiniones fuertes quedan indexadas. Si vas a debatir, usa cuentas con menos datos personales cruzados.",
        ),
      );
    }
    if (postTypes.length === 1 && postTypes[0] === "light") {
      tips.push(
        tip(
          "post-types",
          "Solo contenido sin datos tuyos: buen criterio. Evita que te etiqueten otros con ubicación o cara.",
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
          "“Continuar con Google” une tu identidad entre sitios. Prefiere un correo propio cuando puedas.",
        ),
      );
    }
    if (logins.includes("facebook")) {
      tips.push(
        tip(
          "login",
          "Login con Facebook comparte grafo social. Migra esas cuentas a correo + contraseña única.",
        ),
      );
    }
    if (logins.includes("apple")) {
      tips.push(
        tip(
          "login",
          "Sign in with Apple (con ocultar correo) es mejor que Google/Meta. Igual no lo uses en todos lados sin necesidad.",
        ),
      );
    }
    if (logins.includes("email-same")) {
      tips.push(
        tip(
          "login",
          "Misma contraseña en todos lados: riesgo alto. Gestor de contraseñas + 2FA en el correo.",
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
          "Contraseñas distintas: buen piso. Suma gestor + 2FA.",
        ),
      );
    }
    // manager-2fa: sin consejo — ya está en el mejor hábito.
    if (logins.includes("manager") && !logins.includes("manager-2fa")) {
      tips.push(
        tip(
          "login",
          "Muy bien con el gestor de contraseñas. Activa 2FA en correo, bancos y redes cuando la app lo permita (mejor app o llave que SMS).",
        ),
      );
    }
  }

  switch (answers.os) {
    case "linux":
      break;
    case "windows":
      tips.push(
        tip(
          "os",
          "Windows: desactiva telemetría opcional, usa cuenta local si puedes y revisa privacidad en Configuración → Privacidad y seguridad.",
        ),
      );
      break;
    case "macos":
      tips.push(
        tip(
          "os",
          "macOS: revisa Permisos en Privacidad y seguridad, desactiva análisis / Siri si no los usas y mantén Relé privado si tienes iCloud+.",
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
          "Safari: activa Impedir seguimiento entre sitios y, si tienes iCloud+, Relé privado. Evita extensiones innecesarias.",
        ),
      );
      break;
    case "chrome":
      tips.push(
        tip(
          "browser",
          "Chrome envía mucho a Google (sync, historial, telemetría). Desactiva sync si no lo necesitas, o prueba Firefox/Brave para el día a día.",
        ),
      );
      break;
    case "edge":
      tips.push(
        tip(
          "browser",
          "Edge comparte datos con Microsoft. Desactiva sync y personalización en Privacidad, o cambia a Firefox/Brave.",
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
            ? `Con ${other}: revisa sync de cuenta, telemetría y bloqueo de rastreadores; evita iniciar sesión con Google/Microsoft solo por comodidad.`
            : "Cualquier navegador: revisa sync de cuenta, telemetría y un bloqueador de rastreadores de confianza.",
        ),
      );
      break;
    }
  }

  if (answers["ai-daily"] && answers["ai-daily"] !== "no") {
    switch (answers["ai-daily"]) {
      case "yes-heavy":
        tips.push(
          tip(
            "ai-daily",
            "Usarla varias veces al día acumula un historial enorme en el proveedor. Desactiva “usar chats para entrenar” si la app lo permite y borra historial seguido.",
          ),
        );
        break;
      case "yes":
        tips.push(
          tip(
            "ai-daily",
            "Uso diario: trata al chat como un tercero con servidores propios. Evita pegar secretos laborales o médicos.",
          ),
        );
        break;
      case "sometimes":
        tips.push(
          tip(
            "ai-daily",
            "Uso ocasional igual deja logs. Revisa la configuración de privacidad de la herramienta que más uses.",
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
            "Para estudio/trabajo: saca nombres, IDs y datos de clientes antes de pegar texto. Prefiere ejemplos ficticios.",
          ),
        );
      }
      if (aiHow.includes("ideas")) {
        tips.push(
          tip(
            "ai-how",
            "Ideas y ocio: bajo riesgo si no mezclas datos reales. No subas capturas con notificaciones o correos visibles.",
          ),
        );
      }
      if (aiHow.includes("life")) {
        tips.push(
          tip(
            "ai-how",
            "Consejos de vida/salud/dinero: muy sensible. Usa formulaciones genéricas; lo íntimo no debería viajar a un proveedor de IA.",
          ),
        );
      }
      if (aiHow.includes("docs")) {
        tips.push(
          tip(
            "ai-how",
            "Pegar documentos o correos es de las peores fugas. Resúmelo tú primero o usa herramientas locales/offline si existe la opción.",
          ),
        );
      }
      if (aiHow.includes("images")) {
        tips.push(
          tip(
            "ai-how",
            "Subir fotos a una IA puede exponer caras, documentos y metadatos EXIF. Recorta y anonimiza antes, o no las subas.",
          ),
        );
      }
      if (aiHow.includes("generate-media")) {
        tips.push(
          tip(
            "ai-how",
            "Generar imágenes/audio: no subas fotos de personas reales sin permiso y cuida prompts con datos identificables.",
          ),
        );
      }
      if (aiHow.includes("voice")) {
        tips.push(
          tip(
            "ai-how",
            "Asistentes de voz escuchan el entorno. Revisa historial de grabaciones y desactiva “mejorar el servicio” con tus audios.",
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
              ? `Sobre “${other}”: aplica la misma regla que al resto — sin nombres, documentos ni datos que no quieras que queden en el proveedor.`
              : "Cualquier otro uso de IA: no pegues datos identificables y revisa si el proveedor entrena con tus chats.",
          ),
        );
      }
    }

    switch (answers["ai-personal"]) {
      case "a-lot":
        tips.push(
          tip(
            "ai-personal",
            "Contarle tu vida a la IA crea un archivo íntimo fuera de tu control. Para en seco con datos identificables y borra chats viejos.",
          ),
        );
        break;
      case "therapist":
        tips.push(
          tip(
            "ai-personal",
            "Usar una IA como psicólogo es riesgoso: no es confidencial ni profesional. Para lo emocional, busca ayuda humana; con la IA, evita datos identificables.",
          ),
        );
        break;
      case "some":
        tips.push(
          tip(
            "ai-personal",
            "Los “se me escapó” suman. Antes de enviar, reemplaza nombres por iniciales y saca direcciones, documento de identidad y teléfonos.",
          ),
        );
        break;
      case "careful":
        break;
      case "never":
        tips.push(
          tip(
            "ai-personal",
            "Solo consultas genéricas: excelente. Mantén esa regla aunque el chat “se sienta” privado.",
          ),
        );
        break;
    }
  }

  return tips;
}

const PHONE_INTRO =
  "Sigue esta guía para configurar tu teléfono mejor y aumentar tu privacidad.";

const OS_INTRO =
  "Sigue esta guía para configurar tu computadora mejor y aumentar tu privacidad.";

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
            "Ajustes → Privacidad y seguridad → Seguimiento → desactiva “Permitir que las apps soliciten seguimiento”.",
        },
        {
          title: "Ubicación precisa",
          detail:
            "Ajustes → Privacidad → Localización. Por app: “Nunca” o “Mientras se usa”. Desactiva Localización precisa salvo mapas.",
        },
        {
          title: "Apple ID e iCloud",
          detail:
            "Ajustes → [tu nombre] → iCloud: desmarca apps de más. Con iCloud+: Relé privado y Ocultar mi correo.",
        },
        {
          title: "Safari anti‑rastreo",
          detail:
            "Ajustes → Safari → Impedir seguimiento entre sitios. Privada con Face/Touch ID si quieres.",
        },
        {
          title: "Fotos, micrófono y contactos",
          detail:
            "Privacidad y seguridad: Fotos en “Ninguna” o “Seleccionadas”; revisa Micrófono y Contactos.",
        },
        {
          title: "Analítica y anuncios Apple",
          detail:
            "Limita compartir analítica. En medios y compras → controles de anuncios, reduce personalización.",
        },
      ],
    };
  }

  if (phone === "samsung") {
    return {
      platform: "samsung",
      title: "Samsung",
      intro: PHONE_INTRO,
      steps: [
        {
          title: "Privacidad de One UI",
          detail:
            "Ajustes → Seguridad y privacidad → Privacidad. Revisa el panel de permisos y limita acceso a cámara, micrófono, ubicación y fotos.",
        },
        {
          title: "Anuncios de Google y Samsung",
          detail:
            "Ajustes → Google → Anuncios: elimina/restablece el ID y desactiva personalización. También busca “Anuncios” o “Servicios de publicidad” de Samsung y limita el seguimiento.",
        },
        {
          title: "Cuenta Samsung y Galaxy AI",
          detail:
            "Ajustes → Cuentas → Samsung account: revisa qué se sincroniza. En funciones Galaxy AI / Inteligencia, desactiva el uso de tus datos para mejorar servicios si no lo quieres.",
        },
        {
          title: "Samsung Cloud y Find My Mobile",
          detail:
            "Revisa qué sube Samsung Cloud (fotos, contactos, ajustes). Find My Mobile es útil, pero confirma que solo tú controlas la cuenta.",
        },
        {
          title: "Carpeta segura y apps de fábrica",
          detail:
            "Usa Carpeta segura (Knox) para apps sensibles. Desinstala o desactiva bloat de Samsung/operador que no uses.",
        },
        {
          title: "Ubicación e historial Google",
          detail:
            "Desactiva Historial de ubicaciones en myactivity.google.com. En Ajustes → Ubicación, deja “Solo mientras se usa” por app.",
        },
      ],
    };
  }

  if (phone === "android-other") {
    return {
      platform: "android-other",
      title: "Otro Android",
      intro: PHONE_INTRO,
      steps: [
        {
          title: "ID de publicidad de Google",
          detail:
            "Ajustes → Google → Anuncios (o Privacidad → Anuncios). Elimina/restablece el ID y desactiva anuncios personalizados.",
        },
        {
          title: "Administrador de permisos",
          detail:
            "Ajustes → Privacidad / Seguridad → Permisos. Saca Ubicación, Contactos, Micrófono y Cámara a lo innecesario. Ubicación: “Solo mientras se usa”.",
        },
        {
          title: "Telemetría de la marca",
          detail:
            "Busca “Privacidad”, “Usuario experiencia”, “Análisis” o “Mejorar servicios” en Ajustes y desactiva el envío de datos de uso a la marca.",
        },
        {
          title: "Cuenta Google e historial",
          detail:
            "En myactivity.google.com pausa Historial de ubicaciones y Actividad en la Web. Activa borrado automático si está disponible.",
        },
        {
          title: "Apps preinstaladas",
          detail:
            "Desinstala o desactiva apps del fabricante/operador que no uses. Menos apps = menos permisos activos.",
        },
        {
          title: "Navegador, notificaciones y bloqueo",
          detail:
            "Prefiere Firefox/Brave o bloquea cookies de terceros. Apaga previews en pantalla bloqueada. Mantén el sistema al día con PIN/huella.",
        },
      ],
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
            "Configuración → Privacidad y seguridad → Diagnósticos y comentarios. Elige datos de diagnóstico necesarios y desactiva experiencias personalizadas y mejorar escritura/entrada.",
        },
        {
          title: "ID de publicidad y general",
          detail:
            "Privacidad y seguridad → General: desactiva ID de publicidad, sugerencias en Configuración y el seguimiento de lanzamientos de apps.",
        },
        {
          title: "Cuenta local",
          detail:
            "Si puedes, usa una cuenta local en lugar de cuenta Microsoft para el día a día. Así reduces sync de actividad con la nube de Microsoft.",
        },
        {
          title: "Ubicación y permisos",
          detail:
            "Privacidad y seguridad → Ubicación: apaga el servicio si no lo necesitas, o permite solo apps concretas. Revisa Cámara, Micrófono y Contactos igual.",
        },
        {
          title: "Actividad e historial",
          detail:
            "Privacidad y seguridad → Historial de actividad: desactiva el envío a Microsoft. Revisa también Búsqueda de Windows y lo que indexa.",
        },
        {
          title: "OneDrive y Edge",
          detail:
            "Si no usas OneDrive, pausa o desvincula el backup. En Edge, desactiva sync y personalización de anuncios, o usa Firefox/Brave como navegador principal.",
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
            "Ajustes del Sistema → Privacidad y seguridad. Revisa Ubicación, Cámara, Micrófono, Fotos y Contactos: deja solo lo imprescindible por app.",
        },
        {
          title: "Análisis y mejoras",
          detail:
            "Privacidad y seguridad → Análisis y mejoras: desactiva compartir análisis del Mac y de apps con Apple y desarrolladores si no lo quieres.",
        },
        {
          title: "Apple ID e iCloud",
          detail:
            "Ajustes → [tu nombre] → iCloud: desmarca apps que no necesiten sync. Con iCloud+: activa Relé privado y Ocultar mi correo.",
        },
        {
          title: "Safari anti‑rastreo",
          detail:
            "Safari → Ajustes → Avanzado / Privacidad: Impedir seguimiento entre sitios. Limita extensiones a las que realmente uses.",
        },
        {
          title: "Anuncios de Apple",
          detail:
            "Privacidad y seguridad → Apple Advertising: desactiva anuncios personalizados.",
        },
        {
          title: "Siri y dictado",
          detail:
            "Si no usas Siri, desactívala. Revisa Mejorar Siri y Dictado para no enviar audio a Apple.",
        },
      ],
    };
  }

  return null;
}

function buildPhotoAdvice(
  photos: string | string[] | undefined,
): Tip | null {
  const list = asList(photos);
  if (list.length === 0) return null;

  if (list.includes("local") && list.length === 1) {
    return null;
  }

  const hasGoogle = list.includes("google-photos");
  const hasIcloud = list.includes("icloud");
  const hasOnedrive = list.includes("onedrive");
  const hasOther = list.includes("other-cloud");
  const cloudCount = [hasGoogle, hasIcloud, hasOnedrive, hasOther].filter(
    Boolean,
  ).length;

  const alt =
    "Mejor opción: una nube con cifrado de extremo a extremo como Proton Drive, o un disco externo que sea 100% tuyo.";

  if (cloudCount >= 2) {
    return tip(
      "photos",
      `Tienes fotos en más de una nube: eso duplica el álbum en varias empresas. Exporta, borra las copias extra y pásate a una sola alternativa. ${alt}`,
    );
  }
  if (hasGoogle) {
    return tip(
      "photos",
      `Google Fotos analiza caras, lugares y objetos. Exporta con Takeout, borra el backup en la nube y cambia de servicio. ${alt}`,
    );
  }
  if (hasIcloud) {
    return tip(
      "photos",
      `iCloud cifra en tránsito y en reposo, pero sigue siendo una nube central de Apple. Descarga tus fotos y deja de sincronizar el álbum ahí. ${alt}`,
    );
  }
  if (hasOnedrive) {
    return tip(
      "photos",
      `OneDrive indexa archivos con tu cuenta Microsoft. Saca tus fotos de ahí y deja de usar esa nube para el álbum. ${alt}`,
    );
  }
  if (hasOther) {
    return tip(
      "photos",
      `Otras nubes también suelen indexar tu contenido. Migra el álbum a algo bajo tu control. ${alt}`,
    );
  }

  return tip(
    "photos",
    `Si mezclas nube y almacenamiento local, no dejes copias olvidadas en servicios viejos. ${alt}`,
  );
}
