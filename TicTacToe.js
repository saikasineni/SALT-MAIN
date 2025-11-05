import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Users, X, Circle, RotateCcw, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import WinCelebration from "../components/shared/WinCelebration";
import QuestionPopup from "../components/shared/QuestionPopup";
import GameInstructions from "../components/shared/GameInstructions";
import { getRandomQuestion } from "../components/data/questionBank";

const Square = ({ value, onSquareClick, isWinning }) => {
  const symbol = value === "X" 
    ? <X className="w-12 h-12 text-blue-500" /> 
    : value === "O" 
    ? <Circle className="w-12 h-12 text-red-500" /> 
    : null;

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`flex items-center justify-center w-24 h-24 md:w-32 md:h-32 rounded-lg cursor-pointer transition-colors duration-200 ${
        isWinning ? 'bg-green-200' : 'bg-gray-100 hover:bg-gray-200'
      }`}
      onClick={onSquareClick}
    >
      <AnimatePresence>
        {symbol && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
          >
            {symbol}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const Board = ({ xIsNext, squares, onPlay, winningLine }) => {
  const handleClick = (i) => {
    if (calculateWinner(squares).winner || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    onPlay(nextSquares, i);
  };

  return (
    <div className="grid grid-cols-3 gap-3 p-4 bg-white rounded-xl shadow-inner">
      {squares.map((square, i) => (
        <Square
          key={i}
          value={square}
          onSquareClick={() => handleClick(i)}
          isWinning={winningLine?.includes(i)}
        />
      ))}
    </div>
  );
};

const calculateWinner = (squares) => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: lines[i] };
    }
  }
  if (squares.every(Boolean)) return { winner: "Draw", line: [] };
  return { winner: null, line: [] };
};

const gameInstructions = {
  title: "Math Tic-Tac-Toe",
  rules: [
    "Two players take turns placing X and O on a 3×3 grid",
    "Before each move, answer a math question correctly",
    "Get three of your marks in a row (horizontal, vertical, or diagonal) to win",
    "If all 9 squares are filled with no winner, the game is a draw",
    "Wrong answers don't prevent your move, but correct answers earn bonus points!"
  ],
  objectives: [
    "Practice strategic thinking and planning ahead",
    "Reinforce mathematical concepts through gameplay",
    "Develop pattern recognition skills",
    "Learn to anticipate opponent's moves"
  ],
  tips: [
    "Control the center square - it's part of 4 winning combinations!",
    "Block your opponent when they have 2 in a row",
    "Try to create multiple winning opportunities at once",
    "Think 2-3 moves ahead"
  ]
};

export default function TicTacToePage() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [scores, setScores] = useState({ X: 0, O: 0 });
  const [playerNames, setPlayerNames] = useState({ X: "Player 1", O: "Player 2" });
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationData, setCelebrationData] = useState({});
  const [showQuestion, setShowQuestion] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [pendingMove, setPendingMove] = useState(null);
  const [showInstructions, setShowInstructions] = useState(true);

  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const { winner, line: winningLine } = calculateWinner(currentSquares);

  useEffect(() => {
    if (winner && winner !== "Draw") {
      setScores(prev => ({ ...prev, [winner]: prev[winner] + 1 }));
      setCelebrationData({
        points: 50,
        message: `${playerNames[winner]} wins the game!`
      });
      setShowCelebration(true);
    }
  }, [winner, playerNames]);

  const handlePlay = (nextSquares, squareIndex) => {
    // Show question before making move
    const question = getRandomQuestion('mathematics');
    setCurrentQuestion(question);
    setPendingMove({ nextSquares, squareIndex });
    setShowQuestion(true);
  };

  const handleQuestionAnswer = (isCorrect) => {
    setShowQuestion(false);
    
    if (pendingMove) {
      const newHistory = history.slice(0, currentMove + 1);
      setHistory([...newHistory, pendingMove.nextSquares]);
      setCurrentMove(newHistory.length);
      
      if (isCorrect) {
        // Bonus points for correct answer
        const player = xIsNext ? 'X' : 'O';
        setScores(prev => ({ ...prev, [player]: prev[player] + 10 }));
      }
    }
    
    setPendingMove(null);
    setCurrentQuestion(null);
  };

  const handleReset = () => {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  };

  const handleNewGame = () => {
    handleReset();
    setScores({ X: 0, O: 0 });
  };

  if (showInstructions) {
    return (
      <GameInstructions
        {...gameInstructions}
        onStart={() => setShowInstructions(false)}
      />
    );
  }

  let status;
  if (winner) {
    if (winner === "Draw") {
      status = "It's a Draw! 🤝";
    } else {
      status = `Winner: ${playerNames[winner]} 🎉`;
    }
  } else {
    status = `Next player: ${playerNames[xIsNext ? 'X' : 'O']}`;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link to={createPageUrl("MiniGames")}>
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Tic-Tac-Toe</h1>
            <p className="text-gray-600">Answer math questions to make your move!</p>
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
        
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="flex-grow w-full">
            <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} winningLine={winningLine} />
          </div>

          <div className="w-full lg:w-80 flex-shrink-0 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-center text-xl">{status}</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-around items-center">
                <div className="text-center">
                   <div className="flex items-center gap-2">
                     <X className="w-6 h-6 text-blue-500" />
                     <span className="font-bold text-lg">{playerNames.X}</span>
                   </div>
                   <div className="text-2xl font-bold">{scores.X}</div>
                </div>
                <div className="text-2xl font-bold">vs</div>
                 <div className="text-center">
                   <div className="flex items-center gap-2">
                     <Circle className="w-6 h-6 text-red-500" />
                     <span className="font-bold text-lg">{playerNames.O}</span>
                   </div>
                   <div className="text-2xl font-bold">{scores.O}</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                 <CardTitle className="flex items-center gap-2"><Users className="w-5 h-5" />Player Names</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                 <Input 
                   placeholder="Player 1 (X)"
                   value={playerNames.X}
                   onChange={(e) => setPlayerNames({...playerNames, X: e.target.value})}
                 />
                 <Input 
                   placeholder="Player 2 (O)"
                   value={playerNames.O}
                   onChange={(e) => setPlayerNames({...playerNames, O: e.target.value})}
                 />
              </CardContent>
            </Card>

            <Card>
               <CardHeader>
                 <CardTitle className="flex items-center gap-2"><Trophy className="w-5 h-5" />Game Controls</CardTitle>
               </CardHeader>
              <CardContent className="flex flex-col space-y-3">
                <Button variant="outline" onClick={handleReset}><RotateCcw className="w-4 h-4 mr-2" />Next Round</Button>
                <Button onClick={handleNewGame}>Start New Game</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <WinCelebration
        show={showCelebration}
        onClose={() => setShowCelebration(false)}
        points={celebrationData.points}
        message={celebrationData.message}
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