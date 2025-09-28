"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronDown, BookOpen, Plus, Upload, FolderOpen, Eye } from "lucide-react";

export default function NavigationDropdown() {
  const [isOpen, setIsOpen] = useState(false);

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

  return (
    <div className="relative">
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 hover:bg-gray-100"
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
          <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border z-20">
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Navigation
              </h3>
              <div className="space-y-2">
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <div className="text-gray-400 group-hover:text-blue-600 transition-colors">
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {item.description}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
