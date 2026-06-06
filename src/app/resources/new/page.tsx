import Link from "next/link";
import ResourceForm from "@/components/ResourceForm";
import RequireAuth from "@/components/RequireAuth";

export default function NewResourcePage() {
  return (
    <RequireAuth>
      <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
        <Link
          href="/resources"
          className="mb-6 inline-block text-sm text-muted transition-colors hover:text-accent"
        >
          &larr; Back to Resources
        </Link>
        <h1 className="mb-6 text-2xl font-semibold tracking-tight text-foreground sm:mb-8 sm:text-3xl">
          Add Resource
        </h1>
        <div className="rounded-xl bg-surface p-6 shadow-sm">
          <ResourceForm />
        </div>
      </div>
    </RequireAuth>
  );
}
