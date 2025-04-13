export type Choice = {
  id: string;
  definition: string;
};

export type BaseQuestion = {
  id: string;
  term: string;
  type: 'write' | 'multi-choice' | 'yes-no';
};

export type WriteQuestion = BaseQuestion & {
  type: 'write';
  correctAnswer: string;
};

export type MultiChoiceQuestion = BaseQuestion & {
  type: 'multi-choice';
  choices: Choice[];
};

export type YesNoQuestion = BaseQuestion & {
  type: 'yes-no';
  definition: string;
  correctAnswer: boolean;
};

export type Question = WriteQuestion | MultiChoiceQuestion | YesNoQuestion;

export type TestModeData = {
  success: boolean;
  testMode: boolean;
  questions: Question[];
  sessionId:string;
};

export type UserAnswers = {
  [questionId: string]: string | boolean;
}; 

// types/test.ts

export type QuestionType = "write" | "multi-choice" | "yes-no" | "fill-in" | "drag-and-drop" | "true-false" | "matching" | "flashcard";


export interface DetailedResult {
  questionId: string;
  correct: boolean;
  userAnswer: string | boolean;
  correctAnswer?: string | boolean;
}

export interface TestResult {
  score: number;
  correctCount: number;
  incorrectCount: number;
  totalQuestions: number;
  detailedResults: DetailedResult[];
}