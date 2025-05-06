"use client";

import React, { useEffect, useState } from "react";
import Protected from "@/hooks/useProtected";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Question, TestModeData, UserAnswers } from "@/types/test";
import { CheckCircle, XCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useCreateOrResumeTestQuery, useFinishTestMutation } from "../../../../../redux/features/userSessions/userSessionsApi";
import TestResults from "@/components/test/result";

export default function TestModePage() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [isComplete, setIsComplete] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const params = useParams();
  const setId = params.id;
  const [testResults, setTestResults] = useState<{
    score: number;
    correctCount: number;
    incorrectCount: number;
    totalQuestions: number;
    detailedResults: {
      questionId: string;
      correct: boolean;
      userAnswer: string | boolean;
      correctAnswer?: string | boolean;
    }[];
  } | null>(null);
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [data, setData] = useState<TestModeData>();
  const { data: testData, isLoading: isLoadingTestData } = useCreateOrResumeTestQuery(setId,{});
  const [sessionId,setSessionId] = useState("") 
  useEffect(() => {
    if(testData?.sessionId){
      setSessionId(testData?.sessionId)
    }
    setData(testData);
  }, [testData]);
  const [finishTest, { isLoading: isUpdatingCard }] = useFinishTestMutation();


  useEffect(() => {
    if (!data) return;
    const allQuestionsAnswered = data.questions.every(
      (question) => userAnswers[question.id] !== undefined
    );
    setIsComplete(allQuestionsAnswered);
  }, [userAnswers, data]);

  const handleAnswerChange = (questionId: string, answer: string | boolean) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const calculateResults = (answers: UserAnswers) => {
    if (!data) return null;
    const results = data.questions.map((question) => {
      let isCorrect = false;

      if (question.type === "write") {
        // For write questions, we'll do a case-insensitive comparison
        const userAnswer = ((answers[question.id] as string) || "")
          .trim()
          .toLowerCase();
        const correctAnswer = (question.correctAnswer as string).toLowerCase();
        isCorrect = userAnswer === correctAnswer;

        return {
          questionId: question.id,
          correct: isCorrect,
          userAnswer: answers[question.id] as string,
          correctAnswer: question.correctAnswer as string,
        };
      } else if (question.type === "multi-choice") {
        // For multi-choice, check if selected choice id matches the question id
        isCorrect = answers[question.id] === question.id;

        const selectedChoiceId = answers[question.id] as string;
        const selectedChoice = question.choices.find(
          (c) => c.id === selectedChoiceId
        );
        const correctChoice = question.choices.find(
          (c) => c.id === question.id
        );

        return {
          questionId: question.id,
          correct: isCorrect,
          userAnswer: selectedChoice?.definition || "",
          correctAnswer: correctChoice?.definition || "",
        };
      } else if (question.type === "yes-no") {
        // For yes-no questions, direct comparison
        isCorrect = answers[question.id] === question.correctAnswer;

        return {
          questionId: question.id,
          correct: isCorrect,
          userAnswer: answers[question.id] as boolean,
          correctAnswer: question.correctAnswer as boolean,
        };
      }

      return {
        questionId: (question as Question).id,
        correct: false,
        userAnswer: answers[(question as Question).id] || "",
      };
    });

    const correctCount = results.filter((r) => r.correct).length;
    const incorrectCount = results.filter((r) => !r.correct).length;
    const score = (correctCount / data.questions.length) * 100;

    return {
      sessionId,
      score,
      correctCount,
      incorrectCount,
      totalQuestions: data?.questions.length,
      detailedResults: results,
    };
  };

  const handleSubmit = async() => {
    setEndTime(new Date());
    const results = calculateResults(userAnswers);
    setTestResults(results);
    setShowResults(true);

    // Here you would typically send the results to your backend
    console.log("Submitted answers:", userAnswers);
    console.log("Test results:", results);
    const res = await finishTest(results)
    if(res){
      console.log('success');
    }
    // Calculate time spent in seconds

  };

  const handleRetry = () => {
    setUserAnswers({});
    setShowResults(false);
    setTestResults(null);
    setStartTime(new Date());
    setEndTime(null);
  };

  const renderWriteQuestion = (question: Question) => {
    if (question.type !== "write") return null;
    return (
      <div className="space-y-4 w-full">
        <Label htmlFor={question.id}>Write the translation:</Label>
        <Input
          id={question.id}
          type="text"
          placeholder="Type your answer here..."
          value={(userAnswers[question.id] as string) || ""}
          onChange={(e) => handleAnswerChange(question.id, e.target.value)}
        />
      </div>
    );
  };

  const renderMultiChoiceQuestion = (question: Question) => {
    if (question.type !== "multi-choice") return null;
    return (
      <div className="space-y-4 w-full">
        <Label>Choose the answer</Label>
        <RadioGroup
          value={(userAnswers[question.id] as string) || ""}
          onValueChange={(value) => handleAnswerChange(question.id, value)}
          className="space-y-3"
        >
          {question.choices.map((choice) => (
            <div
              key={choice.id}
              className="flex items-center space-x-3 rounded-lg border p-4 hover:bg-gray-50 transition-colors"
            >
              <RadioGroupItem
                value={choice.id}
                id={`${question.id}-${choice.id}`}
              />
              <Label htmlFor={`${question.id}-${choice.id}`}>
                {choice.definition}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    );
  };

  const renderYesNoQuestion = (question: Question) => {
    if (question.type !== "yes-no") return null;
    return (
      <div className="space-y-4 w-full">
        <Label>Choose the answer</Label>
        <RadioGroup
          value={String(userAnswers[question.id])}
          onValueChange={(value) =>
            handleAnswerChange(question.id, value === "true")
          }
          className="space-y-3"
        >
          {["true", "false"].map((value) => (
            <div
              key={value}
              className="flex items-center space-x-3 rounded-lg border p-4 hover:bg-gray-50 transition-colors"
            >
              <RadioGroupItem value={value} id={`${question.id}-${value}`} />
              <Label htmlFor={`${question.id}-${value}`}>
                {value === "true" ? "True" : "False"}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    );
  };

  return (
    <Protected>
      <div className="min-h-screen">
        <Sidebar
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        <div className="max-w-3xl mx-auto py-8 px-4 space-y-6">
          {isLoadingTestData || !data ? (
            <div>Loading...</div>
          ) : !showResults ? (
            <>
              <h1 className="text-2xl font-bold mb-6">Test Mode</h1>

              {data?.questions.map((question, index) => (
                <Card key={question.id} className="p-4">
                  <CardContent>
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-lg">
                            Question {index + 1}
                          </span>
                          <span className="text-sm text-gray-500">
                            {index + 1} of {data.questions.length}
                          </span>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <Label className="text-gray-600">Term</Label>
                            <div className="text-lg mt-1">{question.term}</div>
                          </div>
                          {question.type === "yes-no" && (
                            <div>
                              <Label className="text-gray-600">
                                Definition
                              </Label>

                              <div className="text-lg mt-1 flex items-center gap-2">
                                {question.definition}
                                <button className="text-gray-400 hover:text-gray-600">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707"></path>
                                  </svg>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="pt-4">
                          {question.type === "write" &&
                            renderWriteQuestion(question)}
                          {question.type === "multi-choice" &&
                            renderMultiChoiceQuestion(question)}
                          {question.type === "yes-no" &&
                            renderYesNoQuestion(question)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <div className="flex justify-end">
                <Button
                  onClick={handleSubmit}
                  disabled={!isComplete}
                  className="px-6"
                >
                  Submit Test
                </Button>
              </div>
            </>
          ) : (
            testResults && (
              <TestResults
                testResults={testResults}
                questions={testData.questions}
                startTime={startTime}
                endTime={endTime}
                onRetry={handleRetry}
              />
            )
          )}
        </div>
      </div>
    </Protected>
  );
}
