"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeToggle } from "@/components/theme-toggle";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Protected from "@/hooks/useProtected";
import { cn } from "@/lib/utils";
import { PageLayout } from "@/components/layout/PageLayout";
export default function SettingsPage() {
  return (
    <Protected>
      <PageLayout>
        <div className="min-h-screen bg-background">

          <main className="container max-w-4xl pt-8 pb-16">
            <h1 className="text-3xl font-bold mb-6">Settings</h1>

            <Tabs defaultValue="account" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="appearance">Appearance</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="privacy">Privacy</TabsTrigger>
              </TabsList>

              <TabsContent value="account">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>
                      Update your account details and profile information.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" defaultValue="Nguyễn Nam Hoài Phan" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input id="username" defaultValue="phnam" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue="user@example.com" />
                      </div>
                    </div>
                    <Button>Save Changes</Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="appearance">
                <Card>
                  <CardHeader>
                    <CardTitle>Appearance</CardTitle>
                    <CardDescription>
                      Customize how the app looks and feels.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Theme</Label>
                      <div className="p-2 border rounded-md">
                        <ThemeToggle />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Settings</CardTitle>
                    <CardDescription>
                      Configure how you receive notifications.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Notification settings will be implemented soon.</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="privacy">
                <Card>
                  <CardHeader>
                    <CardTitle>Privacy Settings</CardTitle>
                    <CardDescription>
                      Manage your privacy preferences.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Privacy settings will be implemented soon.</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </PageLayout>
    </Protected>
  );
} 