"use client";

import Link from "next/link";
import { SiteHeader } from "./SiteHeader";

type AppHeaderProps = {
  backHref?: string;
  backLabel?: string;
  rightContent?: React.ReactNode;
};

export function AppHeader({
  backHref = "/",
  backLabel = "Back",
  rightContent,
}: AppHeaderProps) {
  return (
    <>
      <SiteHeader />
      <div className="border-b border-[#e0dcd5] bg-white/95">
        <div className="mx-auto flex h-11 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link
            href={backHref}
            className="flex items-center gap-2 font-body text-sm font-medium text-[#353535]/70 transition-colors hover:text-[#FA951B]"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            {backLabel}
          </Link>
          {rightContent ? (
            <div className="min-w-[80px]">{rightContent}</div>
          ) : (
            <div className="min-w-[80px]" />
          )}
        </div>
      </div>
    </>
  );
}
