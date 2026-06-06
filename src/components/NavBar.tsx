"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function NavBar() {
  const { user, loading, logout } = useAuth();

  async function handleLogout() {
    await logout();
  }

  return (
    <nav className="border-b border-border bg-surface shadow-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight text-foreground"
          >
            Career Share
          </Link>
          <Link
            href="/"
            className="text-sm text-muted transition-colors hover:text-accent"
          >
            Home
          </Link>
          <Link
            href="/resources"
            className="text-sm text-muted transition-colors hover:text-accent"
          >
            Resources
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {user && (
            <Link
              href="/resources/new"
              className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
            >
              Add Resource
            </Link>
          )}

          {loading ? (
            <span className="text-sm text-muted">...</span>
          ) : user ? (
            <>
              <span className="hidden text-sm text-muted sm:inline">
                {user.fName} {user.lName}
              </span>
              <button
                onClick={handleLogout}
                className="rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-background"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-background"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
