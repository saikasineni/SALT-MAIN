import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Play, Pause, RotateCcw, Trophy, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const GRID_SIZE = 20;
const CELL_SIZE = 20;

export default function SnakeGamePage() {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [direction, setDirection] = useState({ x: 0, y: 1 });
  const [gameRunning, setGameRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameSpeed, setGameSpeed] = useState(150);
  const [level, setLevel] = useState(1);

  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    };
    setFood(newFood);
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setDirection({ x: 0, y: 1 });
    setScore(0);
    setLevel(1);
    setGameSpeed(150);
    setGameRunning(false);
    generateFood();
  };

  const moveSnake = useCallback(() => {
    if (!gameRunning) return;

    setSnake(currentSnake => {
      const newSnake = [...currentSnake];
      const head = { ...newSnake[0] };
      
      head.x += direction.x;
      head.y += direction.y;

      // Check boundaries
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        setGameRunning(false);
        return currentSnake;
      }

      // Check self collision
      if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameRunning(false);
        return currentSnake;
      }

      newSnake.unshift(head);

      // Check food collision
      if (head.x === food.x && head.y === food.y) {
        setScore(prev => {
          const newScore = prev + 10 * level;
          if (newScore > highScore) {
            setHighScore(newScore);
          }
          return newScore;
        });
        
        // Increase difficulty
        if (score > 0 && score % 50 === 0) {
          setLevel(prev => prev + 1);
          setGameSpeed(prev => Math.max(prev - 10, 80));
        }
        
        generateFood();
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameRunning, generateFood, score, highScore, level]);

  useEffect(() => {
    const gameInterval = setInterval(moveSnake, gameSpeed);
    return () => clearInterval(gameInterval);
  }, [moveSnake, gameSpeed]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!gameRunning) return;
      
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x !== -1) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction, gameRunning]);

  const startGame = () => {
    setGameRunning(true);
  };

  const pauseGame = () => {
    setGameRunning(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-50 to-green-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to={createPageUrl("MiniGames")}>
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Snake Game</h1>
            <p className="text-gray-600">Learn sequences and patterns through gameplay</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          
          {/* Game Area */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Snake Game Board</span>
                  <div className="flex gap-2">
                    {!gameRunning ? (
                      <Button onClick={startGame} size="sm">
                        <Play className="w-4 h-4 mr-1" />
                        Start
                      </Button>
                    ) : (
                      <Button onClick={pauseGame} size="sm" variant="outline">
                        <Pause className="w-4 h-4 mr-1" />
                        Pause
                      </Button>
                    )}
                    <Button onClick={resetGame} size="sm" variant="outline">
                      <RotateCcw className="w-4 h-4 mr-1" />
                      Reset
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className="grid bg-gray-800 p-4 rounded-lg mx-auto"
                  style={{
                    gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
                    width: `${GRID_SIZE * CELL_SIZE + 32}px`,
                    height: `${GRID_SIZE * CELL_SIZE + 32}px`
                  }}
                >
                  {Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, index) => {
                    const x = index % GRID_SIZE;
                    const y = Math.floor(index / GRID_SIZE);
                    
                    const isSnake = snake.some(segment => segment.x === x && segment.y === y);
                    const isHead = snake[0] && snake[0].x === x && snake[0].y === y;
                    const isFood = food.x === x && food.y === y;
                    
                    return (
                      <div
                        key={index}
                        className={`
                          ${isHead ? 'bg-green-400' : isSnake ? 'bg-green-500' : ''}
                          ${isFood ? 'bg-red-500 rounded-full' : ''}
                          ${!isSnake && !isFood ? 'bg-gray-700' : ''}
                        `}
                        style={{ width: CELL_SIZE, height: CELL_SIZE }}
                      />
                    );
                  })}
                </div>
                
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600">
                    Use arrow keys to control the snake. Eat the red food to grow!
                  </p>
                </div>
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
                  Score
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{score}</div>
                  <div className="text-sm text-gray-600">Current Score</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{highScore}</div>
                  <div className="text-sm text-gray-600">High Score</div>
                </div>

                <div className="text-center">
                  <div className="text-xl font-bold text-purple-600">Level {level}</div>
                  <div className="text-sm text-gray-600">Current Level</div>
                </div>

                <div className="text-center">
                  <div className="text-lg font-bold text-orange-600">{snake.length}</div>
                  <div className="text-sm text-gray-600">Snake Length</div>
                </div>
              </CardContent>
            </Card>

            {/* Game Status */}
            <Card>
              <CardHeader>
                <CardTitle>Game Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <Badge className={gameRunning ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                    {gameRunning ? "Playing" : "Paused"}
                  </Badge>
                  <div className="mt-2">
                    <div className="text-sm text-gray-600">Speed Level: {Math.round((200 - gameSpeed) / 10)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Learning Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Learning Focus
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2 text-gray-600">
                <h4 className="font-semibold text-gray-800">Pattern Recognition:</h4>
                <p>• Predict snake's path</p>
                <p>• Plan movement sequences</p>
                <p>• Avoid collision patterns</p>
                
                <h4 className="font-semibold text-gray-800 mt-4">Mathematical Concepts:</h4>
                <p>• Coordinate system (x, y)</p>
                <p>• Sequence building</p>
                <p>• Strategic planning</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}