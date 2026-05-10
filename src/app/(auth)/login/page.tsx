"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        setError("Email atau password salah");
        return;
      }

      const meResponse = await fetch("/api/auth/me", {
        credentials: "include",
      });

      if (!meResponse.ok) {
        router.push("/dashboard");
        return;
      }

      const data = (await meResponse.json()) as {
        user?: {
          role?: string;
        };
      };

      const role = data.user?.role;

      if (role === "ADMIN") {
        router.push("/admin");
        return;
      }

      if (role === "TEACHER") {
        router.push("/teacher");
        return;
      }

      router.push("/student");
    } catch {
      setError("Terjadi kesalahan server");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f3f5f9] px-4">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-sm">

        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#1d428a] text-xl font-bold text-white">
            H
          </div>

          <h1 className="mt-4 text-2xl font-bold text-gray-800">
            HaneenAcademy
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Silakan login menggunakan akun Anda
          </p>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-5">

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Email
            </label>

            <input
              type="email"
              placeholder="Masukkan email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#1d428a]"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Password
            </label>

            <input
              type="password"
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#1d428a]"
              required
            />
          </div>

          {error ? (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-[#1d428a] px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
          >
            {isLoading ? "Memproses..." : "Login"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-600">
          Belum punya akun?{" "}
          <Link href="/register" className="font-semibold text-[#1d428a] hover:underline">
            Daftar sekarang
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-500">
          © 2026 HaneenAcademy
        </div>
      </div>
    </main>
  );
}