"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PackageCourse {
  courseId: string;
  lessonLimit: number | null;
  course: { id: string; title: string };
}

interface Package {
  id: string;
  name: string;
  description: string | null;
  price: number;
  defaultLessonLimit: number;
  isActive: boolean;
  createdAt: string;
  packageCourses: PackageCourse[];
  _studentCount?: number;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminPackagesPage() {
  const router = useRouter();
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);

  // Form state
  const [formName, setFormName] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formLimit, setFormLimit] = useState("");

  const fetchPackages = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/packages", { credentials: "include" });
      if (!res.ok) return;
      const data = await res.json();
      setPackages(data.packages ?? []);
    } catch (err) {
      console.error("Failed to fetch packages:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (creating) return;
    setCreating(true);
    try {
      const res = await fetch("/api/admin/packages", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formName.trim(),
          description: formDesc.trim() || undefined,
          price: Number(formPrice) || 0,
          defaultLessonLimit: Number(formLimit) || 0,
        }),
      });
      if (res.ok) {
        setFormName("");
        setFormDesc("");
        setFormPrice("");
        setFormLimit("");
        setShowCreate(false);
        fetchPackages();
      } else {
        const err = await res.json();
        alert(err.message || "Gagal membuat paket");
      }
    } catch {
      alert("Terjadi kesalahan");
    } finally {
      setCreating(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[var(--base)] px-6 py-10">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--primary)] border-t-transparent" />
            <p className="text-sm text-[var(--muted)]">Memuat data paket…</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--base)] px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-[40px] border border-[var(--border)] bg-[var(--surface)] p-7 md:p-10">

          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Link
                href="/admin"
                className="mb-2 inline-flex items-center gap-1 text-xs font-semibold text-[var(--muted)] hover:text-[var(--text)] transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                Admin Panel
              </Link>
              <h1 className="text-3xl font-black tracking-tight text-[var(--text)] md:text-4xl">
                Manajemen Paket
              </h1>
              <p className="mt-2 text-sm text-[var(--muted)]">
                Kelola paket belajar siswa — buat, edit, dan assign siswa ke paket yang sesuai.
              </p>
            </div>
            <button
              onClick={() => setShowCreate(true)}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-[var(--primary-ink)] shadow-lg shadow-[var(--primary)]/20 transition-all hover:shadow-xl hover:shadow-[var(--primary)]/30 hover:-translate-y-0.5 active:translate-y-0"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Buat Paket Baru
            </button>
          </div>

          {/* Stats Summary */}
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: "Total Paket", value: packages.length, icon: "📦", bg: "bg-blue-50 dark:bg-blue-950/30" },
              { label: "Paket Aktif", value: packages.filter(p => p.isActive).length, icon: "✅", bg: "bg-emerald-50 dark:bg-emerald-950/30" },
              { label: "Nonaktif", value: packages.filter(p => !p.isActive).length, icon: "⏸️", bg: "bg-slate-100 dark:bg-slate-800/30" },
              { label: "Total Course", value: new Set(packages.flatMap(p => p.packageCourses.map(pc => pc.courseId))).size, icon: "📚", bg: "bg-violet-50 dark:bg-violet-950/30" },
            ].map((s) => (
              <div key={s.label} className={`rounded-2xl border border-[var(--border)] ${s.bg} p-4`}>
                <div className="text-xl">{s.icon}</div>
                <p className="mt-2 text-2xl font-black text-[var(--text)]">{s.value}</p>
                <p className="text-xs text-[var(--muted)] font-medium">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Package Cards */}
          {packages.length === 0 ? (
            <div className="mt-10 flex flex-col items-center justify-center rounded-[28px] border border-dashed border-[var(--border)] py-16">
              <div className="text-5xl">📦</div>
              <p className="mt-4 text-lg font-bold text-[var(--text)]">Belum ada paket</p>
              <p className="mt-1 text-sm text-[var(--muted)]">Buat paket pertama untuk mulai mengatur siswa</p>
              <button
                onClick={() => setShowCreate(true)}
                className="mt-6 rounded-full bg-[var(--primary)] px-6 py-2.5 text-sm font-semibold text-[var(--primary-ink)] transition hover:-translate-y-0.5"
              >
                Buat Paket
              </button>
            </div>
          ) : (
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {packages.map((pkg) => (
                <button
                  key={pkg.id}
                  onClick={() => router.push(`/admin/packages/${pkg.id}`)}
                  className="group relative rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[var(--primary)]/30"
                >
                  {/* Status badge */}
                  <div className="absolute right-5 top-5">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                      pkg.isActive 
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400" 
                        : "bg-slate-100 text-slate-500 dark:bg-slate-800/40 dark:text-slate-400"
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${pkg.isActive ? "bg-emerald-500" : "bg-slate-400"}`} />
                      {pkg.isActive ? "Aktif" : "Nonaktif"}
                    </span>
                  </div>

                  {/* Package info */}
                  <p className="text-lg font-black tracking-tight text-[var(--text)] pr-24">{pkg.name}</p>
                  {pkg.description && (
                    <p className="mt-1 text-sm text-[var(--muted)] line-clamp-2">{pkg.description}</p>
                  )}

                  {/* Meta */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-[var(--base)] px-3 py-1.5 text-xs font-semibold text-[var(--text)]">
                      💰 {formatPrice(Number(pkg.price))}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-[var(--base)] px-3 py-1.5 text-xs font-semibold text-[var(--text)]">
                      📖 {pkg.defaultLessonLimit <= 0 ? "Unlimited" : `${pkg.defaultLessonLimit} pertemuan`}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-[var(--base)] px-3 py-1.5 text-xs font-semibold text-[var(--text)]">
                      📚 {pkg.packageCourses.length} course
                    </span>
                  </div>

                  {/* Courses preview */}
                  {pkg.packageCourses.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {pkg.packageCourses.slice(0, 3).map((pc) => (
                        <span key={pc.courseId} className="rounded-lg bg-[var(--accent)]/30 px-2.5 py-1 text-[11px] font-semibold text-[var(--text)]">
                          {pc.course.title}
                        </span>
                      ))}
                      {pkg.packageCourses.length > 3 && (
                        <span className="rounded-lg bg-[var(--border)] px-2.5 py-1 text-[11px] font-semibold text-[var(--muted)]">
                          +{pkg.packageCourses.length - 3} lagi
                        </span>
                      )}
                    </div>
                  )}

                  {/* Arrow indicator */}
                  <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--base)] px-4 py-2 text-xs font-semibold text-[var(--muted)] transition-colors group-hover:bg-[var(--primary)] group-hover:text-[var(--primary-ink)] group-hover:border-transparent">
                    Kelola Paket
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Create Modal ───────────────────────────────────────── */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-7 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-[var(--text)]">Buat Paket Baru</h2>
              <button
                onClick={() => setShowCreate(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-[var(--base)] text-[var(--muted)] transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[var(--muted)]">Nama Paket *</label>
                <input
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Misal: Paket 10 Pertemuan"
                  required
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--base)] px-4 py-3 text-sm text-[var(--text)] placeholder:text-[var(--muted)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[var(--muted)]">Deskripsi</label>
                <textarea
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Keterangan singkat tentang paket ini"
                  rows={3}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--base)] px-4 py-3 text-sm text-[var(--text)] placeholder:text-[var(--muted)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-[var(--muted)]">Harga (Rp)</label>
                  <input
                    type="number"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    placeholder="100000"
                    min="0"
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--base)] px-4 py-3 text-sm text-[var(--text)] placeholder:text-[var(--muted)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-[var(--muted)]">Jumlah Pertemuan</label>
                  <input
                    type="number"
                    value={formLimit}
                    onChange={(e) => setFormLimit(e.target.value)}
                    placeholder="10"
                    min="0"
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--base)] px-4 py-3 text-sm text-[var(--text)] placeholder:text-[var(--muted)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40"
                  />
                  <p className="mt-1 text-[10px] text-[var(--muted)]">0 = unlimited</p>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="flex-1 rounded-xl border border-[var(--border)] px-4 py-3 text-sm font-semibold text-[var(--text)] hover:bg-[var(--base)] transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={creating || !formName.trim()}
                  className="flex-1 rounded-xl bg-[var(--primary)] px-4 py-3 text-sm font-semibold text-[var(--primary-ink)] shadow-lg shadow-[var(--primary)]/20 transition-all hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {creating ? "Menyimpan…" : "Buat Paket"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
