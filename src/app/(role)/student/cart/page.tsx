"use client";

import { useEffect, useState } from "react";

interface Transaction {
  id: string;
  amount: number;
  status: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  provider: string | null;
  proofUrl: string | null;
  notes: string | null;
  createdAt: string;
  package: { id: string; name: string; price: number } | null;
  course: { id: string; title: string } | null;
}

const TABS = [
  { key: "ALL", label: "Semua" },
  { key: "PENDING", label: "Menunggu Pembayaran" },
  { key: "PAID", label: "Sedang Diperiksa" },
  { key: "FAILED", label: "Kedaluwarsa" },
];

export default function CartPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ALL");

  useEffect(() => {
    setLoading(true);
    const url = activeTab === "ALL"
      ? "/api/student/my-transactions"
      : `/api/student/my-transactions?status=${activeTab}`;
    fetch(url, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setTransactions(d.transactions ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [activeTab]);

  const formatPrice = (p: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(p);

  const statusBadge = (s: string) => {
    const m: Record<string, { bg: string; text: string; label: string }> = {
      PENDING: { bg: "bg-amber-100", text: "text-amber-800", label: "Menunggu" },
      PAID: { bg: "bg-emerald-100", text: "text-emerald-800", label: "Berhasil" },
      FAILED: { bg: "bg-red-100", text: "text-red-700", label: "Gagal" },
      REFUNDED: { bg: "bg-slate-100", text: "text-slate-600", label: "Refund" },
    };
    return m[s] ?? { bg: "bg-slate-100", text: "text-slate-600", label: s };
  };

  return (
    <main className="min-h-screen bg-white px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-2xl font-black text-slate-900 mb-8">Keranjang</h1>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-slate-200 mb-8">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative pb-3 text-sm font-semibold transition-colors ${
                activeTab === tab.key
                  ? "text-[#8B0000]"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {tab.label}
              {activeTab === tab.key && (
                <span className="absolute bottom-0 left-0 right-0 h-[3px] rounded-full bg-[#8B0000]" />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#8B0000] border-t-transparent" />
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-20">
            <svg className="mx-auto mb-4 text-slate-300" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            <p className="text-lg font-bold text-slate-700">Belum ada transaksi</p>
            <p className="text-sm text-slate-400 mt-1">Beli paket belajar untuk mulai!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((tx) => {
              const badge = statusBadge(tx.status);
              return (
                <div key={tx.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold ${badge.bg} ${badge.text}`}>
                          {badge.label}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {new Date(tx.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-slate-800">
                        {tx.package?.name || tx.course?.title || "Transaksi"}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        ID: {tx.id.slice(0, 12)}... • {tx.provider || "Manual"}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-base font-black text-[#8B0000]">{formatPrice(tx.amount)}</p>
                      {tx.proofUrl && (
                        <a href={tx.proofUrl} target="_blank" rel="noopener noreferrer"
                          className="inline-block mt-2 text-[11px] font-bold text-blue-600 hover:underline">
                          Lihat Bukti
                        </a>
                      )}
                    </div>
                  </div>
                  {tx.notes && (
                    <p className="mt-3 text-xs text-slate-500 bg-slate-50 rounded-lg px-3 py-2">
                      {tx.notes}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
