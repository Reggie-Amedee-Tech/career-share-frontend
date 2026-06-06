"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function RequireAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-2xl px-6 py-12 text-center text-muted">
        Loading...
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return children;
}
