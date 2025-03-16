"use client";
import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Image from "next/image";
import { 
  Trash, 
  Plus,
  Search,
  ArrowLeft,
  SaveIcon,
  ImageIcon,
  CheckCircle,
  XCircle,
  MenuIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import Protected from "@/hooks/useProtected";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { 
  useGetAllSetsQuery,
  useUpdateSetMutation 
} from "../../../../../redux/features/sets/setsApi";
import { 
  useGetCardBySetIdQuery, 
  useUpdateCardMutation,
  useCreateCardMutation
} from "../../../../../redux/features/cards/cardsApi";
import { useSearchImageMutation } from "../../../../../redux/features/image/imageApi";
import { useSelector } from "react-redux";

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

// Image search result type
interface ImageResult {
  id: string;
  imageUrl: string;
  alt: string;
  thumbnail: string;
}

// Simple Carousel component
const ImageCarousel = ({
  images,
  onSelect
}: {
  images: ImageResult[],
  onSelect: (url: string) => void
}) => {
  return (
    <div className="w-full mt-4">
      {/* Multi-image horizontal carousel */}
      <div className="relative">
        <div className="flex overflow-x-auto pb-4 gap-3 snap-x scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {images.map((image) => (
            <div
              key={image.id}
              className="relative flex-none w-1/4 min-w-[200px] h-48 border rounded-md overflow-hidden snap-start"
            >
              <img
                src={image.imageUrl || image.thumbnail}
                alt={image.alt}
                className="w-full h-full object-cover"
              />
              <div
                className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer bg-black bg-opacity-20"
                onClick={() => onSelect(image.imageUrl)}
              >
                <span className="bg-white px-3 py-1 rounded-full font-medium text-sm shadow-md">
                  Select
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function UpdateSetPage() {
  const params = useParams();
  const setId = params.id as string;
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user } = useSelector((state: any) => state.auth);
  
  // Set data states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [terms, setTerms] = useState<Card[]>([]);
  
  // Autosave states
  const [autosaveStatus, setAutosaveStatus] = useState("Saved");
  const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null);
  const [timeSinceLastSave, setTimeSinceLastSave] = useState<string>("0s");
  
  // Modified cards tracking
  const [modifiedCards, setModifiedCards] = useState<Set<string>>(new Set());
  
  // Image search states
  const [activeImageSearchIndex, setActiveImageSearchIndex] = useState<number | null>(null);
  const [imageSearchQuery, setImageSearchQuery] = useState("");
  const [imageSearchResults, setImageSearchResults] = useState<ImageResult[]>([]);
  const [isSearchingImages, setIsSearchingImages] = useState(false);
  
  // API hooks
  const { data: allSetsData, isLoading: isLoadingSets } = useGetAllSetsQuery({});
  const { data: cardsData, isLoading: isLoadingCards, refetch: refetchCards } = useGetCardBySetIdQuery(setId);
  const [updateSet, { isLoading: isUpdatingSet }] = useUpdateSetMutation();
  const [updateCard, { isLoading: isUpdatingCard }] = useUpdateCardMutation();
  const [createCard, { isLoading: isCreatingCard }] = useCreateCardMutation();
  const [searchImage] = useSearchImageMutation();
  console.log("setId", setId);
  // Load set data
  useEffect(() => {
    if (allSetsData?.sets) {
      // Find the specific set by ID
      const currentSet = allSetsData.sets.find((set: any) => set.id === setId);
      if (currentSet) {
        setTitle(currentSet.title || "");
        setDescription(currentSet.description || "");
      }
    }
  }, [allSetsData, setId]);
  
  // Load cards data
  useEffect(() => {
    if (cardsData?.sets) {
      setTerms(cardsData.sets);
    }
  }, [cardsData]);

  // Autosave effect
  useEffect(() => {
    if (terms.length === 0) return; // Don't autosave if no terms loaded yet
    
    setAutosaveStatus("Saving...");
    const timer = setTimeout(() => {
      handleSaveAllChanges();
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [terms, title, description]);

  // Time since last save effect
  useEffect(() => {
    if (!lastSaveTime) return;

    const interval = setInterval(() => {
      const seconds = Math.floor((new Date().getTime() - lastSaveTime.getTime()) / 1000);

      if (seconds < 60) {
        setTimeSinceLastSave(`${seconds}s`);
      } else if (seconds < 3600) {
        const minutes = Math.floor(seconds / 60);
        setTimeSinceLastSave(`${minutes}m`);
      } else {
        const hours = Math.floor(seconds / 3600);
        setTimeSinceLastSave(`${hours}h`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lastSaveTime]);
  
  // Card operations
  const handleTermChange = (index: number, field: 'term' | 'definition', value: string) => {
    const updatedTerms = [...terms];
    updatedTerms[index] = { ...updatedTerms[index], [field]: value };
    setTerms(updatedTerms);
    
    // Track modified cards
    setModifiedCards(prev => {
      const newSet = new Set(prev);
      newSet.add(updatedTerms[index].id);
      return newSet;
    });
  };
  
  const handleSaveAllChanges = async () => {
    try {
      // First, update the set details
      await updateSet({
        id: setId,
        title,
        description,
        cardCount: terms.length
      }).unwrap();
      
      // Then update all modified cards
      const promises = [];
      for (const card of terms) {
        if (modifiedCards.has(card.id)) {
          promises.push(updateCard({
            id: card.id,
            term: card.term,
            definition: card.definition,
            imageUrl: card.imageUrl
          }).unwrap());
        }
      }
      
      if (promises.length > 0) {
        await Promise.all(promises);
        setModifiedCards(new Set());
      }
      
      setAutosaveStatus("Saved");
      setLastSaveTime(new Date());
      setTimeSinceLastSave("0s");
      
      // Show toast on manual save, not on autosave
      toast.success("All changes saved");
    } catch (error) {
      console.error("Failed to save changes:", error);
      setAutosaveStatus("Error saving");
      toast.error("Failed to save changes");
    }
  };
  
  const handleAddTerm = () => {
    const newTerm = { term: "", definition: "", id: "", imageUrl: "" };
    setTerms([...terms, newTerm]);
  };
  
  const handleSaveNewCard = async (index: number) => {
    const card = terms[index];
    
    if (!card.term || !card.definition) {
      toast.error("Both term and definition are required");
      return;
    }
    
    try {
      // Only create if this is a new card (no ID)
      if (!card.id) {
        const response = await createCard({
          setId: setId,
          term: card.term,
          definition: card.definition,
          imageUrl: card.imageUrl || ""
        }).unwrap();
        
        // Update the card with the new ID
        const updatedTerms = [...terms];
        updatedTerms[index] = { ...response.card };
        setTerms(updatedTerms);
        
        toast.success("Card created successfully");
      } else {
        // Otherwise, this is an existing card
        await updateCard({
          id: card.id,
          term: card.term,
          definition: card.definition,
          imageUrl: card.imageUrl
        }).unwrap();
        
        // Remove from modified set
        setModifiedCards(prev => {
          const newSet = new Set(prev);
          newSet.delete(card.id);
          return newSet;
        });
        
        toast.success("Card updated successfully");
      }
      
      refetchCards();
    } catch (error) {
      console.error("Failed to save card:", error);
      toast.error("Failed to save card");
    }
  };
  
  const handleDeleteCard = async (cardId: string, index: number) => {
    if (confirm("Are you sure you want to delete this card?")) {
      try {
        // For new cards that don't have an ID yet
        if (!cardId) {
          const updatedTerms = [...terms];
          updatedTerms.splice(index, 1);
          setTerms(updatedTerms);
          toast.success("Card removed");
          return;
        }
        
        // Delete card API would go here for existing cards
        // For now, just remove from local state
        const updatedTerms = [...terms];
        updatedTerms.splice(index, 1);
        setTerms(updatedTerms);
        toast.success("Card deleted");
      } catch (error) {
        console.error("Failed to delete card:", error);
        toast.error("Failed to delete card");
      }
    }
  };
  
  // Image search functionality
  const handleSearchImages = async (index: number) => {
    setActiveImageSearchIndex(index);
    // Initialize search query with the term's value
    const term = terms[index].term.trim();
    setImageSearchQuery(term);
    
    // If term exists, immediately search
    if (term) {
      performImageSearch(term);
    }
  };
  
  const performImageSearch = async (query: string) => {
    if (!query.trim()) {
      toast.error("Please enter a search term");
      return;
    }
    
    setIsSearchingImages(true);
    
    try {
      const response = await searchImage({ keyword: query });
      console.log("response", response);
      setImageSearchResults(response.data.images);
    } catch (error) {
      console.error("Failed to search images:", error);
      toast.error("Failed to search images");
    } finally {
      setIsSearchingImages(false);
    }
  };
  
  const handleSelectImage = async (imageUrl: string) => {
    if (activeImageSearchIndex === null) return;
    
    const updatedTerms = [...terms];
    updatedTerms[activeImageSearchIndex] = { 
      ...updatedTerms[activeImageSearchIndex], 
      imageUrl
    };
    setTerms(updatedTerms);
    
    try {
      setAutosaveStatus("Saving...");
      
      const term = updatedTerms[activeImageSearchIndex];
      
      if (term.id) {
        // If card exists, just update the image and track as modified
        await updateCard({ 
          id: term.id,
          setId: setId,
          imageUrl: imageUrl
        });
        
        // Track as modified
        setModifiedCards(prev => {
          const newSet = new Set(prev);
          newSet.add(term.id);
          return newSet;
        });
      } else {
        // If it's a new card, create it with the image
        const res = await createCard({
          setId: setId,
          term: term.term,
          definition: term.definition,
          imageUrl: imageUrl
        });
        
        // Update the card ID in local state
        if (res?.data?.card?.id) {
          updatedTerms[activeImageSearchIndex].id = res.data.card.id;
          setTerms(updatedTerms);
        }
      }
      
      setAutosaveStatus("Saved");
      setLastSaveTime(new Date());
      setTimeSinceLastSave("0s");
      
      toast.success("Image added to card");
    } catch (error) {
      console.error("Error saving card with image:", error);
      setAutosaveStatus("Error saving data");
      toast.error("Failed to save card with image");
    }
    
    // Reset search
    setImageSearchResults([]);
    setImageSearchQuery("");
    setActiveImageSearchIndex(null);
  };
  
  const handleClearImage = (index: number) => {
    const updatedTerms = [...terms];
    updatedTerms[index] = { ...updatedTerms[index], imageUrl: "" };
    setTerms(updatedTerms);
    
    // Track as modified if it has an ID (existing card)
    if (updatedTerms[index].id) {
      setModifiedCards(prev => {
        const newSet = new Set(prev);
        newSet.add(updatedTerms[index].id);
        return newSet;
      });
    }
    
    toast.success("Image removed");
  };
  
  const handleFinish = async () => {
    // Save all changes first
    await handleSaveAllChanges();
    // Navigate back to the set detail page
    router.push(`/set/${setId}`);
  };
  
  if (isLoadingSets || isLoadingCards) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading set data...</p>
        </div>
      </div>
    );
  }

  console.log("terms", terms);
  console.log("modifiedCards", modifiedCards);
  return (
    <Protected>
      <div className="min-h-screen bg-gray-50">
        <header
          className={cn(
            "bg-white border-b border-gray-200 fixed top-0 right-0 z-40 transition-all duration-300",
            isSidebarOpen ? "left-64" : "left-20"
          )}
        >
          <div className="flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-8">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
              >
                <span className="sr-only">Toggle sidebar</span>
                <MenuIcon className="w-6 h-6" />
              </button>
              <h1 className="text-xl font-semibold">Edit Set: {title}</h1>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <span className="mr-2">{autosaveStatus}</span>
              {lastSaveTime && (
                <span>Last saved {timeSinceLastSave} ago</span>
              )}
            </div>
          </div>
        </header>

        <Sidebar
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        <main
          className={cn(
            "transition-all duration-300 pt-24 px-8",
            isSidebarOpen ? "ml-64" : "ml-20"
          )}
        >
          <div className="max-w-3xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <Input
                    placeholder="Enter a title for your set"
                    value={title}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <Textarea
                    placeholder="Add a description (optional)"
                    value={description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-medium">Terms ({terms.length})</h2>
                    <Button onClick={handleAddTerm}>Add Term</Button>
                  </div>

                  {terms.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No cards in this set yet. Add your first term below.
                    </div>
                  ) : (
                    terms.map((term, index) => (
                      <div
                        key={index}
                        className={cn(
                          "p-4 border rounded-lg space-y-4",
                          term.id && modifiedCards.has(term.id) && "border-amber-500"
                        )}
                      >
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium">Term {index + 1}</h3>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDeleteCard(term.id, index)}
                            title="Delete term"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Term
                            </label>
                            <Input
                              placeholder="Enter term"
                              value={term.term}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                handleTermChange(index, "term", e.target.value)
                              }
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Definition
                            </label>
                            <Input
                              placeholder="Enter definition"
                              value={term.definition}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                handleTermChange(
                                  index,
                                  "definition",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        </div>
                        
                        {/* Image section */}
                        <div className="mt-2">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSearchImages(index)}
                              disabled={isSearchingImages}
                            >
                              {isSearchingImages && activeImageSearchIndex === index
                                ? "Searching..."
                                : term.imageUrl
                                  ? "Change Image"
                                  : "Add Image"
                              }
                            </Button>

                            {term.imageUrl && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleClearImage(index)}
                              >
                                Remove Image
                              </Button>
                            )}
                          </div>

                          {term.imageUrl && (
                            <div className="mt-2">
                              <div className="relative h-40 w-full max-w-xs overflow-hidden rounded-md">
                                <img
                                  src={term.imageUrl}
                                  alt={`Image for ${term.term}`}
                                  className="object-cover h-full w-full"
                                />
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Image search results carousel with search bar */}
                        {activeImageSearchIndex === index && (
                          <div className="mt-2 p-3 bg-gray-50 rounded-md">
                            <div className="text-sm font-medium mb-2">Find images for "{term.term}":</div>
                            
                            {/* Custom search bar */}
                            <div className="mb-4 flex gap-2">
                              <Input
                                placeholder="Search for images..."
                                value={imageSearchQuery}
                                onChange={(e) => setImageSearchQuery(e.target.value)}
                                className="flex-grow"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    performImageSearch(imageSearchQuery);
                                  }
                                }}
                              />
                              <Button 
                                onClick={() => performImageSearch(imageSearchQuery)}
                                disabled={isSearchingImages}
                              >
                                {isSearchingImages ? "Searching..." : "Search"}
                              </Button>
                            </div>

                            {/* Display search results if available */}
                            {imageSearchResults.length > 0 && (
                              <ImageCarousel
                                images={imageSearchResults}
                                onSelect={handleSelectImage}
                              />
                            )}

                            {/* Message when no results are available */}
                            {imageSearchResults.length === 0 && !isSearchingImages && (
                              <div className="text-center py-4 text-gray-500">
                                Enter a search term and press Search to find images
                              </div>
                            )}
                          </div>
                        )}
                        
                        {/* Save button for new cards or modified cards */}
                        {(!term.id || (term.id && modifiedCards.has(term.id))) && (
                          <div className="pt-2">
                            <Button 
                              onClick={() => handleSaveNewCard(index)}
                              disabled={isUpdatingCard || isCreatingCard}
                              className="gap-1"
                            >
                              <SaveIcon className="h-4 w-4" />
                              {!term.id ? "Create Card" : "Save Changes"}
                            </Button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <Button variant="outline" onClick={() => router.back()}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSaveAllChanges}
                    disabled={modifiedCards.size === 0 && terms.every(t => t.id)}
                  >
                    Save All Changes
                  </Button>
                  <Button onClick={handleFinish}>
                    Finish Editing
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </Protected>
  );
}
