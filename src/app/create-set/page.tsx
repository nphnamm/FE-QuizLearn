"use client";
import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { cn } from "@/lib/utils";
import Protected from "@/hooks/useProtected";
import { useCreateSetMutation, useUpdateSetMutation } from "../../../redux/features/sets/setsApi";
import { useSelector } from "react-redux";
import { RootState } from "@reduxjs/toolkit/query";
import { isDraft } from "@reduxjs/toolkit";
import { useCreateCardMutation, useGetCardBySetIdQuery, useUpdateCardMutation } from "../../../redux/features/cards/cardsApi";
import Image from "next/image";
import { useSearchImageMutation } from "../../../redux/features/image/imageApi";
import { toast } from "sonner";

// Type for image search results
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
                src={image.imageUrl}
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

export default function CreateSetPage() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  // Updated to include imageUrl field
  const [terms, setTerms] = useState([{ term: "", definition: "", id: "", imageUrl: "" }]);
  const { user } = useSelector((state: any) => state.auth);
  const params = useSearchParams();
  const folderId = params.get('folderId');
  const [setId, setSetId] = useState(null);
  const [autosaveStatus, setAutosaveStatus] = useState("Saved");
  const [setName, setSetName] = useState("");
  const [createSet, { isLoading: isCreating }] = useCreateSetMutation();
  const [updateSet, { isLoading: isUpdating }] = useUpdateSetMutation();
  const [createCard, { isLoading: isCreatingCards }] = useCreateCardMutation();
  const [updateCard, { isLoading: isUpdatingCard }] = useUpdateCardMutation();
  const [searchImage, { isLoading: isSearching }] = useSearchImageMutation();
  const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null);
  const [timeSinceLastSave, setTimeSinceLastSave] = useState<string>("0s");

  // States for image search functionality
  const [activeImageSearchIndex, setActiveImageSearchIndex] = useState<number | null>(null);
  const [imageSearchResults, setImageSearchResults] = useState<ImageResult[]>([]);
  const [isSearchingImages, setIsSearchingImages] = useState(false);
  const [imageSearchQuery, setImageSearchQuery] = useState("");

  const autosave = async () => {
    try {
      let currentSetId = setId;
      setAutosaveStatus("Saving...");

      if (!currentSetId) {
        // If the set doesn't exist yet, create it
        const res = await createSet({ title: title, description: description, folderId: folderId, userId: user.id, isDraft: true, statusId: 1, cardCount: terms.length });
        currentSetId = res?.data?.set.id;
        setSetId(currentSetId);
      } else {
        // Otherwise, update the set with the new name
        await updateSet({ id: currentSetId, name: title, description: description, cardCount: terms.length });
      }

      // Loop over the cards; if a card has no id, create it
      for (let i = 0; i < terms.length; i++) {
        if (!terms[i].id) {
          const res = await createCard({
            setId: currentSetId,
            term: terms[i].term,
            definition: terms[i].definition,
            imageUrl: terms[i].imageUrl, // Include the image URL
          });
          const newCardId = res?.data?.card.id;
          if (newCardId) {
            // Update the card locally with the returned id
            setTerms(prevCards => {
              const newCards = [...prevCards];
              newCards[i] = { ...newCards[i], id: newCardId };
              return newCards;
            });
          }
        }
      }
      setAutosaveStatus("Saved");
      setLastSaveTime(new Date());
      setTimeSinceLastSave("0s");
    } catch (error) {
      console.error("Autosave error:", error);
      setAutosaveStatus("Error saving data");
    }
  };

  const handleTermChange = (index: number, field: "term" | "definition", value: string) => {
    const newTerms = [...terms];
    newTerms[index][field] = value;
    setTerms(newTerms);
  };

  const handleAddTerm = () => {
    setTerms([...terms, { term: "", definition: "", id: "", imageUrl: "" }]);
  };

  // Function to initialize image search
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

  // Function to perform the image search with any query
  const performImageSearch = async (query: string) => {
    if (!query.trim()) {
      toast.error("Please enter a search term");
      return;
    }

    setIsSearchingImages(true);

    try {
      // Mock image search results for now
      // In a real implementation, you would call an API like Unsplash, Pexels, or Pixabay
      // Example: const response = await fetch(`https://api.unsplash.com/search/photos?query=${query}&client_id=YOUR_API_KEY`);

      // Simulating API response with dummy data
      const result = await searchImage({ keyword: query });
      console.log("result", result);
      setImageSearchResults(result.data.images);
    } catch (error) {
      console.error("Error searching for images:", error);
      toast.error("Failed to search for images. Please try again.");
    } finally {
      setIsSearchingImages(false);
    }
  };

  // Function to select an image
  const handleSelectImage = async (imageUrl: string) => {
    if (activeImageSearchIndex !== null) {
      console.log("imageUrl", imageUrl);
      const newTerms = [...terms];
      newTerms[activeImageSearchIndex].imageUrl = imageUrl;
      setTerms(newTerms);
      
      try {
        setAutosaveStatus("Saving...");
        
        // Ensure we have a setId for the card
        let currentSetId = setId;
        if (!currentSetId) {
          // If the set doesn't exist yet, create it
          const res = await createSet({ 
            title: title, 
            description: description, 
            folderId: folderId, 
            userId: user.id, 
            isDraft: true, 
            statusId: 1, 
            cardCount: terms.length 
          });
          currentSetId = res?.data?.set.id;
          setSetId(currentSetId);
        }
        
        // Now handle the card
        const term = newTerms[activeImageSearchIndex];
        
        if (term.id) {
          // If card exists, just update the image
          await updateCard({ 
            id: term.id, 
            imageUrl: imageUrl,
            setId: currentSetId
          });
          toast.success("Image updated");
        } else {
          // If it's a new card, create it with the image
          const res = await createCard({
            setId: currentSetId,
            term: term.term,
            definition: term.definition,
            imageUrl: imageUrl
          });
          
          // Update the card ID in local state
          if (res?.data?.card?.id) {
            newTerms[activeImageSearchIndex].id = res.data.card.id;
            setTerms(newTerms);
            toast.success("Card created with image");
          }
        }
        
        setAutosaveStatus("Saved");
        setLastSaveTime(new Date());
        setTimeSinceLastSave("0s");
      } catch (error) {
        console.error("Error saving card with image:", error);
        setAutosaveStatus("Error saving data");
        toast.error("Failed to save card with image");
      }
      
      setActiveImageSearchIndex(null);
      setImageSearchResults([]);
    }
  };

  // Function to clear the selected image
  const handleClearImage = (index: number) => {
    const newTerms = [...terms];
    newTerms[index].imageUrl = "";
    setTerms(newTerms);
    
    // If the card has an ID, update it on the server
    if (newTerms[index].id) {
      updateCard({ id: newTerms[index].id, imageUrl: "" })
        .then(() => {
          toast.success("Image removed");
        })
        .catch((error) => {
          console.error("Error removing image:", error);
          toast.error("Failed to remove image");
        });
    } else {
      toast.success("Image removed");
    }
  };

  const handleSubmit = async () => {
    await updateSet({ id: setId, isDraft: false });
    router.push("/folder ");
  };

  useEffect(() => {
    setAutosaveStatus("Saving...");
    const timer = setTimeout(() => {
      autosave();
    }, 3000);
    return () => clearTimeout(timer);
  }, [setId, terms, title, description]);

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
  console.log("terms", terms);
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
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              <h1 className="text-xl font-semibold">Create New Set</h1>
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
                    <h2 className="text-lg font-medium">Terms</h2>
                    <Button onClick={handleAddTerm}>Add Term</Button>
                  </div>

                  {terms.map((term, index) => (
                    <div
                      key={index}
                      className="p-4 border rounded-lg space-y-4"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Term {index + 1}
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
                          {activeImageSearchIndex === index && 
                           imageSearchResults.length === 0 && 
                           !isSearchingImages && (
                            <div className="text-center py-4 text-gray-500">
                              Enter a search term and press Search to find images
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex justify-end gap-4">
                  <Button variant="outline" onClick={() => router.back()}>
                    Cancel
                  </Button>
                  <Button onClick={handleSubmit}>Create Set</Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </Protected>
  );
}