// components/test/TestResults.tsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { Question, TestResult } from "@/types/test";

interface TestResultsProps {
  testResults: TestResult;
  questions: Question[];
  startTime: Date;
  endTime: Date | null;
  onRetry: () => void;
}

const TestResults: React.FC<TestResultsProps> = ({
  testResults,
  questions,
  startTime,
  endTime,
  onRetry,
}) => {
  const router = useRouter();
  
  const timeSpent = endTime 
    ? Math.floor((endTime.getTime() - startTime.getTime()) / 1000) 
    : 0;
  
  const minutes = Math.floor(timeSpent / 60);
  const seconds = timeSpent % 60;
  
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Test Complete!</h1>
        <p className="text-gray-500">
          You completed the test in {minutes}m {seconds}s
        </p>
      </div>
      
      <Card className="p-6">
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold">Your Score</h2>
              <p className="text-gray-500">
                {testResults.correctCount} out of {testResults.totalQuestions} correct
              </p>
            </div>
            <div className="text-4xl font-bold">
              {Math.round(testResults.score)}%
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-green-50 p-4 rounded-lg flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-full text-green-600">
                <CheckCircle size={24} />
              </div>
              <div>
                <p className="text-gray-500">Correct</p>
                <p className="text-xl font-semibold">{testResults.correctCount}</p>
              </div>
            </div>
            
            <div className="bg-red-50 p-4 rounded-lg flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-full text-red-600">
                <XCircle size={24} />
              </div>
              <div>
                <p className="text-gray-500">Incorrect</p>
                <p className="text-xl font-semibold">{testResults.incorrectCount}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <h2 className="text-xl font-bold mt-8 mb-4">Detailed Results</h2>
      
      {questions.map((question, index) => {
        const result = testResults.detailedResults.find(
          r => r.questionId === question.id
        );
        
        if (!result) return null;
        
        return (
          <Card key={question.id} className={`p-4 border-l-4 ${
            result.correct ? "border-l-green-500" : "border-l-red-500"
          }`}>
            <CardContent>
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-lg">
                      Question {index + 1}
                    </span>
                    {result.correct ? (
                      <CheckCircle className="text-green-500" size={20} />
                    ) : (
                      <XCircle className="text-red-500" size={20} />
                    )}
                  </div>
                  
                  <div className="mt-2">
                    <p className="text-gray-600">Term</p>
                    <p className="text-lg">{question.term}</p>
                  </div>
                  
                  {question.type === "yes-no" && (
                    <div className="mt-2">
                      <p className="text-gray-600">Definition</p>
                      <p className="text-lg">{question.definition}</p>
                    </div>
                  )}
                  
                  <div className="mt-4 space-y-2">
                    <div>
                      <p className="text-gray-600">Your answer</p>
                      <p className={`text-lg ${
                        result.correct ? "text-green-600" : "text-red-600"
                      }`}>
                        {typeof result.userAnswer === "boolean" 
                          ? result.userAnswer ? "True" : "False"
                          : result.userAnswer || "(No answer)"}
                      </p>
                    </div>
                    
                    {!result.correct && (
                      <div>
                        <p className="text-gray-600">Correct answer</p>
                        <p className="text-lg text-green-600">
                          {typeof result.correctAnswer === "boolean"
                            ? result.correctAnswer ? "True" : "False"
                            : result.correctAnswer || ""}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
      
      <div className="flex justify-between mt-8">
        <Button 
          variant="outline" 
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Button>
        
        <Button 
          onClick={onRetry}
          className="flex items-center gap-2"
        >
          <RefreshCw size={16} />
          Retry Test
        </Button>
      </div>
    </div>
  );
};

export default TestResults;