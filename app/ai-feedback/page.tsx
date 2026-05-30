import { Suspense } from "react";
import { FeedbackForm } from "@/components/feedback-form";

export default function AiFeedbackPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <p className="text-sm font-medium text-primary">Workflow review</p>
        <h1 className="mt-2 text-3xl font-semibold">AI feedback</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">Paste what you tried and get practical review points for correctness, gaps, improvements, and the next task.</p>
      </div>
      <Suspense>
        <FeedbackForm />
      </Suspense>
    </section>
  );
}
