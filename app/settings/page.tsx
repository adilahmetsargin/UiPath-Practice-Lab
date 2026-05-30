import { CheckCircle2, CircleDashed } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  const hfConfigured = Boolean(process.env.HUGGINGFACE_API_KEY);
  return (
    <section className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <p className="text-sm font-medium text-primary">Configuration</p>
        <h1 className="mt-2 text-3xl font-semibold">Settings</h1>
        <p className="mt-2 text-muted-foreground">The app runs with mock data by default and upgrades automatically when environment variables are present.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Integration status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Status configured={isSupabaseConfigured} label="Supabase auth, database, and progress tracking" env="NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY" />
          <Status configured={hfConfigured} label="Hugging Face AI feedback" env="HUGGINGFACE_API_KEY" />
        </CardContent>
      </Card>
    </section>
  );
}

function Status({ configured, label, env }: { configured: boolean; label: string; env: string }) {
  const Icon = configured ? CheckCircle2 : CircleDashed;
  return (
    <div className="flex items-start gap-3 rounded-md border p-4">
      <Icon className={configured ? "mt-0.5 h-5 w-5 text-green-600" : "mt-0.5 h-5 w-5 text-slate-400"} />
      <div>
        <p className="font-medium">{label}</p>
        <p className="mt-1 text-sm text-muted-foreground">{configured ? "Configured" : "Using mock fallback"}: {env}</p>
      </div>
    </div>
  );
}
