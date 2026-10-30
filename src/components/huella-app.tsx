"use client";

import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Minus,
  Moon,
  Plus,
  Sun,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/star-rating";
import {
  GRAPHENEOS_URL,
  LINUX_URL,
  isValidOtherTextAnswer,
  isValidTimeAnswer,
  otherTextKey,
  questions,
  scoreAnswers,
  TIME_HOURS_MAX,
  TIME_HOURS_MIN,
  visibleQuestionIndexes,
  type AnswerMap,
  type GuidedTutorial,
  type ScoreResult,
  type Tip,
  type TipPart,
} from "@/data/quiz";
import { cn } from "@/lib/utils";

function groupTipsBySection(
  tips: Tip[],
): { section: string; items: TipPart[][] }[] {
  const order: string[] = [];
  const map = new Map<string, TipPart[][]>();
  for (const t of tips) {
    const list = map.get(t.section);
    if (list) {
      list.push(t.parts);
    } else {
      map.set(t.section, [t.parts]);
      order.push(t.section);
    }
  }
  return order.map((section) => ({
    section,
    items: map.get(section) ?? [],
  }));
}

function TipText({ parts }: { parts: TipPart[] }) {
  return (
    <>
      {parts.map((part, i) =>
        typeof part === "string" ? (
          <span key={i}>{part}</span>
        ) : (
          <a
            key={i}
            href={part.href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-[var(--mark)] underline decoration-[var(--mark)]/70 underline-offset-2 hover:opacity-80"
          >
            {part.label}
          </a>
        ),
      )}
    </>
  );
}

const THEME_KEY = "theme";

function readStoredTheme(): "light" | "dark" | null {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    /* localStorage no disponible */
  }
  return null;
}

/** Misma regla que el script del layout: lo guardado, o si no, el sistema. */
function applyTheme(theme: "light" | "dark") {
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
}

function applyStoredTheme(): "light" | "dark" {
  const stored = readStoredTheme();
  const theme: "light" | "dark" =
    stored === "light" || stored === "dark"
      ? stored
      : window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
  applyTheme(theme);
  return theme;
}

type Phase = "landing" | "quiz" | "results";
type ResultStep =
  | "score"
  | "compare"
  | "destinations"
  | "advice"
  | "phone"
  | "os";

