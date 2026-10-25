export type RiskLevel = "alto" | "medio" | "bajo";

export type Service = {
  id: string;
  name: string;
  category: string;
  risk: RiskLevel;
  tagline: string;
  dataCollected: string[];
  destinations: string[];
  sharedWith: string[];
  controlUrl: string;
  steps: string[];
  alternatives: { name: string; note: string }[];
};

export const services: Service[] = [
  {
    id: "google",
    name: "Google",
    category: "Búsqueda y correo",
    risk: "alto",
    tagline: "Cuenta unificada: búsqueda, Gmail, Maps, YouTube y Android.",
    dataCollected: [
      "Historial de búsquedas y de YouTube",
      "Ubicación (GPS, Wi‑Fi y direcciones IP)",
      "Correo, contactos y archivos en Drive",
      "Actividad en apps y sitios con login de Google",
      "Datos de dispositivo y publicidad",
    ],
    destinations: [
      "Centros de datos de Google (EE. UU., Europa, Asia y América Latina)",
      "Perfiles de publicidad y de personalización",
      "Productos del ecosistema Google (Maps, YouTube, Ads)",
    ],
    sharedWith: [
      "Anunciantes vía Google Ads / DoubleClick",
      "Socios de medición y de analytics",
      "Autoridades cuando hay requerimiento legal",
    ],
    controlUrl: "https://myaccount.google.com/data-and-privacy",
    steps: [
      "Abrí Mi cuenta de Google → Datos y privacidad.",
      "Desactivá Historial de ubicaciones y Actividad en la Web y en Apps.",
      "Configurá borrado automático (3 o 18 meses) del historial.",
      "Revisá Controles de anuncios y desmarcá personalización si preferís.",
      "Descargá una copia con Takeout antes de borrar datos sensibles.",
    ],
    alternatives: [
      { name: "DuckDuckGo / Startpage", note: "Búsqueda sin perfil publicitario persistente." },
      { name: "Proton Mail / Tuta", note: "Correo con cifrado y menos rastreo." },
      { name: "Organic Maps", note: "Mapas offline basados en OpenStreetMap." },
    ],
  },
  {
    id: "meta",
    name: "Meta (Facebook e Instagram)",
    category: "Redes sociales",
    risk: "alto",
    tagline: "Perfil social, mensajes, fotos y comportamiento fuera de la app.",
    dataCollected: [
      "Perfil, amigos, likes, comentarios y tiempo de uso",
      "Fotos, videos y metadatos (ubicación, dispositivo)",
      "Actividad en sitios con píxeles de Meta",
      "Contactos sincronizados del teléfono",
      "Datos de compra y de anuncios vistos",
    ],
    destinations: [
      "Infraestructura de Meta Platforms (principalmente EE. UU. e Irlanda)",
      "Sistemas de ranking y de publicidad",
      "Integración entre Facebook, Instagram y Messenger",
    ],
    sharedWith: [
      "Anunciantes y agencias de marketing",
      "Socios de medición (apps y tiendas)",
      "Empresas del grupo Meta",
    ],
    controlUrl: "https://www.facebook.com/privacy/center",
    steps: [
      "Entrá al Centro de privacidad de Facebook o Instagram.",
      "Limitá la audiencia de publicaciones a Amigos o Solo yo.",
      "Desactivá Actividad fuera de Facebook / Actividad con empresas.",
      "Revisá Anuncios → Temas de interés y ocultá categorías sensibles.",
      "Apagá el acceso a contactos y a ubicación en el sistema operativo.",
    ],
    alternatives: [
      { name: "Mastodon / Bluesky", note: "Redes más abiertas y con menos publicidad." },
      { name: "Pixelfed", note: "Fotos estilo Instagram en fediverso." },
    ],
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    category: "Mensajería",
    risk: "medio",
    tagline: "Mensajes cifrados, pero metadatos y la cuenta van a Meta.",
    dataCollected: [
      "Número de teléfono y foto de perfil",
      "Metadatos: con quién hablás, cuándo y desde dónde (aprox.)",
      "Estado, grupos y lista de contactos (si sincronizás)",
      "Uso de funciones comerciales y de pagos donde existan",
    ],
    destinations: [
      "Servidores de WhatsApp / Meta",
      "Copias de seguridad en Google Drive o iCloud (si las activás; ahí no hay cifrado de punta a punta por defecto)",
    ],
    sharedWith: [
      "Empresas del grupo Meta (según la región y la configuración)",
      "Proveedores de infraestructura y de moderación",
    ],
    controlUrl: "https://www.whatsapp.com/privacy",
    steps: [
      "Ajustes → Privacidad: limitá Quién puede ver foto, info y última vez.",
      "Desactivá lectura de confirmaciones si no querés que vean el visto.",
      "Revisá si compartís datos con empresas de Meta en Ajustes → Privacidad.",
      "Preferí copias cifradas de extremo a extremo o evitá backup en la nube.",
      "No aceptes invitaciones a canales o grupos de desconocidos.",
    ],
    alternatives: [
      { name: "Signal", note: "Cifrado fuerte y recopilación mínima de metadatos." },
      { name: "Session", note: "Mensajería sin número de teléfono." },
    ],
  },
  {
    id: "tiktok",
    name: "TikTok",
    category: "Video corto",
    risk: "alto",
    tagline: "Feed hiperpersonalizado: cada scroll alimenta el perfil.",
    dataCollected: [
      "Videos vistos, likes, comentarios y tiempo de retención",
      "Contactos, mensajes directos y contenido creado",
      "Datos del dispositivo, IP, portapapeles (según versión/OS)",
      "Ubicación aproximada y biometría facial/voz (efectos)",
    ],
    destinations: [
      "Infraestructura de ByteDance / TikTok (varios países)",
      "Sistemas de recomendación y de moderación",
      "Herramientas de anunciantes en TikTok Ads",
    ],
    sharedWith: [
      "Anunciantes y creadores de campañas",
      "Socios de analítica y de seguridad",
      "Autoridades según jurisdicción",
    ],
    controlUrl: "https://www.tiktok.com/privacy/settings",
    steps: [
      "Perfil → Menú → Ajustes y privacidad → Privacidad.",
      "Poné la cuenta en privada si no necesitás audiencia pública.",
      "Desactivá sugerencias a contactos y sincronización de la agenda.",
      "En Personalización y datos, limitá anuncios personalizados.",
      "Borrá el historial de videos vistos periódicamente.",
    ],
    alternatives: [
      { name: "YouTube sin cuenta", note: "Menos perfil persistente si navegás en modo limitado." },
      { name: "PeerTube", note: "Video federado, sin feed publicitario central." },
    ],
  },
  {
    id: "x-twitter",
    name: "X (Twitter)",
    category: "Redes sociales",
    risk: "alto",
    tagline: "Timeline público, DMs y datos usados para anuncios e IA.",
    dataCollected: [
      "Tweets, likes, follows y listas",
      "Mensajes directos y medios subidos",
      "Datos de dispositivo, IP y ubicación aproximada",
      "Interacciones con anuncios y contenido recomendado",
    ],
    destinations: [
      "Servidores de X Corp.",
      "Sistemas de ranking, moderación y entrenamiento de modelos",
    ],
    sharedWith: [
      "Anunciantes",
      "Socios de seguridad y de cumplimiento",
      "Desarrolladores con API (según permisos)",
    ],
    controlUrl: "https://x.com/settings/privacy_and_safety",
    steps: [
      "Ajustes → Privacidad y seguridad.",
      "Desactivá marcar ubicación en posts y descubribilidad por email/teléfono.",
      "Limitá quién puede enviarte mensajes y menciones.",
      "Revisá Personalización de anuncios y desactivá lo que no quieras.",
      "Descargá tu archivo y borrá posts antiguos sensibles.",
    ],
    alternatives: [
      { name: "Bluesky", note: "Protocolo abierto (AT) con más control del feed." },
      { name: "Mastodon", note: "Instancias comunitarias sin un solo dueño comercial." },
    ],
  },
  {
    id: "amazon",
    name: "Amazon",
    category: "Compras y nube",
    risk: "alto",
    tagline: "Compras, Alexa, Prime Video y publicidad cruzada.",
    dataCollected: [
      "Historial de compras, búsquedas y wishlists",
      "Direcciones, métodos de pago y envíos",
      "Voz (Alexa) y hábitos en el hogar conectado",
      "Visualizaciones en Prime Video y uso de Kindle",
    ],
    destinations: [
      "Centros logísticos y de datos de Amazon",
      "Amazon Ads y perfiles de recomendación",
      "Servicios AWS asociados a tu cuenta cuando aplica",
    ],
    sharedWith: [
      "Vendedores del marketplace",
      "Anunciantes en Amazon Ads",
      "Servicios de entrega y de fraude",
    ],
    controlUrl: "https://www.amazon.com/privacy",
    steps: [
      "Cuenta → Tu información de privacidad / Solicitudes de datos.",
      "Gestioná historial de búsquedas y recomendaciones.",
      "En Alexa: borrá grabaciones de voz y limitá uso para mejorar servicios.",
      "Desactivá anuncios personalizados basados en intereses.",
      "Revisá dispositivos vinculados y cerrá sesiones que no uses.",
    ],
    alternatives: [
      { name: "Tiendas locales / cooperativas", note: "Menos perfil unificado de consumo." },
      { name: "Compras directas a marcas", note: "Evita el marketplace que concentra datos." },
    ],
  },
  {
    id: "microsoft",
    name: "Microsoft",
    category: "Productividad",
    risk: "medio",
    tagline: "Windows, Edge, Outlook, OneDrive y Copilot.",
    dataCollected: [
      "Datos de cuenta Microsoft y de inicio de sesión",
      "Telemetría de Windows y de uso de apps",
      "Correo, calendarios y archivos en OneDrive",
      "Consultas a Bing / Copilot y contexto de trabajo",
    ],
    destinations: [
      "Nube Microsoft Azure (regiones globales)",
      "Servicios de identidad y de productividad 365",
      "Sistemas de personalización y de publicidad (según producto)",
    ],
    sharedWith: [
      "Socios de seguridad y antimalware",
      "Anunciantes en productos con ads (p. ej. Bing)",
      "Administradores de tu organización si usás cuenta laboral",
    ],
    controlUrl: "https://account.microsoft.com/privacy",
    steps: [
      "Entrá a account.microsoft.com/privacy.",
      "Desactivá historial de actividad y de ubicación que no necesites.",
      "En Windows: Configuración → Privacidad y seguridad → Diagnósticos (básico).",
      "Revisá permisos de micrófono, cámara y notificaciones por app.",
      "Limitá datos usados para entrenar experiencias de IA si la opción está disponible.",
    ],
    alternatives: [
      { name: "LibreOffice + Nextcloud", note: "Ofimática y archivos bajo tu control." },
      { name: "Proton / Thunderbird", note: "Correo con menos telemetría comercial." },
    ],
  },
  {
    id: "apple",
    name: "Apple",
    category: "Dispositivos",
    risk: "bajo",
    tagline: "Más privacidad por diseño, pero iCloud y Apple ID siguen siendo centrales.",
    dataCollected: [
      "Apple ID, compras en App Store y suscripciones",
      "Respaldos y fotos en iCloud (si están activados)",
      "Datos de Salud, Ubicación y Siri según permisos",
      "Identificadores de dispositivo para análisis (opt‑in)",
    ],
    destinations: [
      "Centros de datos de Apple",
      "Procesamiento on‑device cuando es posible (Face ID, fotos)",
      "iCloud Private Relay / Hide My Email si los usás",
    ],
    sharedWith: [
      "Desarrolladores de apps (según permisos que otorgues)",
      "Socios de Apple Music / TV cuando corresponde",
      "Autoridades con orden legal",
    ],
    controlUrl: "https://privacy.apple.com/",
    steps: [
      "Ajustes → [tu nombre] → Inicio de sesión y seguridad / iCloud.",
      "Revisá apps con acceso a iCloud y desactivá lo innecesario.",
      "Ajustes → Privacidad y seguridad: ubicación, tracking, micrófono.",
      "Pedí App Tracking Transparency en denegar por defecto.",
      "Activá Relé privado y Ocultar mi correo si tenés iCloud+.",
    ],
    alternatives: [
      { name: "GrapheneOS (Pixel)", note: "Android endurecido si priorizás control total." },
      { name: "Almacenamiento local cifrado", note: "Menos dependencia de iCloud." },
    ],
  },
  {
    id: "spotify",
    name: "Spotify",
    category: "Música",
    risk: "medio",
    tagline: "Gustan musicales + publicidad y partners del catálogo.",
    dataCollected: [
      "Canciones, playlists, skips y horarios de escucha",
      "Dispositivos, IP y ubicación aproximada",
      "Datos de pago y de plan (Free / Premium)",
      "Interacciones con podcasts y anuncios",
    ],
    destinations: [
      "Servidores de Spotify (UE y otras regiones)",
      "Sistemas de recomendación y de anuncios",
    ],
    sharedWith: [
      "Sellos, artistas y partners del catálogo (métricas agregadas/detalle según contrato)",
      "Anunciantes (plan Free)",
      "Socios de marketing",
    ],
    controlUrl: "https://www.spotify.com/account/privacy/",
    steps: [
      "Cuenta → Privacidad.",
      "Desactivá escuchas públicas y sesiones privadas cuando quieras.",
      "Gestioná descarga de datos y publicidad personalizada.",
      "Desconectá apps de terceros en Apps autorizadas.",
      "Evitá conectar Facebook/Google si no es necesario.",
    ],
    alternatives: [
      { name: "Buycott / Bandcamp", note: "Compra directa a artistas." },
      { name: "Navidrome / Jellyfin", note: "Streaming de tu propia biblioteca." },
    ],
  },
  {
    id: "netflix",
    name: "Netflix",
    category: "Streaming",
    risk: "medio",
    tagline: "Qué mirás, cuándo y en qué dispositivo alimenta el algoritmo.",
    dataCollected: [
      "Historial de reproducción y calificaciones",
      "Dispositivos, IP y red usada",
      "Datos de pago y de hogar",
      "Interacciones en la interfaz (hover, búsquedas)",
    ],
    destinations: [
      "Infraestructura de Netflix (CDN y nube)",
      "Sistemas de recomendación y de prevención de fraude",
    ],
    sharedWith: [
      "Proveedores de pago",
      "Socios de producción (métricas)",
      "Autoridades según ley aplicable",
    ],
    controlUrl: "https://www.netflix.com/account",
    steps: [
      "Cuenta → Perfiles: revisá historial y mi lista.",
      "Desactivá personalización extra si tu región ofrece el control.",
      "Cerrá sesiones en Dispositivos / Acceso reciente.",
      "Usá perfiles separados para no mezclar gustos y datos.",
      "Pedí descarga de datos personales desde Ayuda de Netflix.",
    ],
    alternatives: [
      { name: "Bibliotecas públicas digitales", note: "Préstamo legal con menos perfil comercial." },
      { name: "Compra / alquiler puntual", note: "Sin suscripción que observe hábitos diarios." },
    ],
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    category: "Trabajo",
    risk: "medio",
    tagline: "Carrera, red profesional y señales usadas por reclutadores y ads.",
    dataCollected: [
      "CV, experiencia, educación y skills",
      "Conexiones, mensajes y actividad en el feed",
      "Datos de empresa y de búsqueda de empleo",
      "Información de dispositivo y de publicidad",
    ],
    destinations: [
      "Microsoft / LinkedIn (nube global)",
      "Productos de Talent y de Marketing Solutions",
    ],
    sharedWith: [
      "Reclutadores con Licencias premium",
      "Anunciantes B2B",
      "Microsoft según políticas del grupo",
    ],
    controlUrl: "https://www.linkedin.com/mypreferences/d/categories/privacy",
    steps: [
      "Me → Ajustes y privacidad.",
      "Limitá visibilidad del perfil y de la foto.",
      "Desactivá compartir datos de perfil con servicios de Microsoft no deseados.",
      "Gestioná anuncios y datos demográficos inferidos.",
      "Revisá aplicaciones autorizadas y sesiones activas.",
    ],
    alternatives: [
      { name: "Portfolio personal / web propia", note: "Controlás qué se publica." },
      { name: "Comunidades de oficio", note: "Networking sin un grafo publicitario único." },
    ],
  },
  {
    id: "discord",
    name: "Discord",
    category: "Comunidad",
    risk: "medio",
    tagline: "Chats de servidores: social, técnico… y a veces demasiado público.",
    dataCollected: [
      "Mensajes, DMs, archivos y reacciones",
      "Lista de servidores, amigos y estado de presencia",
      "Datos de pago (Nitro) y de dispositivo",
      "Voice chat: metadatos de conexión",
    ],
    destinations: [
      "Infraestructura de Discord (EE. UU. y otras regiones)",
      "Sistemas de seguridad antispam y Trust & Safety",
    ],
    sharedWith: [
      "Desarrolladores de bots a los que das permiso",
      "Proveedores de infraestructura",
      "Autoridades con orden válida",
    ],
    controlUrl: "https://discord.com/settings/privacy",
    steps: [
      "Ajustes de usuario → Privacidad y seguridad.",
      "Desactivá DM de miembros de servidores desconocidos.",
      "Revisá quién puede agregarte como amigo.",
      "Filtrá contenido explícito y logs de actividad.",
      "Auditá apps autorizadas y bots con permisos amplios.",
    ],
    alternatives: [
      { name: "Matrix / Element", note: "Chat federado y autocustodia posible." },
      { name: "Teamspeak / servidores propios", note: "Voz sin grafo social comercial." },
    ],
  },
];

export const riskLabel: Record<RiskLevel, string> = {
  alto: "Riesgo alto",
  medio: "Riesgo medio",
  bajo: "Riesgo bajo",
};
