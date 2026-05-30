"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CheckCircle2, ExternalLink, ImageUp, Sparkles } from "lucide-react";
import { ScenarioTask } from "@/lib/scenario-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Review = {
  source: "huggingface" | "mock";
  correct: string[];
  missing: string[];
  improve: string[];
  nextTask: string;
};

export function ScenarioRunner({ scenario }: { scenario: ScenarioTask }) {
  const [steps, setSteps] = useState("");
  const [screenshotNote, setScreenshotNote] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [review, setReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(false);

  const evidenceText = useMemo(
    () => `Scenario: ${scenario.title}\nRequired checks: ${scenario.checks.join(", ")}\nSteps followed:\n${steps}\nScreenshot evidence note:\n${screenshotNote}`,
    [scenario, steps, screenshotNote]
  );

  async function submitForReview() {
    setLoading(true);
    const response = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input: evidenceText,
        scenarioId: scenario.id,
        expectedChecks: scenario.checks
      })
    });
    setReview(await response.json());
    setLoading(false);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <div className="mb-2 flex flex-wrap gap-2">
              <Badge className="bg-blue-50 text-blue-700">{scenario.difficulty}</Badge>
              <Badge className="bg-slate-50 text-slate-700">{scenario.xp} XP</Badge>
              <Badge className="bg-white text-slate-700">{scenario.role}</Badge>
            </div>
            <CardTitle>{scenario.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <p className="text-sm leading-6 text-muted-foreground">{scenario.mission}</p>
            <Button asChild>
              <Link href={scenario.targetUrl} target="_blank">
                <ExternalLink className="h-4 w-4" />
                Open target website
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Required steps</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3 text-sm">
              {scenario.steps.map((step, index) => (
                <li key={step} className="flex gap-3 rounded-md border bg-white p-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-blue-50 text-xs font-semibold text-blue-700">{index + 1}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Submit proof</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="rounded-md border bg-slate-50 p-4">
            <p className="mb-2 text-sm font-medium">AI will look for</p>
            <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
              {scenario.expectedEvidence.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
          <label className="grid gap-2 text-sm font-medium">
            Steps you actually followed
            <textarea value={steps} onChange={(event) => setSteps(event.target.value)} className="min-h-32 rounded-md border bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Screenshot note
            <textarea value={screenshotNote} onChange={(event) => setScreenshotNote(event.target.value)} className="min-h-24 rounded-md border bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-ring" placeholder="Example: screenshot shows Enterprise automation playbook and category Operations." />
          </label>
          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed bg-white p-6 text-center text-sm hover:bg-slate-50">
            <ImageUp className="h-6 w-6 text-primary" />
            Upload screenshot evidence
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) setImagePreview(URL.createObjectURL(file));
              }}
            />
          </label>
          {imagePreview && (
            <div className="overflow-hidden rounded-md border">
              <img src={imagePreview} alt="Uploaded screenshot evidence" className="h-auto w-full object-cover" />
            </div>
          )}
          <Button onClick={submitForReview} disabled={loading || !steps.trim()}>
            <Sparkles className="h-4 w-4" />
            {loading ? "Checking proof..." : "Check with AI"}
          </Button>
          {review && (
            <div className="space-y-4 rounded-md border bg-blue-50 p-4">
              <p className="flex items-center gap-2 font-medium text-blue-950">
                <CheckCircle2 className="h-4 w-4" />
                Review result ({review.source})
              </p>
              <ReviewList title="Looks correct" items={review.correct} />
              <ReviewList title="Missing or weak" items={review.missing} />
              <ReviewList title="Improve next run" items={review.improve} />
              <p className="text-sm text-blue-950"><span className="font-medium">Next:</span> {review.nextTask}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function ReviewList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="text-sm font-medium text-blue-950">{title}</p>
      <ul className="mt-1 list-inside list-disc space-y-1 text-sm text-blue-900">
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </div>
  );
}
