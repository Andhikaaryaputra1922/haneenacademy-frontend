import BackButton from "@/components/BackButton";

export default function AttendancePage() {
  return (
    <main className="min-h-screen bg-[var(--base)] px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-[40px] border border-[var(--border)] bg-[var(--surface)] p-7 md:p-10">
          <div className="flex items-center gap-3 mb-6">
            <BackButton />
            <h1 className="text-3xl font-black tracking-tight text-[var(--text)] md:text-4xl">Absensi Siswa</h1>
          </div>
          <p className="text-sm text-[var(--muted)]">Fitur ini akan segera tersedia.</p>
        </div>
      </div>
    </main>
  );
}
