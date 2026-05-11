"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    if (data.password !== data.confirmPassword) {
      setError("Password dan konfirmasi password tidak cocok.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        toast.success("Registrasi Berhasil!");
        router.push("/student");
        router.refresh();
      } else {
        const errData = await res.json();
        setError(errData.message || "Gagal melakukan pendaftaran");
      }
    } catch {
      setError("Terjadi kesalahan jaringan. Coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const onGoogleSuccess = async (credentialResponse: any) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });

      if (res.ok) {
        toast.success("Pendaftaran Google Berhasil!");
        router.push("/student");
        router.refresh();
      } else {
        toast.error("Gagal mendaftar dengan Google");
      }
    } catch {
      toast.error("Terjadi kesalahan sistem");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GoogleOAuthProvider clientId={(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "").trim()}>
      <main className="flex min-h-screen">
        {/* ── Left Panel (Branding) ── */}
        <section className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-[#1A2E44] p-12 lg:flex">
          {/* Animated Background Geometric Pattern */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#E5B54F" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#grid)" />
            </svg>
          </div>

          {/* Logo Section */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E5B54F] shadow-xl shadow-black/20">
              <span className="text-2xl font-black text-[#1A2E44]">H</span>
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter text-white">
                HANEEN<span className="text-[#E5B54F]">.</span>ACADEMY
              </h1>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#E5B54F]/60">LMS Platform</p>
            </div>
          </div>

          {/* Center Content */}
          <div className="relative z-10 my-auto max-w-md">
            <div className="mb-6 h-1 w-12 rounded-full bg-[#E5B54F]" />
            <h2 className="text-4xl font-black leading-[1.1] tracking-tighter text-white lg:text-5xl">
              Bergabunglah dengan <span className="text-[#E5B54F]">Komunitas</span> Belajar Terbaik.
            </h2>
            <p className="mt-6 text-lg font-medium text-white/60 leading-relaxed">
              Dapatkan akses ke materi eksklusif, tryout intensif, dan bimbingan langsung dari para pengajar berpengalaman.
            </p>
          </div>

          {/* Footer Info */}
          <div className="relative z-10 flex items-center justify-between text-sm font-medium text-white/40">
            <p>© 2026 Haneen Academy</p>
            <div className="flex gap-4">
              <span className="hover:text-white transition-colors cursor-pointer">Syarat</span>
              <span className="hover:text-white transition-colors cursor-pointer">Privasi</span>
            </div>
          </div>
        </section>

        {/* ── Right Panel (Registration Form) ── */}
        <section className="flex w-full flex-col items-center justify-center bg-white p-8 lg:w-1/2 overflow-y-auto">
          <div className="w-full max-w-md space-y-8 py-10">
            {/* Mobile Header */}
            <div className="flex flex-col items-center lg:hidden mb-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1A2E44] shadow-xl">
                <span className="text-2xl font-black text-[#E5B54F]">H</span>
              </div>
              <h1 className="text-xl font-black tracking-tighter text-[#1A2E44] mt-4">HANEEN ACADEMY</h1>
            </div>

            <div>
              <h2 className="text-3xl font-black tracking-tighter text-[#1A2E44]">Mulai Belajar Hari Ini</h2>
              <p className="mt-2 text-sm font-medium text-slate-500">
                Sudah punya akun?{" "}
                <Link href="/login" className="font-bold text-[#E5B54F] hover:underline transition-all">
                  Masuk di sini
                </Link>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">Nama Lengkap</label>
                  <input name="name" type="text" required className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-medium transition-all focus:border-[#E5B54F] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#E5B54F]/10" placeholder="Ahmad Fauzi" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">Username</label>
                  <input name="username" type="text" required className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-medium transition-all focus:border-[#E5B54F] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#E5B54F]/10" placeholder="ahmad_f" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">Email</label>
                  <input name="email" type="email" required className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-medium transition-all focus:border-[#E5B54F] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#E5B54F]/10" placeholder="ahmad@mail.com" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">WhatsApp</label>
                  <input name="phone" type="tel" required className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-medium transition-all focus:border-[#E5B54F] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#E5B54F]/10" placeholder="0857..." />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">Password</label>
                  <input name="password" type="password" required className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-medium transition-all focus:border-[#E5B54F] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#E5B54F]/10" placeholder="••••••••" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">Konfirmasi</label>
                  <input name="confirmPassword" type="password" required className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-medium transition-all focus:border-[#E5B54F] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#E5B54F]/10" placeholder="••••••••" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Kode Kupon (Opsional)</label>
                <input name="couponCode" type="text" className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-medium transition-all focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 uppercase" placeholder="HANEEN2026" />
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-xs font-bold flex items-center gap-2">
                   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                   {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-xl bg-[#1A2E44] py-4 text-sm font-black text-white shadow-xl shadow-[#1A2E44]/20 transition-all hover:bg-[#0F1C2E] active:scale-[0.98] disabled:opacity-50"
              >
                {isLoading ? "Memproses..." : "Daftar Akun Baru"}
              </button>
            </form>

            <div className="my-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Atau daftar dengan</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            <div className="flex justify-center w-full">
              <GoogleLogin
                onSuccess={onGoogleSuccess}
                onError={() => toast.error("Google Signup Failed")}
                theme="outline"
                shape="pill"
                size="large"
                width="384"
              />
            </div>

            <p className="mt-8 text-center text-[10px] text-slate-400 leading-relaxed">
              Dengan mendaftar, Anda menyetujui{" "}
              <span className="font-semibold text-slate-500">Syarat & Ketentuan</span> serta{" "}
              <span className="font-semibold text-slate-500">Kebijakan Privasi</span> Haneen Academy.
            </p>
          </div>
        </section>
      </main>
    </GoogleOAuthProvider>
  );
}
