"use client";

import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AuthButton() {
  const { data: session, status } = useSession();

  // Helper function to get user initials
  const getUserInitials = (name?: string | null, email?: string | null) => {
    if (name) {
      return name.substring(0, 2).toUpperCase();
    }
    if (email) {
      return email.substring(0, 2).toUpperCase();
    }
    return "U";
  };

  if (status === "loading") {
    return <div className="w-20 h-8 bg-gray-200 animate-pulse rounded"></div>;
  }

  if (session) {
    const userInitials = getUserInitials(session.user?.name, session.user?.email);
    
    return (
      <div className="flex items-center gap-3">
        <Link href="/my-dashboard">
          <Button variant="ghost" size="sm">
            My Dashboard
          </Button>
        </Link>
        
        {/* User Badge */}
        <div className="w-8 h-8 bg-orange text-white rounded-full flex items-center justify-center text-sm font-semibold shadow-md">
          {userInitials}
        </div>
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
