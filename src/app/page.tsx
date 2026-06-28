import Link from "next/link";

function JourneyIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <circle cx="6" cy="19" r="2" />
      <circle cx="18" cy="5" r="2" />
      <path d="M8 19V8.5a2 2 0 0 1 2-2h4" />
      <path d="m12 6.5 6-1.5" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <path d="M3 3v18h18" />
      <path d="M7 16V9" />
      <path d="M12 16V5" />
      <path d="M17 16v-4" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

function BriefcaseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      <rect width="20" height="14" x="2" y="6" rx="2" />
    </svg>
  );
}

const journeyHighlights = [
  {
    icon: JourneyIcon,
    title: "Map your path",
    description:
      "Create separate journeys for frontend, backend, data, and more — each tailored to a role and location you care about.",
  },
  {
    icon: ChartIcon,
    title: "See what employers want",
    description:
      "Skill demand charts analyze real open roles so you know exactly which technologies to focus on next.",
  },
  {
    icon: SearchIcon,
    title: "Jump straight to jobs",
    description:
      "Every journey links to a pre-filtered job search, so you can go from insight to application in one click.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      {/* Hero */}
      <section className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 sm:py-20">
        <div className="flex flex-col items-center gap-6 text-center sm:gap-8">
          <p className="rounded-full border border-border bg-surface px-4 py-1.5 text-sm font-medium text-accent">
            Your career, mapped and shared
          </p>
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Navigate your career with clarity and community
          </h1>
          <p className="max-w-xl text-base leading-7 text-muted sm:text-lg sm:leading-8">
            Career Share helps you understand where you want to go, what skills
            you need to get there, and connects you with resources and open
            roles — all in one place.
          </p>
          <div className="flex w-full max-w-md flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center">
            <Link
              href="/journey"
              className="flex h-12 items-center justify-center rounded-full bg-primary px-8 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
            >
              Start My Journey
            </Link>
            <Link
              href="/signup"
              className="flex h-12 items-center justify-center rounded-full border border-border bg-surface px-8 text-sm font-medium text-foreground transition-colors hover:bg-background"
            >
              Create free account
            </Link>
          </div>
        </div>
      </section>

      {/* Featured: My Journey */}
      <section className="border-y border-border bg-surface">
        <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="mb-10 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="mb-2 text-sm font-medium uppercase tracking-wide text-accent">
                Featured
              </p>
              <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                My Journey — your personal career compass
              </h2>
              <p className="mt-3 text-base leading-7 text-muted">
                Stop guessing which skills matter. Define the role you are
                targeting, pick your market, and let Career Share analyze live
                job listings to show you where to invest your learning time.
              </p>
            </div>
            <Link
              href="/journey"
              className="inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-primary px-6 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
            >
              Go to My Journey
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 sm:gap-6">
            {journeyHighlights.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-xl border border-border bg-background p-6"
              >
                <div className="mb-4 inline-flex rounded-lg bg-surface p-2.5 text-accent">
                  <Icon />
                </div>
                <h3 className="font-semibold text-foreground">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Supporting features */}
      <section className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="mb-8 text-center sm:mb-10">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Everything else you need
          </h2>
          <p className="mt-2 text-muted">
            Resources and job search round out your career toolkit.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
          <Link
            href="/resources"
            className="group rounded-xl border border-border bg-surface p-6 transition-colors hover:border-accent hover:bg-background"
          >
            <div className="mb-4 inline-flex rounded-lg bg-background p-2.5 text-accent transition-colors group-hover:bg-surface">
              <BookIcon />
            </div>
            <h3 className="font-semibold text-foreground">Community Resources</h3>
            <p className="mt-2 text-sm leading-6 text-muted">
              Browse and share articles, courses, and tools that helped others
              land their next role. Upvote the best finds.
            </p>
            <span className="mt-4 inline-block text-sm font-medium text-accent group-hover:text-accent-hover">
              Browse resources →
            </span>
          </Link>

          <Link
            href="/jobs"
            className="group rounded-xl border border-border bg-surface p-6 transition-colors hover:border-accent hover:bg-background"
          >
            <div className="mb-4 inline-flex rounded-lg bg-background p-2.5 text-accent transition-colors group-hover:bg-surface">
              <BriefcaseIcon />
            </div>
            <h3 className="font-semibold text-foreground">Job Search</h3>
            <p className="mt-2 text-sm leading-6 text-muted">
              Search open roles by title, skills, and location — including
              distance from your home address. Find opportunities that fit.
            </p>
            <span className="mt-4 inline-block text-sm font-medium text-accent group-hover:text-accent-hover">
              Find jobs →
            </span>
          </Link>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="mx-auto w-full max-w-5xl px-4 pb-12 sm:px-6 sm:pb-20">
        <div className="rounded-2xl border border-border bg-surface px-6 py-10 text-center sm:px-12 sm:py-14">
          <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
            Ready to chart your next move?
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted sm:text-base">
            Create your first journey today and see which skills employers in
            your target market are asking for right now.
          </p>
          <Link
            href="/journey"
            className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
          >
            Start My Journey
          </Link>
        </div>
      </section>
    </div>
  );
}
