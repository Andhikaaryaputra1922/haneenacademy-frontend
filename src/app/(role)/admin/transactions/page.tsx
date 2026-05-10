"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface Transaction {
  id: string;
  studentId: string;
  packageId: string | null;
  courseId: string | null;
  amount: number;
  status: "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED";
  paymentMethod: string | null;
  proofUrl: string | null;
  notes: string | null;
  createdAt: string;
  student: { id: string; name: string | null; email: string };
  package: { id: string; name: string } | null;
  course: { id: string; title: string } | null;
}

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("ALL");
  const [search, setSearch] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const url = new URL("/api/admin/transactions", window.location.origin);
      if (activeTab !== "ALL") url.searchParams.set("status", activeTab);
      
      const res = await fetch(url.toString(), { credentials: "include" });
      if (res.ok) {
        const d = await res.json();
        setTransactions(d.transactions ?? []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const updateStatus = async (txId: string, status: "SUCCESS" | "FAILED", promptNotes: boolean = false) => {
    let notes = undefined;
    if (promptNotes) {
      const input = prompt(`Masukkan catatan tambahan untuk status ${status} (opsional):`);
      if (input === null) return; // User cancelled
      notes = input;
    } else {
      if (!confirm(`Tandai pembayaran ini sebagai ${status}?`)) return;
    }

    setUpdating(txId);
    try {
      const res = await fetch(`/api/admin/transactions/${txId}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, ...(notes !== undefined && { notes }) }),
      });
      if (res.ok) {
        fetchTransactions();
        if (status === "SUCCESS") alert("Berhasil! Siswa otomatis diberikan akses ke materi.");
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

  const formatPrice = (p: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(p);

  const filteredTransactions = transactions.filter((t) => {
    if (search) {
      const q = search.toLowerCase();
      return (
        t.id.toLowerCase().includes(q) ||
        (t.student.name && t.student.name.toLowerCase().includes(q)) ||
        t.student.email.toLowerCase().includes(q) ||
        (t.package && t.package.name.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const tabs = [
    { key: "ALL", label: "Semua" },
    { key: "PENDING", label: "Menunggu" },
    { key: "SUCCESS", label: "Berhasil" },
    { key: "FAILED", label: "Gagal" },
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
                Transaksi
              </h1>
              <p className="mt-2 text-sm text-[var(--muted)]">
                Pantau pembayaran siswa dan berikan akses otomatis.
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
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari TX ID, Siswa..."
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
                  <th className="px-6 py-4">ID & Waktu</th>
                  <th className="px-6 py-4">Siswa</th>
                  <th className="px-6 py-4">Pembelian</th>
                  <th className="px-6 py-4">Status & Nominal</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)] bg-[var(--surface)]">
                {loading ? (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-[var(--muted)]">Memuat...</td></tr>
                ) : filteredTransactions.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-[var(--muted)]">Tidak ada transaksi ditemukan</td></tr>
                ) : (
                  filteredTransactions.map((t) => (
                    <tr key={t.id} className="hover:bg-[var(--base)] transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-mono text-xs font-bold uppercase text-[var(--muted)]">#{t.id.slice(-8)}</p>
                        <p className="text-[10px] text-[var(--muted)] mt-1">{new Date(t.createdAt).toLocaleString("id-ID")}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-sm">{t.student.name || "Tanpa Nama"}</p>
                        <p className="text-xs text-[var(--muted)]">{t.student.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        {t.package ? (
                          <div>
                            <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full">PAKET</span>
                            <p className="text-sm font-semibold mt-1">{t.package.name}</p>
                          </div>
                        ) : t.course ? (
                          <div>
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">COURSE</span>
                            <p className="text-sm font-semibold mt-1">{t.course.title}</p>
                          </div>
                        ) : (
                          <span className="text-xs italic text-[var(--muted)]">Lainnya</span>
                        )}
                        <p className="text-[10px] text-[var(--muted)] mt-1">{t.paymentMethod || "Transfer Manual"}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="mb-1">
                          <span className={`inline-flex px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                            t.status === "SUCCESS" ? "bg-emerald-100 text-emerald-700" :
                            t.status === "FAILED" ? "bg-rose-100 text-rose-700" :
                            "bg-amber-100 text-amber-700"
                          }`}>
                            {t.status}
                          </span>
                        </div>
                        <p className="font-bold text-sm">{formatPrice(t.amount)}</p>
                        {t.notes && <p className="text-[10px] text-amber-600 mt-1">Note: {t.notes}</p>}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex flex-wrap justify-end gap-2">
                          {t.proofUrl && (
                            <a href={t.proofUrl} target="_blank" rel="noreferrer" className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-semibold hover:bg-[var(--base)] transition-colors">
                              Bukti
                            </a>
                          )}
                          {t.status === "PENDING" && (
                            <>
                              <button disabled={updating === t.id} onClick={() => updateStatus(t.id, "SUCCESS")} className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50">
                                Approve
                              </button>
                              <button disabled={updating === t.id} onClick={() => updateStatus(t.id, "FAILED", true)} className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700 disabled:opacity-50">
                                Reject
                              </button>
                            </>
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
