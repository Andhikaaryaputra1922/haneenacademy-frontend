"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (res.ok) {
        router.push("/student");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.message || "Gagal melakukan pendaftaran");
      }
    } catch {
      setError("Terjadi kesalahan jaringan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[var(--surface)]">
      {/* Left Pane - Branding */}
      <div className="hidden w-1/2 flex-col justify-center bg-[var(--primary)] p-12 lg:flex relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 to-transparent mix-blend-multiply" />
        <div className="relative z-10">
          <Link href="/" className="mb-8 inline-block text-2xl font-black text-[var(--primary-ink)]">
            Haneen<span className="opacity-70">.</span>
          </Link>
          <h1 className="text-4xl font-bold leading-tight text-[var(--primary-ink)] xl:text-5xl">
            Mulai Perjalanan Belajarmu Sekarang
          </h1>
          <p className="mt-4 text-lg text-[var(--primary-ink)]/80">
            Daftar, pilih paket sesuai kebutuhanmu, dan nikmati akses instan ke seluruh materi premium kami.
          </p>
        </div>
      </div>

      {/* Right Pane - Form */}
      <div className="flex w-full items-center justify-center p-8 lg:w-1/2">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <Link href="/" className="text-2xl font-black text-[var(--text)]">
              Haneen<span className="text-[var(--primary)]">.</span>
            </Link>
          </div>

          <h2 className="text-2xl font-bold text-[var(--text)]">Daftar Akun Baru</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">Isi data di bawah ini untuk menjadi bagian dari Haneen Academy.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[var(--text)]">Nama Lengkap</label>
              <input
                name="name"
                type="text"
                required
                placeholder="Ahmad Fauzi"
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--base)] px-4 py-3 text-sm text-[var(--text)] focus:border-[var(--primary)] focus:outline-none focus:ring-4 focus:ring-[var(--primary)]/10"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[var(--text)]">Email</label>
              <input
                name="email"
                type="email"
                required
                placeholder="nama@email.com"
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--base)] px-4 py-3 text-sm text-[var(--text)] focus:border-[var(--primary)] focus:outline-none focus:ring-4 focus:ring-[var(--primary)]/10"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[var(--text)]">Password</label>
              <input
                name="password"
                type="password"
                required
                placeholder="Minimal 6 karakter"
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--base)] px-4 py-3 text-sm text-[var(--text)] focus:border-[var(--primary)] focus:outline-none focus:ring-4 focus:ring-[var(--primary)]/10"
              />
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full rounded-xl bg-[var(--primary)] py-3 text-sm font-bold text-[var(--primary-ink)] hover:bg-[var(--primary)]/90 focus:outline-none focus:ring-4 focus:ring-[var(--primary)]/20 disabled:opacity-50 transition-all"
            >
              {loading ? "Memproses..." : "Daftar Akun"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-[var(--muted)]">
            Sudah punya akun?{" "}
            <Link href="/login" className="font-semibold text-[var(--primary)] hover:underline">
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
