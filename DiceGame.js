
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, Trophy, Target, Calculator } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { GameScore } from "@/entities/all";
import { User } from "@/entities/User";
import { addScore as addOfflineScore, getPlayerData } from "@/components/lib/offline";
import QuestionPopup from "../components/shared/QuestionPopup";
import GameInstructions from "../components/shared/GameInstructions";
import { getRandomQuestion } from "../components/data/questionBank";

const diceIcons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];

const DiceDisplay = ({ value, isRolling }) => {
  const DiceIcon = diceIcons[value - 1] || Dice1;
  
  return (
    <motion.div
      animate={isRolling ? { rotate: [0, 180, 360] } : {}}
      transition={{ duration: 0.8 }}
      className="w-20 h-20 bg-white rounded-xl shadow-lg flex items-center justify-center border-2 border-gray-200"
    >
      <DiceIcon className="w-10 h-10 text-blue-600" />
    </motion.div>
  );
};

const challenges = [
  {
    title: "Basic Addition",
    description: "Add the values of two dice",
    type: "addition",
    difficulty: "easy",
    minScore: 2,
    maxScore: 12,
    points: 10
  },
  {
    title: "Probability Prediction",
    description: "Predict if the sum will be even or odd",
    type: "probability",
    difficulty: "medium",
    points: 15
  },
  {
    title: "Target Number",
    description: "Try to roll a specific target number",
    type: "target",
    difficulty: "hard",
    points: 25
  }
];

const gameInstructions = {
  title: "Probability Dice Game",
  rules: [
    "Two dice are rolled on each turn",
    "Answer probability and math questions before rolling",
    "Complete different challenges: addition, probability prediction, target numbers",
    "Correct answers earn points and build your streak",
    "Wrong answers break your streak but you can keep playing"
  ],
  objectives: [
    "Understand probability concepts and likelihood",
    "Practice mental arithmetic with dice sums",
    "Learn to predict outcomes using mathematical reasoning",
    "Develop quick calculation skills"
  ],
  tips: [
    "The most common sum is 7 (can be made 6 different ways)",
    "Sums of 2 and 12 are least likely (only 1 way each)",
    "For even/odd predictions, both have equal 50% probability",
    "Keep track of patterns to improve your predictions"
  ]
};

