import Link from "next/link";
import { Bug, CheckCircle2, Database, FileSpreadsheet, Globe2, MousePointerClick, Play, Save, Send, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const activities = [
  { name: "Use Browser", icon: Globe2 },
  { name: "Type Into", icon: Send },
  { name: "Click", icon: MousePointerClick },
  { name: "Extract Table", icon: Database },
  { name: "Read Range", icon: FileSpreadsheet },
  { name: "Log Message", icon: CheckCircle2 }
];

const workflow = [
  { title: "Open target site", detail: "/practice/search-page", type: "Browser" },
  { title: "Type keyword", detail: "automation", type: "Input" },
  { title: "Click result", detail: "Enterprise automation playbook", type: "Selector" },
  { title: "Validate page", detail: "Category is Operations", type: "Check" },
  { title: "Capture evidence", detail: "Screenshot result page", type: "Output" }
];

export default function StudioPage() {
  return (
    <section className="min-h-[calc(100vh-65px)] bg-slate-100">
      <div className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div>
            <p className="text-sm font-medium text-primary">Fake UiPath Studio</p>
            <h1 className="text-xl font-semibold">Scenario workflow builder</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline"><Save className="h-4 w-4" />Save</Button>
            <Button variant="outline"><Bug className="h-4 w-4" />Debug</Button>
            <Button><Play className="h-4 w-4" />Run</Button>
          </div>
        </div>
      </div>
      <div className="mx-auto grid max-w-7xl gap-4 px-4 py-4 lg:grid-cols-[260px_1fr_300px]">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Activities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {activities.map((activity) => {
              const Icon = activity.icon;
              return (
                <div key={activity.name} className="flex items-center gap-3 rounded-md border bg-white p-3 text-sm">
                  <Icon className="h-4 w-4 text-primary" />
                  {activity.name}
                </div>
              );
            })}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="border-b">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <CardTitle>Main.xaml</CardTitle>
              <Badge className="bg-blue-50 text-blue-700">Browser scenario</Badge>
            </div>
          </CardHeader>
          <CardContent className="bg-white p-6">
            <div className="mx-auto max-w-2xl space-y-3">
              {workflow.map((item, index) => (
                <div key={item.title}>
                  <div className="rounded-lg border bg-slate-50 p-4 shadow-sm">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <p className="font-medium">{item.title}</p>
                      <Badge className="bg-white text-slate-700">{item.type}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.detail}</p>
                  </div>
                  {index < workflow.length - 1 && <div className="mx-auto h-6 w-px bg-border" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Properties</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <Property label="Target URL" value="/practice/search-page" />
              <Property label="Wait mode" value="Element visible" />
              <Property label="Retry" value="2 attempts" />
              <Property label="Evidence" value="Screenshot required" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Run checklist</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {["Use stable selector", "Validate result page", "Capture screenshot", "Submit proof to AI"].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  {item}
                </div>
              ))}
              <Button asChild className="mt-2 w-full">
                <Link href="/scenarios">
                  <Settings2 className="h-4 w-4" />
                  Open scenarios
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

function Property({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md border bg-white p-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
