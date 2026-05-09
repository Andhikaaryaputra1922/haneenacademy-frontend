import Link from "next/link";
import { cookies } from "next/headers";
import { getAuthCookieName } from "@/lib/auth/jwt";
import { getRequestOrigin } from "@/lib/origin";
import { AssignmentsManager } from "@/components/management/assignments-manager";

type Course = { id: string; title: string };

type Assignment = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  maxScore: number;
  course: { id: string; title: string };
};

async function getCourses(baseUrl: string): Promise<Course[]> {
  const response = await fetch(`${baseUrl}/api/courses`, { cache: "no-store" });
  if (!response.ok) return [];
  const data = (await response.json()) as { courses: Course[] };
  return data.courses ?? [];
}

async function getAssignments(baseUrl: string, token: string): Promise<Assignment[]> {
  const response = await fetch(`${baseUrl}/api/assignments`, {
    cache: "no-store",
    headers: { cookie: `${getAuthCookieName()}=${token}` },
  });
  if (!response.ok) return [];
  const data = (await response.json()) as { assignments: Assignment[] };
  return data.assignments ?? [];
}

export default async function AdminAssignmentsPage() {
  const baseUrl = await getRequestOrigin();
  const cookieStore = await cookies();
  const token = cookieStore.get(getAuthCookieName())?.value ?? "";

  const [courses, assignments] = await Promise.all([getCourses(baseUrl), getAssignments(baseUrl, token)]);

  return (
    <main className="min-h-screen bg-[var(--base)] px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-[var(--text)] md:text-4xl">
              Admin • Assignments
            </h1>
            <p className="mt-2 text-sm text-[var(--muted)]">Kelola tugas dan grading untuk semua course.</p>
          </div>
          <Link
            href="/admin"
            className="inline-flex rounded-full border border-[var(--border)] bg-[var(--base)]/70 px-5 py-3 text-sm font-semibold text-[var(--text)] hover:bg-black/5"
          >
            Admin Panel
          </Link>
        </div>

        <AssignmentsManager basePath="/admin" courses={courses} assignments={assignments} />
      </div>
    </main>
  );
}

