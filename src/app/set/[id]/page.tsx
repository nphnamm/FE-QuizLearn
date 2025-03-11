"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { cn } from "@/lib/utils";
import Protected from "@/hooks/useProtected";
import { useSelector } from "react-redux";
import { useGetCardBySetIdQuery } from "../../../../redux/features/cards/cardsApi";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useCreateOrUpdateUserSessionMutation, useGetRandomAnswerChoicesQuery } from "../../../../redux/features/userSessions/userSessionsApi";
import { useRestartSessionMutation, useUpdateProgressMutation } from "../../../../redux/features/userProgresses/userProgressesApi";

type StudyMode = "flashcards" | "learn" | "test";
type LearnMode = "multiple-choice" | "write" | "flashcard";

interface Card {
  id: string;
  term: string;
  definition: string;
}

interface AnswerChoice {
  id: string;
  text: string;
  isCorrect: boolean;
}

export default function StudySetPage() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user } = useSelector((state: any) => state.auth);
  const params = useParams();
  const id = params.id;
  const { data, isLoading } = useGetCardBySetIdQuery(id, {});

  const [currentMode, setCurrentMode] = useState<StudyMode>("flashcards");
  const [learnMode, setLearnMode] = useState<LearnMode>("multiple-choice");
  const [showModeSelector, setShowModeSelector] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [testAnswers, setTestAnswers] = useState<Record<number, string>>({});
  const [showTestResults, setShowTestResults] = useState(false);
  const [learningProgress, setLearningProgress] = useState<Record<number, 'correct' | 'incorrect' | 'skipped'>>({});
  const [cards, setCards] = useState<Card[]>([]);
  const [showContent, setShowContent] = useState(true);
  const [currentAnswerChoices, setCurrentAnswerChoices] = useState<AnswerChoice[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [isLoadingChoices, setIsLoadingChoices] = useState(false);
  const [userSessionId, setUserSessionId] = useState<string | null>(null);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [createOrUpdateUserSession, { isLoading: isCreatingUserSession }] = useCreateOrUpdateUserSessionMutation();
  const [updateProgress, { isLoading: isUpdatingProgress }] = useUpdateProgressMutation();
  const [restart, { isLoading: isRestarting }] = useRestartSessionMutation();

  const [isCompletedSession, setIsCompletedSession] = useState(false);
  const { data: answerChoicesData, isLoading: isLoadingAnswerChoices } = useGetRandomAnswerChoicesQuery(
    { setId: id, cardId: cards[currentCardIndex]?.id },
    { skip: !cards[currentCardIndex]?.id }
  );

  useEffect(() => {
    if (data) {
      setCards(data.sets);
    }
  }, [data]);

  // Create user session when starting multiple-choice mode
  const createUserSession = async () => {
    try {
      const response = await createOrUpdateUserSession({
        userId: user.id,
        setId: id,
      });
      console.log('response', response)
      setUserSessionId(response.data?.sessionId);
      if (response.data?.remainingCards.length > 0) {
        setCards(response.data?.remainingCards);
      } else {
        setIsCompletedSession(true);

      }

      // Assuming the response has a data field with sessionId
    } catch (error) {
      console.error("Failed to create user session:", error);
      return null;
    }
  };
  const handleStartOver = () => {
    setIsCompletedSession(false);
    setCurrentCardIndex(0);
    setLearningProgress({});
    setSelectedAnswer(null);
    setAnswerSubmitted(false);
    setTotalCorrect(0);
    
    restart({
      sessionId: userSessionId,
    });

  }

  // Process the answer choices from the API response format
  const processAnswerChoices = (data: any) => {
    if (!data) return [];

    // Create choices array from the API response
    const choices = data.choices.map((choice: string, index: number) => ({
      id: String(index),
      text: choice,
      isCorrect: choice === data.correctAnswer
    }));

    return choices;
  };

  // Fetch answer choices for multiple-choice mode
  const fetchAnswerChoices = async (cardId: string) => {
    setIsLoadingChoices(true);
    try {
      if (answerChoicesData) {
        const formattedChoices = processAnswerChoices(answerChoicesData);
        setCurrentAnswerChoices(formattedChoices);
      } else {
        // Fallback in case API data isn't available
        setCurrentAnswerChoices([
          { id: '0', text: cards[currentCardIndex].definition, isCorrect: true },
          { id: '1', text: "Incorrect answer 1", isCorrect: false },
          { id: '2', text: "Incorrect answer 2", isCorrect: false },
          { id: '3', text: "Incorrect answer 3", isCorrect: false },
        ]);
      }
    } catch (error) {
      console.error("Failed to process answer choices:", error);
      // Fallback choices in case of error
      setCurrentAnswerChoices([
        { id: '0', text: cards[currentCardIndex].definition, isCorrect: true },
        { id: '1', text: "Incorrect answer 1", isCorrect: false },
        { id: '2', text: "Incorrect answer 2", isCorrect: false },
        { id: '3', text: "Incorrect answer 3", isCorrect: false },
      ]);
    } finally {
      setIsLoadingChoices(false);
    }
  };

  // Update user progress
  const updateUserProgress = async (isCorrect: boolean) => {
    try {
      await updateProgress({
        sessionId: userSessionId,
        cardId: cards[currentCardIndex].id,
        isCorrect,
      });
    } catch (error) {
      console.error("Failed to update user progress:", error);
    }
  };

  // When answerChoicesData changes, update currentAnswerChoices
  useEffect(() => {
    if (answerChoicesData && currentMode === 'learn' && learnMode === 'multiple-choice') {
      const formattedChoices = processAnswerChoices(answerChoicesData);
      setCurrentAnswerChoices(formattedChoices);
      setIsLoadingChoices(false);
    }
  }, [answerChoicesData, currentMode, learnMode]);

  // When current card changes, fetch new choices
  useEffect(() => {
    if (currentMode === 'learn' && learnMode === 'multiple-choice' && cards.length > 0 && userSessionId) {
      setIsLoadingChoices(true);
      fetchAnswerChoices(cards[currentCardIndex].id);
      setSelectedAnswer(null);
      setAnswerSubmitted(false);
    }
  }, [currentCardIndex, currentMode, learnMode, userSessionId]);

  const handleModeChange = async (mode: StudyMode) => {
    setCurrentMode(mode);
    if (mode === 'learn') {
      setShowModeSelector(true);
    }
  };

  const handleLearnModeSelect = async (mode: LearnMode) => {
    setLearnMode(mode);
    setShowModeSelector(false);

    // Reset state for new mode
    setCurrentCardIndex(0);
    setLearningProgress({});
    setSelectedAnswer(null);
    setAnswerSubmitted(false);
    setTotalCorrect(0);

    if (mode === 'multiple-choice') {
      const session = await createUserSession();
      console.log('session', session)
      if (cards.length > 0) {
        setIsLoadingChoices(true);
        fetchAnswerChoices(cards[0].id);
      }
    }
  };

  const handleNextCard = () => {
    if (!cards || cards.length === 0) return;

    // Add transition effect when changing cards
    setShowContent(false);
    setTimeout(() => {
      setIsFlipped(false);
      setCurrentCardIndex((prev) => (prev + 1) % cards.length);
      setShowContent(true);
    }, 300);
  };

  const handlePrevCard = () => {
    if (!cards || cards.length === 0) return;

    // Add transition effect when changing cards
    setShowContent(false);
    setTimeout(() => {
      setIsFlipped(false);
      setCurrentCardIndex((prev) => (prev - 1 + cards.length) % cards.length);
      setShowContent(true);
    }, 300);
  };

  const handleFlipCard = () => {
    // Add transition effect when flipping
    setShowContent(false);
    setTimeout(() => {
      setIsFlipped(!isFlipped);
      setShowContent(true);
    }, 300);
  };

  const handleLearnResponse = (response: 'correct' | 'incorrect' | 'skipped') => {
    setLearningProgress(prev => ({
      ...prev,
      [currentCardIndex]: response
    }));
    handleNextCard();
  };

  const handleTestSubmit = () => {
    setShowTestResults(true);
  };

  const handleMultipleChoiceSubmit = async () => {
    if (!selectedAnswer) return;

    setAnswerSubmitted(true);
    const selectedChoice = currentAnswerChoices.find(choice => choice.id === selectedAnswer);
    const isCorrect = selectedChoice?.isCorrect || false;

    if (isCorrect) {
      setTotalCorrect(prev => prev + 1);
    }

    // Update the learning progress
    setLearningProgress(prev => ({
      ...prev,
      [currentCardIndex]: isCorrect ? 'correct' : 'incorrect'
    }));

    // Update user progress via API
    await updateUserProgress(isCorrect);
  };

  const handleNextQuestion = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setAnswerSubmitted(false);
    } else {
      // End of the set, show results
      setShowTestResults(true);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  // if (!cards || cards.length === 0) {
  //   return <div className="flex items-center justify-center min-h-screen">No flashcards found in this set.</div>;
  // }

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
              <h1 className="text-xl font-semibold">Study Set</h1>
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
          <div className="max-w-4xl mx-auto">
            <Tabs
              defaultValue="flashcards"
              className="w-full"
              onValueChange={(value: any) => handleModeChange(value)}
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
                <TabsTrigger value="learn">Learn</TabsTrigger>
                <TabsTrigger value="test">Test</TabsTrigger>
              </TabsList>

              <TabsContent value="flashcards" className="mt-6">
                <div className="flex flex-col items-center">
                  <div className="w-full max-w-2xl aspect-[3/2] relative">
                    <Card
                      className={cn(
                        "w-full h-full cursor-pointer flex items-center justify-center p-8 text-2xl text-center",
                        "transition-all duration-300",
                        showContent ? "opacity-100 scale-100" : "opacity-0 scale-95"
                      )}
                      onClick={handleFlipCard}
                    >
                      <CardContent className="flex items-center justify-center h-full">
                        {isFlipped
                          ? <span>{cards[currentCardIndex]?.definition || "No definition available"}</span>
                          : <span>{cards[currentCardIndex]?.term || "No term available"}</span>
                        }
                      </CardContent>
                    </Card>
                  </div>
                  <div className="flex gap-4 mt-6">
                    <Button onClick={handlePrevCard}>Previous</Button>
                    <Button onClick={handleNextCard}>Next</Button>
                  </div>
                  <div className="mt-4 text-sm text-gray-500">
                    Card {currentCardIndex + 1} of {cards.length}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="learn" className="mt-6">
                {learnMode === 'multiple-choice' && (
                  <div className="flex flex-col items-center">
                    {showTestResults ? (
                      <div className="w-full max-w-2xl">
                        <Card className="p-6">
                          <h2 className="text-xl font-bold mb-4">Your Results</h2>
                          <div className="text-center mb-6">
                            <p className="text-3xl font-bold">{totalCorrect} / {cards.length}</p>
                            <p className="text-gray-500">correct answers</p>
                          </div>
                          <div className="space-y-4">
                            {cards.map((card, idx) => {
                              const result = learningProgress[idx];
                              return (
                                <div
                                  key={card.id}
                                  className={cn(
                                    "p-4 rounded-lg",
                                    result === 'correct' ? "bg-green-50 border border-green-200" :
                                      result === 'incorrect' ? "bg-red-50 border border-red-200" :
                                        "bg-gray-50 border border-gray-200"
                                  )}
                                >
                                  <p className="font-medium">{card.term}</p>
                                  <p className="text-gray-600">{card.definition}</p>
                                  <p className={cn(
                                    "mt-2 text-sm",
                                    result === 'correct' ? "text-green-600" :
                                      result === 'incorrect' ? "text-red-600" :
                                        "text-gray-600"
                                  )}>
                                    {result === 'correct' ? "Correct" :
                                      result === 'incorrect' ? "Incorrect" :
                                        "Skipped"}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                          <Button
                            className="w-full mt-6"
                            onClick={() => {
                              setCurrentCardIndex(0);
                              setLearningProgress({});
                              setSelectedAnswer(null);
                              setAnswerSubmitted(false);
                              setShowTestResults(false);
                              setTotalCorrect(0);
                              // Recreate session
                              setCards(cards)
                            }}
                          >
                            Start Over
                          </Button>

                        </Card>



                      </div>
                    ) : (
                      <Card className="w-full max-w-2xl p-6">
                        <div className="flex justify-between items-center mb-6">
                          <h3 className="text-lg font-semibold">
                            Question {currentCardIndex + 1} of {cards.length}
                          </h3>
                          <div className="text-sm text-gray-500">
                            {Object.values(learningProgress).filter(p => p === 'correct').length} correct
                          </div>
                        </div>

                        <h2 className="text-xl font-bold mb-6">{cards[currentCardIndex]?.term || "No term available"}</h2>

                        {isLoadingChoices || isLoadingAnswerChoices ? (
                          <div className="flex justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                          </div>
                        ) : (
                          <RadioGroup
                            className="space-y-4"
                            value={selectedAnswer || ""}
                            onValueChange={setSelectedAnswer}
                            disabled={answerSubmitted}
                          >
                            {currentAnswerChoices.map((choice) => {
                              const isSelected = selectedAnswer === choice.id;
                              const showResult = answerSubmitted;
                              const isCorrect = choice.isCorrect;

                              return (
                                <div
                                  key={choice.id}
                                  className={cn(
                                    "flex items-start space-x-2 p-4 rounded-lg border",
                                    !showResult && isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200",
                                    showResult && isSelected && isCorrect ? "border-green-500 bg-green-50" : "",
                                    showResult && isSelected && !isCorrect ? "border-red-500 bg-red-50" : "",
                                    showResult && !isSelected && isCorrect ? "border-green-500 bg-green-50" : ""
                                  )}
                                >
                                  <RadioGroupItem value={choice.id} id={choice.id} />
                                  <Label
                                    htmlFor={choice.id}
                                    className={cn(
                                      "flex-grow",
                                      showResult && isCorrect ? "text-green-700 font-medium" : "",
                                      showResult && isSelected && !isCorrect ? "text-red-700" : ""
                                    )}
                                  >
                                    {choice.text}
                                    {showResult && isCorrect && (
                                      <span className="ml-2 text-green-600">✓</span>
                                    )}
                                    {showResult && isSelected && !isCorrect && (
                                      <span className="ml-2 text-red-600">✗</span>
                                    )}
                                  </Label>
                                </div>
                              );
                            })}
                          </RadioGroup>
                        )}

                        <div className="mt-6 flex gap-4 justify-end">
                          {!answerSubmitted ? (
                            <Button
                              disabled={!selectedAnswer || isLoadingChoices || isLoadingAnswerChoices}
                              onClick={handleMultipleChoiceSubmit}
                            >
                              Submit Answer
                            </Button>
                          ) : (
                            <Button onClick={handleNextQuestion}>
                              {currentCardIndex < cards.length - 1 ? "Next Question" : "See Results"}
                            </Button>
                          )}
                        </div>
                      </Card>
                    )}
                  </div>
                )}

                {learnMode === 'flashcard' && (
                  <div className="flex flex-col items-center">
                    <Card className="w-full max-w-2xl p-6">
                      <h3 className="text-lg font-semibold mb-4">
                        Term: {cards[currentCardIndex]?.term || "No term available"}
                      </h3>
                      <div className="mt-6 flex gap-4 justify-center">
                        <Button
                          variant="outline"
                          onClick={() => handleLearnResponse('skipped')}
                        >
                          Skip
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleLearnResponse('incorrect')}
                        >
                          Don't Know
                        </Button>
                        <Button
                          variant="default"
                          onClick={() => handleLearnResponse('correct')}
                        >
                          Know It
                        </Button>
                      </div>
                    </Card>
                    <div className="mt-4 text-sm text-gray-500">
                      Progress: {Object.keys(learningProgress).length} of {cards.length} cards
                    </div>
                  </div>
                )}

                {learnMode === 'write' && (
                  <div className="flex flex-col items-center">
                    <Card className="w-full max-w-2xl p-6">
                      <h3 className="text-lg font-semibold mb-4">
                        Write the definition for: {cards[currentCardIndex]?.term || "No term available"}
                      </h3>
                      {/* Implement write mode interface here */}
                      <p className="text-gray-500 italic py-6 text-center">Write mode under development</p>
                    </Card>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="test" className="mt-6">
                <div className="space-y-6">
                  {!showTestResults ? (
                    <>
                      {cards.map((card, index) => (
                        <Card key={card.id || index} className="p-6">
                          <h3 className="text-lg font-semibold mb-4">
                            {index + 1}. {card.term || "No term available"}
                          </h3>
                          <textarea
                            className="w-full p-2 border rounded"
                            rows={3}
                            value={testAnswers[index] || ''}
                            onChange={(e) => setTestAnswers(prev => ({
                              ...prev,
                              [index]: e.target.value
                            }))}
                            placeholder="Enter your answer..."
                          />
                        </Card>
                      ))}
                      <Button
                        className="w-full"
                        onClick={handleTestSubmit}
                      >
                        Submit Test
                      </Button>
                    </>
                  ) : (
                    <div className="space-y-6">
                      <h2 className="text-xl font-bold">Test Results</h2>
                      {cards.map((card, index) => (
                        <Card key={card.id || index} className="p-6">
                          <div className="space-y-2">
                            <p className="font-semibold">Term: {card.term || "No term available"}</p>
                            <p className="text-gray-600">Your answer: {testAnswers[index] || "No answer provided"}</p>
                            <p className="text-gray-600">Correct answer: {card.definition || "No definition available"}</p>
                          </div>
                        </Card>
                      ))}
                      <Button
                        onClick={() => {
                          setShowTestResults(false);
                          setTestAnswers({});
                        }}
                      >
                        Retake Test
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            {/* Modal for selecting Learn mode */}
            <Dialog open={showModeSelector} onOpenChange={setShowModeSelector}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Choose Study Mode</DialogTitle>
                  <DialogDescription>
                    Select how you want to study this set
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <RadioGroup
                    defaultValue="multiple-choice"
                    className="grid grid-cols-1 gap-4"
                    value={learnMode}
                    onValueChange={(value: LearnMode) => setLearnMode(value)}
                  >
                    <div className="flex items-center space-x-2 border p-4 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <RadioGroupItem value="multiple-choice" id="multiple-choice" />
                      <Label htmlFor="multiple-choice" className="flex flex-col cursor-pointer flex-grow">
                        <span className="font-medium">Multiple Choice</span>
                        <span className="text-sm text-gray-500">Test your knowledge with multiple choice questions</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 border p-4 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <RadioGroupItem value="write" id="write" />
                      <Label htmlFor="write" className="flex flex-col cursor-pointer flex-grow">
                        <span className="font-medium">Write</span>
                        <span className="text-sm text-gray-500">Practice writing the definitions</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 border p-4 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <RadioGroupItem value="flashcard" id="flashcard" />
                      <Label htmlFor="flashcard" className="flex flex-col cursor-pointer flex-grow">
                        <span className="font-medium">Flashcard</span>
                        <span className="text-sm text-gray-500">Study with interactive flashcards</span>
                      </Label>
                    </div>
                  </RadioGroup>

                  <div className="flex justify-end mt-4">
                    <Button
                      className="px-8"
                      onClick={() => handleLearnModeSelect(learnMode)}
                    >
                      Start
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
                
            <Dialog open={isCompletedSession} onOpenChange={setIsCompletedSession}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>You have finished this set</DialogTitle>
                  <DialogDescription>
                    Would you like to start over?
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
   

                  <div className="flex justify-end mt-4">
                    <Button
                      className="px-8"
                      onClick={handleStartOver}
                    >
                      Start Over
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Display All Cards Below the Tabs */}
            {
              currentMode !== 'learn' && currentMode !== 'test' && (
                <div className="mt-8">
                  <h2 className="text-2xl font-semibold mb-4">All Cards</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {cards.map((card) => (
                      <Card key={card.id} className="p-4">
                        <h3 className="text-lg font-semibold">{card.term}</h3>
                        <p className="text-gray-600">{card.definition}</p>
                      </Card>
                    ))}
                  </div>
                </div>
              )
            }
          </div>
        </main>
      </div>
    </Protected>
  );
}