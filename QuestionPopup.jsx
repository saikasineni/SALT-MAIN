import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, CheckCircle, X, Lightbulb } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { base44 } from '@/api/base44Client';

export default function QuestionPopup({ 
  show, 
  question, 
  options, 
  correctAnswer, 
  explanation, 
  subject,
  onAnswer,
  gameName = "Unknown Game",
  chapter = "",
  difficultyLevel = "medium"
}) {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  const location = useLocation();
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const offlineMode = params.get('mode') === 'offline';
    setIsOffline(offlineMode);
  }, [location.search]);

  const handleSubmit = async (answerIndex) => {
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    // Check if answer is correct (comparing answer strings OR indices)
    const isCorrect = typeof correctAnswer === 'number' 
      ? answerIndex === correctAnswer 
      : options[answerIndex] === correctAnswer;

    // Save doubt if the answer is incorrect
    if (!isCorrect) {
      await saveDoubt(answerIndex);
    }

    setTimeout(() => {
      onAnswer(isCorrect);
      setSelectedAnswer(null);
      setShowResult(false);
      setTimeLeft(30);
    }, 3000);
  };

  const saveDoubt = async (studentAnswerIndex) => {
    // Ensure correctAnswer is a string (convert from index if needed)
    const correctAnswerString = typeof correctAnswer === 'number' 
      ? options[correctAnswer] 
      : correctAnswer;

    const doubtData = {
      game_name: gameName,
      subject: subject,
      chapter: chapter || "General",
      question: question,
      student_answer: options[studentAnswerIndex],
      correct_answer: correctAnswerString,
      explanation: explanation || "No explanation provided.",
      options: options,
      difficulty_level: difficultyLevel
    };

    try {
      if (isOffline) {
        const { saveDoubtOffline } = await import('@/components/lib/offline');
        await saveDoubtOffline(doubtData);
      } else {
        const user = await base44.auth.me();
        await base44.entities.Doubt.create({
          student_id: user.id,
          ...doubtData
        });
      }
    } catch (error) {
      console.error("Error saving doubt:", error);
    }
  };

  const getSubjectColor = () => {
    switch(subject) {
      case 'mathematics': return 'from-blue-500 to-blue-600';
      case 'science': return 'from-green-500 to-green-600';
      case 'technology': return 'from-purple-500 to-purple-600';
      case 'engineering': return 'from-orange-500 to-orange-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  // Helper function to check if answer is correct
  const isAnswerCorrect = (index) => {
    if (typeof correctAnswer === 'number') {
      return index === correctAnswer;
    }
    return options[index] === correctAnswer;
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 50 }}
            className="w-full max-w-2xl"
          >
            <Card className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className={`bg-gradient-to-r ${getSubjectColor()} p-6 text-white`}>
                <div className="flex items-center gap-3 mb-2">
                  <Brain className="w-8 h-8" />
                  <h3 className="text-2xl font-bold">Challenge Question!</h3>
                </div>
                <p className="text-white/90">Answer correctly to continue playing</p>
              </div>

              {/* Question */}
              <div className="p-8">
                <div className="mb-6">
                  <Badge className="mb-4">{subject}</Badge>
                  <h4 className="text-xl font-semibold text-gray-800 mb-4">
                    {question}
                  </h4>
                </div>

                {/* Options */}
                <div className="space-y-3">
                  {options.map((option, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: showResult ? 1 : 1.02 }}
                      whileTap={{ scale: showResult ? 1 : 0.98 }}
                      onClick={() => !showResult && handleSubmit(index)}
                      disabled={showResult}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                        showResult
                          ? isAnswerCorrect(index)
                            ? 'bg-green-50 border-green-500'
                            : selectedAnswer === index
                            ? 'bg-red-50 border-red-500'
                            : 'bg-gray-50 border-gray-200 opacity-50'
                          : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold ${
                            showResult && isAnswerCorrect(index)
                              ? 'bg-green-500 text-white border-green-500'
                              : showResult && selectedAnswer === index && !isAnswerCorrect(index)
                              ? 'bg-red-500 text-white border-red-500'
                              : 'border-gray-300 text-gray-600'
                          }`}>
                            {String.fromCharCode(65 + index)}
                          </div>
                          <span className="font-medium text-gray-800">{option}</span>
                        </div>
                        {showResult && isAnswerCorrect(index) && (
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        )}
                        {showResult && selectedAnswer === index && !isAnswerCorrect(index) && (
                          <X className="w-6 h-6 text-red-600" />
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>

                {/* Explanation */}
                {showResult && explanation && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-6 p-4 rounded-lg ${
                      isAnswerCorrect(selectedAnswer)
                        ? 'bg-green-50 border border-green-200' 
                        : 'bg-blue-50 border border-blue-200'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-800 mb-1">
                          {isAnswerCorrect(selectedAnswer) ? 'Excellent! ' : 'Learn: '}
                        </p>
                        <p className="text-gray-700 text-sm">{explanation}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}