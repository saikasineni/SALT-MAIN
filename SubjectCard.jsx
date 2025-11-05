
import React, { useState, useEffect } from "react";
import { GameSession, Student } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Trophy, 
  Star, 
  CheckCircle, 
  XCircle, 
  Lightbulb,
  Timer,
  Target,
  Award
} from "lucide-react";

export default function BoardGameMode({ subject, chapter, mode, onBack, studentData }) {
  const [gameState, setGameState] = useState("playing"); // playing, completed, failed
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [gameData, setGameData] = useState(null);

  useEffect(() => {
    const generateQuestions = (subjectId, chapterName) => {
      const questionBank = {
        math: {
          "Basic Algebra": [
            {
              question: "What is the value of x in the equation 2x + 5 = 13?",
              options: ["4", "6", "8", "10"],
              correct: 0,
              explanation: "Subtract 5 from both sides: 2x = 8. Then divide by 2: x = 4"
            },
            {
              question: "Simplify: 3(x + 4) - 2x",
              options: ["x + 12", "x + 4", "5x + 12", "x - 12"],
              correct: 0,
              explanation: "3(x + 4) - 2x = 3x + 12 - 2x = x + 12"
            }
          ]
        },
        science: {
          "States of Matter": [
            {
              question: "At what temperature does water boil at sea level?",
              options: ["90°C", "100°C", "110°C", "120°C"],
              correct: 1,
              explanation: "Water boils at 100°C (212°F) at sea level atmospheric pressure"
            },
            {
              question: "Which state of matter has a definite volume but no definite shape?",
              options: ["Solid", "Liquid", "Gas", "Plasma"],
              correct: 1,
              explanation: "Liquids have definite volume but take the shape of their container"
            }
          ]
        },
        technology: {
          "Basic Programming": [
            {
              question: "What does HTML stand for?",
              options: ["HyperText Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "HyperText Modern Language"],
              correct: 0,
              explanation: "HTML stands for HyperText Markup Language, used to create web pages"
            }
          ]
        }
      };

      return questionBank[subjectId]?.[chapterName] || [
        {
          question: `Sample question for ${chapterName}`,
          options: ["Option A", "Option B", "Option C", "Option D"],
          correct: 0,
          explanation: "This is a sample explanation"
        }
      ];
    };

    const questions = generateQuestions(subject.id, chapter);
    setGameData({ questions, totalQuestions: questions.length });

    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [subject.id, chapter]);

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    const isCorrect = answerIndex === gameData.questions[currentQuestion].correct;
    if (isCorrect) {
      setScore(prev => prev + 10);
    }

    setTimeout(() => {
      if (currentQuestion + 1 < gameData.questions.length) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        completeGame();
      }
    }, 2000);
  };

  const completeGame = async () => {
    const finalScore = Math.round((score / (gameData.totalQuestions * 10)) * 100);
    setGameState("completed");
    
    // Save game session
    await GameSession.create({
      student_id: studentData.id,
      subject: subject.id,
      chapter: chapter,
      game_type: mode.id,
      points_earned: score,
      time_spent: Math.round(timeElapsed / 60),
      completion_rate: finalScore,
      correct_answers: Math.round(score / 10),
      total_questions: gameData.totalQuestions
    });

    // Update student progress
    const currentProgress = studentData.subjects_progress || {};
    const subjectProgress = currentProgress[subject.id] || { level: 1, points: 0, chapters_completed: [] };
    
    if (!subjectProgress.chapters_completed.includes(chapter)) {
      subjectProgress.chapters_completed.push(chapter);
    }
    subjectProgress.points += score;
    subjectProgress.level = Math.floor(subjectProgress.points / 100) + 1;

    await Student.update(studentData.id, {
      total_points: (studentData.total_points || 0) + score,
      level: Math.floor(((studentData.total_points || 0) + score) / 300) + 1,
      subjects_progress: {
        ...currentProgress,
        [subject.id]: subjectProgress
      }
    });
  };

  const currentQ = gameData?.questions[currentQuestion];
  const progress = gameData ? ((currentQuestion + 1) / gameData.totalQuestions) * 100 : 0;

  if (!gameData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading game...</p>
        </div>
      </div>
    );
  }

  if (gameState === "completed") {
    const finalScore = Math.round((score / (gameData.totalQuestions * 10)) * 100);
    return (
      <div className="min-h-screen p-4 md:p-8 flex items-center justify-center">
        <Card className="max-w-2xl w-full">
          <CardHeader className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-2xl">Game Complete! 🎉</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{finalScore}%</div>
                <div className="text-sm text-gray-600">Final Score</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{score}</div>
                <div className="text-sm text-gray-600">Points Earned</div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{Math.round(timeElapsed / 60)}</div>
                <div className="text-sm text-gray-600">Minutes</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{Math.round(score / 10)}/{gameData.totalQuestions}</div>
                <div className="text-sm text-gray-600">Correct</div>
              </div>
            </div>

            {finalScore >= 80 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center justify-center gap-2 text-yellow-800">
                  <Award className="w-5 h-5" />
                  <span className="font-medium">Excellent Performance!</span>
                </div>
                <p className="text-sm text-yellow-700 mt-1">
                  You've mastered {chapter}. Keep up the great work!
                </p>
              </div>
            )}

            <div className="flex gap-4 justify-center">
              <Button variant="outline" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Subjects
              </Button>
              <Button onClick={() => window.location.reload()}>
                Play Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">{chapter}</h1>
              <p className="text-gray-600">{subject.name} • {mode.name}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="flex items-center gap-1">
              <Timer className="w-3 h-3" />
              {Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')}
            </Badge>
            <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1">
              <Star className="w-3 h-3" />
              {score} pts
            </Badge>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              Question {currentQuestion + 1} of {gameData.totalQuestions}
            </span>
            <span className="font-medium">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Game Board */}
        <Card className="min-h-96">
          <CardContent className="p-8">
            <div className="max-w-2xl mx-auto text-center space-y-8">
              
              <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${subject.bg}`}>
                <subject.icon className={`w-8 h-8 ${subject.color}`} />
              </div>

              <h2 className="text-2xl font-bold text-gray-900">
                {currentQ.question}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQ.options.map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className={`p-6 text-left h-auto hover:shadow-md transition-all duration-300 ${
                      showResult
                        ? index === currentQ.correct
                          ? "bg-green-50 border-green-500 text-green-700"
                          : selectedAnswer === index && index !== currentQ.correct
                          ? "bg-red-50 border-red-500 text-red-700"
                          : ""
                        : selectedAnswer === index
                        ? "bg-blue-50 border-blue-500"
                        : ""
                    }`}
                    onClick={() => !showResult && handleAnswerSelect(index)}
                    disabled={showResult}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-medium ${
                        showResult && index === currentQ.correct
                          ? "bg-green-500 border-green-500 text-white"
                          : showResult && selectedAnswer === index && index !== currentQ.correct
                          ? "bg-red-500 border-red-500 text-white"
                          : "border-gray-300"
                      }`}>
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span>{option}</span>
                      {showResult && index === currentQ.correct && (
                        <CheckCircle className="w-5 h-5 text-green-600 ml-auto" />
                      )}
                      {showResult && selectedAnswer === index && index !== currentQ.correct && (
                        <XCircle className="w-5 h-5 text-red-600 ml-auto" />
                      )}
                    </div>
                  </Button>
                ))}
              </div>

              {showResult && (
                <div className={`p-4 rounded-lg ${
                  selectedAnswer === currentQ.correct ? "bg-green-50" : "bg-blue-50"
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">Explanation</span>
                  </div>
                  <p className="text-gray-700">{currentQ.explanation}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
