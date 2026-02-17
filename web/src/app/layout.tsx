import type { Metadata } from "next";
import { League_Spartan, Montserrat, Roboto_Condensed } from "next/font/google";
import "./globals.css";
import { SchedulerProvider } from "@/lib/store/schedulerStore";

const leagueSpartan = League_Spartan({
  variable: "--font-headline",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const robotoCondensed = Roboto_Condensed({
  variable: "--font-subheadline",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "BusinessOne Internal Tools",
  description: "Internal tools for BusinessOne Consulting.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${leagueSpartan.variable} ${montserrat.variable} ${robotoCondensed.variable} antialiased`}
      >
        <SchedulerProvider>{children}</SchedulerProvider>
      </body>
    </html>
  );
}
