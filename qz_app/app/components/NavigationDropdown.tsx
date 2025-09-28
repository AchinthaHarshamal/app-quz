"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronDown, BookOpen, Plus, Upload, FolderOpen, Eye, LogOut } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

export default function NavigationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();

  const navigationItems = [
    {
      title: "Browse Quizzes",
      href: "/quiz",
      icon: <Eye className="w-4 h-4" />,
      description: "Explore all available quizzes"
    },
    {
      title: "Create Quiz",
      href: "/new/create",
      icon: <Plus className="w-4 h-4" />,
      description: "Create a new quiz from scratch"
    },
    {
      title: "Upload Quiz",
      href: "/new/upload-csv",
      icon: <Upload className="w-4 h-4" />,
      description: "Upload your quiz data as CSV"
    },
    {
      title: "My Dashboard",
      href: "/my-dashboard",
      icon: <FolderOpen className="w-4 h-4" />,
      description: "Manage quizzes and collections"
    }
  ];

  const handleSignOut = () => {
    setIsOpen(false);
    signOut();
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 hover:bg-orange/10 text-dark-blue hover:text-orange"
      >
        <BookOpen className="w-4 h-4" />
        Menu
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown Menu */}
          <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-light-gray z-20">
            <div className="p-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Navigation
              </h3>
              <div className="space-y-2">
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-orange/10 transition-colors group"
                  >
                    <div className="text-muted-foreground group-hover:text-orange transition-colors">
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-dark-blue group-hover:text-orange transition-colors">
                        {item.title}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {item.description}
                      </div>
                    </div>
                  </Link>
                ))}
                
                {/* Sign Out Button - Only show if user is logged in */}
                {session && (
                  <div className="border-t border-light-gray pt-3 mt-3">
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors group w-full text-left"
                    >
                      <div className="text-muted-foreground group-hover:text-red-600 transition-colors">
                        <LogOut className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-dark-blue group-hover:text-red-600 transition-colors">
                          Sign Out
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          End your current session
                        </div>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
