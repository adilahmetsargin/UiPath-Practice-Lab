"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Feedback = {
  source: "huggingface" | "mock";
  correct: string[];
  missing: string[];
  improve: string[];
  nextTask: string;
};

export function FeedbackForm() {
  const params = useSearchParams();
  const [input, setInput] = useState(params.get("note") || "");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    const response = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input })
    });
    setFeedback(await response.json());
    setLoading(false);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <Card>
        <CardHeader>
          <CardTitle>Submit your UiPath notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            className="min-h-72 w-full rounded-md border bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            placeholder="Paste your workflow explanation, selector issue, error message, screenshot note, or steps followed..."
          />
          <Button onClick={submit} disabled={!input.trim() || loading}>
            <Sparkles className="h-4 w-4" />
            {loading ? "Reviewing..." : "Get feedback"}
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>AI feedback</CardTitle>
        </CardHeader>
        <CardContent>
          {!feedback ? (
            <p className="text-sm leading-6 text-muted-foreground">Feedback will appear here. If HF_TOKEN is not configured, the app uses a local mock reviewer.</p>
          ) : (
            <div className="space-y-5">
              <p className="rounded-md border bg-slate-50 p-3 text-sm">Source: {feedback.source === "huggingface" ? "Hugging Face API" : "Mock reviewer"}</p>
              <FeedbackList title="What is correct" items={feedback.correct} />
              <FeedbackList title="What is missing" items={feedback.missing} />
              <FeedbackList title="How to improve" items={feedback.improve} />
              <div>
                <p className="font-medium">Next suggested task</p>
                <p className="mt-1 text-sm text-muted-foreground">{feedback.nextTask}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function FeedbackList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="font-medium">{title}</p>
      <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </div>
  );
}
