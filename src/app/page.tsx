import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-10 sm:px-6 sm:py-16">
      <main className="flex w-full max-w-3xl flex-col items-center gap-6 rounded-2xl bg-surface px-6 py-12 shadow-sm sm:items-start sm:gap-8 sm:px-16 sm:py-24 sm:text-left">
        <div className="flex flex-col gap-3 text-center sm:gap-4 sm:text-left">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Career Share
          </h1>
          <p className="max-w-md text-base leading-7 text-muted sm:text-lg sm:leading-8">
            Discover and share career resources with the community. Browse
            helpful links, add your own, and help others grow.
          </p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:gap-4">
          <Link
            href="/resources"
            className="flex h-12 w-full items-center justify-center rounded-full bg-primary px-8 text-sm font-medium text-white transition-colors hover:bg-primary-hover sm:w-auto"
          >
            Browse Resources
          </Link>
          <Link
            href="/resources/new"
            className="flex h-12 w-full items-center justify-center rounded-full border border-border px-8 text-sm font-medium text-foreground transition-colors hover:bg-background sm:w-auto"
          >
            Add Resource
          </Link>
        </div>
      </main>
    </div>
  );
}
