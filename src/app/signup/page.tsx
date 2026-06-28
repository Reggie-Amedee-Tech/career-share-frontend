import Link from "next/link";
import SignupForm from "@/components/SignupForm";

export default function SignupPage() {
  return (
    <div className="mx-auto w-full max-w-lg px-4 py-8 sm:px-6 sm:py-12">
      <Link
        href="/"
        className="mb-6 inline-block text-sm text-muted transition-colors hover:text-accent"
      >
        &larr; Back to Home
      </Link>
      <h1 className="mb-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        Create Account
      </h1>
      <p className="mb-8 text-muted">
        Join Career Share to discover resources and find job postings near you.
      </p>
      <div className="rounded-xl bg-surface p-6 shadow-sm">
        <SignupForm />
      </div>
    </div>
  );
}
