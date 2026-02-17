"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  label: string;
  href: string;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Group Interview Scheduler", href: "/" },
  // Add more projects here as needed
];

export function SiteHeader() {
  const pathname = usePathname();
  const isScheduler = pathname === "/" || pathname.startsWith("/availability") || pathname.startsWith("/schedule");

  return (
    <header className="border-b border-[#e0dcd5] bg-white">
      <nav className="mx-auto flex h-14 max-w-6xl items-center gap-8 px-4 sm:px-6">
        <Link
          href="/"
          className="font-headline text-lg font-semibold text-[#353535] transition-colors hover:text-[#FA951B]"
        >
          BusinessOne
        </Link>
        <ul className="flex items-center gap-6">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/"
                ? isScheduler
                : pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`font-body text-sm transition-colors ${
                    isActive
                      ? "font-semibold text-[#353535]"
                      : "text-[#353535]/70 hover:text-[#353535]"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
