import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { lessons, mockProgress } from "@/lib/course-data";
import { Button } from "@/components/ui/button";
import { TaskCard } from "@/components/task-card";

export default async function LessonDetailPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await params;
  const lesson = lessons.find((item) => item.id === lessonId);
  if (!lesson) notFound();

  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <Button variant="ghost" asChild className="mb-4">
        <Link href="/learning">
          <ArrowLeft className="h-4 w-4" />
          Learning path
        </Link>
      </Button>
      <div className="mb-8">
        <p className="text-sm font-medium text-primary">Level {lesson.level}</p>
        <h1 className="mt-2 text-3xl font-semibold">{lesson.title}</h1>
        <p className="mt-3 max-w-3xl leading-7 text-muted-foreground">{lesson.summary}</p>
        <p className="mt-2 text-sm font-medium">{lesson.focus}</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {lesson.tasks.map((task) => (
          <TaskCard key={task.id} task={task} completed={mockProgress.completedTaskIds.includes(task.id)} />
        ))}
      </div>
    </section>
  );
}
