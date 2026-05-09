"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";

export type QuizQuestion = {
  id: string;
  question: string;
  type: string;
  points: number;
  orderNumber: number;
  optionsJson?: unknown;
};

export function QuizTake({ quizId, questions }: { quizId: string; questions: QuizQuestion[] }) {
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ score: number; passScore: number; passed: boolean } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await fetch(`/api/quizzes/${quizId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ answersJson: answers }),
      });

      const data = (await response.json().catch(() => null)) as
        | { result?: { score: number; passScore: number; passed: boolean }; message?: string }
        | null;

      if (!response.ok) {
        setError(data?.message ?? "Gagal submit quiz");
        return;
      }

      if (!data?.result) {
        setError("Response tidak valid");
        return;
      }

      setResult(data.result);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {questions.map((q) => {
        const options = Array.isArray(q.optionsJson) ? (q.optionsJson as unknown[]) : null;
        return (
          <div
            key={q.id}
            className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <p className="text-sm font-black text-[var(--text)]">
                {q.orderNumber}. {q.question}
              </p>
              <span className="rounded-full border border-[var(--border)] bg-[var(--base)]/70 px-3 py-1 text-xs font-semibold text-[var(--muted)]">
                {q.points} pts
              </span>
            </div>

            {options ? (
              <div className="mt-4 grid gap-2">
                {options.map((opt) => {
                  const value = String(opt);
                  const checked = answers[q.id] === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: value }))}
                      className={`rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition-colors ${
                        checked
                          ? "border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-ink)]"
                          : "border-[var(--border)] bg-[var(--surface)] text-[var(--text)] hover:bg-black/5"
                      }`}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="mt-4">
                <input
                  className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/15"
                  placeholder="Jawaban kamu…"
                  value={typeof answers[q.id] === "string" ? (answers[q.id] as string) : ""}
                  onChange={(e) => setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
                />
              </div>
            )}
          </div>
        );
      })}

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      ) : null}

      {result ? (
        <div
          className={`rounded-[28px] border px-6 py-5 text-sm font-semibold ${
            result.passed
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-[var(--border)] bg-[var(--base)]/70 text-[var(--text)]"
          }`}
        >
          Skor: {Math.round(result.score)} / 100 — {result.passed ? "Lulus" : "Belum lulus"} (min {result.passScore})
        </div>
      ) : null}

      <button
        type="button"
        onClick={onSubmit}
        disabled={isLoading}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-[var(--primary-ink)] hover:brightness-95 disabled:opacity-60"
      >
        {isLoading ? "Submitting…" : "Submit quiz"}
        <span className="grid h-8 w-8 place-items-center rounded-full bg-[var(--accent)] text-[var(--text)]">
          <ArrowUpRight size={18} />
        </span>
      </button>
    </div>
  );
}

