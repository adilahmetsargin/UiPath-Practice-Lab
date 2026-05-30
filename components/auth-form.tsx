"use client";

import { useState } from "react";
import { LogIn } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("Use any email in mock mode, or configure Supabase to create real sessions.");

  async function signIn() {
    if (!supabase) {
      setMessage(`Mock session started for ${email || "practice@example.com"}. Configure Supabase for real auth.`);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      const signUp = await supabase.auth.signUp({ email, password });
      setMessage(signUp.error ? signUp.error.message : "Account created. Check email settings in Supabase if confirmation is enabled.");
      return;
    }

    setMessage("Signed in successfully.");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign in to track progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <label className="grid gap-1 text-sm font-medium">
          Email
          <input value={email} onChange={(event) => setEmail(event.target.value)} className="rounded-md border p-2" placeholder="analyst@example.com" />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          Password
          <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" className="rounded-md border p-2" placeholder="Practice123" />
        </label>
        <Button onClick={signIn} disabled={!email || !password}>
          <LogIn className="h-4 w-4" />
          Continue
        </Button>
        <p className="rounded-md border bg-slate-50 p-3 text-sm text-muted-foreground">{message}</p>
      </CardContent>
    </Card>
  );
}
