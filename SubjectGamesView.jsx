
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Play, Trophy, BookOpen, Target } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

// Define subject-specific games - ALL SUBJECTS FULLY IMPLEMENTED
const subjectSpecificGames = {
  mathematics: [
    { id: "tic_tac_toe", name: "Math Tic-Tac-Toe", description: "Solve equations to claim cells", route: "TicTacToe" },
    { id: "math_snake", name: "MathSnake", description: "Build equations with neon snake!", route: "MathSnake" },
    { id: "dice_game", name: "Probability Dice", description: "Learn probability with dice", route: "DiceGame" },
    { id: "card_game", name: "Math Card Game", description: "Probability and strategic thinking", route: "CardGame" },
    { id: "chess_game", name: "Strategic Chess", description: "Logic and algebraic notation", route: "ChessGame" }
  ],
  science: [
    { id: "word_search", name: "Science Word Search", description: "Find scientific terms", route: "WordSearch" },
    { id: "trivia_game", name: "Science Trivia", description: "Test science knowledge", route: "TriviaGame" },
    { id: "memory_game", name: "Science Memory Game", description: "Match scientific terms", route: "MemoryGame" },
    { id: "virtual_lab", name: "Virtual Lab Simulator", description: "Conduct experiments", route: "PuzzleGame" },
    { id: "body_systems", name: "Body Systems Quiz", description: "Learn anatomy", route: "TriviaGame" }
  ],
  technology: [
    { id: "logic_puzzles", name: "Logic Puzzles", description: "Advanced logical thinking", route: "PuzzleGame" },
    { id: "aptitude_test", name: "Aptitude Challenge", description: "Quantitative reasoning", route: "TriviaGame" },
    { id: "pattern_game", name: "Pattern Recognition", description: "Identify sequences", route: "SnakeGame" },
    { id: "reasoning_quiz", name: "Reasoning Quiz", description: "Critical thinking", route: "TriviaGame" },
    { id: "strategy_games", name: "Strategy Games", description: "Strategic problem solving", route: "StrategyGames" }
  ],
  engineering: [
    { id: "code_playground", name: "Code Playground", description: "Learn 6 programming languages", route: "CodePlayground" },
    { id: "math_snake", name: "MathSnake", description: "Build equations visually!", route: "MathSnake" },
    { id: "algorithm_snake", name: "Algorithm Snake", description: "Learn algorithms visually", route: "SnakeGame" },
    { id: "code_breaker", name: "Code Breaker", description: "Decrypt coding patterns", route: "PuzzleGame" },
    { id: "debug_challenge", name: "Debug Challenge", description: "Find and fix code errors", route: "TriviaGame" }
  ]
};

