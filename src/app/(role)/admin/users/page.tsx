"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface User {
  id: string;
  name: string | null;
  email: string;
  role: "ADMIN" | "TEACHER" | "STUDENT" | "PARENT";
  phone: string | null;
  school: string | null;
  createdAt: string;
  _count: { enrollments: number; coursesTaught: number };
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("ALL");
  const [search, setSearch] = useState("");

  // Create Modal
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editUserId, setEditUserId] = useState("");
  const [saving, setSaving] = useState(false);

  // Form State
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formRole, setFormRole] = useState<"ADMIN" | "TEACHER" | "STUDENT" | "PARENT">("STUDENT");
  const [formPhone, setFormPhone] = useState("");
  const [formSchool, setFormSchool] = useState("");

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const url = new URL("/api/admin/users", window.location.origin);
      if (activeTab !== "ALL") url.searchParams.set("role", activeTab);
      if (search) url.searchParams.set("search", search);

      const res = await fetch(url.toString(), { credentials: "include" });
      if (res.ok) {
        const d = await res.json();
        setUsers(d.users ?? []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [activeTab, search]);

  useEffect(() => {
    const t = setTimeout(fetchUsers, 300);
    return () => clearTimeout(t);
  }, [fetchUsers]);

  const openCreateModal = () => {
    setIsEditing(false);
    setEditUserId("");
    setFormName("");
    setFormEmail("");
    setFormPassword("");
    setFormRole("STUDENT");
    setFormPhone("");
    setFormSchool("");
    setShowModal(true);
  };

  const openEditModal = (u: User) => {
    setIsEditing(true);
    setEditUserId(u.id);
    setFormName(u.name || "");
    setFormEmail(u.email);
    setFormPassword(""); // Kosong kecuali diganti
    setFormRole(u.role);
    setFormPhone(u.phone || "");
    setFormSchool(u.school || "");
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    try {
      const url = isEditing ? `/api/admin/users/${editUserId}` : `/api/admin/users`;
      const method = isEditing ? "PUT" : "POST";
      const payload = {
        name: formName,
        email: formEmail,
        role: formRole,
        phone: formPhone || undefined,
        school: formSchool || undefined,
        ...(formPassword ? { password: formPassword } : {}),
      };

      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setShowModal(false);
        fetchUsers();
      } else {
        const err = await res.json();
        alert(err.message || "Gagal menyimpan user");
      }
    } catch {
      alert("Error jaringan");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (u: User) => {
    if (!confirm(`Hapus (nonaktifkan) user ${u.name}?`)) return;
    try {
      const res = await fetch(`/api/admin/users/${u.id}`, { method: "DELETE", credentials: "include" });
      if (res.ok) {
        fetchUsers();
      } else {
        const err = await res.json();
        alert(err.message || "Gagal menghapus user");
      }
    } catch {
      alert("Error jaringan");
    }
  };

  const tabs = [
    { key: "ALL", label: "Semua User" },
    { key: "STUDENT", label: "Siswa" },
    { key: "TEACHER", label: "Pengajar" },
    { key: "ADMIN", label: "Admin" },
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
                Manajemen User
              </h1>
              <p className="mt-2 text-sm text-[var(--muted)]">
                Kelola data akun siswa, pengajar, dan admin platform.
              </p>
            </div>
            <button onClick={openCreateModal} className="inline-flex items-center gap-2 rounded-full bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-[var(--primary-ink)] shadow-lg shadow-[var(--primary)]/20 hover:shadow-xl hover:-translate-y-0.5 transition-all">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Tambah User
            </button>
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
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari nama/email..."
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
                  <th className="px-6 py-4">Nama User</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Kontak</th>
                  <th className="px-6 py-4">Aktivitas</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)] bg-[var(--surface)]">
                {loading ? (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-[var(--muted)]">Memuat...</td></tr>
                ) : users.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-[var(--muted)]">Tidak ada data ditemukan</td></tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id} className="hover:bg-[var(--base)] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary)] text-sm font-bold text-[var(--primary-ink)]">
                            {(u.name || u.email).charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold">{u.name || "Tanpa Nama"}</p>
                            <p className="text-xs text-[var(--muted)]">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${
                          u.role === "ADMIN" ? "bg-red-100 text-red-700" :
                          u.role === "TEACHER" ? "bg-amber-100 text-amber-700" :
                          "bg-emerald-100 text-emerald-700"
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs">{u.phone || "-"}</p>
                        <p className="text-xs text-[var(--muted)]">{u.school || "Umum"}</p>
                      </td>
                      <td className="px-6 py-4">
                        {u.role === "STUDENT" && <span className="text-xs font-semibold text-emerald-600">{u._count.enrollments} Enrollments</span>}
                        {u.role === "TEACHER" && <span className="text-xs font-semibold text-indigo-600">{u._count.coursesTaught} Courses</span>}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => openEditModal(u)} className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-semibold hover:bg-[var(--primary)] hover:text-[var(--primary-ink)] hover:border-transparent transition-colors">Edit</button>
                          <button onClick={() => handleDelete(u)} className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-50 transition-colors">Hapus</button>
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-7 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-[var(--text)]">{isEditing ? "Edit User" : "Tambah User"}</h2>
              <button onClick={() => setShowModal(false)} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-[var(--base)] text-[var(--muted)]">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-[var(--muted)]">Nama Lengkap</label>
                  <input required value={formName} onChange={e => setFormName(e.target.value)}
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--base)] px-4 py-3 text-sm focus:ring-2 focus:ring-[var(--primary)]/40 focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-[var(--muted)]">Role</label>
                  <select value={formRole} onChange={e => setFormRole(e.target.value as any)}
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--base)] px-4 py-3 text-sm focus:ring-2 focus:ring-[var(--primary)]/40 focus:outline-none">
                    <option value="STUDENT">Student</option>
                    <option value="TEACHER">Teacher</option>
                    <option value="ADMIN">Admin</option>
                    <option value="PARENT">Parent</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[var(--muted)]">Email</label>
                <input required type="email" value={formEmail} onChange={e => setFormEmail(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--base)] px-4 py-3 text-sm focus:ring-2 focus:ring-[var(--primary)]/40 focus:outline-none" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[var(--muted)]">Password {isEditing && "(Kosongkan jika tidak diubah)"}</label>
                <input required={!isEditing} type="password" value={formPassword} onChange={e => setFormPassword(e.target.value)} minLength={6}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--base)] px-4 py-3 text-sm focus:ring-2 focus:ring-[var(--primary)]/40 focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-[var(--muted)]">No Telepon (Opsional)</label>
                  <input value={formPhone} onChange={e => setFormPhone(e.target.value)}
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--base)] px-4 py-3 text-sm focus:ring-2 focus:ring-[var(--primary)]/40 focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-[var(--muted)]">Sekolah (Opsional)</label>
                  <input value={formSchool} onChange={e => setFormSchool(e.target.value)}
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--base)] px-4 py-3 text-sm focus:ring-2 focus:ring-[var(--primary)]/40 focus:outline-none" />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 rounded-xl border border-[var(--border)] px-4 py-3 text-sm font-semibold hover:bg-[var(--base)] transition-colors">Batal</button>
                <button type="submit" disabled={saving} className="flex-1 rounded-xl bg-[var(--primary)] px-4 py-3 text-sm font-semibold text-[var(--primary-ink)] disabled:opacity-50 transition-all">
                  {saving ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
