"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";
import Link from "next/link";
import { Clipboard, Share2 } from "lucide-react";
import { useState } from "react";
import Protected from "@/hooks/useProtected";
import { cn } from "@/lib/utils";
import { PageLayout } from "@/components/layout/PageLayout";

export default function ProfilePage() {
    const [copied, setCopied] = useState(false);
    const user = {
        name: "Nguyễn Nam Hoài Phan",
        username: "phnam",
        avatar: "/avatar-placeholder.svg",
        level: 23,
        xp: 182,
        xpMax: 650,
        followers: 0,
        following: 0,
        streak: 2,
        coins: 585,
        badges: [
            {
                id: 1,
                name: "Decked Out",
                icon: "/badges/badge-1.png",
                progress: 32,
                total: 50,
                description: "Flashcard Set(s) Created"
            }
        ],
        inviteCode: "v27mt8",
        inviteLink: "https://knowt.com/invite/v27mt8"
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Protected>
            <PageLayout>
                <div className="bg-gray-50 min-h-screen py-8">
                    <div className="max-w-[1200px] mx-auto px-6">
                        {/* Widgets Section */}
                        <main className="container max-w-6xl pt-8 pb-16">
                            {/* User profile header */}
                            <div className="bg-muted/30 p-6 rounded-lg relative mb-8">
                                <div className="absolute top-4 right-4 flex gap-2">
                                    <Button variant="outline" size="sm">Edit profile</Button>
                                    <Button variant="outline" size="sm">Customize</Button>
                                </div>

                                <div className="flex flex-col items-center sm:items-start sm:flex-row gap-6 pt-8">
                                    <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-background">
                                        <Image
                                            src={user.avatar}
                                            alt={user.name}
                                            width={80}
                                            height={80}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    <div className="text-center sm:text-left">
                                        <h1 className="text-2xl font-bold">{user.name}</h1>
                                        <p className="text-muted-foreground">@{user.username}</p>

                                        <div className="flex flex-wrap gap-4 mt-3 justify-center sm:justify-start">
                                            <div className="flex items-center gap-1">
                                                <span className="text-sm font-semibold">{user.followers}</span>
                                                <span className="text-sm text-muted-foreground">followers</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <span className="text-sm font-semibold">{user.following}</span>
                                                <span className="text-sm text-muted-foreground">following</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Button variant="ghost" size="icon" className="absolute bottom-4 right-4">
                                    <Share2 className="h-5 w-5" />
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Left column */}
                                <div className="col-span-2 space-y-6">
                                    {/* Level card */}
                                    <Card>
                                        <CardContent className="p-6">
                                            <div className="flex justify-between items-center">
                                                <h2 className="text-lg font-semibold">Level {user.level}</h2>
                                                <div className="bg-primary/10 p-1 rounded-full">
                                                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                                                        <span className="text-primary text-sm font-semibold">{user.level}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <Progress value={(user.xp / user.xpMax) * 100} className="h-2 mt-3" />
                                            <p className="text-sm text-muted-foreground mt-1">{user.xp}/{user.xpMax} XP</p>
                                        </CardContent>
                                    </Card>

                                    {/* Badges section */}
                                    <Card>
                                        <CardContent className="p-6">
                                            <div className="flex justify-between items-center mb-4">
                                                <h2 className="text-lg font-semibold">Badges</h2>
                                                <Button variant="outline" size="sm">View more</Button>
                                            </div>

                                            {user.badges.map((badge) => (
                                                <div key={badge.id} className="flex items-center gap-4">
                                                    <div className="relative w-14 h-14 flex-shrink-0">
                                                        <Image
                                                            src="/badges/badge-1.png"
                                                            alt={badge.name}
                                                            width={56}
                                                            height={56}
                                                            className="w-full h-full object-contain"
                                                        />
                                                        <div className="absolute -bottom-1 -right-1 bg-amber-400 text-xs font-semibold text-black rounded-full w-5 h-5 flex items-center justify-center">
                                                            30
                                                        </div>
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="font-semibold">{badge.name}</h3>
                                                        <Progress value={(badge.progress / badge.total) * 100} className="h-2 mt-2" />
                                                        <p className="text-sm text-muted-foreground mt-1">
                                                            {badge.progress}/{badge.total} {badge.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Right column */}
                                <div className="space-y-6">
                                    {/* Stats cards */}
                                    <div className="grid grid-cols-2 gap-4">
                                        {/* Streak card */}
                                        <Card>
                                            <CardContent className="p-4 flex flex-col items-center justify-center">
                                                <h3 className="text-sm font-medium text-muted-foreground">Streak</h3>
                                                <div className="mt-2 flex items-center">
                                                    <div className="flex items-center justify-center">
                                                        <Image
                                                            src="/icons/fire.svg"
                                                            alt="Streak"
                                                            width={24}
                                                            height={24}
                                                            className="w-6 h-6"
                                                        />
                                                        <span className="text-2xl font-bold ml-1">{user.streak}</span>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* Coins card */}
                                        <Card>
                                            <CardContent className="p-4 flex flex-col items-center justify-center">
                                                <h3 className="text-sm font-medium text-muted-foreground">Coins</h3>
                                                <div className="mt-2 flex items-center">
                                                    <div className="flex items-center justify-center">
                                                        <Image
                                                            src="/icons/coin.svg"
                                                            alt="Coins"
                                                            width={24}
                                                            height={24}
                                                            className="w-6 h-6"
                                                        />
                                                        <span className="text-2xl font-bold ml-1">{user.coins}</span>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    {/* Invite friends card */}
                                    <Card className="overflow-hidden">
                                        <CardContent className="p-0">
                                            <div className="p-6 flex flex-col items-center">
                                                <Image
                                                    src="/mascot.png"
                                                    alt="Mascot"
                                                    width={120}
                                                    height={120}
                                                    className="w-32 h-32 object-contain"
                                                />
                                                <h3 className="text-lg font-semibold mt-2 text-center">
                                                    Invite your friends to earn coins for every signup!
                                                </h3>

                                                <div className="w-full mt-6 space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-medium">Link</span>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm truncate max-w-[150px]">{user.inviteLink}</span>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8"
                                                                onClick={() => copyToClipboard(user.inviteLink)}
                                                            >
                                                                <Clipboard className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-medium">Code</span>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm font-semibold">{user.inviteCode}</span>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8"
                                                                onClick={() => copyToClipboard(user.inviteCode)}
                                                            >
                                                                <Clipboard className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
            </PageLayout>
        </Protected>
    );
}



