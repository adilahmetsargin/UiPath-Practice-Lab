import Link from "next/link";
import { ArrowRight, CheckCircle2, FlaskConical, Trophy } from "lucide-react";
import { lessons, allTasks, mockProgress } from "@/lib/course-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function HomePage() {
  const percent = Math.round((mockProgress.completedTaskIds.length / allTasks.length) * 100);

  return (
    <div className="lab-grid">
      <section className="mx-auto grid min-h-[calc(100vh-65px)] max-w-7xl items-center gap-8 px-4 py-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <div className="inline-flex rounded-md border bg-white px-3 py-1 text-sm text-muted-foreground">
            Browser-based practice for QA and RPA careers
          </div>
          <div className="space-y-4">
            <h1 className="max-w-3xl text-4xl font-semibold tracking-normal text-slate-950 md:text-6xl">
              UiPath Practice Lab
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
              Learn RPA by completing browser scenarios, automating fake business websites, uploading screenshot proof, and getting feedback on whether your evidence matches the task.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" asChild>
              <Link href="/scenarios">
                Start scenarios
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/studio">
                Open fake Studio
                <FlaskConical className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Practice track</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-3 gap-3">
                <Metric label="Levels" value={lessons.length} />
                <Metric label="Tasks" value={allTasks.length} />
                <Metric label="XP" value={mockProgress.xp} />
              </div>
              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span>Sample progress</span>
                  <span>{percent}%</span>
                </div>
                <Progress value={percent} />
              </div>
            </CardContent>
          </Card>
          <div className="grid gap-4 sm:grid-cols-2">
            <Feature icon={<CheckCircle2 className="h-5 w-5" />} title="Evidence-based tasks" text="Open a target site, perform the exact steps, upload screenshot proof, and submit the steps you followed." />
            <Feature icon={<Trophy className="h-5 w-5" />} title="Fake Studio workflow" text="Use a visual UiPath-style workflow screen to understand browser steps, selectors, validation, and evidence." />
          </div>
        </div>
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border bg-slate-50 p-4">
      <p className="text-2xl font-semibold">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

function Feature({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <Card>
      <CardContent className="space-y-2 p-5">
        <div className="text-primary">{icon}</div>
        <p className="font-medium">{title}</p>
        <p className="text-sm leading-6 text-muted-foreground">{text}</p>
      </CardContent>
    </Card>
  );
}
