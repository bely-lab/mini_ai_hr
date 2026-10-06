"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CircleAlert, Loader2 } from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    const { error: signInError } =
      await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

    if (signInError) {
      setError("Invalid email or password.");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-8">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <Image
            src="/logo.png"
            alt="SITA.dev"
            width={180}
            height={48}
            priority
            className="h-10 w-auto object-contain"
          />

          <p className="mt-4 text-sm text-muted-foreground">
            Mini AI HR
          </p>
        </div>

        <div className="rounded-xl border bg-background p-6 shadow-sm sm:p-7">
          <div className="mb-6">
            <h1 className="text-xl font-semibold tracking-tight">
              Sign in
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Access your HR workspace.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            noValidate
            className="space-y-5"
          >
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>

              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);

                  if (error) {
                    setError("");
                  }
                }}
                disabled={loading}
                aria-invalid={!!error}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>

              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);

                  if (error) {
                    setError("");
                  }
                }}
                disabled={loading}
                aria-invalid={!!error}
              />
            </div>

            {error && (
              <div
                role="alert"
                className="flex items-start gap-2.5 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive"
              >
                <CircleAlert className="mt-0.5 size-4 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loading || !email.trim() || !password}
            >
              {loading && (
                <Loader2 className="size-4 animate-spin" />
              )}

              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </div>

        <p className="mt-5 text-center text-xs text-muted-foreground">
          Secure HR administration workspace
        </p>
      </div>
    </main>
  );
}