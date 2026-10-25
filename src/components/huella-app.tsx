"use client";

import { useMemo, useState, useTransition } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/star-rating";
import {
  isValidTimeAnswer,
  questions,
  scoreAnswers,
  TIME_CUSTOM_MAX,
  TIME_CUSTOM_MIN,
  visibleQuestionIndexes,
  type AnswerMap,
  type ScoreResult,
} from "@/data/quiz";
import { cn } from "@/lib/utils";

type Phase = "landing" | "quiz" | "results";
type ResultStep = "score" | "compare" | "advice";

const RESULT_STEPS: ResultStep[] = ["score", "compare", "advice"];

export function HuellaApp() {
  const [phase, setPhase] = useState<Phase>("landing");
  const [cursor, setCursor] = useState(0);
  const [resultStep, setResultStep] = useState<ResultStep>("score");
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [, startTransition] = useTransition();

  const visible = useMemo(
    () => visibleQuestionIndexes(answers),
    [answers],
  );

  const result = useMemo(
    () => (phase === "results" ? scoreAnswers(answers) : null),
    [phase, answers],
  );
  const safeCursor = Math.min(cursor, Math.max(visible.length - 1, 0));
  const questionIndex = visible[safeCursor] ?? 0;
  const question = questions[questionIndex];
  const total = visible.length;
  const resultIndex = RESULT_STEPS.indexOf(resultStep);
  const progress =
    phase === "quiz"
      ? (safeCursor + 1) / Math.max(total, 1)
      : phase === "results"
        ? (resultIndex + 1) / RESULT_STEPS.length
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
      if (question.id === "time" && value !== "more") {
        delete next.timeHours;
      }
      return next;
    });
  }

  function setTimeHours(hours: string) {
    setAnswers((prev) => ({ ...prev, time: "more", timeHours: hours }));
  }

  function canContinue() {
    if (!question) return false;
    if (question.id === "time") return isValidTimeAnswer(answers);
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
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.45]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #b8c2cc 1px, transparent 0)",
          backgroundSize: "28px 28px",
          maskImage:
            "radial-gradient(ellipse 70% 55% at 50% 35%, black 20%, transparent 75%)",
        }}
      />

      {phase !== "landing" && (
        <div className="relative z-10 mx-auto w-full max-w-xl px-6 pt-8">
          <div className="h-[2px] w-full bg-[#d5dce3]">
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
          timeHours={
            typeof answers.timeHours === "string" ? answers.timeHours : ""
          }
          onChange={setAnswer}
          onTimeHours={setTimeHours}
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
      <p className="fade-in font-display text-sm tracking-[0.22em] text-[var(--mark)] uppercase">
        Huella Digital
      </p>
      <div className="fade-in-late mx-auto mt-8 h-px w-16 origin-center bg-[var(--mark)] line-draw" />
      <p className="fade-in-late mx-auto mt-10 max-w-md text-lg leading-relaxed text-[#3d4650] sm:text-xl">
        Cada app, cuenta y clic deja rastros: quiénes sos, dónde estás y qué te
        interesa. Esa es tu{" "}
        <span className="font-medium text-foreground">huella digital</span> —
        y casi siempre viaja más lejos de lo que imaginás.
      </p>
      <div className="fade-in-later mt-14 flex flex-col items-center gap-4">
        <Button
          size="lg"
          onClick={onStart}
          className="h-12 min-w-[200px] rounded-sm bg-foreground px-8 text-base font-medium tracking-wide text-background transition-transform hover:bg-foreground/90 active:scale-[0.98]"
        >
          Empezar test
        </Button>
        <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
          Guardamos tus respuestas de forma anónima.
        </p>
      </div>
    </main>
  );
}

