"use client";

import { useState, useEffect } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetUserStreakQuery } from "../../../redux/features/userStats/userStatisticsApi";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

export default function StreakPage() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [filterYear, setFilterYear] = useState(new Date().getFullYear().toString());
    const [filterMonth, setFilterMonth] = useState(new Date().getMonth().toString());

    const { data: streakData, isLoading } = useGetUserStreakQuery({});

    // When filter changes, update the calendar's displayed month
    useEffect(() => {
        setDate(new Date(Number(filterYear), Number(filterMonth), 1));
    }, [filterYear, filterMonth]);

    // Get streak days for the selected month
    const getStreakDaysForMonth = (month: number, year: number) => {
        if (!streakData?.streak) return [];
        return streakData.streak.flatMap((streak: any) => {
            const startDate = new Date(streak.startDate);
            const endDate = streak.endDate ? new Date(streak.endDate) : new Date();
            const days = [];
            const currentDate = new Date(startDate);
            while (currentDate <= endDate) {
                if (currentDate.getMonth() === month && currentDate.getFullYear() === year) {
                    days.push(currentDate.getDate());
                }
                currentDate.setDate(currentDate.getDate() + 1);
            }
            return days;
        });
    };

    // Generate year options (last 5 years to next 5 years)
    const yearOptions = Array.from({ length: 11 }, (_, i) => {
        const year = new Date().getFullYear() - 5 + i;
        return year.toString();
    });

    // Generate month options
    const monthOptions = Array.from({ length: 12 }, (_, i) => {
        const date = new Date(2000, i, 1);
        return {
            value: i.toString(),
            label: date.toLocaleString('default', { month: 'long' })
        };
    });

    // Get streak days for the current month
    const currentStreakDays = date ? getStreakDaysForMonth(date.getMonth(), date.getFullYear()) : [];

    return (
        <PageLayout>
            <div className="container mx-auto py-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between w-full">
                        <CardTitle className="flex items-center gap-2">
                            <Flame className="text-orange-500" />
                            Streak Calendar
                        </CardTitle>
                        <div className="flex items-center gap-2 text-orange-500 font-medium">
                            <Flame className="h-5 w-5" />
                            {currentStreakDays.length} days this month
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="w-full md:w-auto">
                            <div className="flex gap-2 mb-4">
                                <Select value={filterYear} onValueChange={setFilterYear}>
                                    <SelectTrigger className="w-[120px]">
                                        <SelectValue placeholder="Select year" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {yearOptions.map((year) => (
                                            <SelectItem key={year} value={year}>
                                                {year}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Select value={filterMonth} onValueChange={setFilterMonth}>
                                    <SelectTrigger className="w-[140px]">
                                        <SelectValue placeholder="Select month" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {monthOptions.map((month) => (
                                            <SelectItem key={month.value} value={month.value}>
                                                {month.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                month={date}
                                onMonthChange={setDate}
                                className=""
                                modifiers={{
                                    streak: (d: Date) => {
                                        const day = d.getDate();
                                        const month = d.getMonth();
                                        const year = d.getFullYear();
                                        return getStreakDaysForMonth(month, year).includes(day);
                                    }
                                }}
                                modifiersStyles={{
                                    streak: {
                                        backgroundColor: "rgb(255 237 213)",
                                        color: "rgb(249 115 22)",
                                        fontWeight: "500",
    

                                    }
                                }}
                                fixedWeeks
                                weekStartsOn={1}
                            />

                        </div>

                    </CardContent>
                </Card>

            </div>

        </PageLayout>
    );
} 