"use client";

import { Bell, LogOut, Menu, Settings, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/store";
import { toggleSidebar } from "../../redux/features/layout/layoutSlice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

const navigationItems = [
  { name: "Dashboard", href: "/dashboard", current: true },
  { name: "Project", href: "/project", current: false },
  { name: "Clients", href: "/clients", current: false },
  { name: "Quotes", href: "/quotes", current: false },
  { name: "Meeting Schedule", href: "/meetings", current: false },
  { name: "Notes", href: "/notes", current: false },
];

export function Header() {
  const dispatch = useDispatch();
  const { isSidebarOpen } = useSelector((state: RootState) => state.layout);
  const router = useRouter();

  const handleToggleSidebar = () => {
    dispatch(toggleSidebar());
  };

  const handleLogout = () => {
    // TODO: Implement logout functionality
    console.log("Logging out...");
  };

  return (
    <header
      className={cn(
        "bg-white dark:bg-background border-b border-gray-200 fixed top-0 right-0 z-40 transition-all duration-300",
        isSidebarOpen ? "left-64" : "left-20"
      )}
    >
      <div className="px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Left side with logo and navigation */}
          <div className="flex items-center gap-8">
            <button
              onClick={handleToggleSidebar}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isSidebarOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
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
                      ? "bg-[#1a1a1a] dark:bg-white text-white dark:text-black"
                      : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right side icons and profile */}

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-foreground hover:bg-muted rounded-full">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-background" />
            </button>

            {/* User avatar dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-9 h-9 rounded-full overflow-hidden border-2 border-muted hover:border-primary focus:outline-none focus:border-primary transition-colors">
                  <Image
                    src="/avatar-placeholder.svg"
                    alt="User"
                    width={36}
                    height={36}
                    className="w-full h-full object-cover"
                  />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <div className="px-2 py-1.5">
                  <ThemeToggle />
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>

  );
}
