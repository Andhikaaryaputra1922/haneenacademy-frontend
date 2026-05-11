"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/* ── SVG Icons ────────────────────────────── */
const IC = {
  Users: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  Packages: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>
  ),
  Courses: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  ),
  CreditCard: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
    </svg>
  ),
  TrendUp: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
    </svg>
  ),
  Arrow: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
    </svg>
  ),
  Activity: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  ),
  Shield: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
};

interface Stats {
  totalStudents: number;
  totalTeachers: number;
  totalCourses: number;
  totalTransactions: number;
  pendingTransactions: number;
}

export default function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/users?role=STUDENT", { credentials: "include" }).then(r => r.json()),
      fetch("/api/admin/users?role=TEACHER", { credentials: "include" }).then(r => r.json()),
      fetch("/api/admin/courses", { credentials: "include" }).then(r => r.json()),
      fetch("/api/admin/transactions", { credentials: "include" }).then(r => r.json()),
    ]).then(([students, teachers, courses, transactions]) => {
      const txList = transactions.transactions ?? [];
      setStats({
        totalStudents: (students.users ?? []).length,
        totalTeachers: (teachers.users ?? []).length,
        totalCourses: (courses.courses ?? []).length,
        totalTransactions: txList.length,
        pendingTransactions: txList.filter((t: any) => t.status === "PENDING").length,
      });
    }).catch(console.error);
  }, []);

  const statCards = [
    { label: "Siswa Aktif", value: stats?.totalStudents ?? "–", icon: <IC.Users />, bg: "bg-[#8B0000]", text: "text-white", iconBg: "bg-white/15" },
    { label: "Pengajar", value: stats?.totalTeachers ?? "–", icon: <IC.Shield />, bg: "bg-white", text: "text-[#8B0000]", iconBg: "bg-[#8B0000]/10", border: true },
    { label: "Total Course", value: stats?.totalCourses ?? "–", icon: <IC.Courses />, bg: "bg-white", text: "text-slate-800", iconBg: "bg-amber-100", border: true },
    { label: "Pending Review", value: stats?.pendingTransactions ?? "–", icon: <IC.Activity />, bg: "bg-amber-500", text: "text-white", iconBg: "bg-white/20" },
  ];

  const menuItems = [
    { href: "/admin/packages", title: "Manajemen Paket", desc: "Kelola paket belajar, assign siswa, dan mapping course", icon: <IC.Packages />, accent: "#8B0000" },
    { href: "/admin/users", title: "Manajemen User", desc: "CRUD user, kontrol role (Admin/Teacher/Student)", icon: <IC.Users />, accent: "#1E40AF" },
    { href: "/admin/courses", title: "Moderasi Course", desc: "Review, publish, dan arsipkan course dari teacher", icon: <IC.Courses />, accent: "#D97706" },
    { href: "/admin/transactions", title: "Transaksi & Pembayaran", desc: "Monitoring pembayaran dan status transaksi manual", icon: <IC.CreditCard />, accent: "#059669" },
  ];

  return (
    <div className="p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-block h-1.5 w-8 rounded-full bg-[#8B0000]" />
            <span className="text-xs font-black uppercase tracking-[0.2em] text-[#8B0000]">Dashboard</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
            Selamat Datang, Admin
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Kontrol pusat untuk operasional LMS Haneen Academy.
          </p>
        </header>

        {/* Stat Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-10">
          {statCards.map((s) => (
            <div key={s.label} className={`rounded-2xl p-5 ${s.bg} ${s.border ? "border border-slate-200 shadow-sm" : "shadow-md"}`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.iconBg}`}>
                  <span className={s.text}>{s.icon}</span>
                </div>
                <span className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider ${s.bg === "bg-white" ? "text-emerald-600" : "text-white/70"}`}>
                  <IC.TrendUp /> Live
                </span>
              </div>
              <p className={`text-3xl font-black ${s.text}`}>{s.value}</p>
              <p className={`text-xs font-semibold mt-1 ${s.bg === "bg-white" ? "text-slate-500" : "text-white/60"}`}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Quick Menu */}
        <div className="mb-4">
          <h2 className="text-xs font-black uppercase tracking-[0.15em] text-slate-400 mb-4">Menu Cepat</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:border-slate-300"
            >
              <div className="absolute top-0 left-0 h-full w-1 transition-all group-hover:w-1.5" style={{ backgroundColor: item.accent }} />
              <div className="flex items-start gap-4 pl-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: item.accent + "15", color: item.accent }}>
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-black text-slate-900">{item.title}</p>
                  <p className="mt-1 text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400 transition-all group-hover:bg-slate-900 group-hover:text-white">
                  <IC.Arrow />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* System Status */}
        <div className="mt-10">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.15em] mb-4">Status Sistem</h2>
          <div className="grid gap-3 md:grid-cols-4">
            {[
              "Attendance & gradebook operations",
              "Payment & transaction monitoring",
              "Audit log + backup orchestration",
              "AI tools management (quiz generator)",
            ].map((section) => (
              <div
                key={section}
                className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-semibold text-slate-500"
              >
                <span className="h-2 w-2 rounded-full bg-emerald-400 shrink-0" />
                {section}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
