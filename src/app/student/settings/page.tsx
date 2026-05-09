"use client";

import Link from "next/link";
import { useTheme } from "@/components/theme-provider";
import BackButton from "@/components/BackButton";

export default function StudentSettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <main className="min-h-screen bg-[var(--base)] px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-[40px] border border-[var(--border)] bg-[var(--surface)] p-7 md:p-10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-[var(--text)] md:text-4xl">
                Settings
              </h1>
              <p className="mt-2 text-sm text-[var(--muted)]">
                Atur tema dashboard (gelap/terang).
              </p>
            </div>
            <div className="flex items-center gap-3">
              <BackButton />
              <Link
                href="/student"
                className="rounded-full border border-[var(--border)] bg-[var(--base)]/70 px-5 py-3 text-sm font-semibold text-[var(--text)] hover:bg-black/5"
              >
                Dashboard
              </Link>
            </div>
          </div>

          <div className="mt-8 grid gap-4">
            {[
              { key: "system", title: "Ikuti sistem", desc: "Gunakan preferensi perangkat" },
              { key: "light", title: "Mode terang", desc: "Tampilan cerah untuk siang hari" },
              { key: "dark", title: "Mode gelap", desc: "Tampilan nyaman untuk malam" },
            ].map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setTheme(item.key as never)}
                className={
                  theme === item.key
                    ? "rounded-[28px] border border-[var(--primary)] bg-[var(--primary)]/10 p-5 text-left"
                    : "rounded-[28px] border border-[var(--border)] bg-[var(--base)]/70 p-5 text-left hover:bg-black/5"
                }
              >
                <p className="text-sm font-black text-[var(--text)]">{item.title}</p>
                <p className="mt-2 text-sm text-[var(--muted)]">{item.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

