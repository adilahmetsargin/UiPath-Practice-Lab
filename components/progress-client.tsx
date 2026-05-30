"use client";

import { useEffect, useState } from "react";
import { allTasks, badges, lessons } from "@/lib/course-data";
import { getProgressStats, readLocalProgress } from "@/lib/local-progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function ProgressClient() {
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

  const completedSet = new Set(completedTaskIds);
  const stats = getProgressStats(completedTaskIds);

  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <p className="text-sm font-medium text-primary">Progress tracking</p>
        <h1 className="mt-2 text-3xl font-semibold">Progress</h1>
        <p className="mt-2 text-muted-foreground">Demo progress is saved in this browser. Supabase sync can be layered on top after auth limits are settled.</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader>
            <CardTitle>Level completion</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {lessons.map((lesson) => {
              const completed = lesson.tasks.filter((task) => completedSet.has(task.id)).length;
              const value = Math.round((completed / lesson.tasks.length) * 100);
              return (
                <div key={lesson.id}>
                  <div className="mb-2 flex justify-between text-sm">
                    <span>Level {lesson.level}: {lesson.title}</span>
                    <span>{value}%</span>
                  </div>
                  <Progress value={value} />
                </div>
              );
            })}
          </CardContent>
        </Card>
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>Completed tasks: {stats.completedCount}/{allTasks.length}</p>
              <p>XP earned: {stats.xp}</p>
              <p>Current level: {stats.currentLevel}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Badge progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {badges.map((badge, index) => (
                <div key={badge.name} className="rounded-md border p-3">
                  <p className="font-medium">{badge.name} {index < Math.floor(stats.completedCount / 4) ? "earned" : "locked"}</p>
                  <p className="text-sm text-muted-foreground">{badge.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
