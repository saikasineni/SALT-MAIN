import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, X, Circle, RotateCcw, Trophy, Brain, BarChart } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import GameInstructions from "../components/shared/GameInstructions";
import WinCelebration from "../components/shared/WinCelebration";
import QuestionPopup from "../components/shared/QuestionPopup";

const statsQuestions = [
  {
    question: "Find the MEAN of: 4, 8, 6, 5, 7",
    options: ["5", "6", "7", "8"],
    correctAnswer: 1,
    explanation: "Mean = (4+8+6+5+7) ÷ 5 = 30 ÷ 5 = 6",
    type: "mean"
  },
  {
    question: "Find the MEDIAN of: 3, 7, 5, 9, 1",
    options: ["3", "5", "7", "9"],
    correctAnswer: 1,
    explanation: "Arrange: 1, 3, 5, 7, 9. Middle value = 5",
    type: "median"
  },
  {
    question: "Find the MODE of: 2, 4, 4, 6, 4, 8",
    options: ["2", "4", "6", "8"],
    correctAnswer: 1,
    explanation: "4 appears most frequently (3 times)",
    type: "mode"
  },
  {
    question: "Find the MEAN of: 10, 20, 30, 40",
    options: ["20", "25", "30", "35"],
    correctAnswer: 1,
    explanation: "Mean = (10+20+30+40) ÷ 4 = 100 ÷ 4 = 25",
    type: "mean"
  },
  {
    question: "Find the MEDIAN of: 12, 8, 15, 10, 18",
    options: ["10", "12", "15", "18"],
    correctAnswer: 1,
    explanation: "Arrange: 8, 10, 12, 15, 18. Middle value = 12",
    type: "median"
  },
  {
    question: "Find the MODE of: 5, 7, 5, 9, 5, 3",
    options: ["3", "5", "7", "9"],
    correctAnswer: 1,
    explanation: "5 appears most frequently (3 times)",
    type: "mode"
  }
];

const gameInstructions = {
  title: "Mean-Median-Mode Tic-Tac-Toe",
  rules: [
    "Classic 3×3 Tic-Tac-Toe with a statistical twist!",
    "Before each move, answer a math question about Mean, Median, or Mode",
    "✅ Correct answer → You get to place your mark (X or O)",
    "❌ Wrong answer → You lose your turn (opponent plays)",
    "Get 3 in a row to win (horizontal, vertical, or diagonal)",
    "Each correct answer earns you +10 points"
  ],
  objectives: [
    "Master calculating Mean (average of numbers)",
    "Understand Median (middle value when sorted)",
    "Identify Mode (most frequent value)",
    "Practice quick mental math under pressure",
    "Develop strategic thinking while learning statistics"
  ],
  tips: [
    "For MEAN: Add all numbers and divide by count",
    "For MEDIAN: Sort numbers first, then find middle",
    "For MODE: Look for the number that repeats most",
    "Control the center square - it's the most powerful position!",
    "Think ahead - block your opponent's winning moves"
  ]
};

