import type { Metadata } from "next";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { House } from "lucide-react";
import Link from "next/link";
import ClientSessionProvider from "./components/ClientSessionProvider";
import AuthButton from "./components/AuthButton";
import NavigationDropdown from "./components/NavigationDropdown";

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
        <ClientSessionProvider>
          <div className="min-h-screen flex flex-col">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-light-gray">
              <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                  <House className="w-6 h-6 text-orange" />
                  <span className="font-bold text-xl text-dark-blue">Quiz My Brain</span>
                </Link>
                <div className="flex items-center gap-4">
                  <NavigationDropdown />
                  <AuthButton />
                </div>
              </div>
            </header>
            
            {/* Main Content */}
            <main className="flex-1">
              {children}
            </main>
          </div>
        </ClientSessionProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
