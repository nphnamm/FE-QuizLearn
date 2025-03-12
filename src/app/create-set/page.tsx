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
import { useCreateCardMutation, useGetCardBySetIdQuery } from "../../../redux/features/cards/cardsApi";

export default function CreateSetPage() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  // const [cards, setCards] = useState([{ term: "", definition: "", id: null }]);
  const [terms, setTerms] = useState([{ term: "", definition: "", id: "" }]);
  const { user } = useSelector((state: any) => state.auth);
  const params = useSearchParams();
  const folderId = params.get('folderId');
  const [setId, setSetId] = useState(null);
  const [autosaveStatus, setAutosaveStatus] = useState("Saved");
  const [setName, setSetName] = useState("");
  const [createSet, { isLoading: isCreating }] = useCreateSetMutation();
  const [updateSet, { isLoading: isUpdating }] = useUpdateSetMutation();
  const [createCard, { isLoading: isCreatingCards }] = useCreateCardMutation();
  const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null);
  const [timeSinceLastSave, setTimeSinceLastSave] = useState<string>("0s");
  console.log(user);
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


  // Update card fields as the user types


  const handleAddTerm = () => {
    setTerms([...terms, { term: "", definition: "", id: "" }]);
  };
  const handleSubmit = async () => {
    // Here you would typically save the set to your backend
    // console.log({ title, description, terms });
    await updateSet({id:setId,isDraft: false});

    router.push("/folder ");
  };
  useEffect(() => {
    setAutosaveStatus("Saving...");
    const timer = setTimeout(() => {
      autosave();
    }, 3000);
    return () => clearTimeout(timer);
  }, [setId, terms, title, description]);



  // console.log('title', title);
  // console.log('description', description);
  // console.log('terms', terms);
  // console.log('folder', folderId)

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
                      className="grid grid-cols-2 gap-4 p-4 border rounded-lg"
                    >
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