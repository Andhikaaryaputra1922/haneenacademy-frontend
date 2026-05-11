import Link from "next/link";
import { cookies } from "next/headers";
import { getAuthCookieName, verifyUserJwt } from "@/lib/auth/jwt";
import TeacherSidebar from "@/components/teacher/TeacherSidebar";

const StatIcon = {
  Students: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  Assignment: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  ),
  Quiz: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9"/>
      <path d="M9.5 9.5a2.5 2.5 0 0 1 4.9.8c0 1.7-2.5 2.5-2.5 2.5"/>
      <circle cx="12" cy="17" r=".5" fill="currentColor"/>
    </svg>
  ),
  Material: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  ),
  Grade: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  ),
  Attendance: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <polyline points="16 11 18 13 22 9"/>
    </svg>
  ),
};

const FeatureIcon = {
  Quiz: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9"/>
      <path d="M9.5 9.5a2.5 2.5 0 0 1 4.9.8c0 1.7-2.5 2.5-2.5 2.5"/>
      <circle cx="12" cy="17" r=".5" fill="currentColor"/>
    </svg>
  ),
  Grading: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  ),
  Material: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  ),
  Attendance: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <polyline points="16 11 18 13 22 9"/>
    </svg>
  ),
  Report: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/>
      <line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
      <line x1="2" y1="20" x2="22" y2="20"/>
    </svg>
  ),
  Announcement: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  ),
};

const stats = [
  { label: "Jumlah Siswa", href: "/teacher/reports", Icon: StatIcon.Students, accent: "text-blue-600 bg-blue-50 dark:bg-blue-950/30 dark:text-blue-400" },
  { label: "Tugas Aktif", href: "/teacher/assignments", Icon: StatIcon.Assignment, accent: "text-orange-600 bg-orange-50 dark:bg-orange-950/30 dark:text-orange-400" },
  { label: "Quiz Aktif", href: "/teacher/quizzes", Icon: StatIcon.Quiz, accent: "text-violet-600 bg-violet-50 dark:bg-violet-950/30 dark:text-violet-400" },
  { label: "Total Materi", href: "/teacher/materials", Icon: StatIcon.Material, accent: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-400" },
  { label: "Rata-rata Nilai", href: "/teacher/reports", Icon: StatIcon.Grade, accent: "text-sky-600 bg-sky-50 dark:bg-sky-950/30 dark:text-sky-400" },
  { label: "Tingkat Kehadiran", href: "/teacher/attendance", Icon: StatIcon.Attendance, accent: "text-teal-600 bg-teal-50 dark:bg-teal-950/30 dark:text-teal-400" },
];

const features = [
  { title: "Quiz Builder", desc: "Buat quiz, susun pertanyaan, dan pantau attempt siswa.", href: "/teacher/quizzes", Icon: FeatureIcon.Quiz },
  { title: "Submission & Grading", desc: "Lihat submission tugas, berikan nilai dan feedback.", href: "/teacher/assignments", Icon: FeatureIcon.Grading },
  { title: "Manajemen Materi", desc: "Upload modul, video, dan dokumen pembelajaran.", href: "/teacher/materials", Icon: FeatureIcon.Material },
  { title: "Absensi Siswa", desc: "Catat kehadiran siswa per sesi dan rekap absensi.", href: "/teacher/attendance", Icon: FeatureIcon.Attendance },
  { title: "Laporan & Progress", desc: "Pantau perkembangan belajar dan analitik siswa.", href: "/teacher/reports", Icon: FeatureIcon.Report },
  { title: "Pengumuman", desc: "Kirim pengumuman ke kelas atau siswa tertentu.", href: "/teacher/announcements", Icon: FeatureIcon.Announcement },
];

export default async function TeacherPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(getAuthCookieName())?.value;
  const auth = token ? await verifyUserJwt(token).catch(() => null) : null;
  const role = auth?.role ?? "UNKNOWN";

  return (
    <div className="p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        {/* Standardized Header */}
        <header className="mb-10">
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-block h-1.5 w-8 rounded-full bg-[#8B0000]" />
            <span className="text-xs font-black uppercase tracking-[0.2em] text-[#8B0000]">Dashboard</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
            Panel Pengajar
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Kelola materi, tugas, dan pantau perkembangan siswa Anda.
          </p>
        </header>

        <div className="space-y-10">

          {/* ── Statistik ── */}
          <section>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-[var(--muted)]">Ringkasan</p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {stats.map(({ label, href, Icon, accent }) => (
                <Link
                  key={label}
                  href={href}
                  className="group flex items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-4 hover:border-[var(--primary)]/40 hover:shadow-sm transition-all"
                >
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${accent}`}>
                    <Icon />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-[var(--muted)]">{label}</p>
                    {/* Nilai dari API — skeleton sementara */}
                    <div className="mt-1 h-5 w-12 rounded-md bg-[var(--border)] animate-pulse" />
                  </div>
                  <svg className="ml-auto shrink-0 text-[var(--muted)] opacity-0 group-hover:opacity-100 transition-opacity" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </Link>
              ))}
            </div>
          </section>

          {/* ── Fitur Utama ── */}
          <section>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-[var(--muted)]">Fitur Utama</p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {features.map(({ title, desc, href, Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="group flex flex-col rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 hover:border-[var(--primary)]/40 hover:shadow-sm transition-all"
                >
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--base)] text-[var(--muted)] group-hover:border-[var(--primary)]/30 group-hover:text-[var(--primary)] transition-colors">
                    <Icon />
                  </div>
                  <p className="text-sm font-semibold text-[var(--text)] group-hover:text-[var(--primary)] transition-colors">{title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-[var(--muted)]">{desc}</p>
                  <div className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-[var(--primary)] opacity-0 group-hover:opacity-100 transition-opacity">
                    Buka
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* ── Tugas Menunggu Penilaian ── */}
          <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
              <p className="text-sm font-semibold text-[var(--text)]">Tugas Menunggu Penilaian</p>
              <Link href="/teacher/assignments" className="flex items-center gap-1 text-xs font-semibold text-[var(--primary)] hover:underline">
                Lihat Semua
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </Link>
            </div>
            {/* Empty state — data dari API */}
            <div className="flex flex-col items-center justify-center gap-2 py-12 text-center px-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--base)] text-[var(--muted)]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                </svg>
              </div>
              <p className="text-sm font-medium text-[var(--text)]">Semua tugas sudah dinilai</p>
              <p className="text-xs text-[var(--muted)]">Submission baru akan muncul di sini secara otomatis</p>
            </div>
          </section>

          {/* ── Aktivitas Terbaru ── */}
          <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
              <p className="text-sm font-semibold text-[var(--text)]">Aktivitas Terbaru</p>
            </div>
            <div className="flex flex-col items-center justify-center gap-2 py-12 text-center px-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--base)] text-[var(--muted)]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                </svg>
              </div>
              <p className="text-sm font-medium text-[var(--text)]">Belum ada aktivitas</p>
              <p className="text-xs text-[var(--muted)]">Aktivitas siswa akan muncul di sini secara real-time</p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
