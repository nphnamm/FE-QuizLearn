"use client";

import { Bell, Menu, Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";
import { useSidebar } from "@/providers/sidebar-provider";

const navigationItems = [
  { name: "Dashboard", href: "/dashboard", current: true },
  { name: "Project", href: "/project", current: false },
  { name: "Clients", href: "/clients", current: false },
  { name: "Quotes", href: "/quotes", current: false },
  { name: "Meeting Schedule", href: "/meetings", current: false },
  { name: "Notes", href: "/notes", current: false },
];

export function Header() {
  const { toggleSidebar } = useSidebar();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-[#1a1a1a] text-white">
      <div className="container flex h-16 items-center justify-between">
        {/* Left side with logo and navigation */}
        <div className="flex items-center gap-8">
          <button
            onClick={toggleSidebar}
            className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-full"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          <Link href="/dashboard" className="flex items-center gap-2">
            <Image
              src="/fusion-logo.svg"
              alt="Fusion"
              width={24}
              height={24}
              className="w-6 h-6"
            />
            <span className="text-lg font-semibold">Fusion</span>
          </Link>
          <nav className="flex items-center gap-6">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-sm font-medium px-4 py-1.5 rounded-full transition-colors",
                  item.current
                    ? "bg-white text-black"
                    : "text-gray-300 hover:text-white"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right side icons and profile */}
        <div className="flex items-center gap-4">
          <button className="relative p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-full">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-[#1a1a1a]" />
          </button>
          <button className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-full">
            <Settings className="w-5 h-5" />
          </button>
          <ThemeToggle />
          <div className="w-8 h-8 rounded-full overflow-hidden">
            <Image
              src="/avatar-placeholder.svg"
              alt="User"
              width={32}
              height={32}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
