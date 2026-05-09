"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const Icons = {
  Dashboard: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/>
      <rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>
    </svg>
  ),
  Quiz: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9"/>
      <path d="M9.5 9.5a2.5 2.5 0 0 1 4.9.8c0 1.7-2.5 2.5-2.5 2.5"/><circle cx="12" cy="17" r=".5" fill="currentColor"/>
    </svg>
  ),
  Assignment: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <line x1="10" y1="9" x2="8" y2="9"/>
    </svg>
  ),
  Material: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  ),
  Attendance: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <polyline points="16 11 18 13 22 9"/>
    </svg>
  ),
  Schedule: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  Report: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/>
      <line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
      <line x1="2" y1="20" x2="22" y2="20"/>
    </svg>
  ),
  Announcement: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  ),
  Logout: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  ChevronLeft: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6"/>
    </svg>
  ),
  ChevronRight: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  ),
};

const navItems = [
  { label: "Dashboard", href: "/teacher", Icon: Icons.Dashboard },
  { label: "Quiz", href: "/teacher/quizzes", Icon: Icons.Quiz },
  { label: "Assignment", href: "/teacher/assignments", Icon: Icons.Assignment },
  { label: "Materi", href: "/teacher/materials", Icon: Icons.Material },
  { label: "Absensi", href: "/teacher/attendance", Icon: Icons.Attendance },
  { label: "Jadwal", href: "/teacher/schedule", Icon: Icons.Schedule },
  { label: "Laporan", href: "/teacher/reports", Icon: Icons.Report },
  { label: "Pengumuman", href: "/teacher/announcements", Icon: Icons.Announcement },
];

export default function TeacherSidebar({ name, role }: { name?: string; role: string }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const initials = name
    ? name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "T";

  return (
    <>
      <aside
        style={{ width: collapsed ? "68px" : "232px", transition: "width 0.22s cubic-bezier(0.4,0,0.2,1)" }}
        className="fixed left-0 top-0 z-30 flex h-screen flex-col border-r border-[var(--border)] bg-[var(--surface)]"
      >
        {/* Logo & Collapse */}
        <div className="flex h-14 shrink-0 items-center justify-between px-3 border-b border-[var(--border)]">
          {!collapsed && (
            <span className="text-sm font-black tracking-tight text-[var(--text)]">
              Haneen<span className="text-[var(--primary)]">.</span>
            </span>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--base)] text-[var(--muted)] hover:text-[var(--text)] transition ${collapsed ? "mx-auto" : "ml-auto"}`}
          >
            {collapsed ? <Icons.ChevronRight /> : <Icons.ChevronLeft />}
          </button>
        </div>

        {/* Profile */}
        <div className={`shrink-0 border-b border-[var(--border)] ${collapsed ? "px-2 py-3" : "px-3 py-3"}`}>
          <div className={`flex items-center ${collapsed ? "justify-center" : "gap-2.5"}`}>
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--primary)] text-xs font-bold text-[var(--primary-ink)]">
              {initials}
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-[var(--text)]">{name ?? "Guru"}</p>
                <p className="truncate text-[10px] text-[var(--muted)]">{role}</p>
              </div>
            )}
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5">
          {navItems.map(({ label, href, Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                title={collapsed ? label : undefined}
                className={`flex items-center rounded-lg px-2.5 py-2 text-sm transition-all ${
                  collapsed ? "justify-center" : "gap-3"
                } ${
                  isActive
                    ? "bg-[var(--primary)] text-[var(--primary-ink)]"
                    : "text-[var(--muted)] hover:bg-[var(--base)] hover:text-[var(--text)]"
                }`}
              >
                <span className="shrink-0"><Icon /></span>
                {!collapsed && <span className="truncate font-medium">{label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="shrink-0 border-t border-[var(--border)] p-2">
          <button
            onClick={async () => {
              await fetch("/api/auth/logout", { method: "POST" });
              window.location.href = "/login";
            }}
            title={collapsed ? "Logout" : undefined}
            className={`flex w-full items-center rounded-lg px-2.5 py-2 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition ${
              collapsed ? "justify-center" : "gap-3"
            }`}
          >
            <span className="shrink-0"><Icons.Logout /></span>
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Spacer */}
      <div
        style={{ width: collapsed ? "68px" : "232px", transition: "width 0.22s cubic-bezier(0.4,0,0.2,1)" }}
        className="shrink-0"
      />
    </>
  );
}
