"use client";

import { Bell, LogOut, Menu, Settings, User, Flame } from "lucide-react";
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
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { HowToEarnStreakDialog } from "./streak/HowToEarnStreakDialog";
import { useGetUserStreakQuery } from "../../redux/features/userStats/userStatisticsApi";
import { Button } from "@/components/ui/button";
import { useLogOutQuery } from "../../redux/features/auth/authApi";
import { useState } from "react";

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
  const [logout, setLogout] = useState(false);

  const {
    data: logoutData,
    isLoading: logoutIsLoading,
    error: logoutError,
  } = useLogOutQuery(undefined, { skip: !logout });

  const { data: streakData } = useGetUserStreakQuery({});
  const currentStreak = streakData?.streak?.find((streak: any) => streak.isActive)?.streakLength || 0;

  // Get streak days for the current week
  const getStreakDaysForWeek = () => {
    if (!streakData?.streak) return Array(7).fill(false);
    
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Start from Sunday
    
    return streakData.streak.flatMap((streak: any) => {
      const startDate = new Date(streak.startDate);
      const endDate = streak.endDate ? new Date(streak.endDate) : new Date();
      
      const days = Array(7).fill(false);
      const currentDate = new Date(startDate);
      
      while (currentDate <= endDate) {
        const dayIndex = currentDate.getDay();
        if (currentDate >= startOfWeek && currentDate <= today) {
          days[dayIndex] = true;
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      return days;
    });
  };

  const streakDays = getStreakDaysForWeek();

  const handleToggleSidebar = () => {
    dispatch(toggleSidebar());
  };
  const logOutHandler = async () => {
    // await signOut();
    setLogout(true);
  };
  const handleLogout = () => {
    // TODO: Implement logout functionality
    logOutHandler();
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

            <Link href="/" className="flex items-center">
              <Image
                src="/fusion-logo.svg"
                alt="QuizLearn Logo"
                width={32}
                height={32}
                className="w-8 h-8"
              />
              <span className="ml-2 text-xl font-semibold text-gray-900 dark:text-white">QuizLearn</span>
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
            <HoverCard>
              <HoverCardTrigger asChild>
                <button className="relative p-2 text-foreground hover:bg-muted rounded-full">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-background" />
                </button>
              </HoverCardTrigger>
              <HoverCardContent className="w-80 rounded-xl shadow-md p-4 border">
                <div className="text-xl font-bold text-gray-900">
                  Notifications
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  You have new notifications.
                </p>
                <div className="flex flex-col gap-2">
                  {/* Example notifications */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      New comment on your post
                    </span>
                    <span className="text-xs text-gray-500">1 min ago</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Your task is due soon
                    </span>
                    <span className="text-xs text-gray-500">10 min ago</span>
                  </div>
                  {/* Add more notifications here */}
                </div>
                <Button
                  variant="outline"
                  className="text-xs px-3 py-1 rounded-full mt-4"
                >
                  View All Notifications
                </Button>
              </HoverCardContent>
            </HoverCard>
            <HoverCard>
              <HoverCardTrigger asChild>
                <div className="flex items-center gap-1 cursor-pointer">
                  <Flame className="text-orange-500 w-5 h-5" />
                  <span className="font-semibold text-orange-600">{currentStreak}</span>
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="w-80 rounded-xl shadow-md p-4 border">
                <div className="flex items-center gap-2 mb-2">
                  <Flame className="text-orange-500 w-6 h-6" />
                  <span className="text-xl font-bold text-orange-600">{currentStreak}</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Great job! Come back tomorrow to continue your streak!
                </p>
                <div className="flex justify-between mb-3">
                  {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
                    <div key={index} className="flex flex-col items-center">
                      {streakDays[index] ? (
                        <Flame className="text-orange-500 w-4 h-4 mb-1" />
                      ) : (
                        <div className="w-4 h-4 mb-1" />
                      )}
                      <span className="text-xs text-gray-500">{day}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between">
                  <HowToEarnStreakDialog>
                    <Button
                      variant="outline"
                      className="text-xs px-3 py-1 rounded-full"
                    >
                      How to earn a streak
                    </Button>
                  </HowToEarnStreakDialog>
                  <Button 
                    className="text-xs px-3 py-1 rounded-full"
                    onClick={() => router.push("/streak")}
                  >
                    View Calendar
                  </Button>
                </div>
              </HoverCardContent>
            </HoverCard>
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
                <DropdownMenuItem onClick={() => router.push("/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/settings")}>
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