export function HuellaApp() {
  const [phase, setPhase] = useState<Phase>("landing");
  const [cursor, setCursor] = useState(0);
  const [resultStep, setResultStep] = useState<ResultStep>("score");
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [, startTransition] = useTransition();

  useLayoutEffect(() => {
    applyStoredTheme();
    document.documentElement.classList.add("theme-ready");
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (readStoredTheme()) return;
      applyTheme(mq.matches ? "dark" : "light");
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const visible = useMemo(
    () => visibleQuestionIndexes(answers),
    [answers],
  );

  const result = useMemo(
    () => (phase === "results" ? scoreAnswers(answers) : null),
    [phase, answers],
  );

  const resultSteps = useMemo(() => {
    const steps: ResultStep[] = ["score", "compare"];
    if ((result?.networksDetail?.length ?? 0) > 0) steps.push("destinations");
    steps.push("advice");
    if (result?.phoneTutorial) steps.push("phone");
    if (result?.osTutorial) steps.push("os");
    return steps;
  }, [result]);

  const safeCursor = Math.min(cursor, Math.max(visible.length - 1, 0));
  const questionIndex = visible[safeCursor] ?? 0;
  const question = questions[questionIndex];
  const total = visible.length;
  const resultIndex = Math.max(0, resultSteps.indexOf(resultStep));
  const progress =
    phase === "quiz"
      ? (safeCursor + 1) / Math.max(total, 1)
      : phase === "results"
        ? (resultIndex + 1) / Math.max(resultSteps.length, 1)
        : 0;

  function start() {
    startTransition(() => {
      setPhase("quiz");
      setCursor(0);
      setResultStep("score");
      setAnswers({});
    });
  }

  function setAnswer(value: string | string[]) {
    if (!question) return;
    setAnswers((prev) => {
      const next = { ...prev, [question.id]: value };
      delete next.timeHours;
      const hasOtherOption = question.options.some((o) => o.customText);
      if (hasOtherOption) {
        const selected = Array.isArray(value)
          ? value
          : typeof value === "string"
            ? [value]
            : [];
        if (!selected.includes("other")) {
          delete next[otherTextKey(question.id)];
        }
      }
      return next;
    });
  }

  function setCustomText(text: string) {
    if (!question) return;
    setAnswers((prev) => {
      if (question.type === "multi") {
        const prevList = Array.isArray(prev[question.id])
          ? (prev[question.id] as string[])
          : [];
        const list = prevList.includes("other")
          ? prevList
          : [...prevList, "other"];
        return {
          ...prev,
          [question.id]: list,
          [otherTextKey(question.id)]: text,
        };
      }
      return {
        ...prev,
        [question.id]: "other",
        [otherTextKey(question.id)]: text,
      };
    });
  }

  function canContinue() {
    if (!question) return false;
    if (question.type === "hours" || question.id === "time") {
      return isValidTimeAnswer(answers);
    }
    const selectedIds = Array.isArray(answers[question.id])
      ? (answers[question.id] as string[])
      : typeof answers[question.id] === "string"
        ? [answers[question.id] as string]
        : [];
    const textRequired = question.options.some(
      (o) =>
        o.customText && !o.customTextOptional && selectedIds.includes(o.id),
    );
    if (textRequired) {
      return isValidOtherTextAnswer(answers, question.id);
    }
    const v = answers[question.id];
    if (question.type === "multi") return Array.isArray(v) && v.length > 0;
    return typeof v === "string" && v.length > 0;
  }

  function back() {
    if (phase === "quiz" && safeCursor === 0) {
      startTransition(() => setPhase("landing"));
      return;
    }
    if (phase === "quiz") setCursor((c) => Math.max(0, c - 1));
  }

  function next() {
    if (!canContinue()) return;
    if (safeCursor < total - 1) {
      setCursor((c) => c + 1);
      return;
    }
    startTransition(() => {
      setResultStep("score");
      setPhase("results");
    });
  }

  function reset() {
    startTransition(() => {
      setPhase("landing");
      setCursor(0);
      setResultStep("score");
      setAnswers({});
    });
  }

  return (
    <div className="relative flex min-h-full flex-1 flex-col">
      {phase === "landing" && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.45]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, var(--dot) 1px, transparent 0)",
            backgroundSize: "28px 28px",
            maskImage:
              "radial-gradient(ellipse 70% 55% at 50% 35%, black 20%, transparent 75%)",
          }}
        />
      )}

      {phase !== "landing" && (
        <div className="relative z-10 mx-auto w-full max-w-xl px-6 pt-8">
          <div className="h-[2px] w-full bg-[var(--track)]">
            <div
              className="h-full bg-[var(--mark)] transition-[width] duration-500 ease-out"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>
        </div>
      )}

      {phase === "landing" && <Landing onStart={start} />}
      {phase === "quiz" && question && (
        <QuizStep
          key={question.id}
          stepNumber={safeCursor + 1}
          total={total}
          question={question}
          value={answers[question.id]}
          customText={
            typeof answers[otherTextKey(question.id)] === "string"
              ? String(answers[otherTextKey(question.id)])
              : ""
          }
          onChange={setAnswer}
          onCustomText={setCustomText}
          onBack={back}
          onNext={next}
          canContinue={canContinue()}
        />
      )}
      {phase === "results" && result && (
        <Results
          result={result}
          step={resultStep}
          onStep={setResultStep}
          onReset={reset}
        />
      )}
    </div>
  );
}

