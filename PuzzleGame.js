import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Puzzle, Trophy, Lightbulb, RotateCcw, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const puzzles = [
  {
    id: 1,
    title: "Number Sequence",
    question: "What comes next in this sequence? 2, 4, 8, 16, ?",
    options: ["24", "32", "28", "20"],
    correct: 1,
    explanation: "Each number is doubled: 2×2=4, 4×2=8, 8×2=16, 16×2=32",
    difficulty: "Easy"
  },
  {
    id: 2,
    title: "Logic Pattern", 
    question: "If A=1, B=2, C=3... what does 'CAB' equal?",
    options: ["312", "321", "123", "132"],
    correct: 0,
    explanation: "C=3, A=1, B=2, so CAB = 312",
    difficulty: "Medium"
  },
  {
    id: 3,
    title: "Mathematical Reasoning",
    question: "A rectangle has length 12 and width 8. What's its perimeter?",
    options: ["20", "40", "96", "32"],
    correct: 1,
    explanation: "Perimeter = 2(length + width) = 2(12 + 8) = 2(20) = 40",
    difficulty: "Easy"
  },
  {
    id: 4,
    title: "Pattern Recognition",
    question: "Which shape completes the pattern: Circle, Square, Triangle, Circle, Square, ?",
    options: ["Circle", "Square", "Triangle", "Rectangle"],
    correct: 2,
    explanation: "The pattern repeats every 3 shapes: Circle, Square, Triangle",
    difficulty: "Medium"
  },
  {
    id: 5,
    title: "Engineering Logic",
    question: "A bridge can hold 1000kg. Cars weigh 800kg each. How many cars maximum?",
    options: ["1", "2", "0", "3"],
    correct: 0,
    explanation: "1000 ÷ 800 = 1.25, so maximum 1 car can safely cross",
    difficulty: "Hard"
  }
];

export default function PuzzleGamePage() {
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!gameComplete) {
        setTimeElapsed(prev => prev + 1);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [gameComplete]);

  const handleAnswerSelect = (answerIndex) => {
    if (showResult) return;
    
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    const isCorrect = answerIndex === puzzles[currentPuzzle].correct;
    
    if (isCorrect) {
      const points = puzzles[currentPuzzle].difficulty === "Hard" ? 30 : 
                    puzzles[currentPuzzle].difficulty === "Medium" ? 20 : 10;
      setScore(prev => prev + points);
      setCorrectAnswers(prev => prev + 1);
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }

    setTimeout(() => {
      if (currentPuzzle + 1 < puzzles.length) {
        setCurrentPuzzle(prev => prev + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        setGameComplete(true);
      }
    }, 3000);
  };

  const resetGame = () => {
    setCurrentPuzzle(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setCorrectAnswers(0);
    setTimeElapsed(0);
    setGameComplete(false);
    setStreak(0);
  };

  const getCurrentPuzzle = () => puzzles[currentPuzzle];
  const progress = ((currentPuzzle + 1) / puzzles.length) * 100;
  const accuracy = currentPuzzle + 1 > 0 ? Math.round((correctAnswers / (currentPuzzle + 1)) * 100) : 0;

  if (gameComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Link to={createPageUrl("MiniGames")}>
              <Button variant="outline" size="icon">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Puzzle Complete! 🎉</h1>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                  <Trophy className="w-8 h-8 text-yellow-500" />
                  Game Complete!
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">{score}</div>
                    <div className="text-gray-600">Final Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">{accuracy}%</div>
                    <div className="text-gray-600">Accuracy</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{correctAnswers}/{puzzles.length}</div>
                    <div className="text-gray-600">Correct Answers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">
                      {Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')}
                    </div>
                    <div className="text-gray-600">Time Taken</div>
                  </div>
                </div>

                <Button onClick={resetGame} size="lg" className="bg-orange-600 hover:bg-orange-700">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Play Again
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  const puzzle = getCurrentPuzzle();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to={createPageUrl("MiniGames")}>
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Logic Puzzles</h1>
            <p className="text-gray-600">Advanced problem-solving and logical reasoning</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          
          {/* Game Area */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Progress Bar */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm text-gray-600">
                    Puzzle {currentPuzzle + 1} of {puzzles.length}
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
              </CardContent>
            </Card>

            {/* Current Puzzle */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Puzzle className="w-5 h-5 text-orange-600" />
                    {puzzle.title}
                  </div>
                  <Badge variant={
                    puzzle.difficulty === "Hard" ? "destructive" :
                    puzzle.difficulty === "Medium" ? "default" : "secondary"
                  }>
                    {puzzle.difficulty}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-4">{puzzle.question}</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {puzzle.options.map((option, index) => (
                    <motion.div key={index} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        variant="outline"
                        className={`w-full h-16 text-left justify-start ${
                          showResult
                            ? index === puzzle.correct
                              ? "bg-green-100 border-green-500 text-green-800"
                              : selectedAnswer === index
                              ? "bg-red-100 border-red-500 text-red-800"
                              : "opacity-50"
                            : selectedAnswer === index
                            ? "bg-orange-100 border-orange-500"
                            : ""
                        }`}
                        onClick={() => handleAnswerSelect(index)}
                        disabled={showResult}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center font-medium">
                            {String.fromCharCode(65 + index)}
                          </div>
                          <span>{option}</span>
                          {showResult && index === puzzle.correct && (
                            <CheckCircle className="w-5 h-5 text-green-600 ml-auto" />
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
                      className={`p-4 rounded-lg ${
                        selectedAnswer === puzzle.correct ? "bg-green-50" : "bg-red-50"
                      }`}
                    >
                      <div className={`font-semibold mb-2 ${
                        selectedAnswer === puzzle.correct ? "text-green-800" : "text-red-800"
                      }`}>
                        {selectedAnswer === puzzle.correct ? "Correct! 🎉" : "Incorrect 😔"}
                      </div>
                      <p className="text-gray-700 text-sm">{puzzle.explanation}</p>
                      
                      {selectedAnswer === puzzle.correct && (
                        <div className="mt-2 text-green-700 font-medium">
                          +{puzzle.difficulty === "Hard" ? 30 : puzzle.difficulty === "Medium" ? 20 : 10} points!
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-6">
            
            {/* Score Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Your Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{score}</div>
                  <div className="text-sm text-gray-600">Total Points</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{correctAnswers}</div>
                  <div className="text-sm text-gray-600">Correct Answers</div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{streak}</div>
                  <div className="text-sm text-gray-600">Current Streak</div>
                </div>

                <div className="text-center">
                  <div className="text-xl font-bold text-purple-600">
                    {Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')}
                  </div>
                  <div className="text-sm text-gray-600">Time Elapsed</div>
                </div>
              </CardContent>
            </Card>

            {/* Learning Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  Puzzle Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2 text-gray-600">
                <p>• Read questions carefully</p>
                <p>• Look for patterns</p>
                <p>• Think step by step</p>
                <p>• Don't rush - accuracy matters!</p>
                <p>• Learn from explanations</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}