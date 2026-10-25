"use client";

import { useMemo, useState, useTransition } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/star-rating";
import {
  questions,
  scoreAnswers,
  visibleQuestionIndexes,
  type AnswerMap,
  type ScoreResult,
} from "@/data/quiz";
import { cn } from "@/lib/utils";

type Phase = "landing" | "quiz" | "results";

export function HuellaApp() {
  const [phase, setPhase] = useState<Phase>("landing");
  const [cursor, setCursor] = useState(0);
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
  const progress =
    phase === "quiz"
      ? (safeCursor + 1) / Math.max(total, 1)
      : phase === "results"
        ? 1
        : 0;

  function start() {
    startTransition(() => {
      setPhase("quiz");
      setCursor(0);
      setAnswers({});
    });
  }

  function setAnswer(value: string | string[]) {
    if (!question) return;
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
  }

  function canContinue() {
    if (!question) return false;
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
      setPhase("results");
    });
  }

  function reset() {
    startTransition(() => {
      setPhase("landing");
      setCursor(0);
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
          onChange={setAnswer}
          onBack={back}
          onNext={next}
          canContinue={canContinue()}
        />
      )}
      {phase === "results" && result && (
        <Results result={result} onReset={reset} />
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
      <div className="fade-in-later mt-14">
        <Button
          size="lg"
          onClick={onStart}
          className="h-12 min-w-[200px] rounded-sm bg-foreground px-8 text-base font-medium tracking-wide text-background transition-transform hover:bg-foreground/90 active:scale-[0.98]"
        >
          Empezar test
        </Button>
      </div>
    </main>
  );
}

function QuizStep({
  stepNumber,
  total,
  question,
  value,
  onChange,
  onBack,
  onNext,
  canContinue,
}: {
  stepNumber: number;
  total: number;
  question: (typeof questions)[number];
  value: string | string[] | undefined;
  onChange: (v: string | string[]) => void;
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

    if (id === "none") {
      onChange(selected.has("none") ? [] : ["none"]);
      return;
    }

    const next = new Set(selected);
    next.delete("none");
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onChange(Array.from(next));
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
          return (
            <li key={opt.id}>
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
  onReset,
}: {
  result: ScoreResult;
  onReset: () => void;
}) {
  const networks = result.networksDetail ?? [];
  const tips = result.tips ?? [];
  const tutorial = result.phoneTutorial;
  const photoAdvice = result.photoAdvice;

  return (
    <main className="relative z-10 mx-auto flex w-full max-w-xl flex-1 flex-col px-6 py-10 sm:py-12">
      <header className="fade-in text-center">
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

      {networks.length > 0 && (
        <section className="fade-in-late mt-12 border-t border-border pt-8">
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
            Tips según tus respuestas
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
            {(tutorial.steps ?? []).map((step, i) => (
              <li key={step.title} className="flex gap-4">
                <span className="font-display text-xl text-[var(--mark)] tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="font-medium tracking-tight">{step.title}</p>
                  <p className="mt-1 text-[15px] leading-relaxed text-[#3d4650]">
                    {step.detail}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      <footer className="mt-14 flex flex-col items-center gap-4 border-t border-border py-8">
        <p className="max-w-sm text-center text-xs leading-relaxed text-muted-foreground">
          Experiencia orientativa. Los menús de cada sistema pueden cambiar de
          nombre según la versión; buscá los términos en Ajustes si no
          coinciden exactos.
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
