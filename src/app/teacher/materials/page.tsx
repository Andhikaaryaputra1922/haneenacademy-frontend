import { cookies } from "next/headers";
import { getAuthCookieName, verifyUserJwt } from "@/lib/auth/jwt";
import BackButton from "@/components/BackButton";
import Link from "next/link";
import { MaterialsClient } from "./materials-client";

type Course = { id: string; title: string; teacherId: string };
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

async function getCourses(token: string): Promise<Course[]> {
  const response = await fetch("http://localhost:4000/api/courses", {
    cache: "no-store",
    headers: { cookie: `${getAuthCookieName()}=${token}` },
  });
  if (!response.ok) return [];
  const data = (await response.json()) as { courses: Course[] };
  return data.courses ?? [];
}

async function getLessons(courseId: string, token: string): Promise<Lesson[]> {
  const response = await fetch(`http://localhost:4000/api/courses/${courseId}/lessons`, {
    cache: "no-store",
    headers: { cookie: `${getAuthCookieName()}=${token}` },
  });
  if (!response.ok) return [];
  const data = (await response.json()) as { lessons: Lesson[] };
  return data.lessons ?? [];
}

export default async function MaterialsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(getAuthCookieName())?.value ?? "";
  const auth = token ? await verifyUserJwt(token).catch(() => null) : null;

  const allCourses = await getCourses(token);
  const teacherCourses = auth?.role === "TEACHER"
    ? allCourses.filter((c) => c.teacherId === auth.uid)
    : allCourses;

  // Ambil semua lessons dari semua course milik teacher
  const lessonsPerCourse = await Promise.all(
    teacherCourses.map(async (c) => ({
      course: c,
      lessons: await getLessons(c.id, token),
    }))
  );

  return (
    <main className="min-h-screen bg-[var(--base)] px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-[var(--text)] md:text-4xl">
              Manajemen Materi
            </h1>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Upload rekaman dan materi per kelas.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <BackButton />
            <Link
              href="/teacher"
              className="inline-flex rounded-full border border-[var(--border)] bg-[var(--base)]/70 px-5 py-3 text-sm font-semibold text-[var(--text)] hover:bg-black/5"
            >
              Dashboard
            </Link>
          </div>
        </div>

        <MaterialsClient
          courses={teacherCourses.map((c) => ({ id: c.id, title: c.title }))}
          lessonsPerCourse={lessonsPerCourse.map((lpc) => ({
            courseId: lpc.course.id,
            courseTitle: lpc.course.title,
            lessons: lpc.lessons,
          }))}
        />
      </div>
    </main>
  );
}
