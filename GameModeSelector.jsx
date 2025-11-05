import React, { useState } from "react";
import { GameSession } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Gamepad2, Brain, Zap, Target, Play } from "lucide-react";

import BoardGameMode from "./BoardGameMode";

export default function GameModeSelector({ subject, onBack, studentData }) {
  const [selectedMode, setSelectedMode] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);

  const gameModes = [
    {
      id: "board_game",
      name: "Board Game Adventure",
      description: "Navigate through interactive game boards with challenges",
      icon: Gamepad2,
      color: "text-blue-600",
      bg: "bg-blue-50",
      gradient: "from-blue-500 to-blue-600",
      difficulty: "Easy",
      duration: "15-20 min"
    },
    {
      id: "quiz",
      name: "Quick Quiz Challenge",
      description: "Test your knowledge with fast-paced questions",
      icon: Brain,
      color: "text-green-600",
      bg: "bg-green-50",
      gradient: "from-green-500 to-green-600",
      difficulty: "Medium",
      duration: "10-15 min"
    },
    {
      id: "puzzle",
      name: "Logic Puzzles",
      description: "Solve interactive puzzles and brain teasers",
      icon: Zap,
      color: "text-purple-600",
      bg: "bg-purple-50",
      gradient: "from-purple-500 to-purple-600",
      difficulty: "Hard",
      duration: "20-25 min"
    }
  ];

  if (selectedMode && selectedChapter) {
    return (
      <BoardGameMode
        subject={subject}
        chapter={selectedChapter}
        mode={selectedMode}
        onBack={() => {
          setSelectedMode(null);
          setSelectedChapter(null);
        }}
        studentData={studentData}
      />
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
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
              <p className="text-gray-600">Choose your learning mode and chapter</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Game Modes */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Target className="w-5 h-5" />
              Select Game Mode
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
              {gameModes.map((mode) => (
                <Card 
                  key={mode.id}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 ${
                    selectedMode?.id === mode.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setSelectedMode(mode)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-12 h-12 ${mode.bg} rounded-xl flex items-center justify-center`}>
                        <mode.icon className={`w-6 h-6 ${mode.color}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{mode.name}</h3>
                        <p className="text-sm text-gray-600">{mode.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{mode.difficulty}</Badge>
                      <Badge variant="outline">{mode.duration}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Chapter Selection */}
          <div>
            <h2 className="text-xl font-semibold mb-6">Select Chapter</h2>
            <div className="space-y-3">
              {subject.chapters.map((chapter, index) => {
                const isCompleted = studentData?.subjects_progress?.[subject.id]?.chapters_completed?.includes(chapter);
                return (
                  <Card 
                    key={chapter}
                    className={`cursor-pointer transition-all duration-300 hover:shadow-md ${
                      selectedChapter === chapter ? 'ring-2 ring-blue-500' : ''
                    } ${isCompleted ? 'bg-green-50 border-green-200' : ''}`}
                    onClick={() => setSelectedChapter(chapter)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">{chapter}</h4>
                          <p className="text-sm text-gray-600">Chapter {index + 1}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {isCompleted && (
                            <Badge className="bg-green-100 text-green-800">✓ Complete</Badge>
                          )}
                          <Badge variant="outline">
                            Level {Math.min(index + 1, subject.level)}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Start Button */}
            {selectedMode && selectedChapter && (
              <Button 
                className={`w-full mt-6 bg-gradient-to-r ${selectedMode.gradient} hover:shadow-lg`}
                onClick={() => {
                  // This will trigger the BoardGameMode component
                }}
              >
                <Play className="w-4 h-4 mr-2" />
                Start {selectedMode.name}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}