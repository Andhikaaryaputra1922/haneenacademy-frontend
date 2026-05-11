"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { PremiumModal } from "@/components/ui/PremiumFeedback";

const IC = {
  Dashboard: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  ),
  Users: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  Packages: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>
  ),
  Transactions: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
      <line x1="1" y1="10" x2="23" y2="10"/>
    </svg>
  ),
  Courses: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  ),
  Logout: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  ChevronLeft: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6"/>
    </svg>
  ),
  ChevronRight: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  ),
  Shield: () => (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
    </svg>
  ),
};

const navItems = [
  { label: "Dashboard", href: "/admin", Icon: IC.Dashboard },
  { label: "Manajemen User", href: "/admin/users", Icon: IC.Users },
  { label: "Manajemen Paket", href: "/admin/packages", Icon: IC.Packages },
  { label: "Transaksi", href: "/admin/transactions", Icon: IC.Transactions },
  { label: "Moderasi Course", href: "/admin/courses", Icon: IC.Courses },
];

export default function AdminSidebar({ name, email }: { name?: string; email?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const initials = name
    ? name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "A";

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      const res = await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
      if (res.ok) { 
        router.push("/login"); 
        router.refresh(); 
      }
    } catch {
      alert("Gagal logout");
    } finally {
      setLogoutLoading(false);
      setShowLogoutModal(false);
    }
  };

  return (
    <>
      <PremiumModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        title="Konfirmasi Logout"
        message="Yakin ingin keluar dari panel admin? Sesi Anda akan berakhir."
        type="logout"
        confirmText="Logout"
        loading={logoutLoading}
      />
      <aside
        style={{ width: collapsed ? "64px" : "240px", transition: "width 0.2s cubic-bezier(0.4,0,0.2,1)" }}
        className="fixed left-0 top-0 z-30 flex h-screen flex-col bg-[#1A2E44] shadow-xl"
      >
        {/* Logo & Collapse */}
        <div className="flex h-14 shrink-0 items-center justify-between px-3 border-b border-white/10">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <span className="text-[#E5B54F]"><IC.Shield /></span>
              <span className="text-sm font-black tracking-tighter text-white">
                HANEEN<span className="text-[#E5B54F]">.</span>ADMIN
              </span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition ${collapsed ? "mx-auto" : "ml-auto"}`}
          >
            {collapsed ? <IC.ChevronRight /> : <IC.ChevronLeft />}
          </button>
        </div>

        {/* Profile */}
        <div className={`shrink-0 border-b border-white/10 ${collapsed ? "px-2 py-3" : "px-3 py-4"}`}>
          <div className={`flex items-center ${collapsed ? "justify-center" : "gap-2.5"}`}>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E5B54F] text-xs font-black text-[#1A2E44] shadow-md">
              {initials}
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-white">{name ?? "Administrator"}</p>
                <p className="truncate text-[10px] text-white/50">{email ?? "admin@haneen.academy"}</p>
              </div>
            )}
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
          {!collapsed && (
            <p className="px-2 pb-2 text-[9px] font-black uppercase tracking-[0.2em] text-white/30">Menu Utama</p>
          )}
          {navItems.map(({ label, href, Icon }) => {
            const isActive = pathname === href || (href !== "/admin" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                title={collapsed ? label : undefined}
                className={`flex items-center rounded-xl px-3 py-2.5 text-sm transition-all ${
                  collapsed ? "justify-center" : "gap-3"
                } ${
                  isActive
                    ? "bg-[#E5B54F] text-[#1A2E44] font-black shadow-lg shadow-black/10"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span className="shrink-0"><Icon /></span>
                {!collapsed && <span className="truncate">{label}</span>}
                {!collapsed && isActive && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#8B0000]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="shrink-0 border-t border-white/10 p-2">
          <button
            onClick={() => setShowLogoutModal(true)}
            disabled={logoutLoading}
            title={collapsed ? "Logout" : undefined}
            className={`flex w-full items-center rounded-lg px-2.5 py-2.5 text-sm font-medium text-white/60 hover:bg-white/10 hover:text-white transition-colors ${
              collapsed ? "justify-center" : "gap-3"
            }`}
          >
            <span className="shrink-0"><IC.Logout /></span>
            {!collapsed && <span>{logoutLoading ? "Keluar..." : "Logout"}</span>}
          </button>
        </div>
      </aside>

      {/* Spacer */}
      <div
        style={{ width: collapsed ? "64px" : "240px", transition: "width 0.2s cubic-bezier(0.4,0,0.2,1)" }}
        className="hidden lg:block shrink-0"
      />
    </>
  );
}
