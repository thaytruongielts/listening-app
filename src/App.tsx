import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, ChevronRight, RotateCcw, Award, BookOpen, Headphones } from 'lucide-react';
import { questions } from './data/questions';
import { QuizState } from './types';

export default function App() {
  const [state, setState] = useState<QuizState>({
    currentQuestionIndex: 0,
    answers: {},
    isFinished: false,
    score: null,
    feedback: {},
  });

  const currentQuestion = questions[state.currentQuestionIndex];
  const totalQuestions = questions.length;

  const handleAnswer = (answer: string) => {
    if (state.feedback[currentQuestion.id]) return;

    const isCorrect = answer === currentQuestion.correctAnswer;
    
    setState(prev => ({
      ...prev,
      answers: { ...prev.answers, [currentQuestion.id]: answer },
      feedback: {
        ...prev.feedback,
        [currentQuestion.id]: {
          isCorrect,
          message: isCorrect ? "Đúng rồi!" : "Sai rồi!"
        }
      }
    }));
  };

  const nextQuestion = () => {
    if (state.currentQuestionIndex < totalQuestions - 1) {
      setState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1
      }));
    } else {
      const feedbackValues = Object.values(state.feedback) as { isCorrect: boolean; message: string }[];
      const correctCount = feedbackValues.filter(f => f.isCorrect).length;
      const finalScore = (10 * correctCount) / totalQuestions;
      setState(prev => ({ ...prev, isFinished: true, score: finalScore }));
    }
  };

  const resetQuiz = () => {
    setState({
      currentQuestionIndex: 0,
      answers: {},
      isFinished: false,
      score: null,
      feedback: {},
    });
  };

  const progress = ((state.currentQuestionIndex + 1) / totalQuestions) * 100;

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-[#1a1a1a] font-sans p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-black p-2 rounded-lg">
              <Headphones className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Listening Quiz</h1>
              <p className="text-xs text-gray-500 uppercase tracking-widest font-medium">IELTS Practice</p>
            </div>
          </div>
          {!state.isFinished && (
            <div className="text-right">
              <span className="text-sm font-mono text-gray-400">
                {state.currentQuestionIndex + 1} / {totalQuestions}
              </span>
            </div>
          )}
        </header>

        <AnimatePresence mode="wait">
          {!state.isFinished ? (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Progress Bar */}
              <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-black"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                />
              </div>

              {/* Question Card */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-black/5">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-[10px] font-bold uppercase tracking-wider text-gray-500">
                    {currentQuestion.track}
                  </span>
                </div>
                
                <h2 className="text-2xl font-medium leading-tight mb-8">
                  {currentQuestion.text}
                </h2>

                <div className="grid gap-3">
                  {currentQuestion.options.map((option) => {
                    const isSelected = state.answers[currentQuestion.id] === option;
                    const feedback = state.feedback[currentQuestion.id];
                    const isCorrect = currentQuestion.correctAnswer === option;
                    
                    let buttonClass = "w-full text-left p-4 rounded-2xl border transition-all duration-200 flex items-center justify-between ";
                    
                    if (feedback) {
                      if (isSelected) {
                        buttonClass += feedback.isCorrect 
                          ? "bg-emerald-50 border-emerald-200 text-emerald-700" 
                          : "bg-rose-50 border-rose-200 text-rose-700";
                      } else {
                        buttonClass += "border-gray-100 text-gray-400 opacity-50 cursor-not-allowed";
                      }
                    } else {
                      buttonClass += "border-gray-100 hover:border-black hover:bg-gray-50 active:scale-[0.98]";
                    }

                    return (
                      <button
                        key={option}
                        onClick={() => handleAnswer(option)}
                        disabled={!!feedback}
                        className={buttonClass}
                      >
                        <span className="font-medium">{option}</span>
                        {feedback && isSelected && (
                          feedback.isCorrect ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {state.feedback[currentQuestion.id] && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-8 pt-8 border-t border-gray-100 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      {state.feedback[currentQuestion.id].isCorrect ? (
                        <span className="text-emerald-600 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Đúng rồi!
                        </span>
                      ) : (
                        <span className="text-rose-600 font-bold flex items-center gap-1">
                          <XCircle className="w-4 h-4" /> Sai rồi!
                        </span>
                      )}
                    </div>
                    
                    <button
                      onClick={nextQuestion}
                      className="bg-black text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-800 transition-colors"
                    >
                      {state.currentQuestionIndex === totalQuestions - 1 ? "Xem kết quả" : "Tiếp theo"}
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-[40px] p-12 shadow-xl border border-black/5 text-center"
            >
              <div className="w-24 h-24 bg-black rounded-full flex items-center justify-center mx-auto mb-8">
                <Award className="text-white w-12 h-12" />
              </div>
              
              <h2 className="text-4xl font-bold mb-2">Kết quả của bạn</h2>
              <p className="text-gray-500 mb-12">Bạn đã hoàn thành bài kiểm tra nghe!</p>
              
              <div className="flex justify-center items-baseline gap-2 mb-12">
                <span className="text-8xl font-black tracking-tighter">{state.score?.toFixed(1)}</span>
                <span className="text-2xl font-bold text-gray-300">/ 10</span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-12">
                <div className="bg-gray-50 p-6 rounded-3xl">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1">Đúng</p>
                  <p className="text-2xl font-bold">
                    {(Object.values(state.feedback) as { isCorrect: boolean }[]).filter(f => f.isCorrect).length}
                  </p>
                </div>
                <div className="bg-gray-50 p-6 rounded-3xl">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1">Tổng số câu</p>
                  <p className="text-2xl font-bold">{totalQuestions}</p>
                </div>
              </div>

              <button
                onClick={resetQuiz}
                className="w-full bg-black text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all active:scale-[0.98]"
              >
                <RotateCcw className="w-5 h-5" />
                Làm lại bài tập
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Info */}
        <footer className="mt-12 text-center">
          <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">
            Listening Comprehension • Unit 1-25
          </p>
        </footer>
      </div>
    </div>
  );
}
