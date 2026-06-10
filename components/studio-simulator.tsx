"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Database,
  Globe2,
  GripVertical,
  ListChecks,
  MousePointerClick,
  Play,
  RotateCcw,
  Send,
  Square,
  TerminalSquare,
  Trash2
} from "lucide-react";
import { ActivityType, StudioMission, studioMissions, WorkflowStepTemplate } from "@/lib/studio-missions";
import { completeLocalTask } from "@/lib/local-progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type RunStatus = "idle" | "running" | "success" | "error";

type ActivityDefinition = {
  type: ActivityType;
  name: string;
  description: string;
  icon: React.ElementType;
};

type WorkflowStep = WorkflowStepTemplate & {
  status: RunStatus;
  message?: string;
};

type BrowserState = {
  app: StudioMission["targetApp"] | "blank";
  fields: Record<string, string>;
  pageState: "blank" | "opened" | "detail" | "submitted" | "success";
  extracted: Record<string, string>;
  statusText: string;
};

const activityLibrary: ActivityDefinition[] = [
  { type: "openBrowser", name: "Open Browser", description: "Open a target app URL.", icon: Globe2 },
  { type: "typeInto", name: "Type Into", description: "Type a value into a selector.", icon: Send },
  { type: "click", name: "Click", description: "Click a link, button, or dynamic target.", icon: MousePointerClick },
  { type: "getText", name: "Get Text", description: "Extract visible text into a variable.", icon: Database },
  { type: "validateText", name: "Validate Text", description: "Verify expected page or variable text.", icon: ListChecks },
  { type: "logMessage", name: "Log Message", description: "Write support/debug output.", icon: TerminalSquare }
];

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function StudioSimulator({
  mission = studioMissions[0],
  embedded = false,
  onMissionComplete
}: {
  mission?: StudioMission;
  embedded?: boolean;
  onMissionComplete?: (mission: StudioMission) => void;
}) {
  const [workflow, setWorkflow] = useState<WorkflowStep[]>(toWorkflow(mission.starterWorkflow));
  const [selectedId, setSelectedId] = useState(mission.starterWorkflow[0]?.id || "");
  const [browser, setBrowser] = useState<BrowserState>(initialBrowser());
  const [logs, setLogs] = useState<string[]>([`Ready for mission: ${mission.title}`]);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    setWorkflow(toWorkflow(mission.starterWorkflow));
    setSelectedId(mission.starterWorkflow[0]?.id || "");
    setBrowser(initialBrowser());
    setLogs([`Ready for mission: ${mission.title}`]);
    setIsRunning(false);
  }, [mission]);

  const selectedStep = workflow.find((step) => step.id === selectedId) || workflow[0];
  const completedCount = workflow.filter((step) => step.status === "success").length;
  const hasError = workflow.some((step) => step.status === "error");

  const missionStatus = useMemo(() => {
    if (hasError) return "Fix the red activity and run again.";
    if (completedCount === workflow.length && workflow.length > 0) return "Mission complete. Progress has been saved.";
    return mission.goal;
  }, [completedCount, hasError, mission.goal, workflow.length]);

  function addActivity(definition: ActivityDefinition) {
    const id = `${definition.type}-${Date.now()}`;
    const step: WorkflowStep = {
      id,
      type: definition.type,
      name: definition.name,
      target: defaultTarget(definition.type, mission),
      value: defaultValue(definition.type, mission),
      outputVariable: definition.type === "getText" ? "extractedValue" : undefined,
      status: "idle"
    };
    setWorkflow((current) => [...current, step]);
    setSelectedId(id);
  }

  function updateSelected(patch: Partial<WorkflowStep>) {
    setWorkflow((current) => current.map((step) => (step.id === selectedStep.id ? { ...step, ...patch, status: "idle", message: undefined } : step)));
  }

  function deleteSelected() {
    setWorkflow((current) => {
      const next = current.filter((step) => step.id !== selectedStep.id);
      setSelectedId(next[0]?.id || "");
      return next;
    });
  }

  function resetWorkflow() {
    setWorkflow(toWorkflow(mission.starterWorkflow));
    setSelectedId(mission.starterWorkflow[0]?.id || "");
    setBrowser(initialBrowser());
    setLogs([`Workflow reset for ${mission.title}.`]);
  }

  async function runWorkflow() {
    setIsRunning(true);
    setLogs(["Run started."]);
    let runtimeBrowser = initialBrowser();

    setWorkflow((current) => current.map((step) => ({ ...step, status: "idle", message: undefined })));
    setBrowser(runtimeBrowser);

    for (const step of workflow) {
      setWorkflow((current) => current.map((item) => (item.id === step.id ? { ...item, status: "running", message: "Running..." } : item)));
      await sleep(350);

      const result = executeStep(step, runtimeBrowser, mission);
      runtimeBrowser = result.browser;
      setBrowser(runtimeBrowser);
      setLogs((current) => [...current, result.log]);
      setWorkflow((current) => current.map((item) => (item.id === step.id ? { ...item, status: result.ok ? "success" : "error", message: result.message } : item)));

      if (!result.ok) {
        setLogs((current) => [...current, "Run stopped. Fix the highlighted activity."]);
        setIsRunning(false);
        return;
      }
    }

    completeLocalTask(mission.progressTaskId);
    setLogs((current) => [...current, "Run completed successfully.", `Mission saved: ${mission.xp} XP`]);
    setIsRunning(false);
    onMissionComplete?.(mission);
  }

  const shell = (
    <>
      <div className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div>
            <p className="text-sm font-medium text-primary">Browser RPA Studio</p>
            <h1 className="text-xl font-semibold">{mission.title}</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={resetWorkflow}>
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
            <Button onClick={runWorkflow} disabled={isRunning || workflow.length === 0}>
              <Play className="h-4 w-4" />
              {isRunning ? "Running..." : "Run"}
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-4 px-4 py-4 xl:grid-cols-[260px_minmax(420px,1fr)_360px]">
        <ActivityPanel onAdd={addActivity} />
        <div className="space-y-4">
          <Card>
            <CardHeader className="border-b">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <CardTitle>Main Workflow</CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">{missionStatus}</p>
                </div>
                <Badge className={cn("bg-white text-slate-700", completedCount === workflow.length && "border-green-200 bg-green-50 text-green-700")}>
                  {completedCount}/{workflow.length} passed
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="bg-white p-4">
              <div className="space-y-3">
                {workflow.map((step, index) => (
                  <WorkflowNode key={step.id} step={step} index={index} selected={step.id === selectedId} onSelect={() => setSelectedId(step.id)} />
                ))}
              </div>
            </CardContent>
          </Card>
          <BrowserPreview browser={browser} mission={mission} />
        </div>
        <div className="space-y-4">
          <MissionCard mission={mission} />
          <PropertiesPanel step={selectedStep} mission={mission} onChange={updateSelected} onDelete={deleteSelected} />
          <OutputPanel logs={logs} />
        </div>
      </div>
    </>
  );

  if (embedded) return <div className="rounded-lg border bg-slate-100">{shell}</div>;
  return <section className="min-h-[calc(100vh-65px)] bg-slate-100">{shell}</section>;
}

