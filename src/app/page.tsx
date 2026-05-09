import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Brush,
  LayoutGrid,
  MonitorPlay,
  PenTool,
  Sparkles,
  Type,
} from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--base)] text-[var(--text)]">
      <div className="mx-auto max-w-6xl px-6 py-12 md:py-20 space-y-12">

        {/* HERO */}
        <section className="relative overflow-hidden rounded-[36px] border border-[var(--border)] bg-[var(--surface)] p-8 md:p-14">
          
          <div className="absolute inset-0 opacity-60">
            <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[var(--accent)] blur-3xl" />
            <div className="absolute -bottom-40 -right-32 h-[28rem] w-[28rem] rounded-full bg-[var(--primary)]/20 blur-3xl" />
          </div>

          <div className="relative grid gap-12 lg:grid-cols-2 items-center">

            {/* TEXT */}
            <div>
              <div className="flex items-center gap-2 text-sm text-[var(--muted)] font-semibold">
                <Sparkles size={16} />
                Premium Learning Platform
              </div>

              <h1 className="mt-5 text-4xl md:text-5xl font-black leading-tight">
                LEVEL UP YOUR{" "}
                <span className="inline-flex items-center gap-2 bg-[var(--accent)] px-4 py-2 rounded-full">
                  SKILL
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-[var(--text)] text-[var(--base)]">
                    <ArrowRight size={16} />
                  </span>
                </span>
              </h1>

              <p className="mt-5 text-[var(--muted)] leading-relaxed max-w-xl">
                Belajar lebih terstruktur dengan kurikulum modern, progress tracking, dan pengalaman belajar yang fokus ke hasil.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/courses"
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-[var(--primary-ink)]"
                >
                  Explore Courses <ArrowUpRight size={16} />
                </Link>

                <Link
                  href="/login"
                  className="rounded-full border border-[var(--border)] px-6 py-3 text-sm font-semibold hover:bg-black/5"
                >
                  Login
                </Link>
              </div>

              {/* STATS */}
              <div className="mt-10 grid grid-cols-3 gap-4">
                {[
                  { v: "2K+", l: "Students" },
                  { v: "500+", l: "Lessons" },
                  { v: "12+", l: "Tracks" },
                ].map((s) => (
                  <div
                    key={s.l}
                    className="rounded-2xl border border-[var(--border)] bg-[var(--base)] p-4 text-center"
                  >
                    <p className="text-2xl font-black">{s.v}</p>
                    <p className="text-xs text-[var(--muted)] font-semibold mt-1">
                      {s.l}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* ICON GRID */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: <LayoutGrid />, c: "bg-[var(--primary)] text-[var(--primary-ink)]" },
                { icon: <PenTool />, c: "bg-[var(--surface)] border border-[var(--border)]" },
                { icon: <MonitorPlay />, c: "bg-[var(--primary)] text-[var(--primary-ink)] col-span-2 aspect-[2/1]" },
                { icon: <Type />, c: "bg-[var(--surface)] border border-[var(--border)]" },
                { icon: <Brush />, c: "bg-[var(--primary)] text-[var(--primary-ink)]" },
              ].map((i, idx) => (
                <div
                  key={idx}
                  className={`rounded-3xl grid place-items-center aspect-square ${i.c}`}
                >
                  {i.icon}
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* COURSES */}
        <section className="space-y-8">

          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-black">Our Classes</h2>
              <p className="text-[var(--muted)] mt-2 text-sm">
                Pilih jalur belajar sesuai kebutuhanmu
              </p>
            </div>

            <Link
              href="/courses"
              className="text-sm font-semibold flex items-center gap-2"
            >
              View all <ArrowUpRight size={16} />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                t: "Beginner",
                d: "Belajar dasar sampai paham fundamental.",
              },
              {
                t: "Pro Track",
                d: "Project-based learning untuk skill nyata.",
              },
              {
                t: "Fast Track",
                d: "Belajar cepat, ringkas, langsung praktik.",
              },
            ].map((c) => (
              <div
                key={c.t}
                className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 hover:translate-y-[-4px] transition"
              >
                <h3 className="font-black text-lg">{c.t}</h3>
                <p className="text-sm text-[var(--muted)] mt-2 leading-relaxed">
                  {c.d}
                </p>

                <div className="mt-6 flex gap-2">
                  <span className="text-xs bg-[var(--base)] px-3 py-1 rounded-full">
                    UX
                  </span>
                  <span className="text-xs bg-[var(--base)] px-3 py-1 rounded-full">
                    UI
                  </span>
                  <span className="text-xs bg-[var(--base)] px-3 py-1 rounded-full">
                    Dev
                  </span>
                </div>
              </div>
            ))}
          </div>

        </section>

      </div>
    </main>
  );
}