import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-16">
      <main className="flex w-full max-w-3xl flex-col items-center gap-8 rounded-2xl bg-surface px-8 py-24 shadow-sm sm:items-start sm:px-16 sm:text-left">
        <div className="flex flex-col gap-4 text-center sm:text-left">
          <h1 className="text-4xl font-semibold tracking-tight text-foreground">
            Career Share
          </h1>
          <p className="max-w-md text-lg leading-8 text-muted">
            Discover and share career resources with the community. Browse
            helpful links, add your own, and help others grow.
          </p>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Link
            href="/resources"
            className="flex h-12 items-center justify-center rounded-full bg-primary px-8 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
          >
            Browse Resources
          </Link>
          <Link
            href="/resources/new"
            className="flex h-12 items-center justify-center rounded-full border border-border px-8 text-sm font-medium text-foreground transition-colors hover:bg-background"
          >
            Add Resource
          </Link>
        </div>
      </main>
    </div>
  );
}
