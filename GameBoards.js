
import React, { useState, useEffect } from "react";
import { Student } from "@/entities/all";
import { User } from "@/entities/User";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Calculator, Atom, Cpu, Trophy, Star, Play, Wrench } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

import SubjectCard from "../components/gameboards/SubjectCard";
import SubjectGamesView from "../components/gameboards/SubjectGamesView";

export default function GameBoards() {
  const [currentUser, setCurrentUser] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const user = await User.me();
      setCurrentUser(user);
      
      const students = await Student.filter({ created_by: user.email });
      let student = students[0];
      
      if (!student) {
        student = await Student.create({
          student_name: user.full_name,
          grade: "8",
          school: "SALT Academy",
          preferred_language: "english"
        });
      }
      
      setStudentData(student);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setIsLoading(false);
  };

  const subjects = [
    {
      id: "mathematics",
      name: "Mathematics",
      description: "Numbers, equations, and problem-solving adventures",
      icon: Calculator,
      color: "text-blue-600",
      bg: "bg-blue-50",
      gradient: "from-blue-500 to-blue-600",
      chapters: [
        "Mean, Median, Mode", "Probability Basics", "Algebra Fundamentals", "Arithmetic Operations", 
        "Problem Solving Strategies", "Pattern Recognition", "Ratios and Proportions", "Geometry Concepts", 
        "Logical Reasoning", "Advanced Mathematics"
      ],
      games: [
        { id: "tic_tac_toe", name: "Math Tic-Tac-Toe", description: "Solve equations to claim cells", route: "TicTacToe" },
        { id: "dice_game", name: "Probability Dice", description: "Learn probability with dice", route: "DiceGame" },
        { id: "card_game", name: "Math Card Game", description: "Probability and strategic thinking", route: "CardGame" },
        { id: "math_puzzles", name: "Math Puzzles", description: "Logic-based challenges", route: "PuzzleGame" },
        { id: "number_quest", name: "Number Quest", description: "Number theory adventures", route: "SnakeGame" }
      ],
      level: studentData?.subjects_progress?.mathematics?.level || 1,
      points: studentData?.subjects_progress?.mathematics?.points || 0,
      completedChapters: studentData?.subjects_progress?.mathematics?.chapters_completed?.length || 0
    },
    {
      id: "science",
      name: "Science",
      description: "Explore the wonders of biology, chemistry, and physics",
      icon: Atom,
      color: "text-green-600",
      bg: "bg-green-50",
      gradient: "from-green-500 to-green-600",
      chapters: [
        "Scientific Method", "Cell Biology", "Chemistry Basics", "Forces and Motion", 
        "Energy and Work", "Human Body Systems", "Ecosystems and Environment", "Earth Science", 
        "Genetics and DNA", "Scientific Inquiry"
      ],
      games: [
        { id: "word_search", name: "Science Word Search", description: "Find scientific terms", route: "WordSearch" },
        { id: "science_trivia", name: "Science Trivia", description: "Test your knowledge", route: "TriviaGame" },
        { id: "concept_memory", name: "Concept Memory", description: "Match terms and definitions", route: "MemoryGame" },
        { id: "virtual_lab", name: "Virtual Lab", description: "Conduct experiments", route: "PuzzleGame" },
        { id: "body_systems", name: "Body Systems Quiz", description: "Learn anatomy", route: "TriviaGame" }
      ],
      level: studentData?.subjects_progress?.science?.level || 1,
      points: studentData?.subjects_progress?.science?.points || 0,
      completedChapters: studentData?.subjects_progress?.science?.chapters_completed?.length || 0
    },
    {
      id: "technology",
      name: "Technology",
      description: "Aptitude, reasoning, and logical problem-solving",
      icon: Cpu,
      color: "text-purple-600",
      bg: "bg-purple-50",
      gradient: "from-purple-500 to-purple-600",
      chapters: [
        "Logical Reasoning", "Quantitative Aptitude", "Pattern Recognition", "Verbal Reasoning", 
        "Data Interpretation", "Analytical Thinking", "Problem Solving Strategies", "Critical Thinking", 
        "Spatial Reasoning", "Abstract Reasoning"
      ],
      games: [
        { id: "logic_puzzles", name: "Logic Puzzles", description: "Solve logical challenges", route: "PuzzleGame" },
        { id: "aptitude_test", name: "Aptitude Challenge", description: "Quantitative reasoning", route: "TriviaGame" },
        { id: "pattern_game", name: "Pattern Recognition", description: "Identify patterns", route: "SnakeGame" },
        { id: "reasoning_quiz", name: "Reasoning Quiz", description: "Test your reasoning", route: "TriviaGame" },
        { id: "strategy_games", name: "Strategy Games", description: "Strategic thinking", route: "StrategyGames" }
      ],
      level: studentData?.subjects_progress?.technology?.level || 1,
      points: studentData?.subjects_progress?.technology?.points || 0,
      completedChapters: studentData?.subjects_progress?.technology?.chapters_completed?.length || 0
    },
    {
      id: "engineering",
      name: "Engineering",
      description: "Coding, programming, and software development",
      icon: Wrench,
      color: "text-orange-600",
      bg: "bg-orange-50",
      gradient: "from-orange-500 to-orange-600",
      chapters: [
        "Python Basics", "JavaScript Fundamentals", "HTML & CSS", "Data Structures", 
        "Algorithm Design", "Problem Decomposition", "Code Debugging", "Software Engineering", 
        "Object-Oriented Programming", "Web Development"
      ],
      games: [
        { id: "code_playground", name: "Code Playground", description: "Learn 6 programming languages", route: "CodePlayground" },
        { id: "algorithm_challenge", name: "Algorithm Snake", description: "Learn algorithms", route: "SnakeGame" },
        { id: "code_breaker", name: "Code Breaker", description: "Decrypt coding patterns", route: "PuzzleGame" },
        { id: "debug_game", name: "Debug Challenge", description: "Find and fix code errors", route: "TriviaGame" },
        { id: "web_builder", name: "Web Builder", description: "Create web pages", route: "CodePlayground" }
      ],
      level: studentData?.subjects_progress?.engineering?.level || 1,
      points: studentData?.subjects_progress?.engineering?.points || 0,
      completedChapters: studentData?.subjects_progress?.engineering?.chapters_completed?.length || 0
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading game boards...</p>
        </div>
      </div>
    );
  }

  if (selectedSubject) {
    return (
      <SubjectGamesView 
        subject={selectedSubject} 
        onBack={() => setSelectedSubject(null)}
        studentData={studentData}
      />
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Choose Your Subject! 📚
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            Select a subject to explore games and chapters designed for your grade level
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Trophy className="w-4 h-4" />
            <span>Each subject has unique games and educational content</span>
          </div>
        </div>

        {/* Subject Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {subjects.map((subject) => (
            <SubjectCard
              key={subject.id}
              subject={subject}
              onClick={() => setSelectedSubject(subject)}
            />
          ))}
        </div>

        {/* Progress Overview */}
        <Card className="bg-gradient-to-r from-gray-50 to-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Your Learning Journey
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              {subjects.map((subject) => (
                <div key={subject.id} className="text-center">
                  <div className={`w-16 h-16 ${subject.bg} rounded-full flex items-center justify-center mx-auto mb-3`}>
                    <subject.icon className={`w-8 h-8 ${subject.color}`} />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">{subject.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">Level {subject.level}</p>
                  <div className="text-xs text-gray-500">
                    {subject.completedChapters} of {subject.chapters.length} chapters
                  </div>
                  <Progress 
                    value={(subject.completedChapters / subject.chapters.length) * 100} 
                    className="mt-2 h-1"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
