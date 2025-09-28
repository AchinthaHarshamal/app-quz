"use client";

import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";

export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="w-20 h-8 bg-gray-200 animate-pulse rounded"></div>;
  }

  if (session) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/my-dashboard">
          <Button variant="ghost" size="sm">
            My Dashboard
          </Button>
        </Link>
        <span className="text-sm text-gray-600">
          {session.user?.name || session.user?.email}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => signOut()}
          className="flex items-center gap-1"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link href="/auth/login">
        <Button variant="outline" size="sm">
          Sign In
        </Button>
      </Link>
      <Link href="/auth/signup">
        <Button size="sm">
          Sign Up
        </Button>
      </Link>
    </div>
  );
}
