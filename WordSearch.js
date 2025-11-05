
import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Search, Trophy, BookOpen, Timer } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const scienceWords = [
  "ATOM", "CELL", "DNA", "GENE", "VIRUS", "PROTON", "NEUTRON", "ELECTRON",
  "CARBON", "OXYGEN", "MOLECULE", "COMPOUND", "REACTION", "CATALYST",
  "ECOSYSTEM", "HABITAT", "SPECIES", "EVOLUTION", "PROTEIN", "ENZYME"
];

const mathWords = [
  "ALGEBRA", "GEOMETRY", "CALCULUS", "FRACTION", "DECIMAL", "PERCENT",
  "RADIUS", "DIAMETER", "ANGLE", "TRIANGLE", "SQUARE", "CIRCLE",
  "EQUATION", "VARIABLE", "CONSTANT", "FUNCTION", "GRAPH", "SLOPE"
];

const physicsWords = [
  "ENERGY", "FORCE", "MOTION", "VELOCITY", "GRAVITY", "MASS",
  "DENSITY", "PRESSURE", "VOLTAGE", "CURRENT", "CIRCUIT", "MAGNET",
  "LIGHT", "SOUND", "WAVE", "FREQUENCY", "AMPLITUDE", "SPECTRUM"
];

const subjects = {
  science: { words: scienceWords, color: "green", name: "Science" },
  math: { words: mathWords, color: "blue", name: "Mathematics" },
  physics: { words: physicsWords, color: "purple", name: "Physics" }
};

const GRID_SIZE = 15;

const generateGrid = (words) => {
  const grid = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(''));
  const placedWords = [];
  const directions = [
    [0, 1],   // horizontal
    [1, 0],   // vertical
    [1, 1],   // diagonal down-right
    [-1, 1],  // diagonal up-right
  ];

  // Shuffle words and take first 8-10
  const selectedWords = [...words].sort(() => Math.random() - 0.5).slice(0, Math.min(10, words.length));

  selectedWords.forEach(word => {
    let placed = false;
    let attempts = 0;
    
    while (!placed && attempts < 50) {
      const direction = directions[Math.floor(Math.random() * directions.length)];
      const row = Math.floor(Math.random() * GRID_SIZE);
      const col = Math.floor(Math.random() * GRID_SIZE);
      
      // Check if word fits
      let canPlace = true;
      for (let i = 0; i < word.length; i++) {
        const newRow = row + direction[0] * i;
        const newCol = col + direction[1] * i;
        
        if (newRow < 0 || newRow >= GRID_SIZE || newCol < 0 || newCol >= GRID_SIZE) {
          canPlace = false;
          break;
        }
        
        if (grid[newRow][newCol] !== '' && grid[newRow][newCol] !== word[i]) {
          canPlace = false;
          break;
        }
      }
      
      if (canPlace) {
        const positions = [];
        for (let i = 0; i < word.length; i++) {
          const newRow = row + direction[0] * i;
          const newCol = col + direction[1] * i;
          grid[newRow][newCol] = word[i];
          positions.push([newRow, newCol]);
        }
        placedWords.push({ word, positions });
        placed = true;
      }
      
      attempts++;
    }
  });

  // Fill empty cells with random letters
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      if (grid[i][j] === '') {
        grid[i][j] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      }
    }
  }

  return { grid, placedWords };
};

