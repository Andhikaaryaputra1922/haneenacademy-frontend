"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { PremiumModal } from "@/components/ui/PremiumFeedback";

/* ── SVG Icons ─────────────────────────────── */
const IC = {
  Dashboard: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  ),
  Book: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  ),
  Clipboard: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
    </svg>
  ),
  Quiz: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  Play: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="5 3 19 12 5 21 5 3"/>
    </svg>
  ),
  Award: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
    </svg>
  ),
  Package: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>
  ),
  Cart: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
    </svg>
  ),
  Settings: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  ),
  Logout: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  Lock: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  ),
  ChevronL: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
  ),
  ChevronR: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
  ),
};

interface Props {
  name?: string;
  email?: string;
  hasActivePackage?: boolean; // undefined = still loading
}

export default function StudentSidebar({ name, email, hasActivePackage }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const initials = name ? name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() : "S";
  const hasPkg = hasActivePackage === true;

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      const res = await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
      if (res.ok) { router.push("/login"); router.refresh(); }
    } catch { alert("Gagal logout"); }
    finally { 
      setLogoutLoading(false); 
      setShowLogoutModal(false);
    }
  };

  const navItems = [
    { label: "Beranda", icon: <IC.Dashboard />, href: "/student", always: true },
    { label: "Paket Belajar", icon: <IC.Package />, href: "/student/packages", always: true },
    { label: "Keranjang", icon: <IC.Cart />, href: "/student/cart", always: true },
    { label: "Kursus Saya", icon: <IC.Book />, href: "/student/enrollments", always: false },
    { label: "Tugas", icon: <IC.Clipboard />, href: "/student/assignments", always: false },
    { label: "Kuis", icon: <IC.Quiz />, href: "/student/quizzes", always: false },
    { label: "Materi", icon: <IC.Play />, href: "/student/materials", always: false },
    { label: "Sertifikat", icon: <IC.Award />, href: "/student/certificates", always: false },
    { label: "Pengaturan", icon: <IC.Settings />, href: "/student/settings", always: true },
  ];

  return (
    <>
      <PremiumModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        title="Konfirmasi Logout"
        message="Yakin ingin keluar? Sesi belajar kamu akan berakhir."
        type="logout"
        confirmText="Logout"
        loading={logoutLoading}
      />
      <aside
        style={{ width: collapsed ? "64px" : "240px", transition: "width 0.2s cubic-bezier(0.4,0,0.2,1)" }}
        className="fixed left-0 top-0 z-30 flex h-screen flex-col bg-[#8B0000] shadow-xl"
      >
        {/* Logo */}
        <div className="flex h-14 shrink-0 items-center justify-between px-3 border-b border-white/10">
          {!collapsed && (
            <span className="text-sm font-black tracking-tight text-white">
              Haneen<span className="text-amber-300">Academy</span>
            </span>
          )}
          <button onClick={() => setCollapsed(!collapsed)}
            className={`flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition ${collapsed ? "mx-auto" : "ml-auto"}`}>
            {collapsed ? <IC.ChevronR /> : <IC.ChevronL />}
          </button>
        </div>

        {/* Profile */}
        <div className={`shrink-0 border-b border-white/10 ${collapsed ? "px-2 py-3" : "px-3 py-4"}`}>
          <div className={`flex items-center ${collapsed ? "justify-center" : "gap-2.5"}`}>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-400 text-xs font-black text-amber-950 shadow-md">
              {initials}
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-white">{name ?? "Siswa"}</p>
                <p className="truncate text-[10px] text-white/50">{email ?? "siswa@haneen.academy"}</p>
              </div>
            )}
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
          {navItems.map((item) => {
            if (!item.always && !hasPkg) return null;

            const isActive = pathname === item.href || (item.href !== "/student" && pathname.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href} title={collapsed ? item.label : undefined}
                className={`flex items-center rounded-lg px-2.5 py-2.5 text-sm transition-all ${
                  collapsed ? "justify-center" : "gap-3"
                } ${
                  isActive
                    ? "bg-white text-[#8B0000] font-bold shadow-sm"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}>
                <span className="shrink-0">{item.icon}</span>
                {!collapsed && <span className="truncate">{item.label}</span>}
                {!collapsed && isActive && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#8B0000]" />}
              </Link>
            );
          })}

          {!hasPkg && hasActivePackage !== undefined && !collapsed && (
            <div className="mt-4 mx-1 rounded-xl bg-black/20 border border-white/5 p-3">
              <div className="flex items-center gap-2 text-amber-300 mb-1">
                <IC.Lock />
                <p className="text-[11px] font-bold">Fitur Terkunci</p>
              </div>
              <p className="text-[10px] text-white/60 leading-relaxed">
                Beli paket belajar untuk membuka akses penuh ke kursus.
              </p>
            </div>
          )}
        </nav>

        {/* Logout */}
        <div className="shrink-0 border-t border-white/10 p-2">
          <button onClick={() => setShowLogoutModal(true)} disabled={logoutLoading} title={collapsed ? "Keluar" : undefined}
            className={`flex w-full items-center rounded-lg px-2.5 py-2.5 text-sm font-medium text-white/60 hover:bg-white/10 hover:text-white transition-colors ${collapsed ? "justify-center" : "gap-3"}`}>
            <span className="shrink-0"><IC.Logout /></span>
            {!collapsed && <span>{logoutLoading ? "Keluar..." : "Keluar"}</span>}
          </button>
        </div>
      </aside>

      {/* Spacer */}
      <div style={{ width: collapsed ? "64px" : "240px", transition: "width 0.2s cubic-bezier(0.4,0,0.2,1)" }} className="hidden lg:block shrink-0" />
    </>
  );
}