export default function StatsTicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [scores, setScores] = useState({ X: 0, O: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [showInstructions, setShowInstructions] = useState(true);
  const [showQuestion, setShowQuestion] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [pendingMove, setPendingMove] = useState(null);
  const [showCelebration, setCelebrationData] = useState({ show: false, points: 0, message: "" });
  const [questionStats, setQuestionStats] = useState({ mean: 0, median: 0, mode: 0 });

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    
    for (let line of lines) {
      const [a, b, c] = line;
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line };
      }
    }
    
    if (squares.every(Boolean)) return { winner: 'Draw', line: [] };
    return null;
  };

  const handleSquareClick = (index) => {
    if (board[index] || gameOver) return;
    
    // Show question before making move
    const randomQuestion = statsQuestions[Math.floor(Math.random() * statsQuestions.length)];
    setCurrentQuestion(randomQuestion);
    setPendingMove(index);
    setShowQuestion(true);
  };

  const handleQuestionAnswer = (isCorrect) => {
    setShowQuestion(false);
    
    if (isCorrect && pendingMove !== null) {
      // Player answered correctly - allow move
      const newBoard = [...board];
      newBoard[pendingMove] = xIsNext ? 'X' : 'O';
      setBoard(newBoard);
      
      // Update scores
      const player = xIsNext ? 'X' : 'O';
      setScores(prev => ({ ...prev, [player]: prev[player] + 10 }));
      
      // Update question type stats
      if (currentQuestion?.type) {
        setQuestionStats(prev => ({
          ...prev,
          [currentQuestion.type]: prev[currentQuestion.type] + 1
        }));
      }
      
      // Check for winner
      const result = calculateWinner(newBoard);
      if (result) {
        setGameOver(true);
        setWinner(result.winner);
        if (result.winner !== 'Draw') {
          setCelebrationData({
            show: true,
            points: 50,
            message: `Player ${result.winner} wins! 🎉`
          });
        }
      }
      
      setXIsNext(!xIsNext);
    } else {
      // Wrong answer - opponent gets the turn
      setXIsNext(!xIsNext);
    }
    
    setPendingMove(null);
    setCurrentQuestion(null);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setGameOver(false);
    setWinner(null);
  };

  const newMatch = () => {
    resetGame();
    setScores({ X: 0, O: 0 });
    setQuestionStats({ mean: 0, median: 0, mode: 0 });
  };

  if (showInstructions) {
    return (
      <GameInstructions
        {...gameInstructions}
        onStart={() => setShowInstructions(false)}
      />
    );
  }

  const currentPlayer = xIsNext ? 'X' : 'O';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to={createPageUrl("MiniGames")}>
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Mean-Median-Mode Tic-Tac-Toe
            </h1>
            <p className="text-gray-600">Answer statistics questions to play!</p>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowInstructions(true)}
            className="ml-auto"
          >
            View Rules
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Game Board */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <BarChart className="w-5 h-5 text-blue-600" />
                    {gameOver ? (
                      winner === 'Draw' ? "It's a Draw!" : `Player ${winner} Wins!`
                    ) : (
                      `Player ${currentPlayer}'s Turn`
                    )}
                  </span>
                  <div className="flex gap-2">
                    <Button onClick={resetGame} size="sm" variant="outline">
                      <RotateCcw className="w-4 h-4 mr-1" />
                      Next Round
                    </Button>
                    <Button onClick={newMatch} size="sm">
                      New Match
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                  {board.map((square, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: square || gameOver ? 1 : 1.05 }}
                      whileTap={{ scale: square || gameOver ? 1 : 0.95 }}
                      onClick={() => handleSquareClick(index)}
                      disabled={square !== null || gameOver}
                      className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl shadow-lg flex items-center justify-center text-4xl font-bold hover:shadow-xl transition-all disabled:cursor-not-allowed"
                    >
                      {square === 'X' && (
                        <X className="w-16 h-16 text-blue-600" />
                      )}
                      {square === 'O' && (
                        <Circle className="w-16 h-16 text-purple-600" />
                      )}
                    </motion.button>
                  ))}
                </div>

                {/* Question Type Legend */}
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Brain className="w-5 h-5 text-blue-600" />
                    Statistics Concepts Practiced:
                  </h4>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{questionStats.mean}</div>
                      <div className="text-sm text-gray-600">MEAN Questions</div>
                      <div className="text-xs text-gray-500">(Average)</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">{questionStats.median}</div>
                      <div className="text-sm text-gray-600">MEDIAN Questions</div>
                      <div className="text-xs text-gray-500">(Middle Value)</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-pink-600">{questionStats.mode}</div>
                      <div className="text-sm text-gray-600">MODE Questions</div>
                      <div className="text-xs text-gray-500">(Most Frequent)</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Score Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  Scores
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <X className="w-8 h-8 text-blue-600" />
                    <span className="font-bold text-lg">Player X</span>
                  </div>
                  <span className="text-2xl font-bold text-blue-600">{scores.X}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Circle className="w-8 h-8 text-purple-600" />
                    <span className="font-bold text-lg">Player O</span>
                  </div>
                  <span className="text-2xl font-bold text-purple-600">{scores.O}</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Reference */}
            <Card className="bg-gradient-to-br from-yellow-50 to-orange-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-800">
                  <Brain className="w-5 h-5" />
                  Quick Reference
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-3 text-gray-700">
                <div className="p-3 bg-white/50 rounded-lg">
                  <h4 className="font-bold text-blue-600 mb-1">MEAN (Average)</h4>
                  <p>Add all numbers ÷ count</p>
                  <p className="text-xs text-gray-600">Example: (2+4+6) ÷ 3 = 4</p>
                </div>
                <div className="p-3 bg-white/50 rounded-lg">
                  <h4 className="font-bold text-purple-600 mb-1">MEDIAN (Middle)</h4>
                  <p>Sort numbers, find middle</p>
                  <p className="text-xs text-gray-600">Example: 1,3,5,7,9 → 5</p>
                </div>
                <div className="p-3 bg-white/50 rounded-lg">
                  <h4 className="font-bold text-pink-600 mb-1">MODE (Most Common)</h4>
                  <p>Number that appears most</p>
                  <p className="text-xs text-gray-600">Example: 2,4,4,6 → 4</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <WinCelebration
        show={showCelebration.show}
        onClose={() => setCelebrationData({ show: false, points: 0, message: "" })}
        points={showCelebration.points}
        message={showCelebration.message}
      />

      {currentQuestion && (
        <QuestionPopup
          show={showQuestion}
          question={currentQuestion.question}
          options={currentQuestion.options}
          correctAnswer={currentQuestion.correctAnswer}
          explanation={currentQuestion.explanation}
          subject="mathematics"
          onAnswer={handleQuestionAnswer}
        />
      )}
    </div>
  );
}