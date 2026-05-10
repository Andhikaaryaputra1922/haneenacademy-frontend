"use client";

import { useState } from "react";

type Lesson = {
  id: string;
  title: string;
  description: string | null;
  orderNumber: number;
  type: string;
  contentUrl: string | null;
  youtubeUrl: string | null;
  isDownloadable: boolean;
  createdAt: string;
  courseId: string;
  isLocked: boolean;
};

type CourseWithLessons = {
  id: string;
  title: string;
  lessons: Lesson[];
  lessonLimit: number | null;
};

type Props = {
  courses: CourseWithLessons[];
};

export function StudentMaterialsClient({ courses }: Props) {
  const [previewLesson, setPreviewLesson] = useState<Lesson | null>(null);

  const isVideo = (url: string) => /\.(mp4|webm|ogg|mov)$/i.test(url);
  const isPdf = (url: string) => /\.pdf$/i.test(url);
  const isYoutube = (url: string) => /youtube\.com|youtu\.be/i.test(url);

  const getYoutubeEmbedUrl = (url: string) => {
    const match = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : url;
  };

  const totalMateri = courses.reduce((acc, c) => acc + c.lessons.length, 0);

  return (
    <div className="space-y-6">

      {/* Modal Preview */}
      {previewLesson && !previewLesson.isLocked && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={() => setPreviewLesson(null)}>
          <div className="bg-[var(--surface)] rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-[var(--text)]">{previewLesson.title}</h3>
                {previewLesson.description && <p className="text-sm text-[var(--muted)] mt-1">{previewLesson.description}</p>}
                <p className="text-xs text-[var(--muted)] mt-1">
                  Diupload: {new Date(previewLesson.createdAt).toLocaleString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
              <button onClick={() => setPreviewLesson(null)} className="text-[var(--muted)] hover:text-[var(--text)] text-2xl font-bold ml-4">×</button>
            </div>
            {previewLesson.youtubeUrl && isYoutube(previewLesson.youtubeUrl) && (
              <iframe src={getYoutubeEmbedUrl(previewLesson.youtubeUrl)} className="w-full aspect-video rounded-xl" allowFullScreen />
            )}
            {previewLesson.contentUrl && isVideo(previewLesson.contentUrl) && (
              <video controls className="w-full rounded-xl" src={previewLesson.contentUrl} />
            )}
            {previewLesson.contentUrl && isPdf(previewLesson.contentUrl) && (
              <iframe src={previewLesson.contentUrl} className="w-full h-[60vh] rounded-xl border" />
            )}
            {previewLesson.isDownloadable && previewLesson.contentUrl && (
              <a href={previewLesson.contentUrl} download
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--primary)] text-[var(--primary-ink)] text-sm font-semibold hover:opacity-90">
                Download
              </a>
            )}
          </div>
        </div>
      )}

      {totalMateri === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-12 text-center">
          <p className="text-4xl mb-3">📭</p>
          <p className="font-bold text-[var(--text)]">Belum ada materi</p>
          <p className="text-sm text-[var(--muted)] mt-1">Guru belum mengupload materi untuk kelas kamu, atau kamu belum memiliki paket aktif.</p>
        </div>
      ) : (
        courses.map((course) => (
          <div key={course.id} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-[var(--border)] bg-[var(--base)] flex items-center justify-between">
              <div>
                <h3 className="font-bold text-[var(--text)]">{course.title}</h3>
                <p className="text-xs text-[var(--muted)] mt-0.5">
                  {course.lessons.filter(l => !l.isLocked).length} dari {course.lessons.length} materi dapat diakses
                  {course.lessonLimit !== null && ` · Limit: ${course.lessonLimit} pertemuan`}
                </p>
              </div>
            </div>
            {course.lessons.length === 0 ? (
              <div className="px-6 py-8 text-center text-sm text-[var(--muted)]">Belum ada materi untuk kelas ini.</div>
            ) : (
              <div className="divide-y divide-[var(--border)]">
                {course.lessons.map((lesson) => (
                  <div key={lesson.id} className={`flex items-center gap-4 px-6 py-4 transition-colors ${lesson.isLocked ? "opacity-60" : "hover:bg-[var(--base)]"}`}>
                    <div className={`h-10 w-10 rounded-xl grid place-items-center shrink-0 ${lesson.isLocked ? "bg-slate-100" : "bg-[var(--primary)]/10"}`}>
                      {lesson.isLocked ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                        </svg>
                      ) : (
                        <span className="text-sm font-bold text-[var(--primary)]">{lesson.orderNumber}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate text-[var(--text)]">{lesson.title}</p>
                      {lesson.description && <p className="text-xs text-[var(--muted)] truncate mt-0.5">{lesson.description}</p>}
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${lesson.isLocked ? "bg-slate-100 text-slate-400" : "bg-[var(--primary)]/10 text-[var(--primary)]"}`}>
                          {lesson.type === "VIDEO" ? "Video" : lesson.type}
                        </span>
                        <span className="text-xs text-[var(--muted)]">
                          {new Date(lesson.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      </div>
                    </div>
                    {lesson.isLocked ? (
                      <span className="shrink-0 text-xs px-4 py-2 rounded-xl border border-[var(--border)] text-[var(--muted)] font-semibold">
                        🔒 Upgrade Paket
                      </span>
                    ) : (lesson.contentUrl || lesson.youtubeUrl) ? (
                      <button
                        onClick={() => setPreviewLesson(lesson)}
                        className="shrink-0 text-xs px-4 py-2 rounded-xl bg-[var(--primary)] text-[var(--primary-ink)] font-semibold hover:opacity-90 transition-opacity"
                      >
                        Buka
                      </button>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
