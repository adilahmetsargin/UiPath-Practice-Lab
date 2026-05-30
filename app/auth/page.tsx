import { AuthForm } from "@/components/auth-form";

export default function AuthPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <p className="text-sm font-medium text-primary">User system</p>
        <h1 className="mt-2 text-3xl font-semibold">Authentication</h1>
        <p className="mt-2 text-muted-foreground">Sign in with Supabase when configured, or use mock mode while developing locally.</p>
      </div>
      <AuthForm />
    </section>
  );
}
