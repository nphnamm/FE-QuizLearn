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
import { Bell, Settings, Edit, Trash, Plus, PencilLine } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetSetByFolderIdQuery, useUpdateSetMutation, useDeleteSetMutation } from "../../../../redux/features/sets/setsApi";
import {
  useGetCardBySetIdQuery,
  useCreateCardMutation,
  useUpdateCardMutation
} from "../../../../redux/features/cards/cardsApi";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PageLayout } from "@/components/layout/PageLayout";

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

// Card type definition
interface Card {
  id: string;
  term: string;
  definition: string;
  setId?: string;
  position?: number;
  statusId?: number;
  createdAt?: string;
  updatedAt?: string;
  imageUrl?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const params = useParams();
  const id = params.id;
  const [sets, setSets] = useState<any>([]);
  const [draftSets, setDraftSets] = useState<any>([]);
  const [publishedSets, setPublishedSets] = useState<any>([]);
  const [activeTab, setActiveTab] = useState("published");
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [currentSet, setCurrentSet] = useState<any>(null);
  const [updateTitle, setUpdateTitle] = useState("");
  const [updateDescription, setUpdateDescription] = useState("");

  // Cards editor state
  // const [isCardsDialogOpen, setIsCardsDialogOpen] = useState(false);
  const [currentEditingSet, setCurrentEditingSet] = useState<any>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [newCard, setNewCard] = useState<{ term: string, definition: string }>({ term: "", definition: "" });

  const { data, isLoading, isError, refetch } = useGetSetByFolderIdQuery(id, {});
  const [updateSet] = useUpdateSetMutation();
  const [deleteSet] = useDeleteSetMutation();

  // Cards API hooks
  const { data: cardsData, refetch: refetchCards } = useGetCardBySetIdQuery(
    currentEditingSet?.id || "",
    { skip: !currentEditingSet?.id }
  );
  const [createCard] = useCreateCardMutation();
  const [updateCard] = useUpdateCardMutation();

  useEffect(() => {
    const foundItem = mockData.find((item: any) => item.id == id);
    if (foundItem) {
      setSets([foundItem]); // Chuyển thành mảng để tránh lỗi .map()
    } else {
      setSets([]); // Nếu không tìm thấy, đặt là mảng rỗng để tránh lỗi
    }
  }, [id]);

  useEffect(() => {
    if (data?.sets) {
      setSets(data.sets);

      // Filter sets into draft and published
      const drafts = data.sets.filter((set: any) => set.isDraft);
      const published = data.sets.filter((set: any) => !set.isDraft);

      setDraftSets(drafts);
      setPublishedSets(published);
    }
  }, [data]);

  // Effect to load cards when a set is selected for editing
  useEffect(() => {
    if (cardsData?.sets) {
      setCards(cardsData.sets);
    }
  }, [cardsData]);

  const handleCreateSet = () => {
    router.push(`/create-set?folderId=${id}`);
  }

  const handleOpenUpdateDialog = (set: any, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigating to set page
    setCurrentSet(set);
    setUpdateTitle(set.title);
    setUpdateDescription(set.description || "");
    setIsUpdateDialogOpen(true);
  }

  const handleUpdateSet = async () => {
    try {
      await updateSet({
        id: currentSet.id,
        title: updateTitle,
        description: updateDescription
      }).unwrap();

      setIsUpdateDialogOpen(false);
      toast.success("Set updated successfully");
      refetch(); // Refetch data to update the list
    } catch (error) {
      console.error("Failed to update set:", error);
      toast.error("Failed to update set");
    }
  }

  const handleDeleteSet = async (setId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigating to set page

    if (confirm("Are you sure you want to delete this set?")) {
      try {
        await deleteSet(setId).unwrap();
        toast.success("Set deleted successfully");
        refetch(); // Refetch data to update the list
      } catch (error) {
        console.error("Failed to delete set:", error);
        toast.error("Failed to delete set");
      }
    }
  }

  const handlePublishDraft = async (set: any, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigating to set page

    try {
      await updateSet({
        id: set.id,
        isDraft: false
      }).unwrap();

      toast.success("Set published successfully");
      refetch(); // Refetch data to update the list
    } catch (error) {
      console.error("Failed to publish set:", error);
      toast.error("Failed to publish set");
    }
  }

  // Card editing functions
  // const handleOpenCardsDialog = (set: any, e: React.MouseEvent) => {
  //   e.stopPropagation(); // Prevent navigating to set page
  //   setCurrentEditingSet(set);
  //   setIsCardsDialogOpen(true);
  // }
  const handleEditCardsOfSet = (set: any, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigating to set page
    router.push(`/set/update-set/${set.id}`);
  }

  // Track modified cards
  const [modifiedCards, setModifiedCards] = useState<Set<string>>(new Set());

  const handleUpdateCard = async (index: number, field: 'term' | 'definition', value: string) => {
    const updatedCards = [...cards];
    updatedCards[index] = { ...updatedCards[index], [field]: value };
    setCards(updatedCards);

    // Add to modified cards set
    setModifiedCards(prev => {
      const newSet = new Set(prev);
      newSet.add(updatedCards[index].id);
      return newSet;
    });
  }