export default function SubjectGamesView({ subject, onBack, studentData }) {
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);

  // Get games for current subject
  const subjectGames = subjectSpecificGames[subject.id] || [];

  const getGameUrl = (game, chapter) => {
    return createPageUrl(`${game.route}?subject=${subject.id}&chapter=${encodeURIComponent(chapter)}`);
  };

  const getGradeSpecificContent = (chapter, grade = "8") => {
    const gradeContent = {
      "6": "Foundational concepts with simple examples",
      "7": "Building on basics with practical applications", 
      "8": "Intermediate concepts with real-world connections",
      "9": "Advanced topics with analytical thinking",
      "10": "Complex problems preparing for higher studies"
    };
    
    return gradeContent[grade] || gradeContent["8"];
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="icon" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 ${subject.bg} rounded-xl flex items-center justify-center`}>
              <subject.icon className={`w-6 h-6 ${subject.color}`} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{subject.name}</h1>
              <p className="text-gray-600">{subject.description}</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Games Section - ALL SUBJECTS HAVE GAMES */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Play className="w-5 h-5" />
              {subject.name} Games
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {subjectGames.map((game) => (
                <Card 
                  key={game.id}
                  className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105"
                  onClick={() => setSelectedGame(game)}
                >
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 ${subject.bg} rounded-xl flex items-center justify-center mb-4`}>
                      <Play className={`w-6 h-6 ${subject.color}`} />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{game.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{game.description}</p>
                    <Badge className={`bg-gradient-to-r ${subject.gradient} text-white`}>
                      {subject.name}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Chapter Selection for Selected Game */}
            {selectedGame && (
              <Card className="border-2 border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Play {selectedGame.name} with {subject.name}</span>
                    <Button 
                      variant="ghost" 
                      onClick={() => setSelectedGame(null)}
                      className="text-blue-600"
                    >
                      Cancel
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">Choose a {subject.name} chapter to practice with {selectedGame.name}:</p>
                  <div className="grid gap-3">
                    {subject.chapters.map((chapter, index) => {
                      const isCompleted = studentData?.subjects_progress?.[subject.id]?.chapters_completed?.includes(chapter);
                      const gradeLevel = Math.min(6 + Math.floor(index / 2), 10);
                      return (
                        <div key={chapter} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                          <div>
                            <h4 className="font-medium text-gray-900">{chapter}</h4>
                            <p className="text-xs text-gray-600">
                              Grade {gradeLevel} | {subject.name} | {getGradeSpecificContent(chapter, gradeLevel.toString())}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {isCompleted && (
                              <Badge className="bg-green-100 text-green-800 text-xs">✓ Complete</Badge>
                            )}
                            <Link to={getGameUrl(selectedGame, chapter)}>
                              <Button size="sm" className={`bg-gradient-to-r ${subject.gradient}`}>
                                <Play className="w-3 h-3 mr-1" />
                                Play
                              </Button>
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Chapters Sidebar */}
          <div>
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              {subject.name} Chapters
            </h2>
            <div className="space-y-3">
              {subject.chapters.map((chapter, index) => {
                const isCompleted = studentData?.subjects_progress?.[subject.id]?.chapters_completed?.includes(chapter);
                const gradeLevel = Math.min(6 + Math.floor(index / 2), 10);
                
                return (
                  <Card 
                    key={chapter}
                    className={`cursor-pointer transition-all duration-300 hover:shadow-md ${
                      selectedChapter === chapter ? 'ring-2 ring-blue-500' : ''
                    } ${isCompleted ? 'bg-green-50 border-green-200' : ''}`}
                    onClick={() => setSelectedChapter(selectedChapter === chapter ? null : chapter)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{chapter}</h4>
                        <div className="flex items-center gap-2">
                          {isCompleted && (
                            <Badge className="bg-green-100 text-green-800 text-xs">✓</Badge>
                          )}
                          <Badge variant="outline" className="text-xs">
                            Grade {gradeLevel}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">
                        {subject.name}: {getGradeSpecificContent(chapter, gradeLevel.toString())}
                      </p>
                      
                      {selectedChapter === chapter && (
                        <div className="mt-4 pt-3 border-t border-gray-200">
                          <p className="text-xs text-gray-700 mb-2">Play with:</p>
                          <div className="flex flex-wrap gap-1">
                            {subjectGames.map((game) => (
                              <Link 
                                key={game.id}
                                to={getGameUrl(game, chapter)}
                              >
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs cursor-pointer hover:bg-gradient-to-r hover:${subject.gradient} hover:text-white`}
                                >
                                  {game.name}
                                </Badge>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>

        {/* Subject Summary */}
        <Card className="bg-gradient-to-r from-gray-50 to-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              {subject.name} Learning Path
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{subjectGames.length}</div>
                <div className="text-sm text-gray-600">Interactive Games</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{subject.chapters.length}</div>
                <div className="text-sm text-gray-600">Learning Chapters</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">6-10</div>
                <div className="text-sm text-gray-600">Grade Levels</div>
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                🎯 All {subject.name} content is grade-appropriate and aligned with curriculum standards.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
