import Link from "next/link";
import SignupForm from "@/components/SignupForm";

export default function SignupPage() {
  return (
    <div className="mx-auto w-full max-w-md px-6 py-12">
      <Link
        href="/"
        className="mb-6 inline-block text-sm text-muted transition-colors hover:text-accent"
      >
        &larr; Back to Home
      </Link>
      <h1 className="mb-2 text-3xl font-semibold tracking-tight text-foreground">
        Create Account
      </h1>
      <p className="mb-8 text-muted">
        Join Career Share to discover and contribute resources.
      </p>
      <div className="rounded-xl bg-surface p-6 shadow-sm">
        <SignupForm />
      </div>
    </div>
  );
}
