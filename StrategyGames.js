import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Target, Crown, Shield, Zap, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const strategyGames = [
  {
    id: "chess",
    title: "Chess Master",
    description: "Classic chess with educational focus on algebraic notation and strategic thinking.",
    icon: Crown,
    difficulty: "Hard",
    players: "1v1",
    estimatedTime: "20-60 min",
    skills: ["Strategy", "Pattern Recognition", "Forward Planning"],
    available: true,
    route: "ChessGame"
  },
  {
    id: "checkers",
    title: "Strategic Checkers",
    description: "Enhanced checkers game with move analysis and strategic hints.",
    icon: Shield,
    difficulty: "Medium",
    players: "1v1",
    estimatedTime: "15-30 min",
    skills: ["Tactical Thinking", "Spatial Awareness", "Decision Making"],
    available: false,
    route: null
  },
  {
    id: "reversi",
    title: "Reversi Challenge",
    description: "Master the art of board control and strategic positioning.",
    icon: Target,
    difficulty: "Medium",
    players: "1v1",
    estimatedTime: "10-20 min",
    skills: ["Territory Control", "Strategic Planning", "Pattern Recognition"],
    available: false,
    route: null
  },
  {
    id: "connect4",
    title: "Connect Four Plus",
    description: "Enhanced Connect Four with physics concepts and strategic analysis.",
    icon: Zap,
    difficulty: "Easy",
    players: "1v1",
    estimatedTime: "5-15 min",
    skills: ["Logical Thinking", "Pattern Recognition", "Basic Physics"],
    available: false,
    route: null
  }
];

export default function StrategyGamesPage() {
  const [selectedGame, setSelectedGame] = useState(null);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy": return "bg-green-100 text-green-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Hard": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to={createPageUrl("MiniGames")}>
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Strategy Games Hub</h1>
            <p className="text-gray-600">Master strategic thinking through classic board games</p>
          </div>
        </div>

        {/* Games Overview */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Strategic Learning Center</h2>
                  <p className="text-indigo-100 mb-4">
                    Develop critical thinking, planning, and decision-making skills through engaging strategy games.
                  </p>
                  <div className="flex gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4" />
                      <span>Skill Building</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      <span>Strategic Thinking</span>
                    </div>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center">
                    <Crown className="w-12 h-12 text-white" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Games Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {strategyGames.map((game) => (
            <Card
              key={game.id}
              className={`group overflow-hidden transition-all duration-300 hover:shadow-xl ${
                game.available ? 'hover:-translate-y-2 cursor-pointer' : 'opacity-75'
              }`}
              onClick={() => game.available && setSelectedGame(game)}
            >
              <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-500" />
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <game.icon className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getDifficultyColor(game.difficulty)}>
                      {game.difficulty}
                    </Badge>
                    {game.available ? (
                      <Badge className="bg-green-100 text-green-800">Available</Badge>
                    ) : (
                      <Badge className="bg-gray-100 text-gray-800">Coming Soon</Badge>
                    )}
                  </div>
                </div>
                <CardTitle className="text-lg">{game.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {game.description}
                </p>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Players:</span>
                    <span className="font-medium">{game.players}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Time:</span>
                    <span className="font-medium">{game.estimatedTime}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-xs text-gray-500 mb-2">Skills Developed:</div>
                  <div className="flex flex-wrap gap-1">
                    {game.skills.map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {game.available ? (
                  <Link to={createPageUrl(game.route)}>
                    <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:shadow-lg">
                      Play Now
                    </Button>
                  </Link>
                ) : (
                  <Button className="w-full" disabled>
                    Coming Soon
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Learning Benefits */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-600" />
                Strategic Thinking
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-600">
              <p>
                Develop long-term planning skills and learn to think several moves ahead. 
                Strategy games teach pattern recognition and decision-making under pressure.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-purple-600" />
                Problem Solving
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-600">
              <p>
                Each move presents a new problem to solve. Learn to analyze complex situations, 
                weigh multiple options, and make optimal decisions.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-orange-600" />
                Logical Reasoning
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-600">
              <p>
                Build logical thinking skills through cause-and-effect analysis. 
                Understand how individual moves contribute to overall game strategy.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Selected Game Modal */}
        {selectedGame && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-md w-full">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{selectedGame.title}</span>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedGame(null)}>
                    ✕
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">{selectedGame.description}</p>
                <div className="text-sm space-y-2">
                  <div><strong>Difficulty:</strong> {selectedGame.difficulty}</div>
                  <div><strong>Players:</strong> {selectedGame.players}</div>
                  <div><strong>Estimated Time:</strong> {selectedGame.estimatedTime}</div>
                </div>
                <div className="flex gap-2">
                  <Link to={createPageUrl(selectedGame.route)} className="flex-1">
                    <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-500">
                      Start Game
                    </Button>
                  </Link>
                  <Button variant="outline" onClick={() => setSelectedGame(null)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}