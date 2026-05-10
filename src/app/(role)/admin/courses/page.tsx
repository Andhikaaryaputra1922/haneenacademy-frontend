"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface Course {
  id: string;
  title: string;
  category: string;
  level: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  price: number;
  isPremium: boolean;
  createdAt: string;
  teacher: {
    id: string;
    name: string | null;
    email: string;
  } | null;
  _count: {
    lessons: number;
    enrollments: number;
  };
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("ALL");
  const [search, setSearch] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/courses", { credentials: "include" });
      if (res.ok) {
        const d = await res.json();
        setCourses(d.courses ?? []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const updateStatus = async (courseId: string, status: "DRAFT" | "PUBLISHED" | "ARCHIVED") => {
    if (!confirm(`Ubah status course menjadi ${status}?`)) return;
    setUpdating(courseId);
    try {
      const res = await fetch(`/api/admin/courses/${courseId}/status`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        fetchCourses();
      } else {
        const err = await res.json();
        alert(err.message || "Gagal mengubah status");
      }
    } catch {
      alert("Error jaringan");
    } finally {
      setUpdating(null);
    }
  };

  const filteredCourses = courses.filter((c) => {
    if (activeTab !== "ALL" && c.status !== activeTab) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        c.title.toLowerCase().includes(q) ||
        (c.teacher?.name && c.teacher.name.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const tabs = [
    { key: "ALL", label: "Semua" },
    { key: "PUBLISHED", label: "Published" },
    { key: "DRAFT", label: "Draft" },
    { key: "ARCHIVED", label: "Diarsipkan" },
  ];

  return (
    <main className="min-h-screen bg-[var(--base)] px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-[40px] border border-[var(--border)] bg-[var(--surface)] p-7 md:p-10">
          
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <Link href="/admin" className="mb-2 inline-flex items-center gap-1 text-xs font-semibold text-[var(--muted)] hover:text-[var(--text)] transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                Admin Panel
              </Link>
              <h1 className="text-3xl font-black tracking-tight text-[var(--text)] md:text-4xl">
                Moderasi Course
              </h1>
              <p className="mt-2 text-sm text-[var(--muted)]">
                Review, publish, atau arsipkan materi dari pengajar.
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between mb-6">
            <div className="flex flex-wrap gap-2">
              {tabs.map(t => (
                <button key={t.key} onClick={() => setActiveTab(t.key)}
                  className={`rounded-full px-5 py-2 text-xs font-semibold transition-colors border ${activeTab === t.key ? "bg-[var(--primary)] text-[var(--primary-ink)] border-transparent" : "bg-[var(--base)] text-[var(--text)] border-[var(--border)] hover:bg-[var(--border)]"}`}>
                  {t.label}
                </button>
              ))}
            </div>
            <div className="w-full sm:w-64 relative">
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari nama course/guru..."
                className="w-full rounded-full border border-[var(--border)] bg-[var(--base)] px-4 py-2 pl-10 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40" />
              <svg className="absolute left-3 top-2.5 text-[var(--muted)]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-2xl border border-[var(--border)]">
            <table className="w-full text-left text-sm text-[var(--text)]">
              <thead className="bg-[var(--base)] text-xs font-semibold uppercase text-[var(--muted)] border-b border-[var(--border)]">
                <tr>
                  <th className="px-6 py-4">Informasi Course</th>
                  <th className="px-6 py-4">Pengajar</th>
                  <th className="px-6 py-4">Status & Metrik</th>
                  <th className="px-6 py-4 text-right">Aksi Moderasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)] bg-[var(--surface)]">
                {loading ? (
                  <tr><td colSpan={4} className="px-6 py-8 text-center text-[var(--muted)]">Memuat...</td></tr>
                ) : filteredCourses.length === 0 ? (
                  <tr><td colSpan={4} className="px-6 py-8 text-center text-[var(--muted)]">Tidak ada course ditemukan</td></tr>
                ) : (
                  filteredCourses.map((c) => (
                    <tr key={c.id} className="hover:bg-[var(--base)] transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold">{c.title}</p>
                        <div className="flex gap-2 mt-1">
                          <span className="text-[10px] font-semibold text-[var(--primary)] bg-[var(--primary)]/10 px-2 py-0.5 rounded-full">{c.category}</span>
                          <span className="text-[10px] font-semibold text-[var(--muted)] bg-[var(--border)] px-2 py-0.5 rounded-full">{c.level}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-sm">{c.teacher?.name || "Tanpa Guru"}</p>
                        <p className="text-xs text-[var(--muted)]">{c.teacher?.email || "-"}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="mb-2">
                          <span className={`inline-flex px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                            c.status === "PUBLISHED" ? "bg-emerald-100 text-emerald-700" :
                            c.status === "ARCHIVED" ? "bg-rose-100 text-rose-700" :
                            "bg-amber-100 text-amber-700"
                          }`}>
                            {c.status}
                          </span>
                        </div>
                        <p className="text-xs text-[var(--muted)]">{c._count.lessons} Materi · {c._count.enrollments} Siswa</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex flex-wrap justify-end gap-2">
                          <Link href={`/courses/${c.id}`} target="_blank" className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-semibold hover:bg-[var(--base)] transition-colors">Lihat</Link>
                          
                          {c.status !== "PUBLISHED" && (
                            <button disabled={updating === c.id} onClick={() => updateStatus(c.id, "PUBLISHED")} className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50">
                              Terbitkan
                            </button>
                          )}
                          {c.status !== "DRAFT" && (
                            <button disabled={updating === c.id} onClick={() => updateStatus(c.id, "DRAFT")} className="rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-600 disabled:opacity-50">
                              Jadikan Draft
                            </button>
                          )}
                          {c.status !== "ARCHIVED" && (
                            <button disabled={updating === c.id} onClick={() => updateStatus(c.id, "ARCHIVED")} className="rounded-lg border border-rose-200 text-rose-600 px-3 py-1.5 text-xs font-semibold hover:bg-rose-50 disabled:opacity-50">
                              Arsipkan
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
