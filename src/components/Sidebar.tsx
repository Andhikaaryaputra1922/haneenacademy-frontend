"use client";

import { useRouter } from "next/navigation";
import { LogOut, LayoutDashboard, User, Settings } from "lucide-react";
import Link from "next/link";

export function Sidebar() {
  const router = useRouter();

  const handleLogout = async () => {
    if (!confirm("Yakin ingin keluar?")) return;
    const res = await fetch("/api/auth/logout", { method: "POST" });
    if (res.ok) {
      router.refresh();
      router.push("/login");
    }
  };

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-[var(--border)] bg-[var(--surface)] p-6 fixed left-0 top-0">
      <div className="mb-10 font-bold text-xl px-2">Haneen LMS</div>

      {/* Menu Atas */}
      <nav className="flex flex-1 flex-col gap-2">
        <Link href="/student/dashboard" className="flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--base)]">
          <LayoutDashboard size={20} /> Dashboard
        </Link>
        <Link href="/student/profile" className="flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--base)]">
          <User size={20} /> Edit Profil
        </Link>
        <Link href="/student/settings" className="flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--base)]">
          <Settings size={20} /> Settings
        </Link>
      </nav>

      {/* Tombol Logout (Paling Bawah) */}
      <div className="mt-auto pt-4 border-t border-[var(--border)]">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-red-500 transition-all hover:bg-red-50 hover:shadow-inner"
        >
          <LogOut size={20} />
          KELUAR (LOGOUT)
        </button>
      </div>
    </aside>
  );
}