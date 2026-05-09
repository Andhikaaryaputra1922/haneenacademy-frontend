import { redirect } from "next/navigation";

export default async function QuizDetailPage({ params }: { params: Promise<{ quizId: string }> }) {
  const { quizId } = await params;
  redirect(`/student/quizzes/${quizId}`);
}