export default function DiceGamePage() {
  const [dice1, setDice1] = useState(1);
  const [dice2, setDice2] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [score, setScore] = useState(0);
  const [currentChallenge, setCurrentChallenge] = useState(challenges[0]);
  const [prediction, setPrediction] = useState(null);
  const [targetNumber, setTargetNumber] = useState(7);
  const [streak, setStreak] = useState(0);
  const [gameStats, setGameStats] = useState({ correct: 0, total: 0 });
  const [showResult, setShowResult] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [showQuestion, setShowQuestion] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [showInstructions, setShowInstructions] = useState(true);

  const location = useLocation();
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const offlineMode = params.get('mode') === 'offline';
    setIsOffline(offlineMode);

    if (offlineMode) {
      const playerData = getPlayerData();
      setScore(playerData.total_points || 0);
    }
  }, [location.search]);

  const rollDice = async () => {
    if (isRolling || showQuestion) return; // Prevent rolling if already rolling or question is active
    
    // Show question before rolling
    const question = getRandomQuestion('mathematics');
    setCurrentQuestion(question);
    setShowQuestion(true);
  };

  const handleQuestionAnswer = (isCorrect) => {
    setShowQuestion(false);
    
    if (isCorrect) {
      // Bonus points for correct answer to the question
      setScore(prev => prev + 20);
    }
    
    // Proceed with dice roll animation and challenge processing
    proceedWithRoll();
  };

  const proceedWithRoll = () => {
    setIsRolling(true);
    setShowResult(false);
    
    // Simulate rolling animation
    setTimeout(() => {
      const newDice1 = Math.floor(Math.random() * 6) + 1;
      const newDice2 = Math.floor(Math.random() * 6) + 1;
      setDice1(newDice1);
      setDice2(newDice2);
      
      // Process the result based on current challenge
      processResult(newDice1, newDice2);
      setIsRolling(false);
    }, 800);
  };

  const processResult = (d1, d2) => {
    const sum = d1 + d2;
    let isCorrect = false;
    let resultText = "";
    
    switch (currentChallenge.type) {
      case "addition":
        resultText = `${d1} + ${d2} = ${sum}`;
        isCorrect = true; // Always correct for basic addition
        break;
      
      case "probability":
        if (prediction) {
          const isEven = sum % 2 === 0;
          isCorrect = (prediction === "even" && isEven) || (prediction === "odd" && !isEven);
          resultText = `Sum: ${sum} (${isEven ? "Even" : "Odd"}) - ${isCorrect ? "Correct!" : "Wrong!"}`;
        }
        break;
      
      case "target":
        isCorrect = sum === targetNumber;
        resultText = `Target: ${targetNumber}, Rolled: ${sum} - ${isCorrect ? "Hit!" : "Miss!"}`;
        break;
    }

    if (isCorrect) {
      setScore(prev => prev + currentChallenge.points);
      setStreak(prev => prev + 1);
      setGameStats(prev => ({ ...prev, correct: prev.correct + 1, total: prev.total + 1 }));
    } else {
      setStreak(0);
      setGameStats(prev => ({ ...prev, total: prev.total + 1 }));
    }

    setLastResult({ text: resultText, isCorrect, sum, points: isCorrect ? currentChallenge.points : 0 });
    setShowResult(true);
    setPrediction(null);
  };

  const switchChallenge = (challenge) => {
    setCurrentChallenge(challenge);
    setPrediction(null);
    setShowResult(false);
    if (challenge.type === "target") {
      setTargetNumber(Math.floor(Math.random() * 11) + 2); // 2-12
    }
  };

  const saveGameScore = useCallback(async (gameData) => {
    if (isOffline) {
      addOfflineScore(gameData);
    } else {
      try {
        const user = await User.me();
        await GameScore.create({
          student_id: user.id,
          ...gameData
        });
      } catch (error) {
        console.error("Error saving score:", error);
      }
    }
  }, [isOffline]);

  useEffect(() => {
    if (lastResult && lastResult.isCorrect) {
      const accuracy = gameStats.total > 0 ? Math.round((gameStats.correct / gameStats.total) * 100) : 100;
      saveGameScore({
        game_name: "dice_game",
        subject: "mathematics",
        chapter: "Probability & Arithmetic",
        grade_level: "6",
        score: lastResult.points,
        time_spent: 1, // Approximate
        accuracy: accuracy,
        difficulty_level: currentChallenge.difficulty
      });
    }
  }, [lastResult, gameStats, currentChallenge.difficulty, saveGameScore]);

  const accuracy = gameStats.total > 0 ? Math.round((gameStats.correct / gameStats.total) * 100) : 0;
  
  const backUrl = isOffline 
    ? createPageUrl("MiniGames?mode=offline") 
    : createPageUrl("MiniGames");

  if (showInstructions) {
    return (
      <GameInstructions
        {...gameInstructions}
        onStart={() => setShowInstructions(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to={backUrl}>
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dice Game</h1>
            <p className="text-gray-600">Learn probability and arithmetic through dice rolling</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Game Area */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Challenge Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Select Challenge
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-3">
                  {challenges.map((challenge, index) => (
                    <Button
                      key={index}
                      variant={currentChallenge.title === challenge.title ? "default" : "outline"}
                      onClick={() => switchChallenge(challenge)}
                      className="h-auto p-4 text-left"
                    >
                      <div>
                        <div className="font-medium">{challenge.title}</div>
                        <div className="text-xs text-gray-600 mt-1">{challenge.description}</div>
                        <Badge variant="outline" className="mt-2">
                          {challenge.points} pts
                        </Badge>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Current Challenge Info */}
            <Card>
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold mb-2">{currentChallenge.title}</h3>
                  <p className="text-gray-600">{currentChallenge.description}</p>
                  
                  {currentChallenge.type === "probability" && !prediction && (
                    <div className="mt-4 space-x-3">
                      <Button onClick={() => setPrediction("even")} variant="outline">
                        Predict Even
                      </Button>
                      <Button onClick={() => setPrediction("odd")} variant="outline">
                        Predict Odd
                      </Button>
                    </div>
                  )}
                  
                  {currentChallenge.type === "target" && (
                    <div className="mt-4">
                      <div className="text-lg font-semibold">Target Number: {targetNumber}</div>
                      <div className="text-sm text-gray-600">Try to roll this sum!</div>
                    </div>
                  )}
                  
                  {prediction && (
                    <Badge className="mt-4">Prediction: {prediction}</Badge>
                  )}
                </div>

                {/* Dice Display */}
                <div className="flex justify-center items-center gap-8 mb-8">
                  <DiceDisplay value={dice1} isRolling={isRolling} />
                  <div className="text-2xl font-bold text-gray-600">+</div>
                  <DiceDisplay value={dice2} isRolling={isRolling} />
                  <div className="text-2xl font-bold text-gray-600">=</div>
                  <div className="w-20 h-20 bg-blue-100 rounded-xl flex items-center justify-center">
                    <span className="text-2xl font-bold text-blue-600">{dice1 + dice2}</span>
                  </div>
                </div>

                {/* Roll Button */}
                <div className="text-center mb-6">
                  <Button
                    onClick={rollDice}
                    disabled={isRolling || showQuestion || (currentChallenge.type === "probability" && !prediction)}
                    size="lg"
                    className="px-8 py-3"
                  >
                    {isRolling ? "Rolling..." : (showQuestion ? "Answer Question First" : "Roll Dice")}
                  </Button>
                </div>

                {/* Result Display */}
                <AnimatePresence>
                  {showResult && lastResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={`text-center p-4 rounded-lg ${
                        lastResult.isCorrect ? "bg-green-100" : "bg-red-100"
                      }`}
                    >
                      <div className={`text-lg font-semibold ${
                        lastResult.isCorrect ? "text-green-800" : "text-red-800"
                      }`}>
                        {lastResult.text}
                      </div>
                      {lastResult.isCorrect && (
                        <div className="text-green-600 mt-2">
                          +{lastResult.points} points!
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
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
                  Your Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{score}</div>
                  <div className="text-gray-600">Total Points</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{streak}</div>
                  <div className="text-gray-600">Current Streak</div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Accuracy</span>
                    <span>{accuracy}%</span>
                  </div>
                  <Progress value={accuracy} className="h-2" />
                </div>

                <div className="text-center text-sm text-gray-600">
                  <div>{gameStats.correct} correct out of {gameStats.total} attempts</div>
                </div>
              </CardContent>
            </Card>

            {/* Learning Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  Learning Notes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <strong>Probability Facts:</strong>
                  <ul className="mt-1 space-y-1 text-gray-600">
                    <li>• Most likely sum: 7 (6 ways)</li>
                    <li>• Least likely: 2 & 12 (1 way each)</li>
                    <li>• Even sums: 2,4,6,8,10,12</li>
                    <li>• Odd sums: 3,5,7,9,11</li>
                  </ul>
                </div>
                
                <div>
                  <strong>Current Challenge:</strong>
                  <p className="text-gray-600 mt-1">{currentChallenge.description}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
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
