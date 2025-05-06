"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import Link from "next/link";
import { cn, formatDate } from "@/lib/utils";
import Protected from "@/hooks/useProtected";
import { Bell, Settings, ChevronLeft, ChevronRight, ChevronUp } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { PageLayout } from "@/components/layout/PageLayout";
import { useSelector } from "react-redux";
import { useGetRecentSetsQuery, useGetStudyingSetsQuery } from "../../../redux/features/userStats/userStatisticsApi";

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
  const [activeTab, setActiveTab] = useState("studying");
  const { user } = useSelector((state: any) => state.auth);
  const { data: studyingSets, isLoading: isStudyingSetsLoading, isError: isStudyingSetsError } = useGetStudyingSetsQuery({});
  const { data: recentSets, isLoading: isRecentSetsLoading, isError: isRecentSetsError } = useGetRecentSetsQuery({});

  const percentToNextLevel = user.experiencePoints / user.expToNextLevel * 100;

  console.log('user', user);
  console.log('recentSets', recentSets);
  console.log('studyingSets', studyingSets);

  // Mock data for the study lists
  const studyLists = [
    { id: 26, title: "List 26", studiedTime: "7 minutes ago" },
    { id: 25, title: "List 25", studiedTime: "13 minutes ago" },
    { id: 24, title: "List 24", studiedTime: "20 hours ago" },
    { id: 23, title: "List 23", studiedTime: "3 days ago" },
  ];

  // Calendar state and functions
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  // Current month and year
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
  const currentYear = currentDate.getFullYear();
  const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];

  // Mock data for highlighted dates in the calendar (dates with study sessions)
  const highlightedDates = [3, 7, 10, 12, 14, 15];

  // Get days in current month and first day of month
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = getFirstDayOfMonth(year, month);

  // Calendar days array
  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Previous and next month navigation
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDate(null);
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDate(null);
  };

  // Select a date
  const handleDateSelect = (day: number) => {
    setSelectedDate(day);
    // Here you would typically fetch study data for this date
    console.log(`Selected date: ${currentMonth} ${day}, ${currentYear}`);
  };

  return (
    <Protected>
      <PageLayout>
        <div className="dark:bg-background bg-gray-50 min-h-screen py-8">
          <div className=" mx-auto px-6">
            {/* Widgets Section */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Widgets</h2>
                <Button variant="ghost" size="sm">
                  <ChevronUp className="h-5 w-5" />
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-6">
                {/* Left Column - Study Lists */}
                <Card className="p-6 col-span-1">
                  <Tabs defaultValue="studying" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                      <TabsTrigger value="studying">Studying</TabsTrigger>
                      <TabsTrigger value="recent">Recent</TabsTrigger>
                    </TabsList>

                    <TabsContent value="studying" className="space-y-4">
                      {studyingSets?.studyingSets?.map((list: any) => (
                        <div key={list.id} className="flex items-center justify-between border-b pb-4">
                          <div className="flex items-center gap-3">
                            <div className="bg-gray-100 p-2 rounded">
                              <svg className="h-5 w-5 text-gray-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
                                <path d="M8 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                <path d="M8 14H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                              </svg>
                            </div>
                            <div>
                              <h3 className="font-medium">{list.set.title}</h3>
                              <p className="text-sm text-gray-500">Studied {formatDate(list.createdAt)}</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" className="rounded-full">
                            Resume
                          </Button>
                        </div>
                      ))}
                    </TabsContent>

                    <TabsContent value="recent">
                      {recentSets?.recentSets?.map((list: any) => (
                        <div key={list.id} className="flex items-center justify-between border-b pb-4">
                          <div className="flex items-center gap-3">
                            <div className="bg-gray-100 p-2 rounded">
                              <svg className="h-5 w-5 text-gray-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
                                <path d="M8 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                <path d="M8 14H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                              </svg>
                            </div>
                            <div>
                              <h3 className="font-medium">{list?.set?.title}</h3>
                              <p className="text-sm text-gray-500">Studied {formatDate(list.createdAt)} </p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" className="rounded-full">
                            Learn again
                          </Button>
                        </div>
                      ))}                    </TabsContent>
                  </Tabs>
                </Card>

                {/* Middle Column - Calendar */}
                <Card className="p-6 col-span-1">
                  <div className="flex items-center justify-between mb-6">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={goToPreviousMonth}
                      className="hover:bg-gray-100"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>

                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{currentMonth} {currentYear}</h3>
                      <div className="flex items-center text-orange-500">
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                        </svg>
                        <span>2</span>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={goToNextMonth}
                      className="hover:bg-gray-100"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>

                  {/* Calendar grid header */}
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {daysOfWeek.map((day) => (
                      <div key={day} className="text-center text-sm font-medium">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Calendar days */}
                  <div className="grid grid-cols-7 gap-1">
                    {/* Empty cells for days before month start */}
                    {Array.from({ length: firstDayOfMonth }).map((_, index) => (
                      <div key={`empty-${index}`} className="aspect-square"></div>
                    ))}

                    {calendarDays.map((day) => {
                      const isHighlighted = highlightedDates.includes(day);
                      const isSelected = selectedDate === day;
                      const isToday = new Date().getDate() === day &&
                        new Date().getMonth() === month &&
                        new Date().getFullYear() === year;

                      return (
                        <div
                          key={day}
                          onClick={() => handleDateSelect(day)}
                          className={cn(
                            "aspect-square flex items-center justify-center text-sm rounded-full cursor-pointer transition-colors",
                            isHighlighted && !isSelected && !isToday && "bg-orange-100 text-orange-500",
                            isToday && !isSelected && "bg-orange-500 text-white",
                            isSelected && "bg-blue-500 text-white ring-2 ring-blue-300",
                            !isHighlighted && !isSelected && !isToday && "hover:bg-gray-100"
                          )}
                        >
                          {day}
                        </div>
                      );
                    })}
                  </div>
                </Card>

                {/* Right Column - User Profile */}
                <Card className="p-6 col-span-1">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
                      <Image
                        src="/avatar-placeholder.svg"
                        alt="User profile"
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <h3 className="text-lg font-bold mb-1">{user.username}</h3>
                    <p className="text-sm text-gray-500 mb-4">{user.email} | Joined {formatDate(user.createdAt)}</p>

                    <div className="w-full mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">Level {user.level}</h4>
                        <div className="flex items-center gap-1 bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
                          <span className="text-xs">{user.level + 1}</span>
                        </div>
                      </div>

                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${percentToNextLevel}%` }}></div>
                      </div>

                      <p className="text-sm text-gray-500 mt-1">{user.experiencePoints}/{user.expToNextLevel} XP</p>
                    </div>

                    <Button variant="outline" className="w-full">View badges</Button>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
    </Protected>
  );
}
