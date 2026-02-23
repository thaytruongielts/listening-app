export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: string;
  track: string;
}

export interface QuizState {
  currentQuestionIndex: number;
  answers: Record<number, string>;
  isFinished: boolean;
  score: number | null;
  feedback: Record<number, { isCorrect: boolean; message: string }>;
}
