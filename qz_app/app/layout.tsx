import type { Metadata } from "next";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { House } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ClientSessionProvider from "./components/ClientSessionProvider";

export const metadata: Metadata = {
  title: "Quiz My Brain",
  description: '"Quiz My Brain", is a quiz app that allows you to create and take quizzes.',
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClientSessionProvider>{children}</ClientSessionProvider>
        <SpeedInsights />
        <div className="fixed bottom-2 left-2">
          <Link href="/">
            <Button variant="secondary">
              <House />
            </Button>
          </Link>
        </div>
      </body>
    </html>
  );
}
