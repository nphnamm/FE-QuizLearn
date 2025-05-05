"use client";

import React, { useEffect, useState } from "react";
import {
  useCreateOrUpdateUserSessionMutation,
  useGetRandomAnswerChoicesQuery,
} from "../../../../../redux/features/userSessions/userSessionsApi";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import Protected from "@/hooks/useProtected";
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/dashboard/Sidebar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  useRestartSessionMutation,
  useUpdateProgressMutation,
} from "../../../../../redux/features/userProgresses/userProgressesApi";
import { useGetCardBySetIdQuery } from "../../../../../redux/features/cards/cardsApi";
import { Card } from "@/components/ui/card";
import { Flame, Loader2 } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type Props = {};

const page = (props: Props) => {
  const params = useParams();
  const id = params.id;
  const [createOrUpdateUserSession, { isLoading: isCreatingUserSession }] =
    useCreateOrUpdateUserSessionMutation();
  const { user } = useSelector((state: any) => state.auth);
  const [remainingCards, setRemainingCards] = useState<any[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSessionCompleted, setIsSessionCompleted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLearning, setIsLearning] = useState(false);
  const [restart, { isLoading: isRestarting }] = useRestartSessionMutation();
  const { data: allCardsOfSet, isLoading: isLoadingAllCardsOfSet } =
    useGetCardBySetIdQuery(id, {});
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [currentCard, setCurrentCard] = useState<any>(null);
  const [cards, setCards] = useState<any[]>([]);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [showTestResults, setShowTestResults] = useState(false);
  const [answeredCards, setAnsweredCards] = useState<any[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [totalCardsInSession, setTotalCardsInSession] = useState(0);
  const [isNewStreakPopup, setIsNewStreakPopup] = useState(false);
  const { data: answerChoicesData, isLoading: isLoadingAnswerChoices } =
    useGetRandomAnswerChoicesQuery(
      { setId: id, cardId: remainingCards[currentCardIndex]?.id },
      { skip: !remainingCards[currentCardIndex]?.id }
    );
  const [totalRounds, setTotalRounds] = useState(1);
  const [cardResult, setCardResult] = useState<{
    cardId: string;
    isCorrect: boolean;
    term: string;
    definition: string;
    round: number;
  }[]>([]);
  const [cardResultsByRound, setCardResultsByRound] = useState({});
  const allDays = ["F", "Sa", "Su", "M", "Tu", "W", "Th"];
  const streakCount=5
  const streakDays =["F", "Sa", "Su", "M", "Tu"];
  const [updateProgress, { isLoading: isUpdatingProgress }] =
    useUpdateProgressMutation();
  const handleStartOver = async () => {
    // const response = await restart({
    //   sessionId: sessionId,
    // });

    // console.log("response", response);

    // Recreate session
    const res = await createOrUpdateUserSession({
      setId: id as string,
      userId: user?.id,
      sessionType: "multi-choice",
      completed: false

    });
    setAnsweredCards([]);
    setCardResult([]);
    setCardResultsByRound({});
    setIsSessionCompleted(false);
    setCurrentCardIndex(0);
    setShowTestResults(false);
    setTotalCorrect(0);
    setSelectedAnswer(null);
    setRemainingCards(res?.data?.remainingCards);
    setTotalCardsInSession(res?.data?.remainingCards?.length);
    setAnswerSubmitted(false);
    setIsCompleted(false);
    setTotalRounds(1);
  };

  const handleMultipleChoiceSubmit = async () => {
    if (!selectedAnswer) return;

    setAnswerSubmitted(true);
    const selectedChoice = answerChoicesData?.choices.find(
      (choice: any) => choice.id === selectedAnswer
    );
    // console.log("selectedAnswer", selectedAnswer);

    // console.log("answerChoicesData", answerChoicesData);

    const isCorrect =
      answerChoicesData?.correctAnswerId == selectedAnswer || false;

    // console.log("isCorrect", isCorrect);
    if (isCorrect) {
      setAnsweredCards((prev) => [...prev, remainingCards[currentCardIndex]]);
      setTotalCorrect(totalCorrect + 1);
      setCardResult((prev) => [
        ...prev,
        {
          cardId: remainingCards[currentCardIndex]?.id,
          isCorrect: true,
          term: remainingCards[currentCardIndex]?.term,
          definition: remainingCards[currentCardIndex]?.definition,
          round: remainingCards[currentCardIndex]?.timesAnswered + 1,
        },
      ]);

      try {
        await updateProgress({
          sessionId: sessionId,
          cardId: remainingCards[currentCardIndex].id,
          isCorrect,
          timesAnswered: remainingCards[currentCardIndex].timesAnswered == 1 ? 1 : remainingCards[currentCardIndex].timesAnswered + 1,
        });
      } catch (error) {
        toast.error("Failed to update user progress!");
      }
    } else {
      setCardResult((prev) => [
        ...prev,
        {
          cardId: remainingCards[currentCardIndex]?.id,
          isCorrect: false,
          term: remainingCards[currentCardIndex]?.term,
          definition: remainingCards[currentCardIndex]?.definition,
          round: remainingCards[currentCardIndex]?.timesAnswered + 1,
        },
      ]);
      try {
        await updateProgress({
          sessionId: sessionId,
          cardId: remainingCards[currentCardIndex].id,
          isCorrect,
          timesAnswered: remainingCards[currentCardIndex].timesAnswered + 1,
        });
      } catch (error) {
        toast.error("Failed to update user progress!");
      }
    }

    // Update the learning progress
    // setLearningProgress((prev) => ({
    //   ...prev,
    //   [currentCardIndex]: isCorrect ? "correct" : "incorrect",
    // }));

    // Update user progress via API
  };
  // console.log("selectedAnswer", selectedAnswer);
  // console.log("cardResultsByRound", cardResultsByRound);
  const handleStartLearning = async () => {
    const response = await createOrUpdateUserSession({
      setId: id as string,
      userId: user?.id,
      sessionType: "multi-choice",
      completed: false

    });
    // console.log("response", response);
    setSessionId(response?.data?.sessionId);
    setRemainingCards(response?.data?.remainingCards);
    setIsLearning(true);
    setIsCompleted(response?.data?.isCompleted);
    setTotalCorrect(
      allCardsOfSet?.sets?.length - response?.data?.remainingCards?.length
    );
    // setCards(allCardsOfSet?.data);
    const remainingCardIds = new Set(
      response?.data?.remainingCards.map((card: any) => card.id)
    );
    const allCards = allCardsOfSet?.sets;
    setCards(allCards);
    const answeredCards = allCards.filter(
      (card: any) => !remainingCardIds.has(card.id)
    );
    setAnsweredCards(answeredCards);
    setTotalCardsInSession(response?.data?.remainingCards?.length);
  };
  const resetRemaingCards = async () => {
    const res = await createOrUpdateUserSession({
      setId: id as string,
      userId: user?.id,
      sessionType: "multi-choice",
      completed: false

    });
    setShowTestResults(false);
    setTotalCorrect(0);
    setCurrentCardIndex(0);
    setRemainingCards(res?.data?.remainingCards);
    setSelectedAnswer(null);
    setAnswerSubmitted(false);
    setCardResult([]);
    setTotalCardsInSession(res?.data?.remainingCards?.length);
  };
  const handleNextQuestion = async () => {
    if (currentCardIndex < remainingCards.length - 1) {
      setCurrentCardIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setAnswerSubmitted(false);
    } else {
      setTotalRounds(totalRounds + 1);
      setCardResultsByRound((prev) => ({
        ...prev,
        [totalRounds]: cardResult,
      }));

      // End of the set, show results and mark session as completed
      // setShowTestResults(true);
      const res = await createOrUpdateUserSession({
        setId: id as string,
        userId: user?.id,
        sessionType: "multi-choice",
        completed: false

      });
      // console.log("res", res);
      if (res.data?.isNewStreak) {
        setIsNewStreakPopup(true);
      }
      if (res?.data?.isCompleted) {
        setIsSessionCompleted(true);
        setShowTestResults(true);
      } else {
        setShowTestResults(true);
      }
      // setShowTestResults(true);
    }
  };
  console.log('is', isNewStreakPopup);
  console.log("cardResultsByRound", cardResultsByRound);

  // console.log("cardResult", cardResult);
  console.log("totalRounds", totalRounds);
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
              <h1 className="text-xl font-semibold">Study Set</h1>
            </div>
          </div>
        </header>

        <Sidebar
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        <main
          className={cn(
            "transition-all duration-300 pt-24 px-8 bg-background min-h-screen",
            isSidebarOpen ? "ml-64" : "ml-20"
          )}
        >
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col items-center">
              {showTestResults ? (
                <div className="w-full max-w-2xl">
                  <Card className="p-6">
                    <h2 className="text-xl font-bold mb-4">Your Results</h2>
                    <div className="text-center mb-6">
                      <p className="text-3xl font-bold">
                        {totalCorrect} / {isSessionCompleted ? cards.length : totalCardsInSession}
                      </p>
                      <p className="text-gray-500">correct answers</p>
                    </div>
                    {/* Display answered cards */}
                    {cardResult.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-3">
                          Completed Questions
                        </h3>
                        <div className="space-y-3">
                          {cardResultsByRound && Object.keys(cardResultsByRound).length > 0 ? (
                            Object.entries(cardResultsByRound).map(
                              ([round, results], index) => (
                                <div key={round}>
                                  <h3>Round {parseInt(round)} Results:</h3>
                                  <ul className="flex flex-col gap-2">
                                    {(results as any[]).map((result, i) => (

                                      <div
                                        key={result.id}
                                        className={cn(
                                          "p-4 rounded-lg",
                                          result.isCorrect
                                            ? "bg-green-50 border border-green-200"
                                            : "bg-red-50 border border-red-200"
                                        )}
                                      >
                                        <p className="font-medium text-lg text-black">{result.term}</p>
                                        <p className="text-gray-600">
                                          {result.definition}
                                        </p>
                                        <p
                                          className={cn(
                                            "mt-2 text-sm",
                                            result.isCorrect
                                              ? "text-green-600"
                                              : "text-red-600"
                                          )}
                                        >
                                          {result.isCorrect
                                            ? "Correct"
                                            : "Incorrect"}
                                        </p>
                                      </div>
                                    ))}
                                  </ul>
                                </div>
                              )
                            )
                          ) : (
                            <div>No results yet.</div>
                          )}
                          {/* {cardResult.map((card: any) => {
                            // const result = learningProgress[cards.findIndex(c => c.id === card.id)];
                            return (

                              <div
                                key={card.id}
                                className={cn(
                                  "p-4 rounded-lg",
                                  card.isCorrect
                                    ? "bg-green-50 border border-green-200"
                                    : "bg-red-50 border border-red-200"
                                )}
                              >
                                <p className="font-medium">{card.term}</p>
                                <p className="text-gray-600">
                                  {card.definition}
                                </p>
                                <p
                                  className={cn(
                                    "mt-2 text-sm",
                                    card.isCorrect
                                      ? "text-green-600"
                                      : "text-red-600"
                                  )}
                                >
                                  {card.isCorrect
                                    ? "Correct"
                                    : "Incorrect"}
                                </p>
                              </div>
                            );
                          })} */}
                        </div>
                      </div>
                    )}

                    {isSessionCompleted ? (
                      <Button className="w-full mt-6" onClick={handleStartOver}>
                        Start Over
                      </Button>
                    ) : (
                      <Button className="w-full mt-6" onClick={resetRemaingCards}>
                        Continue
                      </Button>
                    )}
                  </Card>
                </div>
              ) : (
                <Card className="w-full max-w-2xl p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold">
                      Question {currentCardIndex + 1} of {totalCardsInSession}
                    </h3>
                    {/* <div className="text-sm text-gray-500">
                                                {
                                                    Object.values(learningProgress).filter(
                                                        (p) => p === "correct"
                                                    ).length
                                                }{" "}
                                                correct
                                            </div> */}
                  </div>

                  <h2 className="text-xl font-bold mb-6">
                    {answerChoicesData?.question?.term || "No term available"}
                  </h2>

                  {isLoadingAnswerChoices ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    </div>
                  ) : (
                    <RadioGroup
                      className="space-y-4"
                      value={selectedAnswer || ""}
                      onValueChange={setSelectedAnswer}
                    // disabled={answerSubmitted}
                    >
                      {answerChoicesData?.choices.map((choice: any) => {
                        const isSelected = selectedAnswer === choice.id;
                        const showResult = answerSubmitted;
                        const isCorrect =
                          answerChoicesData.correctAnswerId === choice.id;

                        return (
                          <div
                            key={choice.id}
                            className={cn(
                              "flex items-start space-x-2 p-4 rounded-lg border",
                              !showResult && isSelected
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200",
                              showResult && isSelected && isCorrect
                                ? "border-green-500 bg-green-50"
                                : "",
                              showResult && isSelected && !isCorrect
                                ? "border-red-500 bg-red-50"
                                : "",
                              showResult && !isSelected && isCorrect
                                ? "border-green-500 bg-green-50"
                                : ""
                            )}
                          >
                            <RadioGroupItem value={choice.id} id={choice.id} />
                            <Label
                              htmlFor={choice.id}
                              className={cn(
                                "flex-grow  ",
                                showResult && isCorrect
                                  ? "text-green-700 font-medium"
                                  : "",
                                showResult && isSelected && !isCorrect
                                  ? "text-red-700"
                                  : ""
                              )}
                            >
                              {choice.definition}
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
                        disabled={!selectedAnswer || isLoadingAnswerChoices}
                        onClick={handleMultipleChoiceSubmit}
                      >
                        Submit Answer
                      </Button>
                    ) : (
                      <Button onClick={handleNextQuestion}>
                        {currentCardIndex < cards?.length - 1
                          ? "Next Question"
                          : "See Results"}
                      </Button>
                    )}
                  </div>
                </Card>
              )}
            </div>

            <Dialog open={!isLearning} onOpenChange={setIsLearning}>
              <DialogContent className="sm:max-w-md">
                <div className="grid gap-4 py-4">
                  <div className="flex justify-end mt-4">
                    <Button className="px-8" onClick={handleStartLearning}>
                      Start Learning
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Dialog open={isCompleted} onOpenChange={setIsCompleted}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>You have finished this set</DialogTitle>
                  <DialogDescription>
                    Would you like to start over?
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="flex justify-end mt-4">
                    <Button className="px-8" onClick={handleStartOver}>
                      Start Over
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={isNewStreakPopup} onOpenChange={setIsNewStreakPopup}>
              <DialogContent className="max-w-sm rounded-xl text-center px-6 py-8">
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <Flame className="text-orange-500 w-16 h-16" />
                    <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-3xl">
                      {streakCount}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-orange-600 mt-4">{streakCount} day streak!</h2>

                  <div className="mt-6 bg-gray-50 p-4 rounded-lg border">
                    <div className="flex justify-between gap-2 mb-2">
                      {allDays.map((day, index) => (
                        <div key={index} className="flex flex-col items-center">
                          <div
                            className={cn(
                              "w-6 h-6 rounded-full border",
                              streakDays.includes(day)
                                ? "bg-orange-500 text-white border-orange-500"
                                : "bg-white text-gray-400"
                            )}
                          >
                            ✓
                          </div>
                          <span
                            className={cn(
                              "text-xs mt-1",
                              streakDays.includes(day)
                                ? "text-orange-600 font-medium"
                                : "text-gray-400"
                            )}
                          >
                            {day}
                          </span>
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600">
                      A <span className="text-orange-600 font-semibold">streak</span> counts how many days you’ve practiced in a row
                    </p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Display All Cards Below the Tabs */}
          </div>
        </main>
      </div>
    </Protected>
  );
};

export default page;
