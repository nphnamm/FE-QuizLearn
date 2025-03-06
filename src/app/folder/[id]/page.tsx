"use client";

import { use, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DonutChart } from "@/components/charts/DonutChart";
import { LineChart } from "@/components/charts/LineChart";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { CampaignTable } from "@/components/dashboard/CampaignTable";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Bell, Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Protected from "@/hooks/useProtected";
import { Folder, MoreHorizontal, Filter } from "lucide-react";
import { useParams } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
const navigationItems = [
  { name: "Dashboard", href: "/dashboard", current: true },
  { name: "Project", href: "/project", current: false },
  { name: "Clients", href: "/clients", current: false },
  { name: "Quotes", href: "/quotes", current: false },
  { name: "Meeting Schedule", href: "/meetings", current: false },
  { name: "Notes", href: "/notes", current: false },
];
const mockData = [
  {
    id: "1",
    name: "Ielts",
    icon: <div className="w-3 h-3 rounded-full bg-blue-500"></div>,
  },
  {
    id: "2",
    name: "Ielts 2",
    icon: <div className="w-3 h-3 rounded-full bg-blue-500"></div>,
  },
];

interface DashboardPageProps {
  params: { id: string };
}

export default function DashboardPage() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const params = useParams();
  const id = params.id;
  console.log(id, "id");
  const [sets, setSets] = useState<any>([]);
  useEffect(() => {
    const foundItem = mockData.find((item: any) => item.id == id);
    if (foundItem) {
      setSets([foundItem]); // Chuyển thành mảng để tránh lỗi .map()
    } else {
      setSets([]); // Nếu không tìm thấy, đặt là mảng rỗng để tránh lỗi
    }
  }, [id]);
  const handleCreateSet = () => {
    router.push(`/create-set?folderId=${id}`);
  }
  return (
    <Protected>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header
          className={cn(
            "bg-white border-b border-gray-200 fixed top-0 right-0 z-40 transition-all duration-300",
            isSidebarOpen ? "left-64" : "left-20"
          )}
        >
          <div className="px-6">
            <div className="flex h-16 items-center justify-between">
              {/* Left side with logo and navigation */}
              <div className="flex items-center gap-8">
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
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
                          ? "bg-[#1a1a1a] text-white"
                          : "text-gray-600 hover:text-gray-900"
                      )}
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Right side icons and profile */}
              <div className="flex items-center gap-4">
                <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
                </button>
                <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full">
                  <Settings className="w-5 h-5" />
                </button>
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <Image
                    src="/avatar-placeholder.svg"
                    alt="User"
                    width={32}
                    height={32}
                    className="w-full h-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        {/* Main Content */}
        <div
          className={cn(
            "transition-all duration-300 pt-16",
            isSidebarOpen ? "pl-64" : "pl-20"
          )}
        >
          <div className="dark:bg-[#1a1a1a] bg-[#f4f4f4] text-white min-h-screen">
            <div className="max-w-[1400px] mx-auto p-8 space-y-8">
              {/* Dashboard Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h1 className="text-2xl font-semibold text-gray-600">
                    Folders
                  </h1>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-[#2a2a2a] rounded-lg px-4 py-2 text-sm text-gray-300">
                    30 days Oct 16/21 - Nov 14/21
                  </div>
                </div>
              </div>

              {/* Top Row */}
              <div className="p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <Button variant="outline" className="flex items-center gap-2" onClick={handleCreateSet}>
                    <span className="text-gray-600">+ Create new</span>
                  </Button>

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon">
                      <span className="sr-only">Select multiple</span>
                      <Folder className="h-4 w-4 text-gray-600" />
                    </Button>

                    <div className="flex items-center">
                      <span className="mr-2 text-gray-600">Last Updated</span>
                      <Button variant="ghost" size="icon">
                        ↓
                      </Button>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="text-gray-600">
                          See saved or trash
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>Saved</DropdownMenuItem>
                        <DropdownMenuItem>Trash</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  {sets?.map((set: any, index: number) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-2 hover:bg-gray-100 rounded-md bg-teal-600 hover:bg-teal-500 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        {set.icon}
                        <span>{set.name}</span>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>Rename</DropdownMenuItem>
                          <DropdownMenuItem>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))}
                </div>

                <div className="fixed bottom-4 right-4">
                  <Button variant="destructive">Remove ads</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Protected>
  );
}
