import { cookies } from "next/headers";
import { getAuthCookieName, verifyUserJwt } from "@/lib/auth/jwt";
import TeacherSidebar from "@/components/teacher/TeacherSidebar";

export default async function TeacherLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get(getAuthCookieName())?.value;
  const auth = token ? await verifyUserJwt(token).catch(() => null) : null;
  
  return (
    <div className="flex min-h-screen bg-[var(--base)]">
      <TeacherSidebar name="Teacher" role={auth?.role ?? "TEACHER"} />
      <div className="flex-1 flex flex-col min-w-0">
        {children}
      </div>
    </div>
  );
}
