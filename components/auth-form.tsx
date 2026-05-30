"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn, UserPlus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { demoSessionKey } from "@/lib/local-progress";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AuthForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("Use Demo mode to test progress immediately, or sign in with an existing Supabase account.");

  async function signIn() {
    if (!supabase) {
      setMessage(`Mock session started for ${email || "practice@example.com"}. Configure Supabase for real auth.`);
      router.push("/dashboard");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Signed in successfully.");
    router.push("/dashboard");
  }

  async function createAccount() {
    if (!supabase) {
      startDemo();
      return;
    }

    const { error } = await supabase.auth.signUp({ email, password });
    setMessage(error ? error.message : "Account created. If email confirmation is enabled, check your inbox before signing in.");
  }

  function startDemo() {
    window.localStorage.setItem(demoSessionKey, "true");
    setMessage("Demo session started.");
    router.push("/dashboard");
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
        <div className="flex flex-wrap gap-2">
          <Button onClick={signIn} disabled={!email || !password}>
            <LogIn className="h-4 w-4" />
            Sign in
          </Button>
          <Button onClick={createAccount} disabled={!email || !password} variant="outline">
            <UserPlus className="h-4 w-4" />
            Create account
          </Button>
          <Button onClick={startDemo} variant="secondary">
            Demo mode
          </Button>
        </div>
        <p className="rounded-md border bg-slate-50 p-3 text-sm text-muted-foreground">{message}</p>
      </CardContent>
    </Card>
  );
}