function QuizStep({
  stepNumber,
  total,
  question,
  value,
  timeHours,
  onChange,
  onTimeHours,
  onBack,
  onNext,
  canContinue,
}: {
  stepNumber: number;
  total: number;
  question: (typeof questions)[number];
  value: string | string[] | undefined;
  timeHours: string;
  onChange: (v: string | string[]) => void;
  onTimeHours: (hours: string) => void;
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

  function onHoursInput(raw: string) {
    const digits = raw.replace(/\D/g, "").slice(0, 2);
    if (digits === "") {
      onTimeHours("");
      return;
    }
    const n = Number(digits);
    if (n > TIME_CUSTOM_MAX) {
      onTimeHours(String(TIME_CUSTOM_MAX));
      return;
    }
    onTimeHours(digits);
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

      <ul className="fade-in-late mt-8 space-y-2">
        {question.options.map((opt) => {
          const active = selected.has(opt.id);
          const showHours = Boolean(opt.customHours && active);

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

              {showHours && (
                <div className="fade-in flex items-center gap-3 border border-border px-4 py-3">
                  <label
                    htmlFor="time-hours"
                    className="text-sm text-muted-foreground"
                  >
                    ¿Cuántas horas?
                  </label>
                  <input
                    id="time-hours"
                    type="number"
                    inputMode="numeric"
                    min={TIME_CUSTOM_MIN}
                    max={TIME_CUSTOM_MAX}
                    value={timeHours}
                    onChange={(e) => onHoursInput(e.target.value)}
                    placeholder={`${TIME_CUSTOM_MIN}–${TIME_CUSTOM_MAX}`}
                    className="h-9 w-24 border border-border bg-transparent px-2 text-center text-base tabular-nums outline-none focus:border-foreground"
                  />
                  <span className="text-sm text-muted-foreground">
                    máx. {TIME_CUSTOM_MAX}
                  </span>
                </div>
              )}
            </li>
          );
        })}
      </ul>

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
          <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-[#3d4650]">
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
            Vos vs. el promedio
          </h1>
          <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-[#3d4650]">
            Comparación orientativa con promedios globales de uso diario.
          </p>
        </header>

        <section className="fade-in-late mt-10 space-y-8">
          <StatBlock
            title="Redes sociales"
            userLabel={`Vos: ${formatHours(c.userSocialHours)}`}
            userSub={c.userSocialLabel}
            avgLabel={`Promedio: ${formatHours(c.avgSocialHours)}`}
            userValue={c.userSocialHours}
            avgValue={c.avgSocialHours}
            max={Math.max(16, c.userSocialHours, c.avgSocialHours)}
            verdict={c.socialVerdict}
          />
          <StatBlock
            title="Tiempo de pantalla (estimado)"
            userLabel={`Vos: ${formatHours(c.userPhoneHours)}`}
            userSub="redes + otras apps"
            avgLabel={`Promedio: ${formatHours(c.avgPhoneHours)}`}
            userValue={c.userPhoneHours}
            avgValue={c.avgPhoneHours}
            max={Math.max(18, c.userPhoneHours, c.avgPhoneHours)}
            verdict={c.phoneVerdict}
          />
        </section>

        <p className="fade-in-later mt-8 text-[15px] leading-relaxed text-[#3d4650]">
          {c.blurb}
        </p>

        <div className="mt-auto flex justify-end pt-10">
          <Button
            size="lg"
            onClick={() => onStep("advice")}
            className="h-11 rounded-sm bg-foreground px-6 text-background hover:bg-foreground/90"
          >
            Ver consejos
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </main>
    );
  }

  const networks = result.networksDetail ?? [];
  const tips = result.tips ?? [];
  const tutorial = result.phoneTutorial;
  const photoAdvice = result.photoAdvice;

  return (
    <main
      key="advice"
      className="relative z-10 mx-auto flex w-full max-w-xl flex-1 flex-col px-6 py-10 sm:py-12"
    >
      <button
        type="button"
        onClick={() => onStep("compare")}
        className="fade-in mb-8 inline-flex items-center gap-1.5 self-start text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        Volver
      </button>

      <header className="fade-in">
        <p className="text-sm tracking-[0.2em] text-[var(--mark)] uppercase">
          Consejos
        </p>
        <h1 className="mt-3 font-display text-3xl tracking-tight sm:text-4xl">
          Cómo cuidar tu huella
        </h1>
        <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-[#3d4650]">
          {result.encouragement}
        </p>
      </header>

      {networks.length > 0 && (
        <section className="fade-in-late mt-10 border-t border-border pt-8">
          <h2 className="text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">
            A dónde van tus datos
          </h2>
          <ul className="mt-6 space-y-5">
            {networks.map((n) => (
              <li key={n.id}>
                <p className="font-display text-lg tracking-tight">{n.name}</p>
                <p className="mt-1 text-[15px] leading-relaxed text-[#3d4650]">
                  {n.note}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {tips.length > 0 && (
        <section className="fade-in-late mt-12 border-t border-border pt-8">
          <h2 className="text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">
            Según tus respuestas
          </h2>
          <ul className="mt-6 space-y-5">
            {tips.map((t) => (
              <li key={`${t.from}-${t.text.slice(0, 28)}`}>
                <p className="text-xs font-medium tracking-[0.14em] text-[var(--mark)] uppercase">
                  {t.section}
                </p>
                <p className="mt-1.5 text-[15px] leading-relaxed text-[#3d4650]">
                  {t.text}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {photoAdvice && (
        <section className="fade-in-later mt-12 border-t border-border pt-8">
          <h2 className="text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">
            Tus fotos
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-[#3d4650]">
            {photoAdvice.text}
          </p>
        </section>
      )}

      {tutorial && (
        <section className="fade-in-later mt-12 border-t border-border pt-8">
          <h2 className="text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">
            Tutorial —{" "}
            {tutorial.platform === "android"
              ? "Android"
              : tutorial.platform === "iphone"
                ? "iPhone"
                : "Sin smartphone típico"}
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-[#3d4650]">
            {tutorial.intro}
          </p>
          <ol className="mt-6 space-y-5">
            {(tutorial.steps ?? []).map((s, i) => (
              <li key={s.title} className="flex gap-4">
                <span className="font-display text-xl text-[var(--mark)] tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="font-medium tracking-tight">{s.title}</p>
                  <p className="mt-1 text-[15px] leading-relaxed text-[#3d4650]">
                    {s.detail}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      <footer className="mt-14 flex flex-col items-center gap-4 border-t border-border py-8">
        <p className="max-w-sm text-center text-sm leading-relaxed text-[#3d4650]">
          Cada pequeño cambio suma. Volvé cuando quieras y medí de nuevo cómo
          va tu huella.
        </p>
        <p className="max-w-sm text-center text-xs leading-relaxed text-muted-foreground">
          Experiencia orientativa. Los menús de cada sistema pueden cambiar de
          nombre según la versión.
        </p>
        <Button
          variant="outline"
          onClick={onReset}
          className="rounded-sm border-foreground/20"
        >
          Empezar de nuevo
        </Button>
      </footer>
    </main>
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
          <div className="h-2 w-full bg-[#d5dce3]">
            <div
              className="h-full bg-[var(--mark)] transition-[width] duration-700 ease-out"
              style={{ width: `${userPct}%` }}
            />
          </div>
        </div>
        <div>
          <div className="mb-1.5 text-sm text-muted-foreground">{avgLabel}</div>
          <div className="h-2 w-full bg-[#d5dce3]">
            <div
              className="h-full bg-foreground/35 transition-[width] duration-700 ease-out"
              style={{ width: `${avgPct}%` }}
            />
          </div>
        </div>
      </div>
      <p className="mt-4 text-[15px] leading-relaxed text-[#3d4650]">
        {verdict}
      </p>
    </div>
  );
}
