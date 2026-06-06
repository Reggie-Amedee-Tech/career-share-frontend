"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function SignupForm() {
  const router = useRouter();
  const { signup } = useAuth();
  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await signup({ fName, lName, email, password });
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="fName"
            className="text-sm font-medium text-foreground"
          >
            First name
          </label>
          <input
            id="fName"
            type="text"
            required
            autoComplete="given-name"
            value={fName}
            onChange={(e) => setFName(e.target.value)}
            className="rounded-lg border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-accent"
            placeholder="Jane"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="lName"
            className="text-sm font-medium text-foreground"
          >
            Last name
          </label>
          <input
            id="lName"
            type="text"
            required
            autoComplete="family-name"
            value={lName}
            onChange={(e) => setLName(e.target.value)}
            className="rounded-lg border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-accent"
            placeholder="Doe"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-sm font-medium text-foreground">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-lg border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-accent"
          placeholder="you@example.com"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="password"
          className="text-sm font-medium text-foreground"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          autoComplete="new-password"
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-lg border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-accent"
          placeholder="At least 8 characters"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:opacity-50"
      >
        {submitting ? "Creating account..." : "Create Account"}
      </button>

      <p className="text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="text-accent hover:text-accent-hover">
          Sign in
        </Link>
      </p>
    </form>
  );
}