function Landing({ onStart }: { onStart: () => void }) {
  return (
    <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
      <h1 className="fade-in font-display text-6xl leading-[0.9] tracking-[0.04em] text-[var(--mark)] uppercase sm:text-7xl">
        Huella
        <br />
        Digital
      </h1>
      <div className="fade-in-late mx-auto mt-8 h-px w-16 origin-center bg-[var(--mark)] line-draw" />
      <p className="fade-in-late mx-auto mt-10 max-w-md text-lg leading-relaxed text-[var(--copy)] sm:text-xl">
        Cada app, cuenta y clic deja rastros: quién sos, dónde estás y qué te
        interesa. Esa es tu{" "}
        <span className="font-medium text-foreground">huella digital</span> —
        y casi siempre viaja más lejos de lo que imaginas.
      </p>
      <div className="fade-in-later mt-14 flex flex-col items-center gap-4">
        <div className="flex items-center gap-3">
          <Button
            size="lg"
            onClick={onStart}
            className="h-12 min-w-[200px] rounded-sm bg-foreground px-8 text-base font-medium tracking-wide text-background transition-[transform,background-color,color] hover:bg-foreground/90 active:scale-[0.98]"
          >
            Empezar test
          </Button>
          <ThemeToggle />
        </div>
        <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
          Guardamos tus respuestas de forma anónima.
        </p>
      </div>
    </main>
  );
}

