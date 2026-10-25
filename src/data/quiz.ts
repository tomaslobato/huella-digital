export type AnswerMap = Record<string, string | string[]>;

export type QuestionOption = {
  id: string;
  label: string;
  impact: number;
  /** Si true, al elegirlo se pide un número de horas (1–16) */
  customHours?: boolean;
};

export type Question = {
  id: string;
  title: string;
  hint?: string;
  type: "single" | "multi";
  options: QuestionOption[];
  /** Si devuelve true, esta pregunta se salta */
  skipIf?: (answers: AnswerMap) => boolean;
};

export const TIME_CUSTOM_MIN = 6;
export const TIME_CUSTOM_MAX = 16;

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
    type: "single",
    options: [
      { id: "lt30", label: "Menos de 30 minutos", impact: 10 },
      { id: "30-60", label: "Entre 30 y 60 minutos", impact: 4 },
      { id: "1-3", label: "Entre 1 y 3 horas", impact: -6 },
      { id: "3-5", label: "Entre 3 y 5 horas", impact: -12 },
      {
        id: "more",
        label: "Más…",
        impact: -16,
        customHours: true,
      },
    ],
  },
  {
    id: "publish",
    title: "¿Publicás en redes sociales?",
    type: "single",
    options: [
      {
        id: "always",
        label: "Siempre: casi todos los días dejo algo online",
        impact: -14,
      },
      {
        id: "sometimes",
        label: "A veces: publico cuando hay algo que quiero compartir",
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
    title: "¿Qué tipo de cosas solés publicar?",
    hint: "Podés marcar varias.",
    type: "multi",
    skipIf: (a) => a.publish === "almost-never",
    options: [
      {
        id: "face-routine",
        label: "Fotos de mi cara / rutina diaria",
        impact: -6,
      },
      {
        id: "location",
        label: "Ubicación, viajes o “estoy acá”",
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
        id: "stories",
        label: "Stories que desaparecen (pero con mucha info)",
        impact: -5,
      },
      {
        id: "light",
        label: "Solo memes, arte o cosas sin datos míos",
        impact: 4,
      },
    ],
  },
  {
    id: "post-freq",
    title: "¿Cada cuánto publicás?",
    type: "single",
    skipIf: (a) => a.publish === "almost-never",
    options: [
      { id: "several-day", label: "Varias veces al día", impact: -12 },
      { id: "daily", label: "Casi todos los días", impact: -8 },
      { id: "weekly", label: "Algunas veces por semana", impact: -4 },
      { id: "monthly", label: "Algunas veces al mes o menos", impact: 2 },
    ],
  },
  {
    id: "post-audience",
    title: "¿Quién puede ver lo que publicás?",
    type: "single",
    skipIf: (a) => a.publish === "almost-never",
    options: [
      {
        id: "public",
        label: "Público: cualquiera en internet",
        impact: -12,
      },
      {
        id: "followers",
        label: "Todos mis seguidores (cuenta abierta o semi)",
        impact: -7,
      },
      {
        id: "friends",
        label: "Solo amigos / cuentas cercanas",
        impact: 4,
      },
      {
        id: "close",
        label: "Listas muy chicas o “mejores amigos”",
        impact: 8,
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
        label: "Mail y la misma contraseña en casi todos lados",
        impact: -14,
      },
      {
        id: "email-unique",
        label: "Mail y contraseñas distintas",
        impact: 6,
      },
      {
        id: "manager-2fa",
        label: "Gestor de contraseñas + verificación en dos pasos",
        impact: 14,
      },
    ],
  },
  {
    id: "phone",
    title: "¿Qué celular usás?",
    type: "single",
    options: [
      { id: "android", label: "Android", impact: -4 },
      { id: "iphone", label: "iPhone", impact: 2 },
      { id: "other", label: "Otro / no uso smartphone", impact: 4 },
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
      {
        id: "other-cloud",
        label: "Otro servicio en la nube (Dropbox, OneDrive…)",
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
        label: "Ideas, brainstorming o entretenimiento",
        impact: -3,
      },
      {
        id: "life",
        label: "Consejos de vida, salud, relaciones o plata",
        impact: -9,
      },
      {
        id: "docs",
        label: "Pegar documentos, mails o datos de cuentas",
        impact: -12,
      },
      {
        id: "images",
        label: "Subir fotos o capturas para que las analice",
        impact: -10,
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
        id: "a-lot",
        label: "Sí: nombre real, laburo, problemas, gente cercana…",
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

export type ScoreResult = {
  stars: number;
  score: number;
  label: string;
  summary: string;
  encouragement: string;
  comparison: UsageComparison;
  tips: Tip[];
  phoneTutorial: {
    platform: "android" | "iphone" | "other";
    intro: string;
    steps: TutorialStep[];
  } | null;
  photoAdvice: Tip | null;
  networksDetail: { id: string; name: string; note: string }[];
};

/** Promedios orientativos globales (uso diario estimado). */
export const AVG_SOCIAL_HOURS = 2.4;
export const AVG_PHONE_HOURS = 4.5;

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

const TIME_HOURS: Record<string, { hours: number; label: string }> = {
  lt30: { hours: 0.25, label: "menos de 30 minutos" },
  "30-60": { hours: 0.75, label: "entre 30 y 60 minutos" },
  "1-3": { hours: 2, label: "entre 1 y 3 horas" },
  "3-5": { hours: 4, label: "entre 3 y 5 horas" },
};

export function parseTimeHours(answers: AnswerMap): {
  hours: number;
  label: string;
} {
  const timeId = typeof answers.time === "string" ? answers.time : "1-3";
  if (timeId === "more") {
    const raw = Number(
      typeof answers.timeHours === "string" ? answers.timeHours : NaN,
    );
    const hours = clamp(
      Number.isFinite(raw) ? raw : TIME_CUSTOM_MIN,
      TIME_CUSTOM_MIN,
      TIME_CUSTOM_MAX,
    );
    return {
      hours,
      label: `${hours} hora${hours === 1 ? "" : "s"} al día`,
    };
  }
  return TIME_HOURS[timeId] ?? TIME_HOURS["1-3"];
}

export function timeImpact(answers: AnswerMap): number {
  const timeId = typeof answers.time === "string" ? answers.time : "";
  if (timeId === "more") {
    const { hours } = parseTimeHours(answers);
    // Más horas = peor impacto (tope ~-22)
    return -Math.min(22, 12 + Math.round((hours - 5) * 1.5));
  }
  const opt = questions
    .find((q) => q.id === "time")
    ?.options.find((o) => o.id === timeId);
  return opt?.impact ?? 0;
}

export function isValidTimeAnswer(answers: AnswerMap): boolean {
  const timeId = answers.time;
  if (typeof timeId !== "string" || !timeId) return false;
  if (timeId !== "more") return true;
  const raw = Number(
    typeof answers.timeHours === "string" ? answers.timeHours : NaN,
  );
  return (
    Number.isFinite(raw) &&
    Number.isInteger(raw) &&
    raw >= TIME_CUSTOM_MIN &&
    raw <= TIME_CUSTOM_MAX
  );
}

const SECTION: Record<string, string> = {
  networks: "Redes sociales",
  time: "Tiempo en pantallas",
  publish: "Exposición",
  "post-types": "Tipo de publicaciones",
  "post-freq": "Frecuencia",
  "post-audience": "Audiencia",
  login: "Inicio de sesión",
  phone: "Tu celular",
  photos: "Tus fotos",
  "ai-daily": "Inteligencia artificial",
  "ai-how": "Uso de la IA",
  "ai-personal": "Datos en la IA",
};

const NETWORK_META: Record<string, { name: string; note: string }> = {
  instagram: {
    name: "Instagram",
    note: "Fotos, stories, DM y actividad fuera de la app van a Meta; alimentan anuncios en Facebook e Instagram.",
  },
  tiktok: {
    name: "TikTok",
    note: "Cada video visto entrena un perfil muy fino. Los datos pueden procesarse en infraestructura de ByteDance.",
  },
  youtube: {
    name: "YouTube",
    note: "Historial y búsquedas viven en tu cuenta Google y se usan para recomendaciones y anuncios.",
  },
  telegram: {
    name: "Telegram",
    note: "Chats en la nube (salvo secret chats), contactos y uso de bots pueden exponer datos; el número queda vinculado a la cuenta.",
  },
  x: {
    name: "X (Twitter)",
    note: "Timeline, likes y DMs alimentan anuncios y, según la configuración, entrenamiento de modelos.",
  },
  reddit: {
    name: "Reddit",
    note: "Posts e intereses del feed se usan para personalización y publicidad; el historial queda en la cuenta.",
  },
  facebook: {
    name: "Facebook",
    note: "Grafo social, likes y píxeles en otros sitios arman uno de los perfiles publicitarios más densos.",
  },
};

function tip(from: string, text: string): Tip {
  return { from, section: SECTION[from] ?? from, text };
}

function asList(value: string | string[] | undefined): string[] {
  if (Array.isArray(value)) return value;
  if (typeof value === "string" && value.length > 0) return [value];
  return [];
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
      if (q.id === "post-types") {
        const sensitive = ids.filter((id) => id !== "light");
        if (sensitive.length >= 4) raw -= 6;
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

  const score = Math.round(clamp(raw, 0, 100));
  const stars =
    score <= 20 ? 1 : score <= 40 ? 2 : score <= 60 ? 3 : score <= 80 ? 4 : 5;

  const labels: Record<number, string> = {
    1: "Nivel terrible de privacidad",
    2: "Nivel terrible de privacidad",
    3: "Nivel promedio de privacidad",
    4: "Muy buen nivel de privacidad",
    5: "Muy buen nivel de privacidad",
  };

  const summaries: Record<number, string> = {
    1: "Tu huella digital está muy expuesta. Redes, publicaciones, login, nube o IA dejan un rastro fácil de seguir.",
    2: "Hay varias puertas abiertas en tu día a día digital. Todavía estás a tiempo de cerrarlas.",
    3: "Ni tan expuesto ni tan protegido: un nivel intermedio, con margen claro para mejorar.",
    4: "Tus hábitos ya limitan bastante el rastro. Vas por un camino sólido.",
    5: "Cuidás bien qué compartís y con quién. La privacidad se nota en tus respuestas.",
  };

  const encouragements: Record<number, string> = {
    1: "Empezar de cero también es un logro: cada ajuste que hagas hoy achica tu huella. No hace falta ser perfecto; hace falta el primer paso.",
    2: "No estás solo en esto. Con un par de cambios concretos (permisos, audiencia, IA) vas a notar la diferencia en poco tiempo. Dale una chance.",
    3: "Estás en el medio del camino, y eso ya es conciencia. Sumá un hábito por semana y vas a subir de nivel sin agobiarte.",
    4: "Muy bien: se nota que pensás antes de compartir. Seguí afinando detalles; tu yo del futuro te lo va a agradecer.",
    5: "Excelente cuidado. Compartí lo que aprendiste con alguien cercano: la privacidad mejora cuando el entorno también se cuida.",
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
    photoAdvice: buildPhotoAdvice(answers.photos),
    networksDetail: networkIds.map((id) => ({
      id,
      name: NETWORK_META[id]?.name ?? id,
      note: NETWORK_META[id]?.note ?? "",
    })),
  };
}

function buildComparison(answers: AnswerMap): UsageComparison {
  const social = parseTimeHours(answers);
  const timeId = typeof answers.time === "string" ? answers.time : "1-3";

  // Estimación de tiempo de pantalla: redes + margen de otras apps.
  const phonePad =
    timeId === "lt30" || timeId === "30-60"
      ? 1.8
      : timeId === "1-3"
        ? 2.2
        : timeId === "3-5"
          ? 1.6
          : 1.2;
  const userPhoneHours = Math.round((social.hours + phonePad) * 10) / 10;

  const socialDelta = Math.round((social.hours - AVG_SOCIAL_HOURS) * 10) / 10;
  const phoneDelta = Math.round((userPhoneHours - AVG_PHONE_HOURS) * 10) / 10;

  const socialVerdict =
    socialDelta <= -0.5
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

  const blurb =
    socialDelta >= 1.5
      ? "Cuanto más tiempo en feeds, más señales acumulan las plataformas sobre vos. Bajar un poco el scroll ya reduce la huella."
      : socialDelta <= -1
        ? "Menos horas en redes suele significar menos perfil publicitario. Buen punto de partida."
        : "Estar cerca del promedio no es neutro: el promedio global ya es alto. Cualquier recorte cuenta.";

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

function normalizeNetworks(ids: string[]): string[] {
  if (ids.includes("none") && ids.length === 1) return [];
  return ids.filter((id) => id !== "none" && NETWORK_META[id]);
}

function buildTips(answers: AnswerMap, networkIds: string[]): Tip[] {
  const tips: Tip[] = [];

  if (networkIds.length === 0) {
    tips.push(
      tip(
        "networks",
        "No marcaste redes activas: genial para la huella. Si más adelante abrís alguna, configurá la cuenta en privado desde el primer día.",
      ),
    );
  } else {
    if (networkIds.includes("tiktok")) {
      tips.push(
        tip(
          "networks",
          "TikTok: cuenta privada, sin sincronizar contactos y con anuncios personalizados limitados.",
        ),
      );
    }
    if (networkIds.includes("instagram") || networkIds.includes("facebook")) {
      tips.push(
        tip(
          "networks",
          "Instagram/Facebook: desactivá actividad fuera de Meta, limitá audiencia de stories y apagá sugerencias a contactos.",
        ),
      );
    }
    if (networkIds.includes("telegram")) {
      tips.push(
        tip(
          "networks",
          "Telegram: desactivá sincronizar contactos, revisá quién puede encontrarte por número y usá secret chats para lo sensible.",
        ),
      );
    }
    if (networkIds.includes("youtube")) {
      tips.push(
        tip(
          "networks",
          "YouTube: pausá el historial en myactivity.google.com y activá borrado automático cada 3 o 18 meses.",
        ),
      );
    }
    if (networkIds.includes("x")) {
      tips.push(
        tip(
          "networks",
          "X: sacá ubicación de posts, limitá DM y revisá personalización de anuncios.",
        ),
      );
    }
    if (networkIds.includes("reddit")) {
      tips.push(
        tip(
          "networks",
          "Reddit: usuario sin datos reales, sin personalización de anuncios y sin login social si podés.",
        ),
      );
    }
  }

  {
    const timeId = answers.time;
    if (timeId === "lt30") {
      tips.push(
        tip(
          "time",
          "Poco tiempo en redes: menos señales para los algoritmos. Mantené límites de pantalla.",
        ),
      );
    } else if (timeId === "30-60") {
      tips.push(
        tip(
          "time",
          "Media hora a una hora es manejable. Evitá el scroll infinito de noche.",
        ),
      );
    } else if (timeId === "1-3") {
      tips.push(
        tip(
          "time",
          "1–3 horas diarias arman un perfil muy rico. Usá límites por app y apagá notificaciones no esenciales.",
        ),
      );
    } else if (timeId === "3-5") {
      tips.push(
        tip(
          "time",
          "3–5 horas: ya estás por encima del promedio mundial. Probá un tope diario y sacá el teléfono del dormitorio.",
        ),
      );
    } else if (timeId === "more") {
      const { hours } = parseTimeHours(answers);
      tips.push(
        tip(
          "time",
          `${hours} horas en redes es muchísimo rastro diario. Empezá recortando 30 minutos por día; límites por app y escala de grises ayudan.`,
        ),
      );
    }
  }

  switch (answers.publish) {
    case "always":
      tips.push(
        tip(
          "publish",
          "Publicar siempre arma un mapa continuo de tu vida. Bajá un poco la frecuencia y sacá ubicación de lo nuevo.",
        ),
      );
      break;
    case "sometimes":
      tips.push(
        tip(
          "publish",
          "Publicar a veces igual deja rastro acumulado. Antes de subir, preguntate: ¿esto lo vería cómodo un desconocido en 5 años?",
        ),
      );
      break;
    case "occasionally":
      tips.push(
        tip(
          "publish",
          "Publicar de vez en cuando está bien si cuidás audiencia y datos sensibles. Revisá posts viejos que sigan públicos.",
        ),
      );
      break;
    case "almost-never":
      tips.push(
        tip(
          "publish",
          "Casi no publicar es una gran defensa. Cuidá igual likes y guards: también delatan intereses.",
        ),
      );
      break;
  }

  const postTypes = Array.isArray(answers["post-types"])
    ? answers["post-types"]
    : [];
  if (postTypes.includes("location")) {
    tips.push(
      tip(
        "post-types",
        "Check‑ins y viajes en tiempo real avisan dónde estás (y dónde no estás en casa). Publicá lugares recién cuando ya te fuiste.",
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
        "Cara + rutina alimentan reconocimiento facial y horarios. Mezclá ángulos, evitá el mismo fondo todos los días y limitá stories permanentes.",
      ),
    );
  }
  if (postTypes.includes("work")) {
    tips.push(
      tip(
        "post-types",
        "Laburo y clientes en redes pueden filtrar datos de terceros. Separá cuenta personal/profesional y borrá capturas con mails o tableros.",
      ),
    );
  }
  if (postTypes.includes("opinions")) {
    tips.push(
      tip(
        "post-types",
        "Opiniones fuertes quedan indexadas. Si vas a debatir, usá cuentas con menos datos personales cruzados.",
      ),
    );
  }
  if (postTypes.includes("stories") && !postTypes.includes("light")) {
    tips.push(
      tip(
        "post-types",
        "Las stories “desaparecen”, pero se capturan y las apps igual miden interacción. Tratalas como públicas.",
      ),
    );
  }
  if (postTypes.length === 1 && postTypes[0] === "light") {
    tips.push(
      tip(
        "post-types",
        "Solo contenido sin datos tuyos: buen criterio. Evitá que te etiqueten otros con ubicación o cara.",
      ),
    );
  }

  switch (answers["post-freq"]) {
    case "several-day":
      tips.push(
        tip(
          "post-freq",
          "Varias veces al día = diario casi en vivo. Recortá a momentos elegidos; menos posts, menos superficie de ataque.",
        ),
      );
      break;
    case "daily":
      tips.push(
        tip(
          "post-freq",
          "Postear diario sostiene un perfil continuo. Probá un día sin publicar y borrá piezas viejas con datos sensibles.",
        ),
      );
      break;
    case "weekly":
      tips.push(
        tip(
          "post-freq",
          "Algunas veces por semana es más sano. Revisá el archivo/histórico: lo viejo sigue expuesto.",
        ),
      );
      break;
    case "monthly":
      tips.push(
        tip(
          "post-freq",
          "Poca frecuencia: bien. Cuando publiques, hacelo sin geotag y con audiencia limitada.",
        ),
      );
      break;
  }

  switch (answers["post-audience"]) {
    case "public":
      tips.push(
        tip(
          "post-audience",
          "Público total: cualquier persona o scraper puede archivar. Pasá a privados o amigos cercanos como default.",
        ),
      );
      break;
    case "followers":
      tips.push(
        tip(
          "post-audience",
          "Todos los seguidores no son “amigos”. Auditá la lista y sacá cuentas que no reconozcas.",
        ),
      );
      break;
    case "friends":
      tips.push(
        tip(
          "post-audience",
          "Solo amigos: buen piso. Revisá una vez al año quién sigue adentro de esa lista.",
        ),
      );
      break;
    case "close":
      tips.push(
        tip(
          "post-audience",
          "Listas chicas / mejores amigos: excelente. No reenvíes stories a canales abiertos después.",
        ),
      );
      break;
  }

  {
    const logins = asList(answers.login);
    if (logins.includes("google")) {
      tips.push(
        tip(
          "login",
          "“Continuar con Google” une tu identidad entre sitios. Preferí mail propio cuando puedas.",
        ),
      );
    }
    if (logins.includes("facebook")) {
      tips.push(
        tip(
          "login",
          "Login con Facebook comparte grafo social. Migrá esas cuentas a mail + contraseña única.",
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
    } else if (logins.includes("email-unique") && !logins.includes("manager-2fa")) {
      tips.push(
        tip(
          "login",
          "Contraseñas distintas: buen piso. Sumá gestor + 2FA.",
        ),
      );
    }
    if (logins.includes("manager-2fa")) {
      tips.push(
        tip(
          "login",
          "Gestor + 2FA: muy sólido. Códigos de respaldo offline y preferí app/llave antes que SMS.",
        ),
      );
    }
  }

  switch (answers["ai-daily"]) {
    case "yes-heavy":
      tips.push(
        tip(
          "ai-daily",
          "Usarla varias veces al día acumula un historial enorme en el proveedor. Desactivá “usar chats para entrenar” si la app lo permite y borrá historial seguido.",
        ),
      );
      break;
    case "yes":
      tips.push(
        tip(
          "ai-daily",
          "Uso diario: tratá al chat como un tercero con servidores propios. Evitá pegar secretos laborales o médicos.",
        ),
      );
      break;
    case "sometimes":
      tips.push(
        tip(
          "ai-daily",
          "Uso ocasional igual deja logs. Revisá la configuración de privacidad de la herramienta que más uses.",
        ),
      );
      break;
    case "no":
      tips.push(
        tip(
          "ai-daily",
          "Casi no usar IA reduce una vía nueva de fuga de datos. Si empezás, hacelo con cuentas sin datos sensibles.",
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
          "Para estudio/laburo: sacá nombres, IDs y datos de clientes antes de pegar texto. Preferí ejemplos ficticios.",
        ),
      );
    }
    if (aiHow.includes("ideas")) {
      tips.push(
        tip(
          "ai-how",
          "Ideas y ocio: bajo riesgo si no mezclás datos reales. No subas capturas con notificaciones o mails visibles.",
        ),
      );
    }
    if (aiHow.includes("life")) {
      tips.push(
        tip(
          "ai-how",
          "Consejos de vida/salud/plata: muy sensible. Usá formulaciones genéricas; lo íntimo no debería viajar a un proveedor de IA.",
        ),
      );
    }
    if (aiHow.includes("docs")) {
      tips.push(
        tip(
          "ai-how",
          "Pegar documentos o mails es de las peores fugas. Resumí vos primero o usá herramientas locales/offline si existe la opción.",
        ),
      );
    }
    if (aiHow.includes("images")) {
      tips.push(
        tip(
          "ai-how",
          "Subir fotos a una IA puede exponer caras, documentos y metadatos EXIF. Recortá y anonimizá antes, o no las subas.",
        ),
      );
    }
  }

  switch (answers["ai-personal"]) {
    case "a-lot":
      tips.push(
        tip(
          "ai-personal",
          "Contarle tu vida a la IA crea un archivo íntimo fuera de tu control. Pará en seco con datos identificables y borrá chats viejos.",
        ),
      );
      break;
    case "some":
      tips.push(
        tip(
          "ai-personal",
          "Los “se me escapó” suman. Antes de enviar, reemplazá nombres por iniciales y sacá direcciones, DNI y teléfonos.",
        ),
      );
      break;
    case "careful":
      tips.push(
        tip(
          "ai-personal",
          "Anonimizar es el hábito correcto. Sumá no pegar capturas y desactivar historial cuando la app lo permita.",
        ),
      );
      break;
    case "never":
      tips.push(
        tip(
          "ai-personal",
          "Solo consultas genéricas: excelente. Mantené esa regla aunque el chat “se sienta” privado.",
        ),
      );
      break;
  }

  return tips;
}

function buildPhoneTutorial(
  phone: string | string[] | undefined,
): ScoreResult["phoneTutorial"] {
  if (phone === "android") {
    return {
      platform: "android",
      intro:
        "En Android la privacidad depende mucho de lo que configures vos: de fábrica suele compartir más telemetría, ubicación y anuncios. Vale la pena dedicar 15 minutos a esto.",
      steps: [
        {
          title: "Bloqueá el ID de publicidad",
          detail:
            "Ajustes → Google → Anuncios (o Privacidad → Anuncios) → Eliminar ID / restablecer ID de publicidad y desactivá personalización de anuncios.",
        },
        {
          title: "Permisos app por app",
          detail:
            "Ajustes → Privacidad / Seguridad → Administrador de permisos. Sacá Ubicación, Contactos, Micrófono y Cámara a lo que no lo necesite. Ubicación: “Solo mientras se usa”.",
        },
        {
          title: "Ubicación e historial de Google",
          detail:
            "Desactivá Historial de ubicaciones en myactivity.google.com. En Ajustes → Ubicación, limitá búsquedas de Wi‑Fi/Bluetooth si no las usás.",
        },
        {
          title: "Navegador y apps de más",
          detail:
            "Evitá cookies de terceros; mejor Firefox o Brave. Desinstalá o desactivá apps del fabricante que no uses.",
        },
        {
          title: "Notificaciones y backups",
          detail:
            "Apagá previews en pantalla bloqueada. Revisá qué se sube solo a Google One / Drive (fotos, WhatsApp).",
        },
        {
          title: "Actualizaciones y bloqueo",
          detail:
            "Sistema al día, PIN/huella, y si podés separá apps dudosas en un perfil de trabajo.",
        },
      ],
    };
  }

  if (phone === "iphone") {
    return {
      platform: "iphone",
      intro:
        "iPhone arranca con mejor piso que la mayoría de Androids, pero igual hay que tocar ajustes. En default, apps y Apple ven más de lo necesario.",
      steps: [
        {
          title: "App Tracking Transparency",
          detail:
            "Ajustes → Privacidad y seguridad → Seguimiento → desactivá “Permitir que las apps soliciten seguimiento”.",
        },
        {
          title: "Ubicación precisa",
          detail:
            "Ajustes → Privacidad → Localización. Por app: “Nunca” o “Mientras se usa”. Desactivá Localización precisa salvo mapas.",
        },
        {
          title: "Apple ID e iCloud",
          detail:
            "Ajustes → [tu nombre] → iCloud: desmarcá apps de más. Con iCloud+: Relé privado y Ocultar mi correo.",
        },
        {
          title: "Safari anti‑rastreo",
          detail:
            "Ajustes → Safari → Impedir seguimiento entre sitios. Privada con Face/Touch ID si querés.",
        },
        {
          title: "Fotos, micrófono y contactos",
          detail:
            "Privacidad y seguridad: Fotos en “Ninguna” o “Seleccionadas”; revisá Micrófono y Contactos.",
        },
        {
          title: "Analítica y anuncios Apple",
          detail:
            "Limitá compartir analítica. En medios y compras → controles de anuncios, reducí personalización.",
        },
      ],
    };
  }

  if (phone === "other") {
    return {
      platform: "other",
      intro:
        "Sin smartphone típico, tu huella se concentra en navegador y cuentas web. Endurecé esos puntos.",
      steps: [
        {
          title: "Navegador limpio",
          detail:
            "Firefox, Brave o Safari con anti‑rastreo estricto y sin cookies de terceros.",
        },
        {
          title: "Cuentas con 2FA",
          detail:
            "Correo y redes con autenticación en dos pasos y contraseñas únicas.",
        },
        {
          title: "Sesiones abiertas",
          detail:
            "Cerrá sesiones viejas en los centros de seguridad de Google, Apple o Meta.",
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
    return tip(
      "photos",
      "Solo local: excelente. Hacé backups cifrados (disco externo / Cryptomator) por si se rompe el teléfono.",
    );
  }

  const hasGoogle = list.includes("google-photos");
  const hasIcloud = list.includes("icloud");
  const hasOther = list.includes("other-cloud");

  if (hasGoogle && hasIcloud) {
    return tip(
      "photos",
      "Google Fotos + iCloud duplica el álbum en dos empresas. Elegí una sola nube (o local) y borrá la otra después de exportar.",
    );
  }
  if (hasGoogle) {
    return tip(
      "photos",
      "Google Fotos analiza caras, lugares y objetos. Desactivá agrupación facial si no la usás, revisá Activity y evitá backups en Wi‑Fi ajenos. Para más control: exportá con Takeout y pasá a local cifrado o Nextcloud.",
    );
  }
  if (hasIcloud) {
    return tip(
      "photos",
      "iCloud cifra en tránsito y en reposo, pero sigue siendo una nube central. 2FA fuerte, revisá dispositivos del Apple ID y Relé privado. Máxima reserva: fotos solo en disco/NAS cifrado.",
    );
  }
  if (hasOther) {
    return tip(
      "photos",
      "Dropbox/OneDrive también indexan. 2FA, sin carpetas públicas de más, y si es sensible preferí cifrado E2E (Proton Drive, Tresorit).",
    );
  }

  return tip(
    "photos",
    "Si mezclás nube y almacenamiento local, asegurate de no dejar copias olvidadas en servicios viejos.",
  );
}
