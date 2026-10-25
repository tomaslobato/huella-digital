export type AnswerMap = Record<string, string | string[]>;

export type QuestionOption = {
  id: string;
  label: string;
  impact: number;
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

export const questions: Question[] = [
  {
    id: "networks",
    title: "¿Qué redes sociales usás?",
    hint: "Marcá todas las que tengas activas.",
    type: "multi",
    options: [
      { id: "instagram", label: "Instagram", impact: -7 },
      { id: "tiktok", label: "TikTok", impact: -9 },
      { id: "youtube", label: "YouTube", impact: -5 },
      { id: "whatsapp", label: "WhatsApp", impact: -4 },
      { id: "x", label: "X (Twitter)", impact: -7 },
      { id: "reddit", label: "Reddit", impact: -4 },
      { id: "facebook", label: "Facebook", impact: -7 },
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
      { id: "gt3", label: "Más de 3 horas", impact: -12 },
    ],
  },
  {
    id: "publish",
    title: "¿Publicás tu vida en redes sociales?",
    hint: "Fotos, stories, check‑ins, opiniones, rutina…",
    type: "single",
    options: [
      {
        id: "a-lot",
        label: "Sí, bastante: mi día a día queda online",
        impact: -14,
      },
      {
        id: "sometimes",
        label: "A veces: lo justo para que se sepa de mí",
        impact: -6,
      },
      {
        id: "rare",
        label: "Casi nunca; solo algo puntual",
        impact: 4,
      },
      {
        id: "no",
        label: "No: miro, pero casi no publico",
        impact: 10,
      },
    ],
  },
  {
    id: "post-types",
    title: "¿Qué tipo de cosas solés publicar?",
    hint: "Podés marcar varias.",
    type: "multi",
    skipIf: (a) => a.publish === "no" || a.publish === "rare",
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
    skipIf: (a) => a.publish === "no" || a.publish === "rare",
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
    skipIf: (a) => a.publish === "no",
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
    type: "single",
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
    type: "single",
    options: [
      { id: "google-photos", label: "Google Fotos", impact: -8 },
      { id: "icloud", label: "iCloud Fotos", impact: -2 },
      {
        id: "both",
        label: "Los dos (Google Fotos e iCloud)",
        impact: -10,
      },
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
    title: "¿Para qué la usás más?",
    hint: "Elegí lo que más se parezca a tu uso.",
    type: "single",
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

export type ScoreResult = {
  stars: number;
  score: number;
  label: string;
  summary: string;
  tips: Tip[];
  phoneTutorial: {
    platform: "android" | "iphone" | "other";
    intro: string;
    steps: TutorialStep[];
  } | null;
  photoAdvice: Tip | null;
  networksDetail: { id: string; name: string; note: string }[];
};

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
  whatsapp: {
    name: "WhatsApp",
    note: "Los mensajes van cifrados, pero metadatos (con quién, cuándo) y la cuenta llegan a Meta.",
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

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function tip(from: string, text: string): Tip {
  return { from, section: SECTION[from] ?? from, text };
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
    2: "Nivel terrible: hay varias puertas abiertas. Los tips de cada sección atacan justo lo que respondiste.",
    3: "Nivel promedio: ni tan expuesto ni tan protegido. Con los cambios puntuales de abajo podés subir de categoría.",
    4: "Muy buen nivel de privacidad. Tus hábitos ya limitan el rastro; los tips afinan detalles.",
    5: "Muy buen nivel de privacidad. Seguí cuidando qué publicás y qué le contás a las máquinas: se mantiene con el tiempo.",
  };

  const networkIds = normalizeNetworks(
    Array.isArray(answers.networks) ? answers.networks : [],
  );

  return {
    stars,
    score,
    label: labels[stars],
    summary: summaries[stars],
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
    if (networkIds.includes("whatsapp")) {
      tips.push(
        tip(
          "networks",
          "WhatsApp: limitá foto/info/última vez; revisá datos compartidos con Meta; preferí backup cifrado o sin nube.",
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

  switch (answers.time) {
    case "lt30":
      tips.push(
        tip(
          "time",
          "Poco tiempo en redes: menos señales para los algoritmos. Mantené límites de pantalla.",
        ),
      );
      break;
    case "30-60":
      tips.push(
        tip(
          "time",
          "Media hora a una hora es manejable. Evitá el scroll infinito de noche.",
        ),
      );
      break;
    case "1-3":
      tips.push(
        tip(
          "time",
          "1–3 horas diarias arman un perfil muy rico. Usá límites por app y apagá notificaciones no esenciales.",
        ),
      );
      break;
    case "gt3":
      tips.push(
        tip(
          "time",
          "Más de 3 horas: el feed te conoce al dedillo. Límites duros, escala de grises y menos notificaciones.",
        ),
      );
      break;
  }

  switch (answers.publish) {
    case "a-lot":
      tips.push(
        tip(
          "publish",
          "Publicar el día a día arma un mapa de tu vida (rutina, cara, vínculos). Bajá la frecuencia y sacá ubicación de las piezas nuevas.",
        ),
      );
      break;
    case "sometimes":
      tips.push(
        tip(
          "publish",
          "Publicar “lo justo” igual deja rastro acumulado. Antes de subir, preguntate: ¿esto lo vería cómodo un desconocido en 5 años?",
        ),
      );
      break;
    case "rare":
      tips.push(
        tip(
          "publish",
          "Casi no publicar es una gran defensa. Cuidá igual los likes, guards y listas: también delatan intereses.",
        ),
      );
      break;
    case "no":
      tips.push(
        tip(
          "publish",
          "Mirar sin publicar reduce mucho la exposición. Seguí así y mantené perfiles privados por si algún día posteás.",
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

  switch (answers.login) {
    case "google":
      tips.push(
        tip(
          "login",
          "“Continuar con Google” une tu identidad entre sitios. Preferí mail propio cuando puedas.",
        ),
      );
      break;
    case "apple":
      tips.push(
        tip(
          "login",
          "Sign in with Apple (con ocultar correo) es mejor que Google/Meta. Igual no lo uses en todos lados sin necesidad.",
        ),
      );
      break;
    case "facebook":
      tips.push(
        tip(
          "login",
          "Login con Facebook comparte grafo social. Migrá esas cuentas a mail + contraseña única.",
        ),
      );
      break;
    case "email-same":
      tips.push(
        tip(
          "login",
          "Misma contraseña en todos lados: riesgo alto. Gestor de contraseñas + 2FA en el correo.",
        ),
      );
      break;
    case "email-unique":
      tips.push(
        tip(
          "login",
          "Contraseñas distintas: buen piso. Sumá gestor + 2FA.",
        ),
      );
      break;
    case "manager-2fa":
      tips.push(
        tip(
          "login",
          "Gestor + 2FA: muy sólido. Códigos de respaldo offline y preferí app/llave antes que SMS.",
        ),
      );
      break;
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

  switch (answers["ai-how"]) {
    case "study-work":
      tips.push(
        tip(
          "ai-how",
          "Para estudio/laburo: sacá nombres, IDs y datos de clientes antes de pegar texto. Preferí ejemplos ficticios.",
        ),
      );
      break;
    case "ideas":
      tips.push(
        tip(
          "ai-how",
          "Ideas y ocio: bajo riesgo si no mezclás datos reales. No subas capturas con notificaciones o mails visibles.",
        ),
      );
      break;
    case "life":
      tips.push(
        tip(
          "ai-how",
          "Consejos de vida/salud/plata: muy sensible. Usá formulaciones genéricas; lo íntimo no debería viajar a un proveedor de IA.",
        ),
      );
      break;
    case "docs":
      tips.push(
        tip(
          "ai-how",
          "Pegar documentos o mails es de las peores fugas. Resumí vos primero o usá herramientas locales/offline si existe la opción.",
        ),
      );
      break;
    case "images":
      tips.push(
        tip(
          "ai-how",
          "Subir fotos a una IA puede exponer caras, documentos y metadatos EXIF. Recortá y anonimizá antes, o no las subas.",
        ),
      );
      break;
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
  switch (photos) {
    case "google-photos":
      return tip(
        "photos",
        "Google Fotos analiza caras, lugares y objetos. Desactivá agrupación facial si no la usás, revisá Activity y evitá backups en Wi‑Fi ajenos. Para más control: exportá con Takeout y pasá a local cifrado o Nextcloud.",
      );
    case "icloud":
      return tip(
        "photos",
        "iCloud cifra en tránsito y en reposo, pero sigue siendo una nube central. 2FA fuerte, revisá dispositivos del Apple ID y Relé privado. Máxima reserva: fotos solo en disco/NAS cifrado.",
      );
    case "both":
      return tip(
        "photos",
        "Google Fotos + iCloud duplica el álbum en dos empresas. Elegí una sola nube (o local) y borrá la otra después de exportar.",
      );
    case "other-cloud":
      return tip(
        "photos",
        "Dropbox/OneDrive también indexan. 2FA, sin carpetas públicas de más, y si es sensible preferí cifrado E2E (Proton Drive, Tresorit).",
      );
    case "local":
      return tip(
        "photos",
        "Solo local: excelente. Hacé backups cifrados (disco externo / Cryptomator) por si se rompe el teléfono.",
      );
    default:
      return null;
  }
}
