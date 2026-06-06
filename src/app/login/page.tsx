import Link from "next/link";
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="mx-auto w-full max-w-md px-6 py-12">
      <Link
        href="/"
        className="mb-6 inline-block text-sm text-muted transition-colors hover:text-accent"
      >
        &larr; Back to Home
      </Link>
      <h1 className="mb-2 text-3xl font-semibold tracking-tight text-foreground">
        Sign In
      </h1>
      <p className="mb-8 text-muted">
        Welcome back. Sign in to share and manage resources.
      </p>
      <div className="rounded-xl bg-surface p-6 shadow-sm">
        <LoginForm />
      </div>
    </div>
  );
}
