import { scenarios } from "@/lib/scenario-data";
import { ScenarioRunner } from "@/components/scenario-runner";

export default function ScenariosPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <p className="text-sm font-medium text-primary">Real browser practice</p>
        <h1 className="mt-2 text-3xl font-semibold">Scenario tasks</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          These are not text-only quizzes. Open the target site, perform the browser work, upload screenshot evidence, describe your steps, and let the reviewer check whether the proof matches the scenario.
        </p>
      </div>
      <div className="space-y-8">
        {scenarios.map((scenario) => <ScenarioRunner key={scenario.id} scenario={scenario} />)}
      </div>
    </section>
  );
}