export default function WordSearchPage() {
  const [currentSubject, setCurrentSubject] = useState("science");
  const [grid, setGrid] = useState([]);
  const [placedWords, setPlacedWords] = useState([]);
  const [foundWords, setFoundWords] = useState([]);
  const [selectedCells, setSelectedCells] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [score, setScore] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  // Get subject from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const subjectParam = urlParams.get('subject');
    if (subjectParam && subjects[subjectParam]) {
      setCurrentSubject(subjectParam);
    }
  }, []); // Empty dependency array means this runs once on mount

  const newGame = useCallback(() => {
    const { grid: newGrid, placedWords: newPlacedWords } = generateGrid(subjects[currentSubject].words);
    setGrid(newGrid);
    setPlacedWords(newPlacedWords);
    setFoundWords([]);
    setSelectedCells([]);
    setScore(0);
    setTimeElapsed(0);
    setGameStarted(true);
  }, [currentSubject]);

  useEffect(() => {
    newGame();
  }, [newGame]);

  useEffect(() => {
    let timer;
    if (gameStarted && foundWords.length < placedWords.length) {
      timer = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameStarted, foundWords.length, placedWords.length]);

  const handleCellClick = (row, col) => {
    if (!isSelecting) {
      setIsSelecting(true);
      setSelectedCells([[row, col]]);
    }
  };

  const handleCellEnter = (row, col) => {
    if (isSelecting && selectedCells.length > 0) {
      const [startRow, startCol] = selectedCells[0];
      const cells = getLineCells(startRow, startCol, row, col);
      setSelectedCells(cells);
    }
  };

  const handleCellRelease = () => {
    if (isSelecting && selectedCells.length > 1) {
      checkForWord(selectedCells);
    }
    setIsSelecting(false);
    setSelectedCells([]);
  };

  const getLineCells = (startRow, startCol, endRow, endCol) => {
    const cells = [];
    const deltaRow = endRow - startRow;
    const deltaCol = endCol - startCol;
    
    // Only allow straight lines (horizontal, vertical, diagonal)
    if (deltaRow === 0) {
      // Horizontal
      const step = deltaCol > 0 ? 1 : -1;
      for (let i = 0; i <= Math.abs(deltaCol); i++) {
        cells.push([startRow, startCol + i * step]);
      }
    } else if (deltaCol === 0) {
      // Vertical
      const step = deltaRow > 0 ? 1 : -1;
      for (let i = 0; i <= Math.abs(deltaRow); i++) {
        cells.push([startRow + i * step, startCol]);
      }
    } else if (Math.abs(deltaRow) === Math.abs(deltaCol)) {
      // Diagonal
      const rowStep = deltaRow > 0 ? 1 : -1;
      const colStep = deltaCol > 0 ? 1 : -1;
      for (let i = 0; i <= Math.abs(deltaRow); i++) {
        cells.push([startRow + i * rowStep, startCol + i * colStep]);
      }
    } else {
      // Invalid selection
      return [[startRow, startCol]];
    }
    
    return cells;
  };

  const checkForWord = (cells) => {
    const selectedWord = cells.map(([row, col]) => grid[row][col]).join('');
    const reversedWord = selectedWord.split('').reverse().join('');
    
    for (let wordObj of placedWords) {
      if ((wordObj.word === selectedWord || wordObj.word === reversedWord) && !foundWords.includes(wordObj.word)) {
        setFoundWords(prev => [...prev, wordObj.word]);
        setScore(prev => prev + wordObj.word.length * 10);
        break;
      }
    }
  };

  const isCellSelected = (row, col) => {
    return selectedCells.some(([r, c]) => r === row && c === col);
  };

  const isCellInFoundWord = (row, col) => {
    return placedWords.some(wordObj => 
      foundWords.includes(wordObj.word) && 
      wordObj.positions.some(([r, c]) => r === row && c === col)
    );
  };

  const progress = placedWords.length > 0 ? (foundWords.length / placedWords.length) * 100 : 0;
  const isComplete = foundWords.length === placedWords.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to={createPageUrl("GameBoards")}>
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {subjects[currentSubject].name} Word Search
            </h1>
            <p className="text-gray-600">Build vocabulary and enhance pattern recognition</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          
          {/* Game Area */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Current Subject Display */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge className={`bg-${subjects[currentSubject].color}-600 text-white`}>
                    {subjects[currentSubject].name}
                  </Badge>
                  Word Search Challenge
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Find all the {subjects[currentSubject].name.toLowerCase()} terms hidden in the grid below.
                </p>
              </CardContent>
            </Card>

            {/* Grid */}
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-15 gap-1 max-w-4xl mx-auto" style={{gridTemplateColumns: 'repeat(15, minmax(0, 1fr))'}}>
                  {grid.map((row, rowIndex) =>
                    row.map((cell, colIndex) => (
                      <motion.div
                        key={`${rowIndex}-${colIndex}`}
                        className={`
                          w-6 h-6 md:w-8 md:h-8 border border-gray-300 flex items-center justify-center 
                          text-xs md:text-sm font-bold cursor-pointer select-none
                          ${isCellSelected(rowIndex, colIndex) ? 'bg-blue-400 text-white' : ''}
                          ${isCellInFoundWord(rowIndex, colIndex) ? 'bg-green-300 text-green-800' : 'bg-white hover:bg-gray-100'}
                        `}
                        onMouseDown={() => handleCellClick(rowIndex, colIndex)}
                        onMouseEnter={() => handleCellEnter(rowIndex, colIndex)}
                        onMouseUp={handleCellRelease}
                        whileHover={{ scale: 1.1 }}
                      >
                        {cell}
                      </motion.div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {isComplete && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center p-6 bg-green-100 rounded-lg"
              >
                <h2 className="text-2xl font-bold text-green-800 mb-2">Congratulations! 🎉</h2>
                <p className="text-green-700">You found all {placedWords.length} words in {Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')}!</p>
                <Button onClick={newGame} className="mt-4">
                  New Game
                </Button>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{foundWords.length}/{placedWords.length}</div>
                  <div className="text-sm text-gray-600">Words Found</div>
                </div>
                
                <Progress value={progress} className="h-3" />
                
                <div className="flex justify-between text-sm">
                  <div>
                    <div className="font-semibold text-green-600">{score}</div>
                    <div className="text-gray-600">Score</div>
                  </div>
                  <div>
                    <div className="font-semibold text-purple-600">
                      {Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')}
                    </div>
                    <div className="text-gray-600">Time</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Word List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Find These Words
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {placedWords.map((wordObj, index) => (
                    <div
                      key={index}
                      className={`p-2 rounded text-sm font-medium ${
                        foundWords.includes(wordObj.word)
                          ? 'bg-green-100 text-green-800 line-through'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {wordObj.word}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  How to Play
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2 text-gray-600">
                <p>• Click and drag to select words</p>
                <p>• Words can be horizontal, vertical, or diagonal</p>
                <p>• Words can be forwards or backwards</p>
                <p>• Find all words to complete the puzzle</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
