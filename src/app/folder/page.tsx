"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DonutChart } from "@/components/charts/DonutChart";
import { LineChart } from "@/components/charts/LineChart";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { CampaignTable } from "@/components/dashboard/CampaignTable";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Bell, Settings, Folder, MoreHorizontal, Filter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Protected from "@/hooks/useProtected";
import { CreateFolderDialog } from "@/components/dialogs/CreateFolderDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCreateFolderMutation, useGetFoldersByUserIdQuery } from "../../../redux/features/folders/foldersApi";
import { ThemeToggle } from "@/components/theme-toggle";
import { PageLayout } from "@/components/layout/PageLayout";

interface Folder {
  id: string;
  name: string;
  icon: JSX.Element;
  totalSets:number;
}



const navigationItems = [
  { name: "Dashboard", href: "/dashboard", current: true },
  { name: "Project", href: "/project", current: false },
  { name: "Clients", href: "/clients", current: false },
  { name: "Quotes", href: "/quotes", current: false },
  { name: "Meeting Schedule", href: "/meetings", current: false },
  { name: "Notes", href: "/notes", current: false },
];

export default function FolderPage() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [folders, setFolders] = useState<Folder[]>([]);
  const { user } = useSelector((state: any) => state.auth);
  const { data, isLoading, isError } = useGetFoldersByUserIdQuery({});
  const [createFolder, { isLoading: isCreating }] = useCreateFolderMutation();
  const handleCreateFolder = (name: string) => {
    createFolder({ name });
    const newFolder: Folder = {
      id: (folders.length + 1).toString(),
      name,
      icon: <div className="w-3 h-3 rounded-full bg-blue-500" />,
      totalSets:0
    };
    setFolders([...folders, newFolder]);
  };

  const handleFolderClick = (folderId: string) => {
    router.push(`/folder/${folderId}`);
  };

  const handleCreateSet = () => {
    router.push("/create-set");
  };

  useEffect(() => {
    if (data) {
      setFolders(data.folders);
    }
    // console.log('folders',data);
  }, [data]);
  // console.log(data);

  return (
    <Protected>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}

        {/* Main Content */}
        <PageLayout>

          <div className="bg-background min-h-screen">
            <div className="max-w-[1400px] mx-auto p-8 space-y-8">
              {/* Dashboard Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h1 className="text-2xl font-semibold text-foreground">
                    Folders
                  </h1>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-muted rounded-lg px-4 py-2 text-sm text-muted-foreground">
                    30 days Oct 16/21 - Nov 14/21
                  </div>
                </div>
              </div>

              {/* Top Row */}
              <div className="p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <CreateFolderDialog onCreateFolder={handleCreateFolder} />

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon">
                      <Folder className="h-4 w-4" />
                    </Button>

                    <div className="flex items-center">
                      <span className="mr-2 text-muted-foreground">Last Updated</span>
                      <Button variant="ghost" size="icon">
                        ↓
                      </Button>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="text-muted-foreground">
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
                  {folders?.map((folder) => (
                    <div
                      key={folder.id}
                      className="bg-card p-4 rounded-lg shadow-sm border border-border hover:border-primary cursor-pointer transition-all duration-200 group"
                      onClick={() => handleFolderClick(folder.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {folder.icon}
                          <div>
                            <h3 className="font-medium text-card-foreground">{folder.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {folder?.totalSets || 0} sets
                            </p>
                          </div>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>Rename</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="fixed bottom-4 right-4">
                  <Button variant="destructive">Remove ads</Button>
                </div>
              </div>
            </div>
          </div>
        </PageLayout>

      </div>
    </Protected>
  );
}