  const handleSaveCard = async (card: Card) => {
    try {
      await updateCard({
        id: card.id,
        term: card.term,
        definition: card.definition,
      }).unwrap();

      // Remove from modified cards set
      setModifiedCards(prev => {
        const newSet = new Set(prev);
        newSet.delete(card.id);
        return newSet;
      });

      toast.success("Card updated successfully");

      // Navigate to the set detail page after successful update
      router.push(`/set/${currentEditingSet.id}`);
    } catch (error) {
      console.error("Failed to update card:", error);
      toast.error("Failed to update card");
    }
  }

  const handleSaveAllCards = async () => {
    try {
      const promises = [];

      // Only update cards that have been modified
      for (const card of cards) {
        if (modifiedCards.has(card.id)) {
          promises.push(updateCard({
            id: card.id,
            term: card.term,
            definition: card.definition,
          }).unwrap());
        }
      }

      if (promises.length === 0) {
        toast.info("No changes to save");
        return;
      }

      await Promise.all(promises);
      setModifiedCards(new Set()); // Clear modified cards
      toast.success(`${promises.length} card(s) updated successfully`);

      // Navigate to the set detail page after successful update
      router.push(`/set/${currentEditingSet.id}`);
    } catch (error) {
      console.error("Failed to update cards:", error);
      toast.error("Failed to update some cards");
    }
  }

  const handleDeleteCard = async (cardId: string, index: number) => {
    if (confirm("Are you sure you want to delete this card?")) {
      try {
        // Delete card from backend - Note: API might need to be implemented
        // For now we're just removing it from the local state
        const updatedCards = [...cards];
        updatedCards.splice(index, 1);
        setCards(updatedCards);
        toast.success("Card deleted");
      } catch (error) {
        console.error("Failed to delete card:", error);
        toast.error("Failed to delete card");
      }
    }
  }

  const handleAddCard = async () => {
    if (!newCard.term || !newCard.definition) {
      toast.error("Both term and definition are required");
      return;
    }

    try {
      const response = await createCard({
        setId: currentEditingSet.id,
        term: newCard.term,
        definition: newCard.definition,
      }).unwrap();

      // Add the new card to the list
      setCards([...cards, response.card]);

      // Clear the form
      setNewCard({ term: "", definition: "" });

      toast.success("Card added successfully");

      // Ask user if they want to continue adding cards or view the set
      const continueAdding = window.confirm(
        "Card added successfully! Would you like to continue adding more cards?\n\nClick 'OK' to add more cards or 'Cancel' to view the set."
      );

      if (!continueAdding) {
        // Navigate to the set detail page
        router.push(`/set/${currentEditingSet.id}`);
      }
    } catch (error) {
      console.error("Failed to add card:", error);
      toast.error("Failed to add card");
    }
  }

  return (
    <Protected>
      <PageLayout>
        <div className="dark:bg-[#1a1a1a] bg-background text-white min-h-screen">
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

              <Tabs defaultValue="published" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="published">Published Sets ({publishedSets.length})</TabsTrigger>
                  <TabsTrigger value="drafts">Draft Sets ({draftSets.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="published" className="space-y-2">
                  {publishedSets.length === 0 ? (
                    <div className="text-center py-8 text-gray-600">
                      No published sets found. Create a new set or publish a draft.
                    </div>
                  ) : (
                    publishedSets.map((set: any, index: number) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-2 hover:bg-gray-100 rounded-md bg-teal-600 hover:bg-teal-500 transition-colors cursor-pointer"
                        onClick={() => router.push(`/set/${set.id}`)}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-white">{set.title}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => handleEditCardsOfSet(set, e)}
                            title="Edit Cards"
                          >
                            <PencilLine className="h-4 w-4 text-white" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => handleOpenUpdateDialog(set, e)}
                            title="Edit Set"
                          >
                            <Edit className="h-4 w-4 text-white" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => handleDeleteSet(set.id, e)}
                            title="Delete Set"
                          >
                            <Trash className="h-4 w-4 text-white" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </TabsContent>

                <TabsContent value="drafts" className="space-y-2">
                  {draftSets.length === 0 ? (
                    <div className="text-center py-8 text-gray-600">
                      No draft sets found. Create a new set to start working on a draft.
                    </div>
                  ) : (
                    draftSets.map((set: any, index: number) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-2 hover:bg-gray-100 rounded-md bg-amber-600 hover:bg-amber-500 transition-colors cursor-pointer"
                        onClick={() => router.push(`/set/${set.id}`)}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-white">{set.title}</span>
                          <span className="text-xs bg-gray-800/30 rounded px-2 py-0.5">DRAFT</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => handlePublishDraft(set, e)}
                            className="text-white text-xs border border-white/50 px-2"
                          >
                            Publish
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => handleEditCardsOfSet(set, e)}
                            title="Edit Cards"
                          >
                            <PencilLine className="h-4 w-4 text-white" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => handleOpenUpdateDialog(set, e)}
                            title="Edit Set"
                          >
                            <Edit className="h-4 w-4 text-white" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => handleDeleteSet(set.id, e)}
                            title="Delete Set"
                          >
                            <Trash className="h-4 w-4 text-white" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </TabsContent>
              </Tabs>

              <div className="fixed bottom-4 right-4">
                <Button variant="destructive">Remove ads</Button>
              </div>
            </div>
          </div>
        </div>

      </PageLayout>

      {/* Update Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Set</DialogTitle>
            <DialogDescription>
              Make changes to the set. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={updateTitle}
                onChange={(e) => setUpdateTitle(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={updateDescription}
                onChange={(e) => setUpdateDescription(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsUpdateDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleUpdateSet}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>



    </Protected>
  );
}