function ThemeToggle() {
  function toggle() {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "light" ? "dark" : "light";
    applyTheme(next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      /* almacenamiento bloqueado: el tema igual cambia en esta visita */
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Cambiar entre tema claro y oscuro"
      className="relative grid size-12 shrink-0 place-items-center rounded-sm border border-border bg-transparent text-foreground hover:border-foreground/40"
    >
      <Sun className="pointer-events-none col-start-1 row-start-1 size-5 transition-all duration-300 ease-out dark:scale-0 dark:rotate-90 dark:opacity-0" />
      <Moon className="pointer-events-none col-start-1 row-start-1 size-5 scale-0 -rotate-90 opacity-0 transition-all duration-300 ease-out dark:scale-100 dark:rotate-0 dark:opacity-100" />
    </button>
  );
}

function QuizStep({
  stepNumber,
  total,
  question,
  value,
  customText,
  onChange,
  onCustomText,
  onBack,
  onNext,
  canContinue,
}: {
  stepNumber: number;
  total: number;
  question: (typeof questions)[number];
  value: string | string[] | undefined;
  customText: string;
  onChange: (v: string | string[]) => void;
  onCustomText: (text: string) => void;
  onBack: () => void;
  onNext: () => void;
  canContinue: boolean;
}) {
  const selected = useMemo(() => {
    if (question.type === "multi") {
      return new Set(Array.isArray(value) ? value : []);
    }
    return new Set(typeof value === "string" ? [value] : []);
  }, [question.type, value]);

  const hoursValue =
    typeof value === "string" && value !== "" && Number.isFinite(Number(value))
      ? Number(value)
      : null;

  function pick(id: string) {
    if (question.type === "single") {
      onChange(id);
      return;
    }

    // Opciones excluyentes dentro de multi
    const exclusive = new Set(["none", "local"]);
    if (exclusive.has(id)) {
      onChange(selected.has(id) ? [] : [id]);
      return;
    }

    const next = new Set(selected);
    for (const ex of exclusive) next.delete(ex);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onChange(Array.from(next));
  }

  function bumpHours(delta: number) {
    const current = hoursValue ?? 0;
    const next = Math.min(
      TIME_HOURS_MAX,
      Math.max(TIME_HOURS_MIN, current + delta),
    );
    onChange(String(next));
  }

  function onHoursInput(raw: string) {
    const digits = raw.replace(/\D/g, "").slice(0, 2);
    if (digits === "") {
      onChange("");
      return;
    }
    const n = Number(digits);
    if (n > TIME_HOURS_MAX) {
      onChange(String(TIME_HOURS_MAX));
      return;
    }
    onChange(digits);
  }

  return (
    <main className="relative z-10 mx-auto flex w-full max-w-xl flex-1 flex-col px-6 py-10 sm:py-12">
      <button
        type="button"
        onClick={onBack}
        className="fade-in mb-8 inline-flex items-center gap-1.5 self-start text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        Volver
      </button>

      <p className="fade-in text-xs tracking-[0.18em] text-muted-foreground uppercase">
        Paso {stepNumber} de {total}
      </p>
      <h1 className="fade-in mt-3 font-display text-3xl leading-tight tracking-tight sm:text-[2.1rem]">
        {question.title}
      </h1>
      {question.hint && (
        <p className="fade-in-late mt-3 text-sm text-muted-foreground">
          {question.hint}
        </p>
      )}

      {question.type === "hours" ? (
        <div className="fade-in-late mt-10 flex flex-col items-center gap-4">
          <div className="flex items-center gap-4">
            <button
              type="button"
              aria-label="Restar una hora"
              onClick={() => bumpHours(-1)}
              disabled={hoursValue !== null && hoursValue <= TIME_HOURS_MIN}
              className="flex size-12 items-center justify-center border border-border transition-colors hover:border-foreground/40 disabled:opacity-30"
            >
              <Minus className="size-5" />
            </button>
            <div className="flex min-w-[7.5rem] flex-col items-center">
              <input
                id="time-hours"
                type="text"
                inputMode="numeric"
                value={hoursValue === null ? "" : String(hoursValue)}
                onChange={(e) => onHoursInput(e.target.value)}
                placeholder="0"
                aria-label="Horas al día"
                className="w-full border-0 bg-transparent text-center font-display text-5xl tabular-nums tracking-tight outline-none"
              />
              <span className="text-sm text-muted-foreground">
                {hoursValue === 1 ? "hora" : "horas"} al día
              </span>
            </div>
            <button
              type="button"
              aria-label="Sumar una hora"
              onClick={() => bumpHours(1)}
              disabled={hoursValue !== null && hoursValue >= TIME_HOURS_MAX}
              className="flex size-12 items-center justify-center border border-border transition-colors hover:border-foreground/40 disabled:opacity-30"
            >
              <Plus className="size-5" />
            </button>
          </div>
        </div>
      ) : (
        <ul className="fade-in-late mt-8 space-y-2">
          {question.options.map((opt) => {
            const active = selected.has(opt.id);
            const showText = Boolean(opt.customText && active);

            return (
              <li key={opt.id} className="space-y-2">
                <button
                  type="button"
                  onClick={() => pick(opt.id)}
                  className={cn(
                    "flex w-full items-center gap-3 border px-4 py-3.5 text-left text-[15px] leading-snug transition-colors",
                    active
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-transparent hover:border-foreground/35",
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "mt-0.5 flex size-4 shrink-0 items-center justify-center border",
                      question.type === "single" && "rounded-full",
                      active
                        ? "border-background/80 bg-background text-foreground"
                        : "border-current/30",
                    )}
                  >
                    {active && question.type === "single" && (
                      <span className="size-1.5 rounded-full bg-foreground" />
                    )}
                    {active && question.type === "multi" && (
                      <svg viewBox="0 0 12 12" className="size-2.5" fill="none">
                        <path
                          d="M2.5 6.2 4.8 8.5 9.5 3.5"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </span>
                  {opt.label}
                </button>

                {showText && (
                  <div className="fade-in border border-border px-4 py-3">
                    <label
                      htmlFor={`custom-text-${opt.id}`}
                      className="mb-2 block text-sm text-muted-foreground"
                    >
                      {opt.customTextLabel ?? "Contanos más"}
                    </label>
                    <input
                      id={`custom-text-${opt.id}`}
                      type="text"
                      inputMode="text"
                      enterKeyHint="done"
                      value={customText}
                      onChange={(e) =>
                        onCustomText(e.target.value.slice(0, 120))
                      }
                      onFocus={(e) =>
                        e.currentTarget.scrollIntoView({
                          block: "nearest",
                          inline: "nearest",
                        })
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") e.currentTarget.blur();
                      }}
                      placeholder={
                        opt.customTextPlaceholder ?? "Escribí acá…"
                      }
                      autoComplete="off"
                      autoCapitalize="sentences"
                      className="h-11 w-full border border-border bg-transparent px-3 text-base outline-none focus:border-foreground"
                    />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <div className="fade-in-later mt-auto flex justify-end pt-10">
        <Button
          size="lg"
          disabled={!canContinue}
          onClick={onNext}
          className="h-11 rounded-sm bg-foreground px-6 text-background hover:bg-foreground/90 disabled:opacity-40"
        >
          {stepNumber === total ? "Ver mi puntuación" : "Continuar"}
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </main>
  );
}

function Results({
  result,
  step,
  onStep,
  onReset,
}: {
  result: ScoreResult;
  step: ResultStep;
  onStep: (s: ResultStep) => void;
  onReset: () => void;
}) {
  if (step === "score") {
    return (
      <main
        key="score"
        className="relative z-10 mx-auto flex w-full max-w-xl flex-1 flex-col px-6 py-10 sm:py-12"
      >
        <header className="fade-in flex flex-1 flex-col items-center justify-center text-center">
          <p className="text-sm tracking-[0.2em] text-[var(--mark)] uppercase">
            Tu puntuación
          </p>
          <div className="mt-6">
            <StarRating stars={result.stars} animate />
          </div>
          <p className="mt-4 font-display text-4xl tracking-tight sm:text-5xl">
            {result.stars}
            <span className="text-2xl text-muted-foreground sm:text-3xl">
              /5
            </span>
          </p>
          <h1 className="mt-3 font-display text-2xl tracking-tight">
            {result.label}
          </h1>
          <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-[var(--copy)]">
            {result.summary}
          </p>
          <p className="mt-4 text-xs tracking-wide text-muted-foreground uppercase">
            Índice {result.score}/100
          </p>
        </header>

        <div className="fade-in-later mt-10 flex justify-center pb-4">
          <Button
            size="lg"
            onClick={() => onStep("compare")}
            className="h-11 rounded-sm bg-foreground px-6 text-background hover:bg-foreground/90"
          >
            Ver comparación
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </main>
    );
  }

  if (step === "compare") {
    const c = result.comparison;
    return (
      <main
        key="compare"
        className="relative z-10 mx-auto flex w-full max-w-xl flex-1 flex-col px-6 py-10 sm:py-12"
      >
        <button
          type="button"
          onClick={() => onStep("score")}
          className="fade-in mb-8 inline-flex items-center gap-1.5 self-start text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Volver
        </button>

        <header className="fade-in">
          <p className="text-sm tracking-[0.2em] text-[var(--mark)] uppercase">
            Estadísticas
          </p>
          <h1 className="mt-3 font-display text-3xl tracking-tight sm:text-4xl">
            Vos frente al promedio
          </h1>
          <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-[var(--copy)]">
            Comparación orientativa con el promedio de uso diario de redes
            sociales en Latinoamérica y España.
          </p>
        </header>

        <section className="fade-in-late mt-10 space-y-8">
          <StatBlock
            title="Redes sociales"
            userLabel={`Vos: ${formatHours(c.userSocialHours)}`}
            userSub={c.userSocialLabel}
            avgLabel={`Promedio LatAm + España: ${formatHours(c.avgSocialHours)}`}
            userValue={c.userSocialHours}
            avgValue={c.avgSocialHours}
            max={Math.max(16, c.userSocialHours, c.avgSocialHours)}
            verdict={c.socialVerdict}
          />
        </section>

        <p className="fade-in-later mt-8 text-[15px] leading-relaxed text-[var(--copy)]">
          {c.blurb}
        </p>

        <div className="mt-auto flex justify-end pt-10">
          <Button
            size="lg"
            onClick={() =>
              onStep(
                (result.networksDetail?.length ?? 0) > 0
                  ? "destinations"
                  : "advice",
              )
            }
            className="h-11 rounded-sm bg-foreground px-6 text-background hover:bg-foreground/90"
          >
            {(result.networksDetail?.length ?? 0) > 0
              ? "A dónde van tus datos"
              : "Ver consejos"}
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </main>
    );
  }

  if (step === "destinations") {
    return (
      <DestinationsStep
        destinations={result.networksDetail ?? []}
        onBack={() => onStep("compare")}
        onNext={() => onStep("advice")}
      />
    );
  }

  if (step === "advice") {
    const tips = result.tips ?? [];
    const photoAdvice = result.photoAdvice ?? [];
    const hasPhoneTutorial = Boolean(result.phoneTutorial);
    const hasOsTutorial = Boolean(result.osTutorial);
    const hasDestinations = (result.networksDetail?.length ?? 0) > 0;
    const tipGroups = groupTipsBySection([...tips, ...photoAdvice]);
    const watchNote = result.networksWatchNote;
    const hasAdviceContent = tipGroups.length > 0 || Boolean(watchNote);
    const nextTutorial: ResultStep | null = hasPhoneTutorial
      ? "phone"
      : hasOsTutorial
        ? "os"
        : null;

    return (
      <main
        key="advice"
        className="relative z-10 mx-auto flex w-full max-w-xl flex-1 flex-col px-6 py-10 sm:py-12"
      >
        <button
          type="button"
          onClick={() => onStep(hasDestinations ? "destinations" : "compare")}
          className="fade-in mb-8 inline-flex items-center gap-1.5 self-start text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Volver
        </button>

        <header className="fade-in">
          <h1 className="font-display text-3xl tracking-tight sm:text-4xl">
            Consejos personalizados
          </h1>
          {tipGroups.length > 0 && (
            <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-[var(--copy)]">
              Elegí alguno de estos cambios para empezar
            </p>
          )}
        </header>

        {(tipGroups.length > 0 || watchNote) && (
          <section className="fade-in-late mt-12 space-y-8 border-t border-border pt-8">
            {watchNote &&
              !tipGroups.some((g) => g.section === "Redes sociales") && (
                <div>
                  <h2 className="text-xs font-medium tracking-[0.14em] text-[var(--mark)] uppercase">
                    Redes sociales
                  </h2>
                  <p className="mt-3 text-[15px] leading-relaxed text-[var(--copy)]">
                    {watchNote}
                  </p>
                </div>
              )}
            {tipGroups.map((group) => (
              <div key={group.section}>
                <h2 className="text-xs font-medium tracking-[0.14em] text-[var(--mark)] uppercase">
                  {group.section}
                </h2>
                {group.section === "Redes sociales" && watchNote && (
                  <p className="mt-3 text-[15px] leading-relaxed text-[var(--copy)]">
                    {watchNote}
                  </p>
                )}
                <ul
                  className={cn(
                    "list-disc space-y-2.5 pl-5 text-[15px] leading-relaxed text-[var(--copy)]",
                    group.section === "Redes sociales" && watchNote
                      ? "mt-4"
                      : "mt-3",
                  )}
                >
                  {group.items.map((parts, i) => (
                    <li key={i}>
                      <TipText parts={parts} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        )}

        <footer
          className={cn(
            "flex flex-col items-center gap-4 py-8",
            hasAdviceContent
              ? "mt-14 border-t border-border"
              : "mt-10",
          )}
        >
          {hasAdviceContent && (
            <p className="max-w-sm text-center text-sm leading-relaxed text-[var(--copy)]">
              Cada pequeño cambio suma. Volvé cuando quieras y medí de nuevo
              cómo va tu huella.
            </p>
          )}
          {nextTutorial === "phone" && (
            <Button
              size="lg"
              onClick={() => onStep("phone")}
              className="h-11 rounded-sm bg-foreground px-6 text-background hover:bg-foreground/90"
            >
              Configurá mejor tu teléfono
              <ArrowRight className="size-4" />
            </Button>
          )}
          {nextTutorial === "os" && result.osTutorial && (
            <Button
              size="lg"
              onClick={() => onStep("os")}
              className="h-11 rounded-sm bg-foreground px-6 text-background hover:bg-foreground/90"
            >
              Configurá mejor tu {result.osTutorial.title}
              <ArrowRight className="size-4" />
            </Button>
          )}
          <Button
            variant="outline"
            onClick={onReset}
            className="rounded-sm border-foreground/20"
          >
            Empezar de nuevo
          </Button>
        </footer>

        <ScrollToBottomHint />
      </main>
    );
  }

  if (step === "phone" && result.phoneTutorial) {
    return (
      <TutorialStep
        key="phone"
        eyebrow="Teléfono"
        tutorial={result.phoneTutorial}
        nextLevel={{
          before: "Si querés llevar tu privacidad al siguiente nivel, usá ",
          label: "GrapheneOS",
          href: GRAPHENEOS_URL,
        }}
        onBack={() => onStep("advice")}
        nextAction={
          result.osTutorial
            ? {
                label: `Configurá mejor tu ${result.osTutorial.title}`,
                onClick: () => onStep("os"),
              }
            : null
        }
        onReset={onReset}
      />
    );
  }

  if (step === "os" && result.osTutorial) {
    return (
      <TutorialStep
        key="os"
        eyebrow="Computadora"
        tutorial={result.osTutorial}
        nextLevel={{
          before: "Si querés llevar tu privacidad al siguiente nivel, usá ",
          label: "Linux",
          href: LINUX_URL,
        }}
        onBack={() =>
          onStep(result.phoneTutorial ? "phone" : "advice")
        }
        nextAction={null}
        onReset={onReset}
      />
    );
  }

  return null;
}

function TutorialStep({
  eyebrow,
  tutorial,
  nextLevel,
  onBack,
  nextAction,
  onReset,
}: {
  eyebrow: string;
  tutorial: GuidedTutorial;
  nextLevel: { before: string; label: string; href: string };
  onBack: () => void;
  nextAction: { label: string; onClick: () => void } | null;
  onReset: () => void;
}) {
  return (
    <main className="relative z-10 mx-auto flex w-full max-w-xl flex-1 flex-col px-6 py-10 sm:py-12">
      <button
        type="button"
        onClick={onBack}
        className="fade-in mb-8 inline-flex items-center gap-1.5 self-start text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        Volver
      </button>

      <header className="fade-in">
        <p className="text-sm tracking-[0.2em] text-[var(--mark)] uppercase">
          {eyebrow}
        </p>
        <h1 className="mt-3 font-display text-3xl tracking-tight sm:text-4xl">
          Guía — {tutorial.title}
        </h1>
        <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-[var(--copy)]">
          {tutorial.intro}
        </p>
      </header>

      <ol className="fade-in-late mt-10 space-y-5 border-t border-border pt-8">
        {(tutorial.steps ?? []).map((s, i) => (
          <li key={s.title} className="flex gap-4">
            <span className="font-display text-xl text-[var(--mark)] tabular-nums">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <p className="font-medium tracking-tight">{s.title}</p>
              <p className="mt-1 text-[15px] leading-relaxed text-[var(--copy)]">
                {s.detail}{" "}
                {s.link && (
                  <a
                    href={s.link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-[var(--mark)] underline decoration-[var(--mark)]/70 underline-offset-2 hover:opacity-80"
                  >
                    {s.link.label}
                  </a>
                )}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <footer className="mt-14 flex flex-col items-center gap-4 border-t border-border py-8">
        <p className="max-w-sm text-center text-[15px] leading-relaxed text-[var(--copy)]">
          {nextLevel.before}
          <a
            href={nextLevel.href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground underline underline-offset-2 transition-colors hover:text-[var(--mark)]"
          >
            {nextLevel.label}
          </a>
          .
        </p>
        <p className="max-w-sm text-center text-xs leading-relaxed text-muted-foreground">
          Los menús pueden cambiar de nombre según la versión del sistema.
          Buscá estos términos en Ajustes si no coinciden exactamente.
        </p>
        {nextAction && (
          <Button
            size="lg"
            onClick={nextAction.onClick}
            className="h-11 rounded-sm bg-foreground px-6 text-background hover:bg-foreground/90"
          >
            {nextAction.label}
            <ArrowRight className="size-4" />
          </Button>
        )}
        <Button
          variant="outline"
          onClick={onReset}
          className="rounded-sm border-foreground/20"
        >
          Empezar de nuevo
        </Button>
      </footer>

      <ScrollToBottomHint />
    </main>
  );
}

function DestinationsStep({
  destinations,
  onBack,
  onNext,
}: {
  destinations: { id: string; name: string; note: string }[];
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <main
      key="destinations"
      className="relative z-10 mx-auto flex w-full max-w-xl flex-1 flex-col px-6 py-10 sm:py-12"
    >
      <button
        type="button"
        onClick={onBack}
        className="fade-in mb-8 inline-flex items-center gap-1.5 self-start text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        Volver
      </button>

      <header className="fade-in">
        <h1 className="font-display text-3xl tracking-tight sm:text-4xl">
          A dónde van tus datos
        </h1>
        <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-[var(--copy)]">
          Según tus respuestas, estas son las empresas que más acumulan tu
          rastro: las redes, cómo entrás, el celular, la nube y la inteligencia
          artificial.
        </p>
      </header>

      <ul className="fade-in-late mt-10 space-y-5 border-t border-border pt-8">
        {destinations.map((n) => (
          <li key={n.id}>
            <p className="font-display text-lg tracking-tight">{n.name}</p>
            <p className="mt-1 text-[15px] leading-relaxed text-[var(--copy)]">
              {n.note}
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-auto flex justify-end pt-10">
        <Button
          size="lg"
          onClick={onNext}
          className="h-11 rounded-sm bg-foreground px-6 text-background hover:bg-foreground/90"
        >
          Consejos personalizados
          <ArrowRight className="size-4" />
        </Button>
      </div>

      <ScrollToBottomHint />
    </main>
  );
}

function ScrollToBottomHint() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function update() {
      const doc = document.documentElement;
      const overflow = doc.scrollHeight > window.innerHeight + 24;
      const nearBottom =
        window.scrollY + window.innerHeight >= doc.scrollHeight - 48;
      setVisible(overflow && !nearBottom);
    }

    update();
    const id = window.setTimeout(update, 100);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-5 z-20 flex justify-center">
      <button
        type="button"
        aria-label="Ir abajo"
        onClick={() => {
          window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: "smooth",
          });
        }}
        className="scroll-hint flex size-10 items-center justify-center rounded-sm bg-foreground text-background shadow-sm transition-opacity hover:opacity-90"
      >
        <ChevronDown className="size-5" />
      </button>
    </div>
  );
}

function formatHours(h: number) {
  if (h < 1) return `${Math.round(h * 60)} min`;
  const whole = Math.floor(h);
  const mins = Math.round((h - whole) * 60);
  if (mins === 0) return `${whole} h`;
  return `${whole} h ${mins} min`;
}

function StatBlock({
  title,
  userLabel,
  userSub,
  avgLabel,
  userValue,
  avgValue,
  max,
  verdict,
}: {
  title: string;
  userLabel: string;
  userSub?: string;
  avgLabel: string;
  userValue: number;
  avgValue: number;
  max: number;
  verdict: string;
}) {
  const userPct = Math.min(100, (userValue / max) * 100);
  const avgPct = Math.min(100, (avgValue / max) * 100);

  return (
    <div className="border-t border-border pt-8 first:border-t-0 first:pt-0">
      <h2 className="text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">
        {title}
      </h2>
      <div className="mt-5 space-y-4">
        <div>
          <div className="mb-1.5 flex items-baseline justify-between gap-3">
            <span className="text-sm font-medium">{userLabel}</span>
            {userSub && (
              <span className="text-xs text-muted-foreground">{userSub}</span>
            )}
          </div>
          <div className="h-2 w-full bg-[var(--track)]">
            <div
              className="h-full bg-[var(--mark)] transition-[width] duration-700 ease-out"
              style={{ width: `${userPct}%` }}
            />
          </div>
        </div>
        <div>
          <div className="mb-1.5 text-sm text-muted-foreground">{avgLabel}</div>
          <div className="h-2 w-full bg-[var(--track)]">
            <div
              className="h-full bg-foreground/35 transition-[width] duration-700 ease-out"
              style={{ width: `${avgPct}%` }}
            />
          </div>
        </div>
      </div>
      <p className="mt-4 text-[15px] leading-relaxed text-[var(--copy)]">
        {verdict}
      </p>
    </div>
  );
}
