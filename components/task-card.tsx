"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, ExternalLink, Lightbulb, Send } from "lucide-react";
import { PracticeTask } from "@/lib/course-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function TaskCard({ task, completed = false }: { task: PracticeTask; completed?: boolean }) {
  const [showHint, setShowHint] = useState(false);
  const [done, setDone] = useState(completed);
  const [note, setNote] = useState("");

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="bg-blue-50 text-blue-700">{task.difficulty}</Badge>
          <Badge className="bg-slate-50 text-slate-700">{task.xp} XP</Badge>
          {done && <Badge className="border-green-200 bg-green-50 text-green-700">Completed</Badge>}
        </div>
        <CardTitle>{task.title}</CardTitle>
        <CardDescription>{task.practicalTask}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium">Expected result</p>
          <p className="mt-1 text-sm text-muted-foreground">{task.expectedResult}</p>
        </div>
        {showHint && (
          <div className="rounded-md border border-blue-100 bg-blue-50 p-3 text-sm text-blue-900">
            {task.hint}
          </div>
        )}
        <textarea
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="Submit explanation, screenshot note, error message, or steps followed..."
          className="min-h-24 w-full rounded-md border bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={() => setShowHint((value) => !value)}>
            <Lightbulb className="h-4 w-4" />
            Hint
          </Button>
          <Button type="button" onClick={() => setDone(true)}>
            <CheckCircle2 className="h-4 w-4" />
            Mark as completed
          </Button>
          <Button type="button" variant="secondary" asChild>
            <Link href={`/ai-feedback?task=${task.id}&note=${encodeURIComponent(note)}`}>
              <Send className="h-4 w-4" />
              AI feedback
            </Link>
          </Button>
          {task.practiceUrl && (
            <Button type="button" variant="ghost" asChild>
              <Link href={task.practiceUrl}>
                <ExternalLink className="h-4 w-4" />
                Practice page
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
