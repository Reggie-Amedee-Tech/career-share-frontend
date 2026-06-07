"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

function MenuIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
      </svg>
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M4 6h16" />
      <path d="M4 12h16" />
      <path d="M4 18h16" />
    </svg>
  );
}

export default function NavBar() {
  const { user, loading, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    setMenuOpen(false);
    await logout();
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  const navLinkClass =
    "text-sm text-muted transition-colors hover:text-accent";
  const buttonClass =
    "rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-background";
  const primaryButtonClass =
    "rounded-full bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover";

  return (
    <nav className="border-b border-border bg-surface shadow-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-foreground"
          onClick={closeMenu}
        >
          Career Share
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <Link href="/" className={navLinkClass}>
            Home
          </Link>
          <Link href="/resources" className={navLinkClass}>
            Resources
          </Link>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {user && (
            <Link href="/resources/new" className={primaryButtonClass}>
              Add Resource
            </Link>
          )}

          {loading ? (
            <span className="text-sm text-muted">...</span>
          ) : user ? (
            <>
              <button onClick={handleLogout} className={buttonClass}>
                Sign Out
              </button>
              <span className="text-sm text-muted">
                {user.fName} {user.lName}
              </span>
            </>
          ) : (
            <>
              <Link href="/login" className={buttonClass}>
                Sign In
              </Link>
              <Link href="/signup" className={primaryButtonClass}>
                Sign Up
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="inline-flex items-center justify-center rounded-lg border border-border p-2 text-foreground transition-colors hover:bg-background md:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          <MenuIcon open={menuOpen} />
        </button>
      </div>

      {menuOpen && (
        <div
          id="mobile-nav-menu"
          className="border-t border-border md:hidden"
        >
          <div className="flex flex-col gap-1 px-4 py-4 sm:px-6">
            <Link
              href="/"
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-background"
              onClick={closeMenu}
            >
              Home
            </Link>
            <Link
              href="/resources"
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-background"
              onClick={closeMenu}
            >
              Resources
            </Link>

            <div className="my-2 border-t border-border" />

            {loading ? (
              <span className="px-3 py-2 text-sm text-muted">...</span>
            ) : user ? (
              <>
                <Link
                  href="/resources/new"
                  className={`${primaryButtonClass} text-center`}
                  onClick={closeMenu}
                >
                  Add Resource
                </Link>
                <button
                  onClick={handleLogout}
                  className={`${buttonClass} w-full`}
                >
                  Sign Out
                </button>
                <p className="px-3 py-1 text-sm text-muted">
                  {user.fName} {user.lName}
                </p>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/login"
                  className={`${buttonClass} text-center`}
                  onClick={closeMenu}
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className={`${primaryButtonClass} text-center`}
                  onClick={closeMenu}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
