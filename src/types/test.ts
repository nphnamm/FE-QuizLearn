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
};

export type UserAnswers = {
  [questionId: string]: string | boolean;
}; 