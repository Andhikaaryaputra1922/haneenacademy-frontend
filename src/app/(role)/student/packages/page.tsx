"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import BackButton from "@/components/BackButton";

interface StorePackage {
  id: string;
  name: string;
  description: string | null;
  price: number;
  defaultLessonLimit: number;
  packageCourses: {
    lessonLimit: number | null;
    course: {
      id: string;
      title: string;
      category: string;
      thumbnailUrl: string | null;
    };
  }[];
}

export default function PackageStorePage() {
  const [packages, setPackages] = useState<StorePackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/packages/store", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setPackages(data.packages || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const formatPrice = (p: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(p);

  const handleBuy = async (pkgId: string) => {
    setPurchasing(pkgId);
    try {
      const res = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageId: pkgId }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        alert(data.message || "Gagal membuat transaksi");
        return;
      }

      // Pastikan Snap Midtrans sudah dimuat di layout utama
      if (typeof window !== "undefined" && (window as any).snap) {
        (window as any).snap.pay(data.token, {
          onSuccess: function (result: any) {
            alert("Pembayaran berhasil! Anda akan segera diarahkan ke Dashboard.");
            window.location.href = "/student";
          },
          onPending: function (result: any) {
            alert("Menunggu pembayaran Anda.");
          },
          onError: function (result: any) {
            alert("Pembayaran gagal. Silakan coba lagi.");
          },
          onClose: function () {
            console.log("Pop up ditutup");
          }
        });
      } else {
        alert("Sistem pembayaran belum siap. Silakan refresh halaman.");
      }
    } catch (err) {
      alert("Error memproses pembelian.");
    } finally {
      setPurchasing(null);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--base)] px-6 py-10">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <BackButton />
              <Link href="/student" className="text-sm font-semibold text-[var(--muted)] hover:text-[var(--text)] transition-colors">
                Kembali ke Dashboard
              </Link>
            </div>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-[var(--text)] md:text-5xl">
              Pilih Paket Belajarmu
            </h1>
            <p className="mt-3 max-w-2xl text-base text-[var(--muted)]">
              Dapatkan akses ke materi premium kami dengan harga terbaik. Pembayaran instan melalui QRIS, Transfer Bank, dan lainnya.
            </p>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-[400px] animate-pulse rounded-3xl border border-[var(--border)] bg-[var(--surface)]" />
            ))}
          </div>
        )}

        {/* Packages Grid */}
        {!loading && packages.length === 0 && (
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-12 text-center">
            <h3 className="text-xl font-bold text-[var(--text)]">Belum ada paket</h3>
            <p className="mt-2 text-[var(--muted)]">Saat ini belum ada paket yang tersedia untuk dibeli.</p>
          </div>
        )}

        {!loading && packages.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {packages.map((pkg) => {
              const isFree = pkg.price === 0;
              return (
                <div key={pkg.id} className="relative flex flex-col overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 md:p-8 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
                  
                  {/* Badge */}
                  {pkg.name.toLowerCase().includes("pro") || pkg.name.toLowerCase().includes("premium") ? (
                    <div className="absolute right-0 top-0 rounded-bl-2xl bg-gradient-to-tr from-amber-400 to-amber-300 px-4 py-2 font-black text-amber-950 text-xs shadow-sm">
                      POPULER
                    </div>
                  ) : null}

                  <h3 className="text-2xl font-black text-[var(--text)]">{pkg.name}</h3>
                  <p className="mt-2 text-sm text-[var(--muted)]">{pkg.description || "Akses ke modul-modul pembelajaran komprehensif."}</p>
                  
                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-4xl font-black tracking-tight text-[var(--text)]">
                      {isFree ? "Gratis" : formatPrice(pkg.price)}
                    </span>
                    {!isFree && <span className="text-sm font-medium text-[var(--muted)]">/paket</span>}
                  </div>

                  <div className="my-8 h-px w-full bg-[var(--border)]" />

                  <div className="mb-8 flex-1">
                    <p className="mb-4 text-xs font-bold uppercase tracking-widest text-[var(--muted)]">TERMASUK</p>
                    <ul className="space-y-4">
                      {/* Default limit */}
                      <li className="flex items-start gap-3 text-sm text-[var(--text)] font-medium">
                        <svg className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        <span>{pkg.defaultLessonLimit <= 0 ? "Akses materi tak terbatas" : `Batas ${pkg.defaultLessonLimit} materi per kelas`}</span>
                      </li>
                      
                      {/* Courses count */}
                      <li className="flex items-start gap-3 text-sm text-[var(--text)] font-medium">
                        <svg className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        <span>Akses penuh ke {pkg.packageCourses.length} Kelas Pembelajaran</span>
                      </li>

                      {/* Map top 3 courses */}
                      {pkg.packageCourses.slice(0, 3).map(pc => (
                        <li key={pc.course.id} className="flex items-start gap-3 text-sm text-[var(--muted)] pl-7">
                          <span className="h-1.5 w-1.5 mt-2 shrink-0 rounded-full bg-[var(--border)]" />
                          <span className="line-clamp-1">{pc.course.title}</span>
                        </li>
                      ))}
                      {pkg.packageCourses.length > 3 && (
                        <li className="text-xs font-semibold text-[var(--primary)] pl-7">
                          + {pkg.packageCourses.length - 3} kelas lainnya
                        </li>
                      )}
                    </ul>
                  </div>

                  <button
                    onClick={() => handleBuy(pkg.id)}
                    disabled={purchasing === pkg.id}
                    className={`w-full rounded-2xl py-4 text-sm font-bold transition-all focus:outline-none focus:ring-4 focus:ring-[var(--primary)]/20 disabled:opacity-50
                      ${purchasing === pkg.id || pkg.name.toLowerCase().includes("pro")
                        ? "bg-[var(--primary)] text-[var(--primary-ink)] hover:bg-[var(--primary)]/90" 
                        : "bg-[var(--base)] border border-[var(--border)] text-[var(--text)] hover:bg-black/5 dark:hover:bg-white/5"}
                    `}
                  >
                    {purchasing === pkg.id ? "Memproses..." : isFree ? "Dapatkan Gratis" : "Beli Sekarang"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
