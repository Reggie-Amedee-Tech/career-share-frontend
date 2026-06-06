"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import DeleteResourceButton from "@/components/DeleteResourceButton";

interface AuthResourceActionsProps {
  resourceId: string;
  resourceTitle: string;
}

export default function AuthResourceActions({
  resourceId,
  resourceTitle,
}: AuthResourceActionsProps) {
  const { user, loading } = useAuth();

  if (loading || !user) {
    return null;
  }

  return (
    <div className="flex shrink-0 gap-2">
      <Link
        href={`/resources/${resourceId}/edit`}
        className="rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-background"
      >
        Edit
      </Link>
      <DeleteResourceButton
        resourceId={resourceId}
        resourceTitle={resourceTitle}
      />
    </div>
  );
}
