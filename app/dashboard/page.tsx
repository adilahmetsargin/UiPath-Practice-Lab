import Link from "next/link";
import { ArrowRight, BadgeCheck, BookOpenCheck, Target, Zap } from "lucide-react";
import { allTasks, badges, lessons, mockProgress } from "@/lib/course-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function DashboardPage() {
  const completed = mockProgress.completedTaskIds.length;
  const percent = Math.round((completed / allTasks.length) * 100);
  const currentLesson = lessons.find((lesson) => lesson.level === mockProgress.currentLevel) || lessons[0];

  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-medium text-primary">Welcome back, {mockProgress.userName}</p>
          <h1 className="mt-2 text-3xl font-semibold">Dashboard</h1>
          <p className="mt-2 text-muted-foreground">Track your UiPath practice momentum and continue the next task.</p>
        </div>
        <Button asChild>
          <Link href={`/learning/${currentLesson.id}`}>
            Continue Level {currentLesson.level}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        <Stat icon={<Target />} label="Current level" value={mockProgress.currentLevel} />
        <Stat icon={<BookOpenCheck />} label="Completed tasks" value={completed} />
        <Stat icon={<Zap />} label="XP earned" value={mockProgress.xp} />
        <Stat icon={<BadgeCheck />} label="Badges" value={3} />
      </div>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Overall progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-2 flex justify-between text-sm">
            <span>{completed} of {allTasks.length} tasks completed</span>
            <span>{percent}%</span>
          </div>
          <Progress value={percent} />
        </CardContent>
      </Card>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Next recommended tasks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {currentLesson.tasks.slice(0, 3).map((task) => (
              <Link key={task.id} href={`/learning/${currentLesson.id}`} className="block rounded-md border p-4 hover:bg-slate-50">
                <p className="font-medium">{task.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{task.practicalTask}</p>
              </Link>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Badges</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {badges.map((badge, index) => (
              <div key={badge.name} className="rounded-md border p-4">
                <p className="font-medium">{badge.name} {index < 3 ? "earned" : "locked"}</p>
                <p className="text-sm text-muted-foreground">{badge.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactElement; label: string; value: number }) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="mb-3 text-primary">{icon}</div>
        <p className="text-2xl font-semibold">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  );
}
