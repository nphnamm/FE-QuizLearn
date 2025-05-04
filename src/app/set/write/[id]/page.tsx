"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { cn } from "@/lib/utils";
import Protected from "@/hooks/useProtected";
import { useSelector } from "react-redux";
import { useGetCardBySetIdQuery } from "../../../../../redux/features/cards/cardsApi";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import {
  useCreateOrUpdateUserSessionMutation,
  useGetRandomAnswerChoicesQuery,
} from "../../../../../redux/features/userSessions/userSessionsApi";
import {
  useRestartSessionMutation,
  useUpdateProgressMutation,
} from "../../../../../redux/features/userProgresses/userProgressesApi";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription
} from "@/components/ui/dialog";

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

export default function WriteModePage() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user } = useSelector((state: any) => state.auth);
  const params = useParams();
  const id = params.id as string;
  const { data, isLoading, refetch } = useGetCardBySetIdQuery(id, {
    refetchOnMountOrArgChange: true,
    skip: false
  });

  const [cards, setCards] = useState<Card[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [progress, setProgress] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showContent, setShowContent] = useState(true);
  const [userSessionId, setUserSessionId] = useState<string | null>(null);
  const [isCompletedSession, setIsCompletedSession] = useState(false);

  const [createOrUpdateUserSession] = useCreateOrUpdateUserSessionMutation();
  const [updateProgress] = useUpdateProgressMutation();
  const [restart] = useRestartSessionMutation();

  // Initialize the session
  useEffect(() => {
    if (data) {
      setCards(data.sets);
      createUserSession();
    }
  }, [data]);

  // Refetch cards data on mount
  useEffect(() => {
    refetch();
  }, [refetch]);

  // Create user session
  const createUserSession = async () => {
    try {
      const response = await createOrUpdateUserSession({
        userId: user.id,
        setId: id,
        sessionType: "write",
        completed: false

      });

      setUserSessionId(response.data?.sessionId);

      // If there are remaining cards, use them
      const remainingCards = response.data?.remainingCards || [];
      if (remainingCards.length > 0) {
        setCards(remainingCards);
      } else if (data?.sets && data.sets.length > 0) {
        setCards(data.sets);
      }

      return response;
    } catch (error) {
      console.error("Failed to create user session:", error);
      return null;
    }
  };

  // Update user progress
  const updateUserProgress = async (isCorrect: boolean) => {
    try {
      if (userSessionId) {
        await updateProgress({
          sessionId: userSessionId,
          cardId: cards[currentCardIndex].id,
          isCorrect,
        });
      }
    } catch (error) {
      console.error("Failed to update user progress:", error);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim()) return;

    setAnswerSubmitted(true);

    // Improved answer validation
    const currentTerm = cards[currentCardIndex].term.toLowerCase().trim();
    const userTerm = userAnswer.toLowerCase().trim();

    // Check if answer is correct using more sophisticated matching
    const correct =
      userTerm === currentTerm ||
      currentTerm.includes(userTerm) ||
      userTerm.includes(currentTerm) ||
      (userTerm.length > 3 &&
        currentTerm.split(" ").some(word =>
          word.length > 3 && userTerm.includes(word.toLowerCase())));

    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      setCorrectAnswers(prev => prev + 1);
    }

    // Update progress
    await updateUserProgress(correct);
    setProgress(((currentCardIndex + 1) / cards.length) * 100);
  };

  const handleNextCard = async () => {
    if (currentCardIndex < cards.length - 1) {
      // Add transition effect when changing cards
      setShowContent(false);
      setTimeout(() => {
        setCurrentCardIndex(prev => prev + 1);
        setUserAnswer("");
        setAnswerSubmitted(false);
        setShowFeedback(false);
        setShowContent(true);
      }, 300);
    } else {
      // End of the set
      const res = await createOrUpdateUserSession({
        userId: user.id,
        setId: id,
        sessionType: "write",
        completed: false

      });

      console.log('res', res);
      if (res.data.remainingCards.length > 0) {
        setIsCompletedSession(false);
        setCurrentCardIndex(0);
        setUserAnswer("");
        setAnswerSubmitted(false);
        setShowFeedback(false);
        setCorrectAnswers(0);
        setProgress(0);
        setCards(res.data.remainingCards);
      } else {
        setIsCompletedSession(true);
      }

    }
  };

  const handleStartOver = async () => {
    setIsCompletedSession(false);
    setCurrentCardIndex(0);
    setUserAnswer("");
    setAnswerSubmitted(false);
    setShowFeedback(false);
    setCorrectAnswers(0);
    setProgress(0);

    if (userSessionId) {
      restart({ sessionId: userSessionId });

    }
    const res = await createOrUpdateUserSession({
      userId: user.id,
      setId: id,
      sessionType: "write",
      completed: false

    });
    setCards(res.data.remainingCards);
  };

  const handleBackToDashboard = () => {
    router.push(`/set/${id}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

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
              <h1 className="text-xl font-semibold">Write Mode</h1>
            </div>
            <Button variant="outline" onClick={handleBackToDashboard}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Set
            </Button>
          </div>
        </header>

        <Sidebar
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        <main
          className={cn(
            "transition-all bg-background duration-300 pt-24 px-8 pb-8",
            isSidebarOpen ? "ml-64" : "ml-20"
          )}
        >
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm font-medium">
                  {currentCardIndex + 1} of {cards.length} cards
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Card Section */}
            {cards.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div
                  className={cn(
                    "transition-all duration-300",
                    showContent ? "opacity-100 scale-100" : "opacity-0 scale-95"
                  )}
                >
                  <div className="space-y-6">
                    {/* Card term and image */}
                    <div className="text-center">
                      <h2 className="text-2xl font-bold mb-4">
                        {cards[currentCardIndex]?.definition}
                      </h2>

                      {/* Card image */}
                      {cards[currentCardIndex]?.imageUrl && (
                        <div className="relative w-full max-w-md mx-auto h-48 bg-gray-100 rounded-lg overflow-hidden mb-6">
                          <Image
                            src={cards[currentCardIndex].imageUrl}
                            alt={cards[currentCardIndex].term}
                            fill
                            className="object-contain"
                            priority
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const fallbackEl = document.createElement('div');
                              fallbackEl.className = 'flex items-center justify-center h-full text-gray-400';
                              fallbackEl.innerText = 'Image could not be loaded';
                              target.parentElement?.appendChild(fallbackEl);
                            }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Input area */}
                    <div className="space-y-4">
                      <Label htmlFor="answer" className="text-lg">
                        Write the term:
                      </Label>
                      <Input
                        id="answer"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        placeholder="Type your answer here..."
                        className="h-12"
                        disabled={answerSubmitted}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !answerSubmitted) {
                            handleSubmitAnswer();
                          } else if (e.key === 'Enter' && answerSubmitted) {
                            handleNextCard();
                          }
                        }}
                      />
                    </div>

                    {/* Feedback area */}
                    {showFeedback && (
                      <div
                        className={cn(
                          "p-4 rounded-lg mt-4",
                          isCorrect ? "bg-green-50" : "bg-red-50"
                        )}
                      >
                        <div className="flex items-start">
                          {isCorrect ? (
                            <CheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" />
                          ) : (
                            <XCircle className="h-6 w-6 text-red-500 mr-2 flex-shrink-0" />
                          )}
                          <div>
                            <p
                              className={cn(
                                "font-semibold",
                                isCorrect ? "text-green-700" : "text-red-700"
                              )}
                            >
                              {isCorrect ? "Correct!" : "Incorrect"}
                            </p>
                            <p className="text-sm mt-1">
                              {isCorrect
                                ? "Good job! Your answer matches the expected term."
                                : "The correct term is:"}
                            </p>
                            {!isCorrect && (
                              <p className="mt-2 text-sm font-medium">
                                {cards[currentCardIndex].term}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex justify-end space-x-4 mt-6">
                      {!answerSubmitted ? (
                        <Button onClick={handleSubmitAnswer}>Submit</Button>
                      ) : (
                        <Button onClick={handleNextCard}>
                          {currentCardIndex < cards.length - 1
                            ? "Next Card"
                            : "Finish"}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Completion Dialog */}
        <Dialog open={isCompletedSession} onOpenChange={setIsCompletedSession}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>You've completed this set!</DialogTitle>
              <DialogDescription>
                You got {correctAnswers} out of {cards.length} cards correct.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="text-center">
                <p className="mb-4 font-medium text-xl">
                  {correctAnswers === cards.length
                    ? "Perfect score! Great job! 🎉"
                    : correctAnswers > cards.length / 2
                      ? "Well done! Keep practicing to improve. 👍"
                      : "Keep studying to improve your score. 📚"}
                </p>
                <div className="flex justify-center gap-4">
                  <Button variant="outline" onClick={handleBackToDashboard}>
                    Back to Set
                  </Button>
                  <Button onClick={handleStartOver}>Start Over</Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Protected>
  );
}