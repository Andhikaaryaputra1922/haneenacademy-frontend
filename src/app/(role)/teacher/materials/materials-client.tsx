"use client";

import { useState } from "react";

type Course = { id: string; title: string };
type Lesson = {
  id: string;
  title: string;
  description: string | null;
  orderNumber: number;
  type: string;
  contentUrl: string | null;
  isDownloadable: boolean;
  createdAt: string;
  courseId: string;
};
type LessonsPerCourse = { courseId: string; courseTitle: string; lessons: Lesson[] };
type Props = { courses: Course[]; lessonsPerCourse: LessonsPerCourse[] };

export function MaterialsClient({ courses, lessonsPerCourse }: Props) {
  const [courseId, setCourseId] = useState(courses[0]?.id ?? "");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [linkUrl, setLinkUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [previewLesson, setPreviewLesson] = useState<Lesson | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    if (f) setPreviewUrl(URL.createObjectURL(f));
    else setPreviewUrl(null);
  };

  const handleUpload = async () => {
    if (!title || !courseId) { setMsg("Judul dan kelas wajib diisi."); return; }
    if (!file && !linkUrl) { setMsg("Pilih file atau isi link materi."); return; }
    setLoading(true); setMsg("");
    try {
      const fd = new FormData();
      fd.append("title", title);
      if (desc) fd.append("description", desc);
      if (file) fd.append("file", file);
      if (linkUrl) fd.append("contentUrl", linkUrl);
      const res = await fetch("/api/courses/" + courseId + "/lessons", { method: "POST", credentials: "include", body: fd });
      if (res.ok) { setMsg("Berhasil diupload!"); setTitle(""); setDesc(""); setFile(null); setLinkUrl(""); setPreviewUrl(null); setTimeout(() => window.location.reload(), 800); }
      else { const e = await res.json(); setMsg("Gagal: " + (e.message ?? "coba lagi")); }
    } catch { setMsg("Error."); } finally { setLoading(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus materi ini?")) return;
    const res = await fetch("/api/lessons/" + id, { method: "DELETE", credentials: "include" });
    if (res.ok) window.location.reload(); else alert("Gagal menghapus.");
  };

  const isVideo = (url: string) => /\.(mp4|webm|ogg|mov)$/i.test(url);
  const isPdf = (url: string) => /\.pdf$/i.test(url);

  return (
    <div className="space-y-8">

      {/* Modal Preview */}
      {previewLesson && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setPreviewLesson(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold">{previewLesson.title}</h3>
                {previewLesson.description && <p className="text-sm text-gray-500 mt-1">{previewLesson.description}</p>}
                <p className="text-xs text-gray-400 mt-1">Diupload: {new Date(previewLesson.createdAt).toLocaleString("id-ID")}</p>
              </div>
              <button onClick={() => setPreviewLesson(null)} className="text-gray-400 hover:text-gray-700 text-xl font-bold ml-4">x</button>
            </div>
            {previewLesson.contentUrl && isVideo(previewLesson.contentUrl) && (
              <video controls className="w-full rounded-xl" src={previewLesson.contentUrl} />
            )}
            {previewLesson.contentUrl && isPdf(previewLesson.contentUrl) && (
              <iframe src={previewLesson.contentUrl} className="w-full h-[60vh] rounded-xl border" />
            )}
            {previewLesson.contentUrl && !isVideo(previewLesson.contentUrl) && !isPdf(previewLesson.contentUrl) && (
              <p className="text-sm text-gray-500">Preview tidak tersedia. <a href={previewLesson.contentUrl} target="_blank" rel="noreferrer" className="text-indigo-600 underline">Buka file</a></p>
            )}
          </div>
        </div>
      )}

      {/* Form Upload */}
      <div className="p-6 bg-white rounded-2xl shadow-sm border border-[var(--border)]">
        <h2 className="text-xl font-bold mb-1">Upload Materi / Rekaman</h2>
        <p className="text-sm text-gray-400 mb-5">File akan otomatis tercatat dengan waktu upload saat ini.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Pilih Kelas <span className="text-red-500">*</span></label>
            <select value={courseId} onChange={(e) => setCourseId(e.target.value)} className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
              {courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Judul Materi <span className="text-red-500">*</span></label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Pertemuan 1 - Pengenalan Huruf" className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Deskripsi</label>
            <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={2} placeholder="Deskripsi singkat materi..." className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">File Materi (opsional)</label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-indigo-400 transition-colors">
              <input type="file" id="file-upload" accept="video/*,application/pdf" onChange={handleFileChange} className="hidden" />
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="text-4xl mb-2">📁</div>
                <p className="text-sm font-medium text-indigo-600">Klik untuk pilih file</p>
                <p className="text-xs text-gray-400 mt-1">Video (MP4, WebM) atau PDF · Maks 25MB</p>
              </label>
              {file && (
                <div className="mt-3 p-3 bg-indigo-50 rounded-xl text-left">
                  <p className="text-sm font-semibold text-indigo-700">{file.name}</p>
                  <p className="text-xs text-indigo-400">{(file.size/1024/1024).toFixed(2)} MB · {file.type}</p>
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Atau Link Materi (opsional)</label>
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://drive.google.com/... atau https://youtu.be/..."
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <p className="text-xs text-gray-400 mt-1">Isi salah satu: upload file atau link.</p>
          </div>
        </div>

        {/* Preview file sebelum upload */}
        {previewUrl && file && (
          <div className="mt-4 rounded-xl border border-gray-200 overflow-hidden">
            <p className="px-4 py-2 text-xs font-semibold text-gray-500 bg-gray-50 border-b">Preview sebelum upload</p>
            {file.type.startsWith("video/") && (
              <video controls className="w-full max-h-64" src={previewUrl} />
            )}
            {file.type === "application/pdf" && (
              <iframe src={previewUrl} className="w-full h-64" />
            )}
          </div>
        )}

        {msg && <p className={"mt-3 text-sm font-medium " + (msg.includes("Berhasil") ? "text-green-600" : "text-red-600")}>{msg}</p>}
        <button onClick={handleUpload} disabled={loading} className="mt-4 px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:opacity-60 transition-colors">
          {loading ? "Mengupload..." : "Upload Materi"}
        </button>
      </div>

      {/* Daftar Materi */}
      {lessonsPerCourse.map((lpc) => (
        <div key={lpc.courseId} className="rounded-2xl border border-[var(--border)] bg-white shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b bg-gray-50 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-[var(--text)]">{lpc.courseTitle}</h3>
              <p className="text-xs text-gray-400">{lpc.lessons.length} materi diupload</p>
            </div>
          </div>
          {lpc.lessons.length === 0 ? (
            <div className="px-6 py-10 text-center text-sm text-gray-400">Belum ada materi untuk kelas ini.</div>
          ) : (
            <div className="divide-y">
              {lpc.lessons.map((lesson) => (
                <div key={lesson.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="h-10 w-10 rounded-xl bg-indigo-50 grid place-items-center shrink-0">
                    <span className="text-sm font-bold text-indigo-600">{lesson.orderNumber}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{lesson.title}</p>
                    {lesson.description && <p className="text-xs text-gray-500 truncate mt-0.5">{lesson.description}</p>}
                    <div className="flex items-center gap-2 mt-1">
                      <span className={"text-xs px-2 py-0.5 rounded-full font-medium " + (lesson.contentUrl ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400")}>
                        {lesson.contentUrl ? (lesson.type === "VIDEO" ? "Video" : "PDF") : "Tanpa file"}
                      </span>
                      <span className="text-xs text-gray-400">{new Date(lesson.createdAt).toLocaleString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {lesson.contentUrl && (
                      <button onClick={() => setPreviewLesson(lesson)} className="text-xs px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 font-medium hover:bg-indigo-100">
                        Preview
                      </button>
                    )}
                    <button onClick={() => handleDelete(lesson.id)} className="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-600 font-medium hover:bg-red-100">
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
