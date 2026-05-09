import Link from "next/link";
import { cookies } from "next/headers";
import { getAuthCookieName } from "@/lib/auth/jwt";
import { getRequestOrigin } from "@/lib/origin";
import { QuizzesManager } from "@/components/management/quizzes-manager";

type Course = { id: string; title: string };

type Quiz = {
  id: string;
  title: string;
  description?: string | null;
  passScore: number;
  maxAttempts: number;
  isRandomized: boolean;
  timeLimit?: number | null;
  course: { id: string; title: string };
};

async function getCourses(baseUrl: string): Promise<Course[]> {
  const response = await fetch(`${baseUrl}/api/courses`, { cache: "no-store" });
  if (!response.ok) return [];
  const data = (await response.json()) as { courses: Course[] };
  return data.courses ?? [];
}

async function getQuizzes(baseUrl: string, token: string): Promise<Quiz[]> {
  const response = await fetch(`${baseUrl}/api/quizzes`, {
    cache: "no-store",
    headers: { cookie: `${getAuthCookieName()}=${token}` },
  });
  if (!response.ok) return [];
  const data = (await response.json()) as { quizzes: Quiz[] };
  return data.quizzes ?? [];
}

export default async function AdminQuizzesPage() {
  const baseUrl = await getRequestOrigin();
  const cookieStore = await cookies();
  const token = cookieStore.get(getAuthCookieName())?.value ?? "";

  const [courses, quizzes] = await Promise.all([getCourses(baseUrl), getQuizzes(baseUrl, token)]);

  return (
    <main className="min-h-screen bg-[var(--base)] px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-[var(--text)] md:text-4xl">
              Admin • Quizzes
            </h1>
            <p className="mt-2 text-sm text-[var(--muted)]">Kelola quiz untuk semua course.</p>
          </div>
          <Link
            href="/admin"
            className="inline-flex rounded-full border border-[var(--border)] bg-[var(--base)]/70 px-5 py-3 text-sm font-semibold text-[var(--text)] hover:bg-black/5"
          >
            Admin Panel
          </Link>
        </div>

        <QuizzesManager basePath="/admin" courses={courses} quizzes={quizzes} />
      </div>
    </main>
  );
}

