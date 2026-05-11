"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  useEffect(() => {
    fetch("/api/packages/store", { credentials: "include" })
      .then((res) => res.json())
      .then((storeData) => {
        setPackages(storeData.packages || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const formatPrice = (p: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(p);

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      {/* Banner Section */}
      <div className="w-full bg-[#1A2E44] px-4 py-20 text-center text-white relative overflow-hidden">
        {/* Islamic Motif Background */}
        <div className="absolute inset-0 opacity-10 flex justify-center items-center pointer-events-none scale-150">
          <svg className="w-[800px] h-[800px]" fill="#E5B54F" viewBox="0 0 100 100">
            <path d="M50 0 L60 40 L100 50 L60 60 L50 100 L40 60 L0 50 L40 40 Z" />
          </svg>
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center justify-center">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-8 bg-[#E5B54F]" />
            <p className="text-xs font-black tracking-[0.4em] uppercase text-[#E5B54F]">Program Unggulan</p>
            <div className="h-px w-8 bg-[#E5B54F]" />
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
             AKSELERASI <span className="text-[#E5B54F]">UTBK & TKA</span>
          </h1>
          <p className="text-lg md:text-xl font-medium mb-10 max-w-2xl text-white/70 leading-relaxed">
            Kurikulum terintegrasi Haneen Academy untuk memaksimalkan peluang kelulusan Anda di PTN Impian.
          </p>
          <div className="inline-block bg-[#E5B54F] text-[#1A2E44] px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-[#E5B54F]/20 hover:scale-105 transition-transform cursor-default">
            Diskon Spesial Terbatas! 🌙
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 mt-12">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
             <div className="h-8 w-1 bg-[#1A2E44] rounded-full" />
             <h2 className="text-2xl font-black text-slate-800">Paket Belajar Terbaik</h2>
          </div>
          <button className="text-sm font-bold text-[#1A2E44] hover:text-[#E5B54F] flex items-center gap-1 group transition-colors">
            Lihat Semua
            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"></path></svg>
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-[450px] animate-pulse rounded-2xl border border-slate-200 bg-white" />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && packages.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
            <h3 className="text-xl font-bold text-slate-800">Belum ada paket</h3>
            <p className="mt-2 text-slate-500">Saat ini belum ada paket yang tersedia untuk dibeli.</p>
          </div>
        )}

        {/* Packages Grid */}
        {!loading && packages.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {packages.map((pkg) => {
              const isFree = pkg.price === 0;
              // Simulate discount percentage and original price for UI
              const discountPercent = 75;
              const originalPrice = isFree ? 0 : pkg.price * (100 / (100 - discountPercent));

              // Sum of all lessons across courses
              const totalLessons = pkg.packageCourses.reduce((acc, pc) => {
                // If we don't have exact lesson counts here, we just use a placeholder text or default limit
                return acc + (pc.lessonLimit ?? pkg.defaultLessonLimit);
              }, 0) || 7;

              return (
                <div key={pkg.id} className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-200 hover:shadow-xl transition-all">
                  
                  {/* Card Header Section */}
                  <div className="bg-[#1A2E44] p-8 text-center text-white relative">
                    <h3 className="text-3xl font-black italic tracking-tighter text-white/5 absolute -right-2 -top-2 select-none pointer-events-none uppercase">PROMO</h3>
                    <div className="relative z-10 flex flex-col items-center">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#E5B54F] mb-2">Exclusive Access</p>
                      <h4 className="text-xl font-black uppercase leading-tight mb-3 tracking-tighter">{pkg.name}</h4>
                      <div className="inline-block bg-[#E5B54F] text-[#1A2E44] px-4 py-1 rounded-lg font-black text-[9px] uppercase tracking-widest shadow-lg">
                        Premium Bundle
                      </div>
                    </div>
                  </div>

                  {/* Bottom White Section */}
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="mb-4 flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1 rounded bg-blue-50 px-2 py-1 text-[10px] font-bold text-blue-700">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        {totalLessons} Materi
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-800 uppercase mb-2 line-clamp-2">
                      {pkg.name} (KELAS & TRYOUT)
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-3 mb-6 flex-1">
                      {pkg.description || `Paket ini khusus untuk pendaftar program ${pkg.name}.`}
                    </p>

                    <div className="mt-auto">
                      {isFree ? (
                        <div className="flex items-end justify-end mb-6">
                          <span className="text-2xl font-black text-[#1A2E44]">Gratis ✨</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex flex-col">
                            <span className="inline-block bg-emerald-600 text-white px-1.5 py-0.5 rounded text-[10px] font-bold self-start mb-1">
                              {discountPercent}%
                            </span>
                            <span className="text-xs text-slate-400 line-through font-medium">
                              {formatPrice(originalPrice)}
                            </span>
                          </div>
                          <span className="text-2xl font-black text-[#1A2E44]">
                            {formatPrice(pkg.price)}
                          </span>
                        </div>
                      )}

                      <button
                        onClick={() => router.push(`/student/packages/${pkg.id}`)}
                        className="w-full rounded-2xl bg-[#1A2E44] hover:bg-[#E5B54F] hover:text-[#1A2E44] py-4 text-xs font-black uppercase tracking-widest text-white transition-all shadow-xl shadow-[#1A2E44]/10 active:scale-[0.98]"
                      >
                        Pesan Sekarang
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
