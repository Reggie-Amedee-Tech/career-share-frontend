import Link from "next/link";
import { notFound } from "next/navigation";
import { getResource } from "@/lib/api";
import ResourceForm from "@/components/ResourceForm";
import RequireAuth from "@/components/RequireAuth";
import { Resource } from "@/types/resource";

interface EditResourcePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditResourcePage({
  params,
}: EditResourcePageProps) {
  const { id } = await params;

  let resource: Resource | null = null;
  try {
    resource = await getResource(id);
  } catch {
    notFound();
  }

  if (!resource) {
    notFound();
  }

  return (
    <RequireAuth>
      <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
        <Link
          href={`/resources/${resource.id}`}
          className="mb-6 inline-block text-sm text-muted transition-colors hover:text-accent"
        >
          &larr; Back to Resource
        </Link>
        <h1 className="mb-6 text-2xl font-semibold tracking-tight text-foreground sm:mb-8 sm:text-3xl">
          Edit Resource
        </h1>
        <div className="rounded-xl bg-surface p-6 shadow-sm">
          <ResourceForm
            resourceId={resource.id}
            initialData={{
              title: resource.title,
              description: resource.description,
              url: resource.url,
              category: resource.category[0] ?? "OTHER",
            }}
          />
        </div>
      </div>
    </RequireAuth>
  );
}
