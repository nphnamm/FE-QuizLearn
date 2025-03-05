"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import type { RootState, AppDispatch } from "@/store/store";
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
import { fetchMeRequest } from "@/store/features/auth/authSlice";

const navigationItems = [
  { name: "Dashboard", href: "/dashboard", current: true },
  { name: "Project", href: "/project", current: false },
  { name: "Clients", href: "/clients", current: false },
  { name: "Quotes", href: "/quotes", current: false },
  { name: "Meeting Schedule", href: "/meetings", current: false },
  { name: "Notes", href: "/notes", current: false },
];

export default function DashboardPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { isAuthenticated, accessToken, refreshToken, user } = useSelector(
    (state: RootState) => state.login
  );
  console.log(accessToken);
  console.log(refreshToken);
  console.log(user);
  console.log(isAuthenticated);
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
    dispatch(fetchMeRequest());
  }, []);
  return (
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
        <div className="bg-[#1a1a1a] text-white min-h-screen">
          <div className="max-w-[1400px] mx-auto p-8 space-y-8">
            {/* Dashboard Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-semibold">Overview</h1>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-[#2a2a2a] rounded-lg px-4 py-2 text-sm text-gray-300">
                  30 days Oct 16/21 - Nov 14/21
                </div>
              </div>
            </div>

            {/* Top Row */}
            <div className="grid grid-cols-3 gap-8">
              {/* Summary Card */}
              <Card className="bg-[#2a2a2a]/50 backdrop-blur p-6">
                <h2 className="text-xl font-medium mb-4">Summary</h2>
                <div className="space-y-3">
                  {["Overview", "Campaigns", "Ad Group", "Keywords"].map(
                    (item) => (
                      <div
                        key={item}
                        className="flex items-center justify-between bg-[#3a3a3a]/50 p-3 rounded-lg"
                      >
                        <span className="text-gray-300">{item}</span>
                        <span>1,552</span>
                      </div>
                    )
                  )}
                </div>
              </Card>

              {/* Top 5 Products Card */}
              <Card className="bg-[#2a2a2a]/50 backdrop-blur p-6">
                <h2 className="text-xl font-medium mb-4">
                  Top 5 products by spend
                </h2>
                <div className="relative h-[200px]">
                  <DonutChart
                    data={[
                      { value: 60, color: "#4ade80" },
                      { value: 25, color: "#fbbf24" },
                      { value: 15, color: "#f87171" },
                    ]}
                    total={2985}
                  />
                </div>
              </Card>

              {/* Highest ACoS Campaigns */}
              <Card className="bg-[#2a2a2a]/50 backdrop-blur p-6">
                <h2 className="text-xl font-medium mb-4">
                  Highest ACoS campaigns
                </h2>
                <CampaignTable />
              </Card>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-6 gap-4">
              <MetricCard
                title="Orders Created"
                value="$134,970"
                change={12.49}
                trend="up"
              />
              <MetricCard
                title="Total Sales"
                value="$2,145,132.80"
                change={-4.95}
                trend="down"
              />
              <MetricCard
                title="PPC Sales"
                value="$890.00"
                change={6.07}
                trend="up"
              />
              <MetricCard
                title="Units Sales"
                value="151,740"
                change={0}
                trend="neutral"
              />
              <MetricCard
                title="Organic Sales Rate"
                value="100.00%"
                change={0.12}
                trend="up"
              />
              <MetricCard
                title="Refunds"
                value="-$134"
                change={0}
                trend="neutral"
              />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-2 gap-8">
              <Card className="bg-[#2a2a2a]/50 backdrop-blur p-6">
                <h2 className="text-xl font-medium mb-4">Costs</h2>
                <div className="h-[200px]">
                  <LineChart data={[4, 6, 5, 7, 5, 8, 6, 4]} color="#4ade80" />
                </div>
              </Card>
              <Card className="bg-[#2a2a2a]/50 backdrop-blur p-6">
                <h2 className="text-xl font-medium mb-4">ACoS vs TACoS</h2>
                <div className="h-[200px]">
                  <LineChart data={[5, 7, 6, 8, 7, 9, 8, 6]} color="#fbbf24" />
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
