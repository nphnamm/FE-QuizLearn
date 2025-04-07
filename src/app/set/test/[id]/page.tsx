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

export default function TestModePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const data: TestModeData = {
    success: true,
    testMode: true,
    questions: [
      {
        id: "7d9905bd-09d4-46e7-860d-b3de4572104a",
        term: "One",
        type: "write" as const,
        correctAnswer: "Một",
      },
      {
        id: "f29131c4-d798-4aa9-9958-73420c741b55",
        term: "Red",
        type: "write" as const,
        correctAnswer: "Màu đỏ",
      },
      {
        id: "5eb446c9-9d93-44aa-853a-2fbcf7e4a7f4",
        term: "Blue",
        type: "multi-choice" as const,
        choices: [
          {
            id: "854928a5-4876-43bf-a964-54a8f0f58660",
            definition: "Màu vàng",
          },
          {
            id: "7d9905bd-09d4-46e7-860d-b3de4572104a",
            definition: "Một",
          },
          {
            id: "5eb446c9-9d93-44aa-853a-2fbcf7e4a7f4",
            definition: "Màu xanh dương",
          },
          {
            id: "f29131c4-d798-4aa9-9958-73420c741b55",
            definition: "Màu đỏ",
          },
        ],
      },
      {
        id: "fb577f25-e5e6-4175-a008-8b34c711ba1a",
        term: "Green",
        type: "multi-choice" as const,
        choices: [
          {
            id: "fb577f25-e5e6-4175-a008-8b34c711ba1a",
            definition: "Màu xanh lá",
          },
          {
            id: "854928a5-4876-43bf-a964-54a8f0f58660",
            definition: "Màu vàng",
          },
          {
            id: "7d9905bd-09d4-46e7-860d-b3de4572104a",
            definition: "Một",
          },
          {
            id: "5eb446c9-9d93-44aa-853a-2fbcf7e4a7f4",
            definition: "Màu xanh dương",
          },
        ],
      },
      {
        id: "854928a5-4876-43bf-a964-54a8f0f58660",
        term: "Yellow",
        type: "yes-no" as const,
        definition: "Màu vàng",
        correctAnswer: true,
      },
      {
        id: "fbdd7eb5-199a-44f0-988b-9b03e38f9733",
        term: "Black",
        type: "write" as const,
        correctAnswer: "Màu đen",
      },
    ],
  };

  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const allQuestionsAnswered = data.questions.every(
      (question) => userAnswers[question.id] !== undefined
    );
    setIsComplete(allQuestionsAnswered);
  }, [userAnswers, data.questions]);

  const handleAnswerChange = (questionId: string, answer: string | boolean) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmit = (answers: UserAnswers) => {
    console.log("Submitted answers:", answers);
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
          <h1 className="text-2xl font-bold mb-6">Test Mode</h1>

          {data.questions.map((question, index) => (
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
                          <Label className="text-gray-600">Definition</Label>

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
              onClick={() => handleSubmit(userAnswers)}
              disabled={!isComplete}
              className="px-6"
            >
              Submit Test
            </Button>
          </div>
        </div>
      </div>
    </Protected>
  );
}
