"use client";

import { useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Database,
  FileText,
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type ActivityType = "openBrowser" | "typeInto" | "click" | "getText" | "validateText" | "logMessage";
type RunStatus = "idle" | "running" | "success" | "error";

type ActivityDefinition = {
  type: ActivityType;
  name: string;
  description: string;
  icon: React.ElementType;
};

type WorkflowStep = {
  id: string;
  type: ActivityType;
  name: string;
  target?: string;
  value?: string;
  outputVariable?: string;
  status: RunStatus;
  message?: string;
};

type BrowserState = {
  page: "blank" | "search" | "article";
  searchValue: string;
  extracted: Record<string, string>;
};

const activityLibrary: ActivityDefinition[] = [
  { type: "openBrowser", name: "Open Browser", description: "Open a target web page.", icon: Globe2 },
  { type: "typeInto", name: "Type Into", description: "Type text into an input selector.", icon: Send },
  { type: "click", name: "Click", description: "Click a button, link, or result selector.", icon: MousePointerClick },
  { type: "getText", name: "Get Text", description: "Extract visible text into a variable.", icon: Database },
  { type: "validateText", name: "Validate Text", description: "Check that a page contains expected text.", icon: ListChecks },
  { type: "logMessage", name: "Log Message", description: "Write a message to the output panel.", icon: TerminalSquare }
];

const defaultWorkflow: WorkflowStep[] = [
  {
    id: "step-open",
    type: "openBrowser",
    name: "Open Search Practice",
    target: "/practice/search-page",
    status: "idle"
  },
  {
    id: "step-type",
    type: "typeInto",
    name: "Type Search Keyword",
    target: "#searchKeyword",
    value: "automation",
    status: "idle"
  },
  {
    id: "step-click",
    type: "click",
    name: "Click Correct Result",
    target: "[data-result='enterprise-automation-playbook']",
    status: "idle"
  },
  {
    id: "step-get",
    type: "getText",
    name: "Extract Category",
    target: "[data-field='category']",
    outputVariable: "articleCategory",
    status: "idle"
  },
  {
    id: "step-validate",
    type: "validateText",
    name: "Validate Extracted Value",
    value: "Operations",
    status: "idle"
  },
  {
    id: "step-log",
    type: "logMessage",
    name: "Log Result",
    value: "Article category captured successfully.",
    status: "idle"
  }
];

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function StudioSimulator() {
  const [workflow, setWorkflow] = useState<WorkflowStep[]>(defaultWorkflow);
  const [selectedId, setSelectedId] = useState(defaultWorkflow[0].id);
  const [browser, setBrowser] = useState<BrowserState>({ page: "blank", searchValue: "", extracted: {} });
  const [logs, setLogs] = useState<string[]>(["Ready. Build a workflow and press Run."]);
  const [isRunning, setIsRunning] = useState(false);

  const selectedStep = workflow.find((step) => step.id === selectedId) || workflow[0];
  const completedCount = workflow.filter((step) => step.status === "success").length;
  const hasError = workflow.some((step) => step.status === "error");

  const missionStatus = useMemo(() => {
    if (hasError) return "Fix the failed activity and run again.";
    if (completedCount === workflow.length) return "Mission complete. You built and ran your first browser workflow.";
    return "Mission: search for automation, open the enterprise playbook, extract category Operations.";
  }, [completedCount, hasError, workflow.length]);

  function addActivity(definition: ActivityDefinition) {
    const id = `${definition.type}-${Date.now()}`;
    const step: WorkflowStep = {
      id,
      type: definition.type,
      name: definition.name,
      target: defaultTarget(definition.type),
      value: defaultValue(definition.type),
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
    setWorkflow(defaultWorkflow);
    setSelectedId(defaultWorkflow[0].id);
    setBrowser({ page: "blank", searchValue: "", extracted: {} });
    setLogs(["Workflow reset. Press Run to execute the starter bot."]);
  }

  async function runWorkflow() {
    setIsRunning(true);
    setLogs(["Run started."]);
    let runtimeBrowser: BrowserState = { page: "blank", searchValue: "", extracted: {} };

    setWorkflow((current) => current.map((step) => ({ ...step, status: "idle", message: undefined })));
    setBrowser(runtimeBrowser);

    for (const step of workflow) {
      setWorkflow((current) => current.map((item) => (item.id === step.id ? { ...item, status: "running", message: "Running..." } : item)));
      await sleep(450);

      const result = executeStep(step, runtimeBrowser);
      runtimeBrowser = result.browser;
      setBrowser(runtimeBrowser);
      setLogs((current) => [...current, result.log]);
      setWorkflow((current) =>
        current.map((item) =>
          item.id === step.id
            ? {
                ...item,
                status: result.ok ? "success" : "error",
                message: result.message
              }
            : item
        )
      );

      if (!result.ok) {
        setLogs((current) => [...current, "Run stopped. Fix the highlighted activity."]);
        setIsRunning(false);
        return;
      }
    }

    setLogs((current) => [...current, "Run completed successfully."]);
    setIsRunning(false);
  }

  return (
    <section className="min-h-[calc(100vh-65px)] bg-slate-100">
      <div className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div>
            <p className="text-sm font-medium text-primary">Browser RPA Studio</p>
            <h1 className="text-xl font-semibold">Build and run a beginner automation</h1>
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
                  <WorkflowNode
                    key={step.id}
                    step={step}
                    index={index}
                    selected={step.id === selectedId}
                    onSelect={() => setSelectedId(step.id)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          <BrowserPreview browser={browser} />
        </div>

        <div className="space-y-4">
          <PropertiesPanel step={selectedStep} onChange={updateSelected} onDelete={deleteSelected} />
          <OutputPanel logs={logs} />
        </div>
      </div>
    </section>
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
            <button
              key={activity.type}
              onClick={() => onAdd(activity)}
              className="flex w-full items-start gap-3 rounded-md border bg-white p-3 text-left text-sm hover:bg-slate-50"
            >
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
      className={cn(
        "grid w-full grid-cols-[24px_1fr_auto] items-center gap-3 rounded-lg border bg-slate-50 p-4 text-left shadow-sm transition",
        selected && "border-blue-400 bg-blue-50",
        step.status === "success" && "border-green-200 bg-green-50",
        step.status === "error" && "border-red-200 bg-red-50"
      )}
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

function PropertiesPanel({ step, onChange, onDelete }: { step?: WorkflowStep; onChange: (patch: Partial<WorkflowStep>) => void; onDelete: () => void }) {
  if (!step) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Properties</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">Add or select an activity.</CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle>Properties</CardTitle>
          <Button variant="ghost" size="icon" onClick={onDelete} title="Delete activity">
            <Trash2 className="h-4 w-4" />
          </Button>
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
        {step.type === "getText" && (
          <Field label="Output variable" value={step.outputVariable || ""} onChange={(value) => onChange({ outputVariable: value })} />
        )}
        <div className="rounded-md border bg-slate-50 p-3 text-xs leading-5 text-muted-foreground">
          {hintForType(step.type)}
        </div>
      </CardContent>
    </Card>
  );
}

function BrowserPreview({ browser }: { browser: BrowserState }) {
  return (
    <Card>
      <CardHeader className="border-b">
        <div className="flex items-center justify-between gap-3">
          <CardTitle>Browser Preview</CardTitle>
          <Badge className="bg-white text-slate-700">{browser.page === "blank" ? "about:blank" : browser.page === "search" ? "/practice/search-page" : "article detail"}</Badge>
        </div>
      </CardHeader>
      <CardContent className="bg-slate-200 p-4">
        <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b bg-slate-50 px-3 py-2">
            <span className="h-3 w-3 rounded-full bg-red-300" />
            <span className="h-3 w-3 rounded-full bg-yellow-300" />
            <span className="h-3 w-3 rounded-full bg-green-300" />
            <div className="ml-3 flex-1 rounded-md border bg-white px-3 py-1 text-xs text-muted-foreground">
              {browser.page === "blank" ? "about:blank" : browser.page === "search" ? "https://practice.local/search" : "https://practice.local/articles/enterprise-automation-playbook"}
            </div>
          </div>
          <div className="min-h-[340px] p-6">
            {browser.page === "blank" && (
              <div className="flex min-h-[280px] items-center justify-center rounded-md border border-dashed bg-slate-50 text-sm text-muted-foreground">
                Browser has not opened a page yet.
              </div>
            )}
            {browser.page === "search" && (
              <div className="space-y-5">
                <div>
                  <p className="text-2xl font-semibold">Search Practice</p>
                  <p className="mt-1 text-sm text-muted-foreground">Selector target: #searchKeyword</p>
                </div>
                <div className="rounded-full border px-4 py-3 text-sm">
                  {browser.searchValue || "Search keyword..."}
                </div>
                {browser.searchValue && (
                  <div className="space-y-3">
                    <SearchResult title="Enterprise automation playbook" category="Operations" active />
                    <SearchResult title="Selector repair checklist" category="QA" />
                    <SearchResult title="Invoice automation case study" category="Finance" />
                  </div>
                )}
              </div>
            )}
            {browser.page === "article" && (
              <div className="overflow-hidden rounded-lg border">
                <div className="bg-blue-700 p-6 text-white">
                  <p className="text-sm opacity-80">Practice article</p>
                  <h2 className="mt-2 text-3xl font-semibold">Enterprise automation playbook</h2>
                </div>
                <div className="space-y-4 p-5">
                  <p className="text-sm font-medium text-primary">Category: Operations</p>
                  <p className="leading-7 text-muted-foreground">
                    A practical guide for choosing RPA candidates, validating selectors, and documenting bot evidence.
                  </p>
                  <div className="rounded-md border bg-slate-50 p-3 text-sm">
                    Extracted variables: {Object.keys(browser.extracted).length ? JSON.stringify(browser.extracted) : "none yet"}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function OutputPanel({ logs }: { logs: string[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Output</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="max-h-64 space-y-2 overflow-auto rounded-md bg-slate-950 p-3 font-mono text-xs text-slate-100">
          {logs.map((log, index) => (
            <p key={`${log}-${index}`}>{`> ${log}`}</p>
          ))}
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

function SearchResult({ title, category, active = false }: { title: string; category: string; active?: boolean }) {
  return (
    <div className={cn("rounded-md border p-4", active ? "border-blue-200 bg-blue-50" : "bg-white")}>
      <p className="text-xs text-green-700">https://practice.local/articles/{title.toLowerCase().replaceAll(" ", "-")}</p>
      <p className="mt-1 font-medium text-blue-700">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">Category: {category}</p>
    </div>
  );
}

function executeStep(step: WorkflowStep, browser: BrowserState): { ok: boolean; message: string; log: string; browser: BrowserState } {
  if (step.type === "openBrowser") {
    if (step.target !== "/practice/search-page") {
      return fail(step, browser, "Expected URL /practice/search-page.");
    }
    return pass(step, { ...browser, page: "search" }, "Opened search practice page.");
  }

  if (step.type === "typeInto") {
    if (browser.page !== "search") return fail(step, browser, "Open the search page before typing.");
    if (step.target !== "#searchKeyword") return fail(step, browser, "Selector should be #searchKeyword.");
    if (!step.value) return fail(step, browser, "Type Into needs a value.");
    return pass(step, { ...browser, searchValue: step.value }, `Typed "${step.value}" into search input.`);
  }

  if (step.type === "click") {
    if (browser.page !== "search") return fail(step, browser, "Click can only find the result on the search page.");
    if (browser.searchValue.toLowerCase() !== "automation") return fail(step, browser, "Search keyword should be automation before clicking.");
    if (step.target !== "[data-result='enterprise-automation-playbook']") {
      return fail(step, browser, "Selector should target the Enterprise automation playbook result.");
    }
    return pass(step, { ...browser, page: "article" }, "Clicked Enterprise automation playbook.");
  }

  if (step.type === "getText") {
    if (browser.page !== "article") return fail(step, browser, "Open the article page before extracting text.");
    if (step.target !== "[data-field='category']") return fail(step, browser, "Selector should be [data-field='category'].");
    const variable = step.outputVariable || "extractedValue";
    return pass(step, { ...browser, extracted: { ...browser.extracted, [variable]: "Operations" } }, `Extracted Operations into ${variable}.`);
  }

  if (step.type === "validateText") {
    const extractedValues = Object.values(browser.extracted);
    if (!step.value) return fail(step, browser, "Validate Text needs an expected value.");
    if (!extractedValues.includes(step.value) && step.value !== "Operations") {
      return fail(step, browser, `Expected text "${step.value}" was not found.`);
    }
    return pass(step, browser, `Validated expected text "${step.value}".`);
  }

  return pass(step, browser, step.value || "Log message activity completed.");
}

function pass(step: WorkflowStep, browser: BrowserState, message: string) {
  return { ok: true, message, log: `${step.name}: ${message}`, browser };
}

function fail(step: WorkflowStep, browser: BrowserState, message: string) {
  return { ok: false, message, log: `${step.name} failed: ${message}`, browser };
}

function defaultTarget(type: ActivityType) {
  if (type === "openBrowser") return "/practice/search-page";
  if (type === "typeInto") return "#searchKeyword";
  if (type === "click") return "[data-result='enterprise-automation-playbook']";
  if (type === "getText") return "[data-field='category']";
  return "";
}

function defaultValue(type: ActivityType) {
  if (type === "typeInto") return "automation";
  if (type === "validateText") return "Operations";
  if (type === "logMessage") return "Workflow step completed.";
  return "";
}

function iconForType(type: ActivityType) {
  return activityLibrary.find((item) => item.type === type)?.icon || Square;
}

function labelForType(type: ActivityType) {
  return activityLibrary.find((item) => item.type === type)?.name || type;
}

function hintForType(type: ActivityType) {
  const hints: Record<ActivityType, string> = {
    openBrowser: "Beginner rule: open the target page before trying any UI activity.",
    typeInto: "Type Into needs a selector and a value. For this mission, the stable selector is #searchKeyword.",
    click: "Click should target a stable result selector, not screen coordinates.",
    getText: "Get Text stores page text in a variable so later activities can validate or log it.",
    validateText: "Validation proves the bot reached the right state instead of only clicking around.",
    logMessage: "Logs make a workflow easier to debug and explain in interviews."
  };
  return hints[type];
}
