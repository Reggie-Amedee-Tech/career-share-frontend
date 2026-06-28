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
  const [addressLine1, setAddressLine1] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await signup({
        fName,
        lName,
        email,
        password,
        addressLine1,
        city,
        state,
        zipCode,
        country,
      });
      router.push("/journey");
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

      <div className="border-t border-border pt-2">
        <h2 className="text-sm font-semibold text-foreground">Your address</h2>
        <p className="mt-1 text-xs text-muted">
          Used to match you with nearby job postings.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="addressLine1"
          className="text-sm font-medium text-foreground"
        >
          Street address
        </label>
        <input
          id="addressLine1"
          type="text"
          required
          autoComplete="address-line1"
          value={addressLine1}
          onChange={(e) => setAddressLine1(e.target.value)}
          className="rounded-lg border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-accent"
          placeholder="123 Main St"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="city" className="text-sm font-medium text-foreground">
            City
          </label>
          <input
            id="city"
            type="text"
            required
            autoComplete="address-level2"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="rounded-lg border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-accent"
            placeholder="New York"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="state"
            className="text-sm font-medium text-foreground"
          >
            State / Province
          </label>
          <input
            id="state"
            type="text"
            required
            autoComplete="address-level1"
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="rounded-lg border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-accent"
            placeholder="NY"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="zipCode"
            className="text-sm font-medium text-foreground"
          >
            ZIP / Postal code
          </label>
          <input
            id="zipCode"
            type="text"
            required
            autoComplete="postal-code"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            className="rounded-lg border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-accent"
            placeholder="10001"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="country"
            className="text-sm font-medium text-foreground"
          >
            Country
          </label>
          <input
            id="country"
            type="text"
            required
            autoComplete="country-name"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="rounded-lg border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-accent"
            placeholder="United States"
          />
        </div>
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
        className="w-full rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:opacity-50 sm:w-auto"
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
