"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { cn } from "@/lib/utils";
import Protected from "@/hooks/useProtected";

export default function CreateSetPage() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [terms, setTerms] = useState([{ term: "", definition: "" }]);
  const params = useParams();
  const folderId = params.folderId;
  const handleAddTerm = () => {
    setTerms([...terms, { term: "", definition: "" }]);
  };

  const handleTermChange = (index: number, field: "term" | "definition", value: string) => {
    const newTerms = [...terms];
    newTerms[index][field] = value;
    setTerms(newTerms);
  };

  const handleSubmit = () => {
    // Here you would typically save the set to your backend
    console.log({ title, description, terms });
    router.push("/folder ");
  };

  return (
    <Protected>
      <div className="min-h-screen bg-gray-50">
        <header className={cn(
          "bg-white border-b border-gray-200 fixed top-0 right-0 z-40 transition-all duration-300",
          isSidebarOpen ? "left-64" : "left-20"
        )}>
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
          </div>
        </header>

        <Sidebar
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        <main className={cn(
          "transition-all duration-300 pt-24 px-8",
          isSidebarOpen ? "ml-64" : "ml-20"
        )}>
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
                    <div key={index} className="grid grid-cols-2 gap-4 p-4 border rounded-lg">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Term {index + 1}
                        </label>
                        <Input
                          placeholder="Enter term"
                          value={term.term}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleTermChange(index, "term", e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Definition
                        </label>
                        <Input
                          placeholder="Enter definition"
                          value={term.definition}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleTermChange(index, "definition", e.target.value)}
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