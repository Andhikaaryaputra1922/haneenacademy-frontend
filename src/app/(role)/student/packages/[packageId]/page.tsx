"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { PremiumModal, Toast } from "@/components/ui/PremiumFeedback";

interface PackageLesson {
  id: string;
  title: string;
  orderNumber: number;
  type: string;
}

interface PackageCourse {
  lessonLimit: number | null;
  course: {
    id: string;
    title: string;
    category: string;
    thumbnailUrl: string | null;
    teacher: { name: string | null } | null;
    lessons: PackageLesson[];
  };
}

interface PackageDetail {
  id: string;
  name: string;
  description: string | null;
  price: number;
  defaultLessonLimit: number;
  packageCourses: PackageCourse[];
}

export default function PackageDetailPage() {
  const params = useParams();
  const router = useRouter();
  const packageId = params.packageId as string;

  const [pkg, setPkg] = useState<PackageDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Payment modal state
  const [showModal, setShowModal] = useState(false);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [purchasing, setPurchasing] = useState(false);

  // Premium Feedback
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [feedback, setFeedback] = useState<{ isOpen: boolean; title: string; message: string; type: any; onConfirm?: () => void } | null>(null);

  useEffect(() => {
    fetch(`/api/packages/store/${packageId}`, { credentials: "include" })
      .then((res) => {
        if (res.status === 404) { setNotFound(true); return null; }
        return res.json();
      })
      .then((data) => {
        if (data?.package) setPkg(data.package);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [packageId]);

  const formatPrice = (p: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(p);

  const isFree = pkg?.price === 0;
  const discountPercent = 75;
  const originalPrice = pkg && !isFree ? pkg.price * (100 / (100 - discountPercent)) : 0;

  // Flatten all lessons from all courses for the materi section
  const allLessons = pkg?.packageCourses.flatMap((pc) =>
    pc.course.lessons.map((l) => ({ ...l, courseTitle: pc.course.title }))
  ) ?? [];

  // Total videos (lessons with type VIDEO)
  const totalVideos = allLessons.filter((l) => l.type === "VIDEO").length;

  // Unique mentors
  const mentors = Array.from(
    new Set(
      pkg?.packageCourses
        .map((pc) => pc.course.teacher?.name)
        .filter(Boolean) as string[]
    )
  );

  const handleFree = async () => {
    if (!pkg) return;
    
    setFeedback({
      isOpen: true,
      title: "Konfirmasi Pendaftaran",
      message: `Dapatkan paket "${pkg.name}" secara gratis?`,
      type: "confirm",
      onConfirm: async () => {
        setFeedback(null);
        setPurchasing(true);
        try {
          const res = await fetch("/api/payments/free", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ packageId: pkg.id }),
          });
          if (res.ok) {
            setFeedback({
              isOpen: true,
              title: "Selamat! 🎉",
              message: "Paket Anda telah aktif dan dapat langsung diakses.",
              type: "success",
              onConfirm: () => {
                router.push("/student");
                router.refresh();
              }
            });
          } else {
            const data = await res.json();
            setToast({ message: data.message || "Gagal mengambil paket gratis", type: "error" });
          }
        } catch {
          setToast({ message: "Error memproses paket gratis.", type: "error" });
        } finally {
          setPurchasing(false);
        }
      }
    });
  };

  const submitManualPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pkg || !proofFile) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("packageId", pkg.id);
      formData.append("proof", proofFile);
      const res = await fetch("/api/payments/manual", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      if (res.ok) {
        setShowModal(false);
        setProofFile(null);
        setFeedback({
          isOpen: true,
          title: "Konfirmasi Terkirim! 🚀",
          message: "Admin akan memverifikasi pembayaran Anda segera. Harap tunggu maksimal 1x24 jam.",
          type: "success",
          onConfirm: () => {
            router.push("/student");
            router.refresh();
          }
        });
      } else {
        const data = await res.json();
        setToast({ message: data.message || "Gagal mengirim konfirmasi", type: "error" });
      }
    } catch {
      setToast({ message: "Error mengirim konfirmasi.", type: "error" });
    } finally {
      setUploading(false);
    }
  };

  /* ── Loading ───────────────────────────────────────────────── */
  if (loading) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[#8B0000] border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 font-medium">Memuat detail paket...</p>
        </div>
      </main>
    );
  }

  if (notFound || !pkg) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Paket tidak ditemukan</h2>
          <p className="text-slate-500 mb-6">Paket ini mungkin sudah tidak aktif.</p>
          <Link href="/student/packages" className="inline-block bg-[#8B0000] text-white px-6 py-3 rounded-xl font-bold hover:bg-red-900 transition-colors">
            Kembali ke Etalase
          </Link>
        </div>
      </main>
    );
  }

  /* ── Main Content ──────────────────────────────────────────── */
  return (
    <main className="min-h-screen bg-white pb-20">
      {/* Breadcrumb */}
      <div className="border-b border-slate-100 bg-white px-6 py-4">
        <nav className="mx-auto max-w-5xl flex items-center gap-2 text-sm text-slate-500">
          <Link href="/student" className="hover:text-[#8B0000] transition-colors">Dashboard</Link>
          <span>/</span>
          <Link href="/student/packages" className="hover:text-[#8B0000] transition-colors">Paket Belajar</Link>
          <span>/</span>
          <span className="text-slate-800 font-medium line-clamp-1">{pkg.name}</span>
        </nav>
      </div>

      <div className="mx-auto max-w-5xl px-6 pt-8">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* ─── LEFT COLUMN ─────────────────────────────────── */}
          <div className="flex-1 min-w-0">

            {/* Tentang Paket */}
            <section>
              <h2 className="text-xl font-black text-[#8B0000] mb-4">Tentang Paket</h2>
              <p className="text-sm font-bold text-slate-700 uppercase mb-3">
                PAKET INI KHUSUS UNTUK PENDAFTAR PROGRAM {pkg.name.toUpperCase()}.
              </p>
              <div className="text-sm text-slate-700 leading-relaxed space-y-2">
                {pkg.description ? (
                  <p>{pkg.description}</p>
                ) : (
                  <>
                    <p>Berisi materi pembelajaran komprehensif dari dasar hingga mahir.</p>
                  </>
                )}
                <ul className="mt-4 space-y-1.5">
                  {[
                    "Kelas online bersama pengajar berpengalaman",
                    "Rekaman kelas tersedia setelah sesi selesai",
                    "Soal-soal latihan berdasarkan pengalaman peserta",
                    "Pembahasan soal lengkap & detail",
                    "Akses materi kapan saja dan di mana saja",
                    `Batas akses ${pkg.defaultLessonLimit <= 0 ? "tak terbatas" : pkg.defaultLessonLimit + " materi per kelas"}`,
                    `Akses penuh ke ${pkg.packageCourses.length} kelas pembelajaran`,
                    "Join grup belajar eksklusif",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm">
                      <svg className="w-4 h-4 text-[#8B0000] mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Materi Section */}
            {allLessons.length > 0 && (
              <section className="mt-10">
                <h2 className="text-xl font-black text-[#8B0000] mb-5">Materi</h2>
                <div className="space-y-2">
                  {allLessons.map((lesson, idx) => (
                    <div
                      key={lesson.id}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold ${
                        idx % 2 === 0
                          ? "bg-blue-50 text-blue-900"
                          : idx % 3 === 0
                          ? "bg-slate-50 text-slate-800"
                          : "bg-slate-100 text-slate-800"
                      }`}
                    >
                      <span className="shrink-0">{idx + 1}.</span>
                      <span>{lesson.title}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* ─── RIGHT SIDEBAR ────────────────────────────────── */}
          <aside className="w-full lg:w-72 xl:w-80 shrink-0">
            {/* Price Card */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-md p-6 mb-4">
              {/* Price */}
              <div className="mb-4">
                {isFree ? (
                  <p className="text-3xl font-black text-[#8B0000]">Gratis</p>
                ) : (
                  <>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded">
                        {discountPercent}%
                      </span>
                      <span className="text-sm text-slate-400 line-through font-medium">
                        {formatPrice(originalPrice)}
                      </span>
                    </div>
                    <p className="text-3xl font-black text-[#8B0000]">{formatPrice(pkg.price)}</p>
                  </>
                )}
              </div>

              {/* CTA */}
              {isFree ? (
                <button
                  onClick={handleFree}
                  disabled={purchasing}
                  className="w-full bg-[#8B0000] hover:bg-red-900 text-white font-bold py-3.5 rounded-xl shadow-md transition-all disabled:opacity-60"
                >
                  {purchasing ? "Memproses..." : "Dapatkan Gratis"}
                </button>
              ) : (
                <button
                  onClick={() => setShowModal(true)}
                  className="w-full bg-[#8B0000] hover:bg-red-900 text-white font-bold py-3.5 rounded-xl shadow-md transition-all"
                >
                  Beli Paket Sekarang
                </button>
              )}

              <p className="text-center text-[10px] text-slate-400 mt-3 uppercase tracking-wider">
                Diverifikasi oleh tim Haneen Academy
              </p>
            </div>

            {/* Detail Kelas */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 mb-4">
              <h3 className="text-base font-black text-[#8B0000] mb-4">Detail Kelas</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3">
                  <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                  <span className="text-sm font-bold text-slate-700">{allLessons.length} Materi</span>
                </div>
                {totalVideos > 0 && (
                  <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3">
                    <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                    <span className="text-sm font-bold text-slate-700">{totalVideos} Video</span>
                  </div>
                )}
                <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3">
                  <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
                  <span className="text-sm font-bold text-slate-700">{pkg.packageCourses.length} Kelas</span>
                </div>
              </div>
            </div>

            {/* Mentor */}
            {mentors.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
                <h3 className="text-base font-black text-[#8B0000] mb-4">Mentor</h3>
                <div className="flex flex-col gap-3">
                  {mentors.map((name) => (
                    <div key={name} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#8B0000]/10 flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4 text-[#8B0000]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#8B0000]">{name}</p>
                        <p className="text-[10px] text-slate-400">Super Teacher</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>

      {/* ─── Payment Modal ─────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="border-b border-slate-100 p-6 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800">Konfirmasi Pembayaran</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors text-2xl leading-none">&times;</button>
            </div>

            <div className="p-6">
              {/* Payment info */}
              <div className="mb-6 rounded-2xl bg-red-50 p-4">
                <p className="text-xs font-bold text-[#8B0000] uppercase tracking-wider mb-2">Instruksi Pembayaran</p>
                <p className="text-sm text-slate-700 leading-relaxed mb-3">
                  Silakan transfer sebesar{" "}
                  <strong className="text-[#8B0000]">{formatPrice(pkg.price)}</strong> ke rekening berikut:
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-white p-3 shadow-sm border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">E-WALLET DANA</p>
                    <p className="font-bold text-slate-700 text-sm">085704833249</p>
                    <p className="text-[10px] text-slate-500">A/N Haneen Academy</p>
                  </div>
                  <div className="rounded-xl bg-white p-3 shadow-sm border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">BANK BRI</p>
                    <p className="font-bold text-slate-700 text-sm">017201109122508</p>
                    <p className="text-[10px] text-slate-500">A/N Haneen Academy</p>
                  </div>
                </div>
              </div>

              {/* Upload proof */}
              <form onSubmit={submitManualPayment} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Unggah Bukti Bayar</label>
                  <div className="relative group">
                    <input
                      type="file"
                      accept="image/*"
                      required
                      onChange={(e) => setProofFile(e.target.files?.[0] || null)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center transition-all group-hover:border-[#8B0000] group-hover:bg-red-50/30">
                      {proofFile ? (
                        <div className="flex flex-col items-center">
                          <svg className="w-8 h-8 text-emerald-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                          <p className="text-sm font-semibold text-slate-700">{proofFile.name}</p>
                          <p className="text-xs text-slate-400 mt-1">Klik untuk mengganti file</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <svg className="w-8 h-8 text-slate-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>
                          <p className="text-sm font-semibold text-slate-600">Klik atau seret gambar ke sini</p>
                          <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">PNG, JPG, JPEG (Max. 5MB)</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={uploading || !proofFile}
                  className="w-full bg-[#8B0000] hover:bg-red-900 text-white font-bold py-4 rounded-2xl shadow-lg shadow-red-900/20 transition-all disabled:opacity-50 active:scale-95"
                >
                  {uploading ? "Mengirim..." : "Kirim Konfirmasi"}
                </button>

                <p className="text-center text-[10px] text-slate-400 uppercase tracking-widest leading-relaxed">
                  Pesanan Anda akan diverifikasi secara manual oleh tim kami<br />dalam waktu maksimal 1x24 jam.
                </p>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Premium Feedback Components */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
      {feedback && (
        <PremiumModal
          isOpen={feedback.isOpen}
          onClose={() => setFeedback(null)}
          onConfirm={feedback.onConfirm}
          title={feedback.title}
          message={feedback.message}
          type={feedback.type}
          confirmText="Ya, Lanjutkan"
          loading={purchasing || uploading}
        />
      )}
    </main>
  );
}
