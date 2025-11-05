
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Brain, Timer, Trophy, CheckCircle, X } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const questionBank = {
  mathematics: [
    {
      question: "What is the value of π (pi) to 2 decimal places?",
      options: ["3.14", "3.16", "3.12", "3.18"],
      correct: 0,
      explanation: "π (pi) is approximately 3.14159, which rounds to 3.14"
    },
    {
      question: "What is 15% of 200?",
      options: ["25", "30", "35", "40"],
      correct: 1,
      explanation: "15% of 200 = 0.15 × 200 = 30"
    },
    {
      question: "Which shape has the most sides?",
      options: ["Pentagon", "Hexagon", "Octagon", "Decagon"],
      correct: 3,
      explanation: "A decagon has 10 sides, more than pentagon (5), hexagon (6), or octagon (8)"
    },
    {
      question: "What is the square root of 144?",
      options: ["11", "12", "13", "14"],
      correct: 1,
      explanation: "12 × 12 = 144, so √144 = 12"
    },
    {
      question: "In a right triangle, what is the longest side called?",
      options: ["Adjacent", "Opposite", "Hypotenuse", "Base"],
      correct: 2,
      explanation: "The hypotenuse is the longest side in a right triangle, opposite the right angle"
    }
  ],
  science: [
    {
      question: "What is the chemical symbol for gold?",
      options: ["Go", "Gd", "Au", "Ag"],
      correct: 2,
      explanation: "Au comes from the Latin word 'aurum' meaning gold"
    },
    {
      question: "How many chambers does a human heart have?",
      options: ["2", "3", "4", "5"],
      correct: 2,
      explanation: "The human heart has 4 chambers: 2 atria and 2 ventricles"
    },
    {
      question: "What gas do plants absorb from the atmosphere during photosynthesis?",
      options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
      correct: 2,
      explanation: "Plants absorb CO₂ from the atmosphere and convert it to oxygen during photosynthesis"
    },
    {
      question: "What is the hardest natural substance on Earth?",
      options: ["Iron", "Diamond", "Granite", "Quartz"],
      correct: 1,
      explanation: "Diamond is the hardest natural substance, ranking 10 on the Mohs hardness scale"
    },
    {
      question: "How many bones are in an adult human body?",
      options: ["196", "206", "216", "226"],
      correct: 1,
      explanation: "An adult human body has 206 bones"
    }
  ],
  physics: [
    {
      question: "What is the speed of light in a vacuum?",
      options: ["299,792,458 m/s", "300,000,000 m/s", "299,000,000 m/s", "301,000,000 m/s"],
      correct: 0,
      explanation: "The speed of light in vacuum is exactly 299,792,458 meters per second"
    },
    {
      question: "What force keeps planets in orbit around the Sun?",
      options: ["Magnetic force", "Electric force", "Gravitational force", "Nuclear force"],
      correct: 2,
      explanation: "Gravitational force between the Sun and planets keeps them in orbit"
    },
    {
      question: "What is the unit of electrical resistance?",
      options: ["Volt", "Ampere", "Watt", "Ohm"],
      correct: 3,
      explanation: "The ohm (Ω) is the unit of electrical resistance"
    },
    {
      question: "At what temperature does water freeze at sea level?",
      options: ["-1°C", "0°C", "1°C", "32°C"],
      correct: 1,
      explanation: "Water freezes at 0°C (32°F) at standard atmospheric pressure"
    },
    {
      question: "What type of wave is sound?",
      options: ["Electromagnetic", "Transverse", "Longitudinal", "Surface"],
      correct: 2,
      explanation: "Sound is a longitudinal wave where particles vibrate parallel to wave direction"
    }
  ],
  technology: [
    {
      question: "What does HTML stand for?",
      options: ["HyperText Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "HyperText Modern Language"],
      correct: 0,
      explanation: "HTML stands for HyperText Markup Language, used to create web pages"
    },
    {
      question: "What is the binary representation of 8?",
      options: ["1010", "1000", "1100", "1001"],
      correct: 1,
      explanation: "8 in binary is 1000 (1×8 + 0×4 + 0×2 + 0×1)"
    },
    {
      question: "Which of these is a programming language?",
      options: ["Photoshop", "Excel", "Python", "PowerPoint"],
      correct: 2,
      explanation: "Python is a widely used high-level programming language."
    },
    {
      question: "What company developed the Android operating system?",
      options: ["Apple", "Microsoft", "Google", "Samsung"],
      correct: 2,
      explanation: "Android was initially developed by Android Inc., which Google acquired in 2005."
    },
    {
      question: "What is the primary function of a CPU?",
      options: ["Store data", "Execute instructions", "Display graphics", "Connect to networks"],
      correct: 1,
      explanation: "The CPU (Central Processing Unit) is the 'brain' of the computer, executing instructions."
    }
  ]
};

export default function TriviaGamePage() {
  const [currentSubject, setCurrentSubject] = useState("mathematics");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameActive, setGameActive] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [gameStats, setGameStats] = useState({ correct: 0, total: 0 });

  // Get subject from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const subjectParam = urlParams.get('subject');
    if (subjectParam && questionBank[subjectParam]) {
      setCurrentSubject(subjectParam);
    }
  }, []); // Run only once on mount

  const endGame = useCallback(() => {
    setGameActive(false);
    // Could add end game logic here
  }, [setGameActive]); // setGameActive is a stable reference

  const nextQuestion = useCallback(() => {
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setTimeLeft(30);
      setGameActive(true);
    } else {
      endGame();
    }
  }, [currentQuestion, questions.length, endGame, setCurrentQuestion, setSelectedAnswer, setShowResult, setTimeLeft, setGameActive]);

  const startNewGame = useCallback(() => {
    const subjectQuestions = questionBank[currentSubject] ? [...questionBank[currentSubject]] : [];
    const shuffled = subjectQuestions.sort(() => Math.random() - 0.5);
    setQuestions(shuffled);
    setCurrentQuestion(0);
    setScore(0);
    setTimeLeft(30);
    setGameActive(true);
    setShowResult(false);
    setSelectedAnswer(null);
    setGameStats({ correct: 0, total: 0 });
  }, [currentSubject]); // Depend on currentSubject to restart game when subject changes

  const handleTimeout = useCallback(() => {
    setShowResult(true);
    setGameActive(false);
    setGameStats(prev => ({ ...prev, total: prev.total + 1 }));
    
    setTimeout(() => {
      nextQuestion();
    }, 2000);
  }, [nextQuestion, setShowResult, setGameActive, setGameStats]);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]); // Start a new game whenever startNewGame callback changes (which happens when currentSubject changes)

  useEffect(() => {
    let timer;
    if (gameActive && timeLeft > 0 && !showResult) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameActive && !showResult) {
      handleTimeout();
    }
    return () => clearInterval(timer);
  }, [gameActive, timeLeft, showResult, handleTimeout]);

  const handleAnswerSelect = (answerIndex) => {
    if (showResult || !gameActive) return;
    
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    setGameActive(false);

    const isCorrect = answerIndex === questions[currentQuestion].correct;
    const newStats = {
      correct: gameStats.correct + (isCorrect ? 1 : 0),
      total: gameStats.total + 1
    };
    setGameStats(newStats);

    if (isCorrect) {
      const timeBonus = Math.floor(timeLeft / 3);
      setScore(prev => prev + 100 + timeBonus);
    }

    setTimeout(() => {
      nextQuestion();
    }, 3000);
  };

  const isGameComplete = currentQuestion >= questions.length - 1 && showResult;
  const currentQ = questions[currentQuestion];
  const accuracy = gameStats.total > 0 ? Math.round((gameStats.correct / gameStats.total) * 100) : 0;

  if (!currentQ && questions.length > 0) {
    // This case handles when currentQuestion index might go out of bounds before game complete state is fully processed
    return <div className="min-h-screen flex items-center justify-center">Loading next question...</div>;
  }
  
  if (questions.length === 0 && currentSubject) {
    // This case handles initial load or if a subject has no questions
    return <div className="min-h-screen flex items-center justify-center">Loading {currentSubject} trivia...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to={createPageUrl("GameBoards")}>
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {currentSubject.charAt(0).toUpperCase() + currentSubject.slice(1)} Trivia
            </h1>
            <p className="text-gray-600">Quick-fire knowledge testing</p>
          </div>
        </div>

        {/* Game Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{score}</div>
              <div className="text-sm text-gray-600">Score</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{currentQuestion + 1}/{questions.length}</div>
              <div className="text-sm text-gray-600">Question</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className={`text-2xl font-bold ${timeLeft <= 10 ? 'text-red-600' : 'text-green-600'}`}>
                {timeLeft}s
              </div>
              <div className="text-sm text-gray-600">Time Left</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{accuracy}%</div>
              <div className="text-sm text-gray-600">Accuracy</div>
            </CardContent>
          </Card>
        </div>

        {/* Timer Progress */}
        <div className="mb-6">
          <Progress value={(timeLeft / 30) * 100} className="h-3" />
        </div>

        {/* Question Card */}
        {currentQ && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-center text-xl">
                {currentQ.question}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {currentQ.options.map((option, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: showResult ? 1 : 1.02 }}
                    whileTap={{ scale: showResult ? 1 : 0.98 }}
                  >
                    <Button
                      variant="outline"
                      className={`w-full h-auto p-4 text-left justify-start ${
                        showResult
                          ? index === currentQ.correct
                            ? "bg-green-100 border-green-500 text-green-800"
                            : selectedAnswer === index
                            ? "bg-red-100 border-red-500 text-red-800"
                            : "opacity-50"
                          : selectedAnswer === index
                          ? "bg-blue-100 border-blue-500"
                          : ""
                      }`}
                      onClick={() => handleAnswerSelect(index)}
                      disabled={showResult || !gameActive}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center font-medium">
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span>{option}</span>
                        {showResult && index === currentQ.correct && (
                          <CheckCircle className="w-5 h-5 text-green-600 ml-auto" />
                        )}
                        {showResult && selectedAnswer === index && index !== currentQ.correct && (
                          <X className="w-5 h-5 text-red-600 ml-auto" />
                        )}
                      </div>
                    </Button>
                  </motion.div>
                ))}
              </div>

              {/* Result Display */}
              <AnimatePresence>
                {showResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`mt-6 p-4 rounded-lg ${
                      selectedAnswer === currentQ.correct ? "bg-green-50" : "bg-red-50"
                    }`}
                  >
                    <div className={`font-semibold mb-2 ${
                      selectedAnswer === currentQ.correct ? "text-green-800" : "text-red-800"
                    }`}>
                      {selectedAnswer === currentQ.correct ? "Correct!" : 
                       selectedAnswer === null ? "Time's up!" : "Incorrect!"}
                    </div>
                    <p className="text-gray-700 text-sm">{currentQ.explanation}</p>
                    
                    {selectedAnswer === currentQ.correct && (
                      <div className="mt-2 text-green-700 font-medium">
                        +{100 + Math.floor(timeLeft / 3)} points (including time bonus!)
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        )}

        {/* Game Complete */}
        {isGameComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 text-center p-6 bg-purple-50 rounded-lg"
          >
            <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-purple-800 mb-2">Game Complete!</h2>
            <p className="text-purple-700 mb-4">
              Final Score: {score} points | Accuracy: {accuracy}%
            </p>
            <Button onClick={startNewGame} className="bg-purple-600 hover:bg-purple-700">
              Play Again
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
