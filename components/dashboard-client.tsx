"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, BadgeCheck, BookOpenCheck, Target, Zap } from "lucide-react";
import { allTasks, badges, lessons } from "@/lib/course-data";
import { getProgressStats, readLocalProgress } from "@/lib/local-progress";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function DashboardClient() {
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>([]);

  useEffect(() => {
    const sync = () => setCompletedTaskIds(readLocalProgress().completedTaskIds);
    sync();
    window.addEventListener("uipath-progress-updated", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("uipath-progress-updated", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const stats = getProgressStats(completedTaskIds);
  const currentLesson = lessons.find((lesson) => lesson.level === stats.currentLevel) || lessons[0];
  const earnedBadges = Math.min(badges.length, Math.floor(stats.completedCount / 4));

  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-medium text-primary">Welcome back, Practice Analyst</p>
          <h1 className="mt-2 text-3xl font-semibold">Dashboard</h1>
          <p className="mt-2 text-muted-foreground">Track your browser practice progress from completed tasks.</p>
        </div>
        <Button asChild>
          <Link href={`/learning/${currentLesson.id}`}>
            Continue Level {currentLesson.level}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        <Stat icon={<Target />} label="Current level" value={stats.currentLevel} />
        <Stat icon={<BookOpenCheck />} label="Completed tasks" value={stats.completedCount} />
        <Stat icon={<Zap />} label="XP earned" value={stats.xp} />
        <Stat icon={<BadgeCheck />} label="Badges" value={earnedBadges} />
      </div>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Overall progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-2 flex justify-between text-sm">
            <span>{stats.completedCount} of {allTasks.length} tasks completed</span>
            <span>{stats.percent}%</span>
          </div>
          <Progress value={stats.percent} />
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
                <p className="font-medium">{badge.name} {index < earnedBadges ? "earned" : "locked"}</p>
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
