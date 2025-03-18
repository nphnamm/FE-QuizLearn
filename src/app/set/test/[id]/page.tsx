"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  useCreateOrUpdateUserSessionMutation,
  useGetRandomAnswerChoicesQuery,
} from "../../../../../redux/features/userSessions/userSessionsApi";
import {
  useRestartSessionMutation,
  useUpdateProgressMutation,
} from "../../../../../redux/features/userProgresses/userProgressesApi";
import { useGetCardBySetIdQuery } from "../../../../../redux/features/cards/cardsApi";

type QuestionType = "multiple-choice" | "written";

interface Question {
  id: string;
  term: string;
  definition: string;
  type: QuestionType;
}

export default function TestModePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const { user } = useSelector((state: any) => state.auth);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Session state
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [isTestCompleted, setIsTestCompleted] = useState(false);
  const [showTestResults, setShowTestResults] = useState(false);
  
  // Questions state
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showContent, setShowContent] = useState(true);
  
  // Answer state
  const [userAnswer, setUserAnswer] = useState("");
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  
  // Progress tracking
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [progress, setProgress] = useState(0);
  const [testResults, setTestResults] = useState<{
    questionId: string;
    isCorrect: boolean;
    userAnswer: string;
    correctAnswer: string;
    term: string;
    type: QuestionType;
  }[]>([]);

  // API hooks
  const [createOrUpdateUserSession, { isLoading: isCreatingUserSession }] =
    useCreateOrUpdateUserSessionMutation();
  const [updateProgress, { isLoading: isUpdatingProgress }] =
    useUpdateProgressMutation();
  const [restart, { isLoading: isRestarting }] = useRestartSessionMutation();
  const { data: allCardsOfSet, isLoading: isLoadingAllCardsOfSet } =
    useGetCardBySetIdQuery(id, {});
  const { data: answerChoicesData, isLoading: isLoadingAnswerChoices } =
    useGetRandomAnswerChoicesQuery(
      { 
        setId: id, 
        cardId: questions[currentQuestionIndex]?.id 
      },
      { 
        skip: !questions[currentQuestionIndex]?.id || 
              questions[currentQuestionIndex]?.type !== "multiple-choice" 
      }
    );

  useEffect(() => {
    if (allCardsOfSet?.sets) {
      // Create a mix of multiple choice and written questions
      const mixedQuestions = allCardsOfSet.sets.map((card: any, index: number) => ({
        ...card,
        type: index % 2 === 0 ? "multiple-choice" : "written" as QuestionType
      }));
      
      // Shuffle the questions
      const shuffledQuestions = [...mixedQuestions].sort(() => Math.random() - 0.5);
      setQuestions(shuffledQuestions);
    }
  }, [allCardsOfSet]);

  const handleStartTest = async () => {
    const response = await createOrUpdateUserSession({
      setId: id as string,
      userId: user?.id,
    });
    setSessionId(response?.data?.sessionId);
    setIsTestStarted(true);
    setProgress(0);
    setCorrectAnswers(0);
    setTestResults([]);
  };

  const validateWrittenAnswer = (userAnswer: string, correctAnswer: string) => {
    const normalizedUser = userAnswer.toLowerCase().trim();
    const normalizedCorrect = correctAnswer.toLowerCase().trim();
    
    return (
      normalizedUser === normalizedCorrect ||
      normalizedCorrect.includes(normalizedUser) ||
      normalizedUser.includes(normalizedCorrect) ||
      (normalizedUser.length > 3 &&
        normalizedCorrect.split(" ").some((word) =>
          word.length > 3 && normalizedUser.includes(word.toLowerCase())
        ))
    );
  };

  const handleSubmitAnswer = async () => {
    const currentQuestion = questions[currentQuestionIndex];
    let isAnswerCorrect = false;
    let userAnswerText = "";

    if (currentQuestion.type === "multiple-choice") {
      if (!selectedAnswer) return;
      
      const selectedChoice = answerChoicesData?.choices.find(
        (choice: any) => choice.id === selectedAnswer
      );
      isAnswerCorrect = answerChoicesData?.correctAnswerId === selectedAnswer;
      userAnswerText = selectedChoice?.definition || "";
    } else {
      if (!userAnswer.trim()) return;
      isAnswerCorrect = validateWrittenAnswer(userAnswer, currentQuestion.term);
      userAnswerText = userAnswer;
    }

    setAnswerSubmitted(true);
    setIsCorrect(isAnswerCorrect);
    setShowFeedback(true);

    if (isAnswerCorrect) {
      setCorrectAnswers((prev) => prev + 1);
    }

    // Add to test results
    setTestResults((prev) => [
      ...prev,
      {
        questionId: currentQuestion.id,
        isCorrect: isAnswerCorrect,
        userAnswer: userAnswerText,
        correctAnswer: currentQuestion.type === "multiple-choice" 
          ? currentQuestion.definition 
          : currentQuestion.term,
        term: currentQuestion.term,
        type: currentQuestion.type
      }
    ]);

    // Update progress
    try {
      await updateProgress({
        sessionId: sessionId,
        cardId: currentQuestion.id,
        isCorrect: isAnswerCorrect,
      });
    } catch (error) {
      toast.error("Failed to update progress!");
    }

    setProgress(((currentQuestionIndex + 1) / questions.length) * 100);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setShowContent(false);
      setTimeout(() => {
        setCurrentQuestionIndex((prev) => prev + 1);
        setUserAnswer("");
        setSelectedAnswer(null);
        setAnswerSubmitted(false);
        setShowFeedback(false);
        setShowContent(true);
      }, 300);
    } else {
      setIsTestCompleted(true);
      setShowTestResults(true);
    }
  };

  const handleStartOver = async () => {
    if (sessionId) {
      await restart({ sessionId });
    }
    setIsTestCompleted(false);
    setCurrentQuestionIndex(0);
    setUserAnswer("");
    setSelectedAnswer(null);
    setAnswerSubmitted(false);
    setShowFeedback(false);
    setCorrectAnswers(0);
    setProgress(0);
    setTestResults([]);
    setShowTestResults(false);
    handleStartTest();
  };

  const handleBackToSet = () => {
    router.push(`/set/${id}`);
  };

  if (isLoadingAllCardsOfSet) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <Protected>
      <div className="min-h-screen">
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
            {!isTestStarted ? (
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">Test Mode</h2>
                <p className="text-gray-600 mb-6">
                  Test your knowledge with a mix of multiple choice and written questions.
                  You'll be tested on all {questions.length} terms in this set.
                </p>
                <Button onClick={handleStartTest} disabled={isCreatingUserSession}>
                  Start Test
                </Button>
              </Card>
            ) : showTestResults ? (
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">Test Results</h2>
                <div className="text-center mb-6">
                  <p className="text-3xl font-bold">
                    {correctAnswers} / {questions.length}
                  </p>
                  <p className="text-gray-500">correct answers</p>
                  <p className="text-lg mt-2">
                    {Math.round((correctAnswers / questions.length) * 100)}% accuracy
                  </p>
                </div>

                <div className="space-y-4 mt-8">
                  <h3 className="text-lg font-semibold mb-3">Question Review</h3>
                  {testResults.map((result, index) => (
                    <div
                      key={result.questionId}
                      className={cn(
                        "p-4 rounded-lg",
                        result.isCorrect
                          ? "bg-green-50 border border-green-200"
                          : "bg-red-50 border border-red-200"
                      )}
                    >
                      <div className="flex items-start">
                        {result.isCorrect ? (
                          <CheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" />
                        ) : (
                          <XCircle className="h-6 w-6 text-red-500 mr-2 flex-shrink-0" />
                        )}
                        <div className="flex-grow">
                          <p className="font-medium">
                            Question {index + 1}: {result.term}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            Type: {result.type === "multiple-choice" ? "Multiple Choice" : "Written"}
                          </p>
                          <p className="text-sm mt-2">Your answer: {result.userAnswer}</p>
                          {!result.isCorrect && (
                            <p className="text-sm text-gray-600 mt-1">
                              Correct answer: {result.correctAnswer}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4 mt-8">
                  <Button onClick={handleStartOver}>Retake Test</Button>
                  <Button variant="outline" onClick={handleBackToSet}>
                    Back to Set
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </h2>
                  <div className="text-sm text-gray-500">
                    {correctAnswers} correct
                  </div>
                </div>

                <Progress value={progress} className="h-2" />

                <Card
                  className={cn(
                    "w-full p-6 transition-all duration-300",
                    showContent ? "opacity-100 scale-100" : "opacity-0 scale-95"
                  )}
                >
                  {questions[currentQuestionIndex]?.type === "multiple-choice" ? (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          Choose the correct definition:
                        </h3>
                        <p className="text-xl font-bold">
                          {questions[currentQuestionIndex]?.term}
                        </p>
                      </div>

                      {isLoadingAnswerChoices ? (
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
                                <RadioGroupItem
                                  value={choice.id}
                                  id={choice.id}
                                  disabled={answerSubmitted}
                                />
                                <Label
                                  htmlFor={choice.id}
                                  className={cn(
                                    "flex-grow",
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
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          Write the term for this definition:
                        </h3>
                        <p className="text-xl font-bold">
                          {questions[currentQuestionIndex]?.definition}
                        </p>
                      </div>

                      <div className="space-y-4">
                        <Input
                          value={userAnswer}
                          onChange={(e) => setUserAnswer(e.target.value)}
                          placeholder="Type your answer here..."
                          className="h-12"
                          disabled={answerSubmitted}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !answerSubmitted) {
                              handleSubmitAnswer();
                            } else if (e.key === "Enter" && answerSubmitted) {
                              handleNextQuestion();
                            }
                          }}
                        />
                      </div>

                      {showFeedback && (
                        <div
                          className={cn(
                            "p-4 rounded-lg",
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
                              {!isCorrect && (
                                <div className="mt-2">
                                  <p className="text-sm">The correct term is:</p>
                                  <p className="font-medium mt-1">
                                    {questions[currentQuestionIndex]?.term}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex justify-end mt-6">
                    {!answerSubmitted ? (
                      <Button
                        onClick={handleSubmitAnswer}
                        disabled={
                          questions[currentQuestionIndex]?.type === "multiple-choice"
                            ? !selectedAnswer || isLoadingAnswerChoices
                            : !userAnswer.trim()
                        }
                      >
                        Submit Answer
                      </Button>
                    ) : (
                      <Button onClick={handleNextQuestion}>
                        {currentQuestionIndex < questions.length - 1
                          ? "Next Question"
                          : "See Results"}
                      </Button>
                    )}
                  </div>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>
    </Protected>
  );
} 