import Link from "next/link";

const sections = [
  "User Management (CRUD + role control)",
  "Course moderation + publish pipeline",
  "Attendance & gradebook operations",
  "Payment & transaction monitoring",
  "Audit log + backup orchestration",
  "AI tools management (quiz generator, tutor)",
];

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-[var(--base)] px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-[40px] border border-[var(--border)] bg-[var(--surface)] p-7 md:p-10">
          <h1 className="text-3xl font-black tracking-tight text-[var(--text)] md:text-4xl">
            Admin Panel
          </h1>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Kontrol pusat untuk operasional LMS enterprise.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {[
              { href: "/admin/quizzes", title: "Quizzes", desc: "CRUD quiz + question builder + attempts" },
              { href: "/admin/assignments", title: "Assignments", desc: "CRUD assignment + submissions + grading" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <p className="text-lg font-black tracking-tight text-[var(--text)]">{item.title}</p>
                <p className="mt-2 text-sm text-[var(--muted)]">{item.desc}</p>
                <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--accent)] px-4 py-2 text-xs font-semibold text-[var(--text)]">
                  Open
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {sections.map((section) => (
              <div
                key={section}
                className="rounded-[28px] border border-[var(--border)] bg-[var(--base)]/70 px-5 py-4 text-sm font-semibold text-[var(--text)]"
              >
                {section}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
