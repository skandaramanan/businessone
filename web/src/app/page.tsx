import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
      <path d="M8 14h.01" />
      <path d="M12 14h.01" />
      <path d="M16 14h.01" />
      <path d="M8 18h.01" />
      <path d="M12 18h.01" />
      <path d="M16 18h.01" />
    </svg>
  );
}

function UserPlusIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <line x1="19" x2="19" y1="8" y2="14" />
      <line x1="22" x2="16" y1="11" y2="11" />
    </svg>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="font-subheadline text-sm uppercase tracking-wider text-[#353535]/70">
          Purpose
        </p>
        <p className="mt-3 max-w-2xl font-body text-base leading-relaxed text-[#353535] sm:text-lg">
          Coordinate two interviewer availability for group interviews, manage slots in a weekly grid, and book candidates into shared time blocks.
        </p>

        {/* Action cards */}
        <section className="mt-12 grid gap-5 sm:grid-cols-2">
          <Link
            href="/availability"
            className="group relative overflow-hidden rounded-2xl border border-[#e0dcd5] bg-white p-8 shadow-sm transition-all duration-200 hover:border-[#FA951B]/40 hover:shadow-md"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFBD59]/20 text-[#FA951B] transition-colors group-hover:bg-[#FA951B]/30">
              <CalendarIcon className="h-6 w-6" />
            </div>
            <h2 className="mt-5 font-headline text-xl font-semibold text-[#353535]">
              Add My Availability
            </h2>
            <p className="mt-2 font-body text-sm leading-relaxed text-[#353535]/80">
              Drag across the weekly grid to mark when you&apos;re free for interviews.
            </p>
            <span className="mt-4 inline-flex items-center font-body text-sm font-medium text-[#353535] group-hover:text-[#FA951B]">
              Open availability grid
              <svg
                className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </span>
          </Link>

          <Link
            href="/schedule"
            className="group relative overflow-hidden rounded-2xl border border-[#e0dcd5] bg-white p-8 shadow-sm transition-all duration-200 hover:border-[#FA951B]/40 hover:shadow-md"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFBD59]/20 text-[#FA951B] transition-colors group-hover:bg-[#FA951B]/30">
              <UserPlusIcon className="h-6 w-6" />
            </div>
            <h2 className="mt-5 font-headline text-xl font-semibold text-[#353535]">
              Schedule a Candidate
            </h2>
            <p className="mt-2 font-body text-sm leading-relaxed text-[#353535]/80">
              Pick two interviewers and view shared slots to book in one click.
            </p>
            <span className="mt-4 inline-flex items-center font-body text-sm font-medium text-[#353535] group-hover:text-[#FA951B]">
              Open scheduler
              <svg
                className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </span>
          </Link>
        </section>

        <p className="mt-12 text-center font-body text-sm text-[#353535]/60">
          Use availability to set your free slots, then schedule to find overlaps and book.
        </p>
      </main>
    </div>
  );
}
