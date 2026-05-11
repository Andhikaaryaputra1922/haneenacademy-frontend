"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard, BookOpen, ClipboardList, HelpCircle,
  PlaySquare, Award, Settings, LogOut, CheckCircle, Clock
} from "lucide-react";
import { IslamicPanel, IslamicCard } from "@/components/ui/IslamicPanel";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Assignment {
  id: string;
  title: string;
  courseName: string;
  dueDate: string;
  status: "pending" | "submitted" | "graded";
  grade?: number;
}

interface Certificate {
  id: string;
  courseName: string;
  issuedAt: string;
  downloadUrl?: string;
}

interface Enrollment {
  id: string;
  courseName: string;
  progress: number;
  instructor: string;
}

interface Quiz {
  id: string;
  title: string;
  courseName: string;
  dueDate: string;
  status: "upcoming" | "completed";
  score?: number;
  totalQuestions: number;
}

interface PackageInfo {
  enrollmentId: string;
  status: string;
  startedAt: string;
  expiresAt: string | null;
  daysRemaining: number | null;
  isExpired: boolean;
  package: {
    id: string;
    name: string;
    description: string | null;
    defaultLessonLimit: number;
  };
}

interface DashboardData {
  student: { name: string; email: string };
  assignments: Assignment[];
  certificates: Certificate[];
  enrollments: Enrollment[];
  quizzes: Quiz[];
  packageData?: {
    activePackages: PackageInfo[];
    hasActivePackage: boolean;
  };
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_DATA: DashboardData = {
  student: { name: "Ahmad Fauzi", email: "ahmad@example.com" },
  assignments: [
    { id: "1", title: "Essay: Sejarah Islam", courseName: "Sejarah Peradaban", dueDate: "2026-05-15", status: "pending" },
    { id: "2", title: "Laporan Praktikum Kimia", courseName: "Kimia Dasar", dueDate: "2026-05-10", status: "submitted" },
    { id: "3", title: "Analisis Puisi", courseName: "Bahasa Indonesia", dueDate: "2026-04-30", status: "graded", grade: 88 },
  ],
  certificates: [
    { id: "1", courseName: "Matematika Dasar", issuedAt: "2026-03-20" },
    { id: "2", courseName: "Pengantar Pemrograman", issuedAt: "2026-02-14" },
  ],
  enrollments: [
    { id: "1", courseName: "Kimia Dasar", progress: 65, instructor: "Dr. Siti Rahayu" },
    { id: "2", courseName: "Sejarah Peradaban", progress: 40, instructor: "Ustadz Hasan" },
    { id: "3", courseName: "Bahasa Indonesia", progress: 90, instructor: "Bu Kartini" },
    { id: "4", courseName: "Fisika Modern", progress: 20, instructor: "Prof. Budi" },
  ],
  quizzes: [
    { id: "1", title: "Quiz Bab 3", courseName: "Kimia Dasar", dueDate: "2026-05-12", status: "upcoming", totalQuestions: 20 },
    { id: "2", title: "Ulangan Harian", courseName: "Sejarah Peradaban", dueDate: "2026-05-08", status: "completed", score: 85, totalQuestions: 15 },
  ],
};

// ─── Nav Config ───────────────────────────────────────────────────────────────

type NavKey = "overview" | "enrollments" | "assignments" | "quizzes" | "certificates" | "materi" | "settings" | "packages";

const NAV_ITEMS: { key: NavKey; label: string; icon: React.ReactNode }[] = [
  { key: "overview",     label: "Overview",    icon: <LayoutDashboard size={16} /> },
  { key: "enrollments",  label: "Kursus Saya", icon: <BookOpen size={16} /> },
  { key: "assignments",  label: "Tugas",        icon: <ClipboardList size={16} /> },
  { key: "quizzes",      label: "Kuis",         icon: <HelpCircle size={16} /> },
  { key: "materi",       label: "Materi",       icon: <PlaySquare size={16} /> },
  { key: "certificates", label: "Sertifikat",   icon: <Award size={16} /> },
  { key: "settings",     label: "Pengaturan",   icon: <Settings size={16} /> },
];

// ─── Shared UI ────────────────────────────────────────────────────────────────

function ProgressBar({ value }: { value: number }) {
  const color = value >= 75 ? "bg-emerald-500" : value >= 40 ? "bg-amber-400" : "bg-rose-400";
  return (
    <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
      <div className={`h-1.5 rounded-full transition-all duration-700 ${color}`} style={{ width: `${value}%` }} />
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending:   "bg-amber-100 text-amber-700",
    submitted: "bg-blue-100 text-blue-700",
    graded:    "bg-emerald-100 text-emerald-700",
    upcoming:  "bg-violet-100 text-violet-700",
    completed: "bg-slate-100 text-slate-600",
  };
  const labels: Record<string, string> = {
    pending:   "Belum Dikumpul",
    submitted: "Sudah Dikumpul",
    graded:    "Sudah Dinilai",
    upcoming:  "Akan Datang",
    completed: "Selesai",
  };
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${styles[status] ?? "bg-slate-100 text-slate-500"}`}>
      {labels[status] ?? status}
    </span>
  );
}

// ─── Pages ────────────────────────────────────────────────────────────────────

function OverviewPage({ data }: { data: DashboardData }) {
  const pending  = data.assignments.filter((a) => a.status === "pending").length;
  const upcoming = data.quizzes.filter((q) => q.status === "upcoming").length;

  const stats = [
    { label: "Kursus Aktif",   value: data.enrollments.length,  icon: <BookOpen size={18} />,      bg: "bg-blue-50",    text: "text-blue-600" },
    { label: "Tugas Pending",  value: pending,                   icon: <ClipboardList size={18} />, bg: "bg-amber-50",   text: "text-amber-600" },
    { label: "Kuis Mendatang", value: upcoming,                  icon: <HelpCircle size={18} />,    bg: "bg-violet-50",  text: "text-violet-600" },
    { label: "Sertifikat",     value: data.certificates.length,  icon: <Award size={18} />,         bg: "bg-emerald-50", text: "text-emerald-600" },
  ];

  return (
    <div className="space-y-8">
      {/* Banner Paket */}
      {data.packageData && (
        <div className="mb-4">
          {!data.packageData.hasActivePackage ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 flex items-start gap-4">
              <div className="text-2xl mt-0.5">⚠️</div>
              <div>
                <h3 className="font-bold text-rose-800">Tidak ada paket belajar aktif</h3>
                <p className="text-sm text-rose-600 mt-1">
                  Materi premium terkunci karena kamu tidak memiliki paket belajar yang aktif, atau paket sebelumnya telah kedaluwarsa.
                </p>
                <button className="mt-3 text-xs font-bold text-white bg-rose-600 px-4 py-2 rounded-xl hover:bg-rose-700 transition">
                  Lihat Pilihan Paket
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {data.packageData.activePackages.map((pkg) => {
                const isExpiringSoon = pkg.daysRemaining !== null && pkg.daysRemaining <= 7;
                return (
                  <div key={pkg.enrollmentId} className={`rounded-2xl border p-4 flex items-center justify-between ${isExpiringSoon ? 'border-amber-200 bg-amber-50' : 'border-indigo-100 bg-indigo-50/50'}`}>
                    <div className="flex items-center gap-4">
                      <div className="text-2xl">{isExpiringSoon ? "⏳" : "💎"}</div>
                      <div>
                        <h3 className={`font-bold ${isExpiringSoon ? 'text-amber-800' : 'text-indigo-900'}`}>Paket {pkg.package.name} Aktif</h3>
                        <p className={`text-sm mt-0.5 ${isExpiringSoon ? 'text-amber-700' : 'text-indigo-600'}`}>
                          {pkg.expiresAt 
                            ? `Berakhir pada: ${new Date(pkg.expiresAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}`
                            : 'Paket ini tidak memiliki masa kedaluwarsa.'}
                        </p>
                      </div>
                    </div>
                    {pkg.daysRemaining !== null && (
                      <div className={`shrink-0 px-4 py-2 rounded-xl text-sm font-bold ${isExpiringSoon ? 'bg-amber-100 text-amber-800' : 'bg-indigo-100 text-indigo-700'}`}>
                        Sisa {pkg.daysRemaining} Hari
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center gap-4">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl ${s.bg}`}>{s.icon}</div>
            <div>
              <p className={`text-2xl font-bold ${s.text}`}>{s.value}</p>
              <p className="text-xs text-slate-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-sm font-bold text-slate-600 uppercase tracking-wide mb-3">Kursus Aktif</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {data.enrollments.slice(0, 4).map((e) => (
            <div key={e.id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <div className="flex justify-between items-start">
                <p className="font-semibold text-slate-800 text-sm">{e.courseName}</p>
                <span className="text-sm font-bold text-teal-600">{e.progress}%</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{e.instructor}</p>
              <ProgressBar value={e.progress} />
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-sm font-bold text-slate-600 uppercase tracking-wide mb-3">Tugas Terbaru</h2>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 divide-y divide-slate-50">
          {data.assignments.slice(0, 3).map((a) => (
            <Link key={a.id} href={`/student/assignments/${a.id}`}
              className="flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors">
              <div>
                <p className="font-medium text-slate-800 text-sm">{a.title}</p>
                <p className="text-xs text-slate-400 mt-0.5">{a.courseName} · {a.dueDate}</p>
              </div>
              <div className="flex items-center gap-2">
                {a.grade !== undefined && <span className="text-sm font-bold text-emerald-600">{a.grade}</span>}
                <StatusBadge status={a.status} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function EnrollmentsPage({ enrollments }: { enrollments: Enrollment[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {enrollments.map((e) => (
        <div key={e.id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <p className="font-semibold text-slate-800">{e.courseName}</p>
            <span className="text-sm font-bold text-teal-600">{e.progress}%</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">{e.instructor}</p>
          <ProgressBar value={e.progress} />
        </div>
      ))}
    </div>
  );
}

function AssignmentsPage({ assignments }: { assignments: Assignment[] }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 divide-y divide-slate-50">
      {assignments.map((a) => (
        <Link key={a.id} href={`/student/assignments/${a.id}`}
          className="flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors">
          <div>
            <p className="font-medium text-slate-800 text-sm">{a.title}</p>
            <p className="text-xs text-slate-400 mt-0.5">{a.courseName} · Tenggat: {a.dueDate}</p>
          </div>
          <div className="flex items-center gap-2">
            {a.grade !== undefined && <span className="text-sm font-bold text-emerald-600">{a.grade}</span>}
            <StatusBadge status={a.status} />
          </div>
        </Link>
      ))}
    </div>
  );
}

function QuizzesPage({ quizzes }: { quizzes: Quiz[] }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 divide-y divide-slate-50">
      {quizzes.map((q) => (
        <Link key={q.id} href={`/student/quizzes/${q.id}`}
          className="flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors">
          <div>
            <p className="font-medium text-slate-800 text-sm">{q.title}</p>
            <p className="text-xs text-slate-400 mt-0.5">{q.courseName} · {q.totalQuestions} soal</p>
          </div>
          <div className="flex items-center gap-2">
            {q.score !== undefined && <span className="text-sm font-bold text-violet-600">{q.score}</span>}
            <StatusBadge status={q.status} />
          </div>
        </Link>
      ))}
    </div>
  );
}

function CertificatesPage({ certificates }: { certificates: Certificate[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {certificates.map((c) => (
        <div key={c.id} className="bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-100 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
          <div className="text-3xl">🏅</div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-slate-800 truncate">{c.courseName}</p>
            <p className="text-xs text-slate-500 mt-0.5">Diterbitkan: {c.issuedAt}</p>
          </div>
          {c.downloadUrl && (
            <a href={c.downloadUrl} className="text-xs text-teal-600 font-semibold hover:underline">Unduh</a>
          )}
        </div>
      ))}
    </div>
  );
}

function SettingsPage({ student }: { student: DashboardData["student"] }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4 max-w-md">
      <div>
        <label className="text-xs font-semibold text-slate-500 block mb-1">Nama</label>
        <input defaultValue={student.name}
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-400" />
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500 block mb-1">Email</label>
        <input defaultValue={student.email}
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-400" />
      </div>
      <button className="bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors">
        Simpan Perubahan
      </button>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function StudentDashboardClient() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [enrollRes, assignRes, quizRes, certRes, meRes, pkgRes] = await Promise.all([
          fetch("/api/enrollments", { credentials: "include" }),
          fetch("/api/assignments", { credentials: "include" }),
          fetch("/api/quizzes", { credentials: "include" }),
          fetch("/api/certificates", { credentials: "include" }),
          fetch("/api/auth/me", { credentials: "include" }),
          fetch("/api/student/my-packages", { credentials: "include" }),
        ]);

        const enrollData = enrollRes.ok ? await enrollRes.json() : { enrollments: [] };
        const assignData = assignRes.ok ? await assignRes.json() : { assignments: [] };
        const quizData = quizRes.ok ? await quizRes.json() : { quizzes: [] };
        const certData = certRes.ok ? await certRes.json() : { certificates: [] };
        const meData = meRes.ok ? await meRes.json() : { user: { name: "Siswa", email: "" } };
        const pkgData = pkgRes.ok ? await pkgRes.json() : null;

        const pkgInfo = pkgData ? {
          activePackages: pkgData.activePackages ?? [],
          hasActivePackage: pkgData.hasActivePackage ?? false,
        } : { activePackages: [], hasActivePackage: false };

        if (!pkgInfo.hasActivePackage) {
          router.push("/student/packages");
          return;
        }

        setData({
          student: { name: meData.user?.name ?? "Siswa", email: meData.user?.email ?? "" },
          packageData: pkgInfo,
          enrollments: (enrollData.enrollments ?? []).map((e: any) => ({
            id: e.id,
            courseName: e.course?.title ?? "",
            progress: Math.round(e.progress ?? 0),
            instructor: e.course?.teacher?.name ?? "Pengajar",
          })),
          assignments: (assignData.assignments ?? []).map((a: any) => ({
            id: a.id,
            title: a.title,
            courseName: a.course?.title ?? "",
            dueDate: a.dueDate,
            status: "pending",
          })),
          quizzes: (quizData.quizzes ?? []).map((q: any) => ({
            id: q.id,
            title: q.title,
            courseName: q.course?.title ?? "",
            dueDate: "",
            status: "upcoming",
            totalQuestions: q.questions?.length ?? 0,
          })),
          certificates: (certData.certificates ?? []).map((c: any) => ({
            id: c.id,
            courseName: c.course?.title ?? "",
            issuedAt: c.issuedAt,
            downloadUrl: c.pdfUrl,
          })),
        });
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
        setData(MOCK_DATA);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[#8B0000] border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 font-medium text-sm">Menyiapkan dashboard…</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const pendingAssignments = data.assignments.filter(a => a.status === "pending");
  const activeEnrollments = data.enrollments.filter(e => e.progress < 100);

  return (
    <div className="p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <IslamicPanel variant="navy" className="mb-10 text-white overflow-hidden relative">
          <div className="relative z-10 py-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-block h-1 w-6 rounded-full bg-[#E5B54F]" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#E5B54F]">Selamat Datang</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight md:text-5xl mb-2">
              Ahlan wa Sahlan, {data.student.name.split(' ')[0]}! ✨
            </h1>
            <p className="text-sm text-white/70 font-medium italic">
              {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
          
          {/* Decorative Arabic Motif (Optional SVG) */}
          <div className="absolute top-0 right-0 opacity-10 pointer-events-none translate-x-1/4 -translate-y-1/4">
             <svg width="300" height="300" viewBox="0 0 100 100" fill="currentColor"><path d="M50 0 L60 40 L100 50 L60 60 L50 100 L40 60 L0 50 L40 40 Z" /></svg>
          </div>
        </IslamicPanel>

        {/* Banner Paket */}
        {data.packageData && (
          <div className="mb-12">
            {data.packageData.activePackages.map((pkg) => {
              const isExpiringSoon = pkg.daysRemaining !== null && pkg.daysRemaining <= 7;
              return (
                <div key={pkg.enrollmentId} 
                  className={`rounded-[40px] border-2 p-8 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl transition-all hover:-translate-y-1 duration-500 ${
                    isExpiringSoon 
                    ? 'border-amber-300 bg-gradient-to-br from-amber-50 via-white to-amber-50/30' 
                    : 'border-[#E5B54F]/30 bg-gradient-to-br from-[#1A2E44] to-[#0F1C2E] text-white'
                  }`}>
                  <div className="flex items-center gap-6">
                    <div className={`flex h-16 w-16 items-center justify-center rounded-3xl text-3xl shadow-xl ${
                      isExpiringSoon ? 'bg-amber-400 text-white' : 'bg-[#E5B54F] text-[#1A2E44]'
                    }`}>
                      {isExpiringSoon ? <Clock size={32} /> : <Award size={32} />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                         <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${
                           isExpiringSoon ? 'bg-amber-100 text-amber-800' : 'bg-white/10 text-[#E5B54F]'
                         }`}>Akses VIP Aktif</span>
                      </div>
                      <h3 className={`text-2xl font-black ${isExpiringSoon ? 'text-amber-900' : 'text-white'}`}>
                        Paket {pkg.package.name}
                      </h3>
                      <p className={`text-sm mt-1 font-medium ${isExpiringSoon ? 'text-amber-700/80' : 'text-white/60'}`}>
                        {pkg.expiresAt 
                          ? `Berlaku hingga: ${new Date(pkg.expiresAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}`
                          : 'Akses tanpa batas (Lifetime Access)'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    {pkg.daysRemaining !== null && (
                      <div className={`px-6 py-3 rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl ${
                        isExpiringSoon ? 'bg-amber-500 text-white' : 'bg-[#E5B54F] text-[#1A2E44]'
                      }`}>
                        {pkg.daysRemaining} Hari Lagi
                      </div>
                    )}
                    <Link href="/student/packages" className={`flex-1 md:flex-none text-center px-6 py-3 rounded-2xl text-sm font-bold transition-all ${
                      isExpiringSoon ? 'bg-white text-amber-800 border-2 border-amber-200' : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                    }`}>
                      Kelola Paket
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* Kursus Aktif */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs font-black uppercase tracking-[0.15em] text-slate-400">Kursus Berjalan</h2>
                <Link href="/student/enrollments" className="text-xs font-bold text-[#8B0000] hover:underline">Lihat Semua</Link>
              </div>
              <div className="grid gap-6">
                {activeEnrollments.length > 0 ? activeEnrollments.slice(0, 3).map((e) => (
                  <IslamicCard key={e.id} variant="white" className="p-6 transition-all group cursor-pointer" onClick={() => router.push(`/student/enrollments/${e.id}`)}>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="font-black text-slate-800 text-lg group-hover:text-[#1A2E44] transition-colors">{e.courseName}</p>
                        <div className="flex items-center gap-2 mt-1">
                           <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
                              <CheckCircle size={12} className="text-emerald-500" />
                           </div>
                           <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">{e.instructor}</p>
                        </div>
                      </div>
                      <div className="text-right">
                         <span className="text-xl font-black text-[#1A2E44]">{e.progress}%</span>
                         <p className="text-[10px] font-bold text-slate-400 uppercase">Selesai</p>
                      </div>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 shadow-inner">
                      <div className="h-2 rounded-full bg-gradient-to-r from-[#1A2E44] to-[#E5B54F] transition-all duration-1000 shadow-sm" style={{ width: `${e.progress}%` }} />
                    </div>
                  </IslamicCard>
                )) : (
                  <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center">
                    <p className="text-sm text-slate-400">Belum ada kursus yang aktif.</p>
                  </div>
                )}
              </div>
            </section>

            {/* Tugas Pending */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs font-black uppercase tracking-[0.15em] text-slate-400">Tugas & Deadline</h2>
                <Link href="/student/assignments" className="text-xs font-bold text-[#8B0000] hover:underline">Lihat Semua</Link>
              </div>
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden divide-y divide-slate-50">
                {pendingAssignments.length > 0 ? pendingAssignments.slice(0, 4).map((a) => (
                  <Link key={a.id} href={`/student/assignments/${a.id}`}
                    className="flex items-center justify-between px-6 py-5 hover:bg-red-50/30 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 font-bold text-lg shadow-inner">
                        !
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm group-hover:text-[#8B0000] transition-colors">{a.title}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{a.courseName} · <span className="text-rose-500 font-semibold">{a.dueDate}</span></p>
                      </div>
                    </div>
                    <StatusBadge status={a.status} />
                  </Link>
                )) : (
                  <div className="p-10 text-center">
                    <p className="text-sm text-slate-400">Semua tugas sudah dikerjakan! 🎉</p>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-10">
            
            {/* Quick Stats */}
            <section>
              <h2 className="text-xs font-black uppercase tracking-[0.15em] text-slate-400 mb-4">Statistik</h2>
              <div className="grid gap-4">
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <BookOpen size={20} />
                  </div>
                  <div>
                    <p className="text-lg font-black text-slate-800">{data.enrollments.length}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Total Kursus</p>
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Award size={20} />
                  </div>
                  <div>
                    <p className="text-lg font-black text-slate-800">{data.certificates.length}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Sertifikat</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Sertifikat Terbaru */}
            {data.certificates.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xs font-black uppercase tracking-[0.15em] text-slate-400">Pencapaian Sertifikat</h2>
                  <Link href="/student/certificates" className="text-xs font-bold text-[#E5B54F] hover:underline">Semua</Link>
                </div>
                <div className="space-y-4">
                  {data.certificates.slice(0, 2).map((c) => (
                    <div key={c.id} className="bg-gradient-to-br from-[#FCFBF7] to-white border border-[#E5B54F]/20 rounded-[24px] p-5 flex items-center gap-5 shadow-sm group hover:shadow-md transition-all">
                      <div className="h-14 w-14 bg-[#F9F6EE] rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform shadow-inner">
                        🏅
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-black text-[#1A2E44] text-sm truncate">{c.courseName}</p>
                        <p className="text-[10px] font-bold text-[#E5B54F] uppercase tracking-wider mt-1">Lulus: {new Date(c.issuedAt).toLocaleDateString("id-ID")}</p>
                      </div>
                      {c.downloadUrl && (
                        <a href={c.downloadUrl} className="h-10 w-10 rounded-xl bg-[#1A2E44] text-white flex items-center justify-center hover:bg-[#E5B54F] transition-colors shadow-lg shadow-[#1A2E44]/10">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Bantuan Card */}
            <IslamicPanel variant="navy" className="p-8 text-white relative group overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-xl font-black mb-3">Butuh Bantuan?</h3>
                <p className="text-xs text-white/60 leading-relaxed mb-6">Ustadz dan tim admin kami siap membantu kendala belajar Anda kapan pun.</p>
                <a href="https://wa.me/6285704833249" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 w-full bg-[#E5B54F] text-[#1A2E44] font-black text-xs py-4 rounded-2xl hover:bg-white transition-all shadow-xl">
                   <span>Hubungi via WhatsApp</span>
                </a>
              </div>
              <div className="absolute -bottom-4 -right-4 text-white opacity-5 pointer-events-none">
                 <HelpCircle size={100} />
              </div>
            </IslamicPanel>

          </div>
        </div>
      </div>
    </div>
  );
}
