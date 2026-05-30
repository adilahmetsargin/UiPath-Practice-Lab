import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { lessons, mockProgress } from "@/lib/course-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LearningPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <p className="text-sm font-medium text-primary">Structured path</p>
        <h1 className="mt-2 text-3xl font-semibold">Learning path</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">Each level has a short explanation and practical tasks. Complete work in UiPath, then submit notes for review.</p>
      </div>
      <div className="grid gap-4">
        {lessons.map((lesson) => {
          const completed = lesson.tasks.filter((task) => mockProgress.completedTaskIds.includes(task.id)).length;
          return (
            <Card key={lesson.id}>
              <CardHeader className="flex gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="mb-2 flex flex-wrap gap-2">
                    <Badge className="bg-blue-50 text-blue-700">Level {lesson.level}</Badge>
                    <Badge className="bg-slate-50 text-slate-700">{completed}/{lesson.tasks.length} complete</Badge>
                  </div>
                  <CardTitle>{lesson.title}</CardTitle>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">{lesson.summary}</p>
                </div>
                <Button asChild>
                  <Link href={`/learning/${lesson.id}`}>
                    Open
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardHeader>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
