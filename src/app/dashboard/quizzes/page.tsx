import { redirect } from "next/navigation";

export default async function QuizzesPage() {
  redirect("/student/quizzes");
}
