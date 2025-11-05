import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Crown, Trophy, RotateCcw, Timer } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

// Simple chess piece representation
const ChessPiece = ({ piece, color }) => {
  const pieces = {
    king: '♔', queen: '♕', rook: '♖', bishop: '♗', knight: '♘', pawn: '♙'
  };
  
  return (
    <div className={`text-2xl ${color === 'white' ? 'text-gray-700' : 'text-gray-900'}`}>
      {pieces[piece] || ''}
    </div>
  );
};

const initialBoard = [
  ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'],
  ['pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn'],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ['pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn'],
  ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook']
];

export default function ChessGamePage() {
  const [board, setBoard] = useState(initialBoard);
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState('white');
  const [gameTime, setGameTime] = useState(0);
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState({ white: 0, black: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      setGameTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSquareClick = (row, col) => {
    if (selectedSquare) {
      // Make move
      const [fromRow, fromCol] = selectedSquare;
      const newBoard = board.map(r => [...r]);
      
      if (newBoard[fromRow][fromCol]) {
        newBoard[row][col] = newBoard[fromRow][fromCol];
        newBoard[fromRow][fromCol] = null;
        setBoard(newBoard);
        setCurrentPlayer(currentPlayer === 'white' ? 'black' : 'white');
        setMoves(prev => prev + 1);
      }
      
      setSelectedSquare(null);
    } else {
      // Select piece
      if (board[row][col]) {
        setSelectedSquare([row, col]);
      }
    }
  };

  const resetGame = () => {
    setBoard(initialBoard);
    setSelectedSquare(null);
    setCurrentPlayer('white');
    setGameTime(0);
    setMoves(0);
  };

  const isSquareSelected = (row, col) => {
    return selectedSquare && selectedSquare[0] === row && selectedSquare[1] === col;
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to={createPageUrl("MiniGames")}>
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Chess Game</h1>
            <p className="text-gray-600">Master strategy, logic, and algebraic notation</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          
          {/* Chess Board */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Crown className="w-5 h-5 text-purple-600" />
                    Chess Board
                  </div>
                  <Badge className={`${currentPlayer === 'white' ? 'bg-gray-100 text-gray-800' : 'bg-gray-800 text-white'}`}>
                    {currentPlayer === 'white' ? 'White' : 'Black'}'s Turn
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-8 gap-1 p-4 bg-amber-100 rounded-xl max-w-2xl mx-auto">
                  {board.map((row, rowIndex) =>
                    row.map((piece, colIndex) => {
                      const isLight = (rowIndex + colIndex) % 2 === 0;
                      const isSelected = isSquareSelected(rowIndex, colIndex);
                      
                      return (
                        <motion.div
                          key={`${rowIndex}-${colIndex}`}
                          className={`
                            w-12 h-12 md:w-16 md:h-16 flex items-center justify-center cursor-pointer
                            ${isLight ? 'bg-amber-200' : 'bg-amber-600'}
                            ${isSelected ? 'ring-4 ring-blue-500' : ''}
                            hover:opacity-75 transition-all duration-200
                          `}
                          onClick={() => handleSquareClick(rowIndex, colIndex)}
                          whileHover={{ scale: 1.05 }}
                        >
                          {piece && (
                            <ChessPiece 
                              piece={piece} 
                              color={rowIndex < 2 ? 'black' : 'white'} 
                            />
                          )}
                        </motion.div>
                      );
                    })
                  )}
                </div>
                
                {/* Algebraic Notation Helper */}
                <div className="mt-6 text-center">
                  <h3 className="text-lg font-semibold mb-2">Algebraic Notation</h3>
                  <p className="text-sm text-gray-600">
                    Click a piece, then click where you want to move it. 
                    Learn chess notation: a1-h8, with files (a-h) and ranks (1-8).
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Game Stats Sidebar */}
          <div className="space-y-6">
            
            {/* Game Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Game Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{moves}</div>
                  <div className="text-sm text-gray-600">Moves Made</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{formatTime(gameTime)}</div>
                  <div className="text-sm text-gray-600">Game Time</div>
                </div>

                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">Current Player</div>
                  <Badge className={`${currentPlayer === 'white' ? 'bg-gray-100 text-gray-800' : 'bg-gray-800 text-white'}`}>
                    {currentPlayer === 'white' ? 'White' : 'Black'}
                  </Badge>
                </div>
                
                <Button onClick={resetGame} variant="outline" className="w-full">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  New Game
                </Button>
              </CardContent>
            </Card>

            {/* Chess Learning */}
            <Card>
              <CardHeader>
                <CardTitle>Learning Chess</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2 text-gray-600">
                <h4 className="font-semibold text-gray-800">Piece Values:</h4>
                <p>• Pawn = 1 point</p>
                <p>• Knight/Bishop = 3 points</p>
                <p>• Rook = 5 points</p>
                <p>• Queen = 9 points</p>
                <p>• King = Priceless!</p>
                
                <h4 className="font-semibold text-gray-800 mt-4">Basic Rules:</h4>
                <p>• White moves first</p>
                <p>• Capture opponent pieces</p>
                <p>• Protect your king</p>
                <p>• Think ahead!</p>
              </CardContent>
            </Card>

            {/* Strategy Tips */}
            <Card>
              <CardHeader>
                <CardTitle>Strategy Tips</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2 text-gray-600">
                <p>• Control the center squares</p>
                <p>• Develop pieces early</p>
                <p>• Castle to protect king</p>
                <p>• Don't move same piece twice</p>
                <p>• Think before you move!</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}