import type { Metadata } from "next";
import { Fraunces, Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Huella Digital — ¿A dónde van tus datos?",
  description:
    "Conocé qué es la huella digital, descubrí a dónde van tus datos según los servicios que usás y aprendé cómo recuperar el control.",
};

/** Corre antes de pintar: preferencia guardada, o la del sistema si todavía no eligió. */
const themeInitScript = `(function(){try{var s=localStorage.getItem("theme");var d=s==="dark"||(s!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches);var t=d?"dark":"light";var h=document.documentElement;h.setAttribute("data-theme",t);h.classList.toggle("dark",d);h.style.colorScheme=t;}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${outfit.variable} ${fraunces.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