function MissionCard({ mission }: { mission: StudioMission }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle>Mission</CardTitle>
          <Badge className="bg-blue-50 text-blue-700">{mission.xp} XP</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm leading-6 text-muted-foreground">{mission.goal}</p>
        <div className="space-y-2">
          {mission.checklist.map((item) => (
            <div key={item} className="flex gap-2 text-sm">
              <CheckCircle2 className="mt-0.5 h-4 w-4 text-green-600" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ActivityPanel({ onAdd }: { onAdd: (definition: ActivityDefinition) => void }) {
  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle>Activities</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {activityLibrary.map((activity) => {
          const Icon = activity.icon;
          return (
            <button key={activity.type} onClick={() => onAdd(activity)} className="flex w-full items-start gap-3 rounded-md border bg-white p-3 text-left text-sm hover:bg-slate-50">
              <Icon className="mt-0.5 h-4 w-4 text-primary" />
              <span>
                <span className="block font-medium">{activity.name}</span>
                <span className="mt-1 block text-xs leading-5 text-muted-foreground">{activity.description}</span>
              </span>
            </button>
          );
        })}
      </CardContent>
    </Card>
  );
}

function WorkflowNode({ step, index, selected, onSelect }: { step: WorkflowStep; index: number; selected: boolean; onSelect: () => void }) {
  const Icon = iconForType(step.type);

  return (
    <button
      onClick={onSelect}
      className={cn("grid w-full grid-cols-[24px_1fr_auto] items-center gap-3 rounded-lg border bg-slate-50 p-4 text-left shadow-sm transition", selected && "border-blue-400 bg-blue-50", step.status === "success" && "border-green-200 bg-green-50", step.status === "error" && "border-red-200 bg-red-50")}
    >
      <GripVertical className="h-4 w-4 text-slate-400" />
      <span>
        <span className="flex flex-wrap items-center gap-2">
          <span className="font-medium">{index + 1}. {step.name}</span>
          <Badge className="bg-white text-slate-700">{labelForType(step.type)}</Badge>
        </span>
        <span className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
          {step.target && <span>Target: {step.target}</span>}
          {step.value && <span>Value: {step.value}</span>}
          {step.outputVariable && <span>Output: {step.outputVariable}</span>}
        </span>
        {step.message && <span className="mt-2 block text-xs text-muted-foreground">{step.message}</span>}
      </span>
      <span className="flex h-9 w-9 items-center justify-center rounded-md bg-white">
        {step.status === "success" ? <CheckCircle2 className="h-5 w-5 text-green-600" /> : step.status === "error" ? <AlertCircle className="h-5 w-5 text-red-600" /> : step.status === "running" ? <ChevronDown className="h-5 w-5 text-blue-600" /> : <Icon className="h-5 w-5 text-primary" />}
      </span>
    </button>
  );
}

function PropertiesPanel({ step, mission, onChange, onDelete }: { step?: WorkflowStep; mission: StudioMission; onChange: (patch: Partial<WorkflowStep>) => void; onDelete: () => void }) {
  if (!step) {
    return (
      <Card>
        <CardHeader><CardTitle>Properties</CardTitle></CardHeader>
        <CardContent className="text-sm text-muted-foreground">Add or select an activity.</CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle>Properties</CardTitle>
          <Button variant="ghost" size="icon" onClick={onDelete} title="Delete activity"><Trash2 className="h-4 w-4" /></Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <Field label="Activity name" value={step.name} onChange={(value) => onChange({ name: value })} />
        {(step.type === "openBrowser" || step.type === "typeInto" || step.type === "click" || step.type === "getText") && (
          <Field label={step.type === "openBrowser" ? "URL" : "Selector"} value={step.target || ""} onChange={(value) => onChange({ target: value })} />
        )}
        {(step.type === "typeInto" || step.type === "validateText" || step.type === "logMessage") && (
          <Field label={step.type === "validateText" ? "Expected text" : "Value"} value={step.value || ""} onChange={(value) => onChange({ value })} />
        )}
        {step.type === "getText" && <Field label="Output variable" value={step.outputVariable || ""} onChange={(value) => onChange({ outputVariable: value })} />}
        <div className="rounded-md border bg-slate-50 p-3 text-xs leading-5 text-muted-foreground">{hintForType(step.type, mission)}</div>
      </CardContent>
    </Card>
  );
}

function BrowserPreview({ browser, mission }: { browser: BrowserState; mission: StudioMission }) {
  return (
    <Card>
      <CardHeader className="border-b">
        <div className="flex items-center justify-between gap-3">
          <CardTitle>Browser Preview</CardTitle>
          <Badge className="bg-white text-slate-700">{browser.app === "blank" ? "about:blank" : mission.expected.url}</Badge>
        </div>
      </CardHeader>
      <CardContent className="bg-slate-200 p-4">
        <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b bg-slate-50 px-3 py-2">
            <span className="h-3 w-3 rounded-full bg-red-300" />
            <span className="h-3 w-3 rounded-full bg-yellow-300" />
            <span className="h-3 w-3 rounded-full bg-green-300" />
            <div className="ml-3 flex-1 rounded-md border bg-white px-3 py-1 text-xs text-muted-foreground">
              {browser.app === "blank" ? "about:blank" : `https://practice.local${mission.expected.url}`}
            </div>
          </div>
          <div className="min-h-[340px] p-6">{renderFakeApp(browser, mission)}</div>
        </div>
      </CardContent>
    </Card>
  );
}

function OutputPanel({ logs }: { logs: string[] }) {
  return (
    <Card>
      <CardHeader><CardTitle>Output</CardTitle></CardHeader>
      <CardContent>
        <div className="max-h-64 space-y-2 overflow-auto rounded-md bg-slate-950 p-3 font-mono text-xs text-slate-100">
          {logs.map((log, index) => <p key={`${log}-${index}`}>{`> ${log}`}</p>)}
        </div>
      </CardContent>
    </Card>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-1 text-sm font-medium">
      {label}
      <input value={value} onChange={(event) => onChange(event.target.value)} className="rounded-md border bg-white p-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
    </label>
  );
}

function renderFakeApp(browser: BrowserState, mission: StudioMission) {
  if (browser.app === "blank") {
    return <div className="flex min-h-[280px] items-center justify-center rounded-md border border-dashed bg-slate-50 text-sm text-muted-foreground">Browser has not opened a page yet.</div>;
  }

  if (mission.targetApp === "search") {
    if (browser.pageState === "detail") {
      return <ArticleView extracted={browser.extracted} />;
    }
    return (
      <div className="space-y-5">
        <PageTitle title="Search Practice" selector="#searchKeyword" />
        <InputPreview value={browser.fields["#searchKeyword"]} placeholder="Search keyword..." />
        {browser.fields["#searchKeyword"] && (
          <div className="space-y-3">
            <Result title="Enterprise automation playbook" meta="Category: Operations" active />
            <Result title="Selector repair checklist" meta="Category: QA" />
          </div>
        )}
      </div>
    );
  }

  if (mission.targetApp === "login") {
    return (
      <div className="space-y-5">
        <PageTitle title="Acme Portal Login" selector="#email, #password, #signInButton" />
        <InputPreview value={browser.fields["#email"]} placeholder="Email" />
        <InputPreview value={browser.fields["#password"] ? "•••••••••••" : ""} placeholder="Password" />
        <div className="rounded-md bg-blue-700 px-4 py-2 text-center text-sm font-medium text-white">Sign in</div>
        {browser.statusText && <StatusText text={browser.statusText} />}
      </div>
    );
  }

  if (mission.targetApp === "order") {
    return (
      <div className="space-y-5">
        <PageTitle title="Northwind Order Entry" selector="#customerName, #productName, #submitOrder" />
        <InputPreview value={browser.fields["#customerName"]} placeholder="Customer name" />
        <InputPreview value={browser.fields["#productName"]} placeholder="Product" />
        <div className="rounded-md bg-blue-700 px-4 py-2 text-center text-sm font-medium text-white">Submit order</div>
        {browser.statusText && <StatusText text={browser.statusText} />}
        {Object.keys(browser.extracted).length > 0 && <VariableBox values={browser.extracted} />}
      </div>
    );
  }

  if (mission.targetApp === "table") {
    return (
      <div className="space-y-5">
        <PageTitle title="Procurement Product Catalog" selector="[data-field='highestProduct']" />
        <table className="w-full border-collapse text-sm">
          <thead><tr>{["Product", "Category", "Price"].map((head) => <th key={head} className="border bg-slate-100 p-2 text-left">{head}</th>)}</tr></thead>
          <tbody>
            {[
              ["Automation Cloud Seat", "Software", "$120"],
              ["Invoice Scanner", "Hardware", "$310"],
              ["Robot Runtime", "Software", "$480"]
            ].map((row) => <tr key={row[0]}>{row.map((cell) => <td key={cell} className="border p-2">{cell}</td>)}</tr>)}
          </tbody>
        </table>
        {Object.keys(browser.extracted).length > 0 && <VariableBox values={browser.extracted} />}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <PageTitle title="Dynamic Approval Buttons" selector="[data-action='approve-primary']" />
      <div className="flex flex-wrap gap-3">
        <div className="rounded-md border bg-white px-4 py-2 text-sm">Approve 42</div>
        <div className="rounded-md border border-blue-200 bg-blue-50 px-4 py-2 text-sm">Process 17</div>
        <div className="rounded-md border bg-white px-4 py-2 text-sm">Continue 81</div>
      </div>
      {browser.statusText && <StatusText text={browser.statusText} />}
    </div>
  );
}

function executeStep(step: WorkflowStep, browser: BrowserState, mission: StudioMission): { ok: boolean; message: string; log: string; browser: BrowserState } {
  if (step.type === "openBrowser") {
    if (step.target !== mission.expected.url) return fail(step, browser, `Expected URL ${mission.expected.url}.`);
    return pass(step, { ...initialBrowser(), app: mission.targetApp, pageState: "opened" }, `Opened ${mission.expected.url}.`);
  }

  if (step.type === "typeInto") {
    if (browser.app === "blank") return fail(step, browser, "Open Browser must run before Type Into.");
    if (!step.target) return fail(step, browser, "Type Into needs a selector.");
    if (!step.value) return fail(step, browser, "Type Into needs a value.");
    return pass(step, { ...browser, fields: { ...browser.fields, [step.target]: step.value } }, `Typed "${step.value}" into ${step.target}.`);
  }

  if (step.type === "click") {
    if (browser.app === "blank") return fail(step, browser, "Open Browser must run before Click.");
    if (step.target !== mission.expected.clickTarget) return fail(step, browser, `Expected click selector ${mission.expected.clickTarget}.`);
    if (mission.targetApp === "search" && browser.fields["#searchKeyword"]?.toLowerCase() !== mission.expected.typedValue) return fail(step, browser, `Search keyword should be ${mission.expected.typedValue}.`);
    if (mission.targetApp === "login" && (browser.fields["#email"] !== "analyst@example.com" || browser.fields["#password"] !== "Practice123")) return fail(step, browser, "Valid login credentials are required before clicking.");
    if (mission.targetApp === "order" && (!browser.fields["#customerName"] || browser.fields["#productName"] !== "Studio License")) return fail(step, browser, "Order needs customer and Studio License before submit.");

    const nextState = mission.targetApp === "search" ? "detail" : mission.targetApp === "login" || mission.targetApp === "dynamic" ? "success" : "submitted";
    const statusText = mission.targetApp === "login" ? "Login successful" : mission.targetApp === "order" ? "Order submitted. Confirmation ORD-48291" : mission.targetApp === "dynamic" ? "Correct dynamic button clicked" : browser.statusText;
    return pass(step, { ...browser, pageState: nextState, statusText }, `Clicked ${step.target}.`);
  }

  if (step.type === "getText") {
    if (step.target !== mission.expected.extractTarget) return fail(step, browser, `Expected extract selector ${mission.expected.extractTarget}.`);
    const variable = step.outputVariable || "extractedValue";
    const value = mission.expected.extractedValue || "";
    return pass(step, { ...browser, extracted: { ...browser.extracted, [variable]: value } }, `Extracted "${value}" into ${variable}.`);
  }

  if (step.type === "validateText") {
    if (!step.value) return fail(step, browser, "Validate Text needs expected text.");
    const haystack = `${browser.statusText} ${Object.values(browser.extracted).join(" ")} ${browser.pageState}`;
    if (!haystack.includes(step.value)) return fail(step, browser, `Expected "${step.value}" was not found.`);
    return pass(step, browser, `Validated "${step.value}".`);
  }

  return pass(step, browser, step.value || "Log message activity completed.");
}

function toWorkflow(steps: WorkflowStepTemplate[]): WorkflowStep[] {
  return steps.map((step) => ({ ...step, status: "idle" }));
}

function initialBrowser(): BrowserState {
  return { app: "blank", fields: {}, pageState: "blank", extracted: {}, statusText: "" };
}

function pass(step: WorkflowStep, browser: BrowserState, message: string) {
  return { ok: true, message, log: `${step.name}: ${message}`, browser };
}

function fail(step: WorkflowStep, browser: BrowserState, message: string) {
  return { ok: false, message, log: `${step.name} failed: ${message}`, browser };
}

function defaultTarget(type: ActivityType, mission: StudioMission) {
  if (type === "openBrowser") return mission.expected.url;
  if (type === "typeInto") return mission.targetApp === "login" ? "#email" : mission.targetApp === "order" ? "#customerName" : "#searchKeyword";
  if (type === "click") return mission.expected.clickTarget || "";
  if (type === "getText") return mission.expected.extractTarget || "";
  return "";
}

function defaultValue(type: ActivityType, mission: StudioMission) {
  if (type === "typeInto") return mission.expected.typedValue || "";
  if (type === "validateText") return mission.expected.validationText || "";
  if (type === "logMessage") return `${mission.title} completed.`;
  return "";
}

function iconForType(type: ActivityType) {
  return activityLibrary.find((item) => item.type === type)?.icon || Square;
}

function labelForType(type: ActivityType) {
  return activityLibrary.find((item) => item.type === type)?.name || type;
}

function hintForType(type: ActivityType, mission: StudioMission) {
  const hints: Record<ActivityType, string> = {
    openBrowser: `Use the mission URL: ${mission.expected.url}.`,
    typeInto: "Type Into needs both a selector and value. Think: which field would UiPath target?",
    click: `For this mission, the expected click target is ${mission.expected.clickTarget || "not required"}.`,
    getText: `Extract from ${mission.expected.extractTarget || "the target field"} into a named variable.`,
    validateText: `Validate against ${mission.expected.validationText || "the expected result"}. Validation proves the bot really succeeded.`,
    logMessage: "Logs make automations supportable and interview-ready."
  };
  return hints[type];
}

function PageTitle({ title, selector }: { title: string; selector: string }) {
  return (
    <div>
      <p className="text-2xl font-semibold">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">Practice selectors: {selector}</p>
    </div>
  );
}

function InputPreview({ value, placeholder }: { value?: string; placeholder: string }) {
  return <div className="rounded-md border px-4 py-3 text-sm text-slate-800">{value || <span className="text-muted-foreground">{placeholder}</span>}</div>;
}

function StatusText({ text }: { text: string }) {
  return <div className="rounded-md border border-blue-100 bg-blue-50 p-3 text-sm text-blue-900">{text}</div>;
}

function VariableBox({ values }: { values: Record<string, string> }) {
  return <div className="rounded-md border bg-slate-50 p-3 text-sm">Extracted variables: {JSON.stringify(values)}</div>;
}

function Result({ title, meta, active = false }: { title: string; meta: string; active?: boolean }) {
  return (
    <div className={cn("rounded-md border p-4", active ? "border-blue-200 bg-blue-50" : "bg-white")}>
      <p className="text-xs text-green-700">https://practice.local/articles/{title.toLowerCase().replaceAll(" ", "-")}</p>
      <p className="mt-1 font-medium text-blue-700">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{meta}</p>
    </div>
  );
}

function ArticleView({ extracted }: { extracted: Record<string, string> }) {
  return (
    <div className="overflow-hidden rounded-lg border">
      <div className="bg-blue-700 p-6 text-white">
        <p className="text-sm opacity-80">Practice article</p>
        <h2 className="mt-2 text-3xl font-semibold">Enterprise automation playbook</h2>
      </div>
      <div className="space-y-4 p-5">
        <p className="text-sm font-medium text-primary">Category: Operations</p>
        <p className="leading-7 text-muted-foreground">A practical guide for choosing RPA candidates, validating selectors, and documenting bot evidence.</p>
        {Object.keys(extracted).length > 0 && <VariableBox values={extracted} />}
      </div>
    </div>
  );
}
