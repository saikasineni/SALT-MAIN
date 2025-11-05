import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Spade, Heart, Diamond, Club, Trophy, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const suits = {
  spades: { icon: Spade, color: "text-black" },
  hearts: { icon: Heart, color: "text-red-500" },
  diamonds: { icon: Diamond, color: "text-red-500" },
  clubs: { icon: Club, color: "text-black" }
};

const createDeck = () => {
  const deck = [];
  const suitNames = Object.keys(suits);
  const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  
  for (let suit of suitNames) {
    for (let value of values) {
      deck.push({
        suit,
        value,
        numericValue: value === 'A' ? 1 : ['J', 'Q', 'K'].includes(value) ? 10 : parseInt(value)
      });
    }
  }
  
  return deck.sort(() => Math.random() - 0.5);
};

const PlayingCard = ({ card, hidden = false }) => {
  if (!card) return null;
  
  const SuitIcon = suits[card.suit]?.icon || Spade;
  const suitColor = suits[card.suit]?.color || "text-black";
  
  return (
    <motion.div
      initial={{ scale: 0, rotateY: 180 }}
      animate={{ scale: 1, rotateY: hidden ? 180 : 0 }}
      whileHover={{ scale: 1.05 }}
      className="w-20 h-28 bg-white rounded-lg shadow-lg border-2 border-gray-200 flex flex-col items-center justify-center relative overflow-hidden"
    >
      {hidden ? (
        <div className="w-full h-full bg-blue-600 rounded flex items-center justify-center">
          <div className="text-white text-lg">🂠</div>
        </div>
      ) : (
        <>
          <div className={`text-lg font-bold ${suitColor}`}>{card.value}</div>
          <SuitIcon className={`w-6 h-6 ${suitColor}`} />
          <div className={`absolute top-1 left-1 text-xs ${suitColor}`}>{card.value}</div>
          <div className={`absolute bottom-1 right-1 text-xs ${suitColor} transform rotate-180`}>{card.value}</div>
        </>
      )}
    </motion.div>
  );
};

export default function CardGamePage() {
  const [deck, setDeck] = useState([]);
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [gameState, setGameState] = useState("betting"); // betting, playing, dealer, finished
  const [playerScore, setPlayerScore] = useState(0);
  const [dealerScore, setDealerScore] = useState(0);
  const [gameResult, setGameResult] = useState("");
  const [wins, setWins] = useState(0);
  const [games, setGames] = useState(0);
  const [streak, setStreak] = useState(0);

  const calculateScore = (hand) => {
    let score = 0;
    let aces = 0;
    
    for (let card of hand) {
      if (card.value === 'A') {
        aces++;
        score += 11;
      } else {
        score += card.numericValue;
      }
    }
    
    while (score > 21 && aces > 0) {
      score -= 10;
      aces--;
    }
    
    return score;
  };

  const startNewGame = () => {
    const newDeck = createDeck();
    const newPlayerHand = [newDeck.pop(), newDeck.pop()];
    const newDealerHand = [newDeck.pop(), newDeck.pop()];
    
    setDeck(newDeck);
    setPlayerHand(newPlayerHand);
    setDealerHand(newDealerHand);
    setPlayerScore(calculateScore(newPlayerHand));
    setDealerScore(calculateScore([newDealerHand[0]])); // Only show first card
    setGameState("playing");
    setGameResult("");
  };

  const hit = () => {
    if (deck.length === 0) return;
    
    const newCard = deck.pop();
    const newPlayerHand = [...playerHand, newCard];
    const newScore = calculateScore(newPlayerHand);
    
    setPlayerHand(newPlayerHand);
    setPlayerScore(newScore);
    setDeck([...deck]);
    
    if (newScore > 21) {
      endGame("bust");
    }
  };

  const stand = () => {
    setGameState("dealer");
    dealerPlay();
  };

  const dealerPlay = () => {
    let currentDealerHand = [...dealerHand];
    let currentScore = calculateScore(currentDealerHand);
    let currentDeck = [...deck];
    
    while (currentScore < 17 && currentDeck.length > 0) {
      const newCard = currentDeck.pop();
      currentDealerHand.push(newCard);
      currentScore = calculateScore(currentDealerHand);
    }
    
    setDealerHand(currentDealerHand);
    setDealerScore(currentScore);
    setDeck(currentDeck);
    
    // Determine winner
    if (currentScore > 21) {
      endGame("dealer_bust");
    } else if (currentScore > playerScore) {
      endGame("dealer_wins");
    } else if (playerScore > currentScore) {
      endGame("player_wins");
    } else {
      endGame("tie");
    }
  };

  const endGame = (result) => {
    setGameState("finished");
    setGames(prev => prev + 1);
    
    let resultText = "";
    let isWin = false;
    
    switch (result) {
      case "bust":
        resultText = "Bust! You went over 21";
        break;
      case "dealer_bust":
        resultText = "Dealer bust! You win!";
        isWin = true;
        break;
      case "dealer_wins":
        resultText = "Dealer wins";
        break;
      case "player_wins":
        resultText = "You win!";
        isWin = true;
        break;
      case "tie":
        resultText = "It's a tie!";
        break;
    }
    
    setGameResult(resultText);
    
    if (isWin) {
      setWins(prev => prev + 1);
      setStreak(prev => prev + 1);
    } else if (result !== "tie") {
      setStreak(0);
    }
  };

  const winRate = games > 0 ? Math.round((wins / games) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-purple-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to={createPageUrl("MiniGames")}>
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Blackjack</h1>
            <p className="text-gray-600">Learn probability and strategic thinking</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          
          {/* Game Area */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Dealer's Hand */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Dealer</span>
                  <Badge variant="outline">
                    Score: {gameState === "playing" ? "?" : dealerScore}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3 justify-center">
                  {dealerHand.map((card, index) => (
                    <PlayingCard 
                      key={index} 
                      card={card} 
                      hidden={gameState === "playing" && index === 1}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Game Controls */}
            <Card>
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  {gameState === "betting" && (
                    <div>
                      <h3 className="text-xl font-bold mb-4">Ready to Play?</h3>
                      <Button onClick={startNewGame} size="lg">
                        Deal Cards
                      </Button>
                    </div>
                  )}
                  
                  {gameState === "playing" && (
                    <div>
                      <h3 className="text-xl font-bold mb-4">Your Turn</h3>
                      <div className="flex gap-4 justify-center">
                        <Button onClick={hit} variant="outline" size="lg">
                          Hit
                        </Button>
                        <Button onClick={stand} size="lg">
                          Stand
                        </Button>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        Hit to draw another card, Stand to end your turn
                      </p>
                    </div>
                  )}
                  
                  {gameState === "dealer" && (
                    <div>
                      <h3 className="text-xl font-bold">Dealer's Turn</h3>
                      <p className="text-gray-600">Dealer must hit on 16 and stand on 17</p>
                    </div>
                  )}
                  
                  {gameState === "finished" && (
                    <div>
                      <h3 className="text-2xl font-bold mb-2">{gameResult}</h3>
                      <Button onClick={startNewGame} size="lg">
                        New Game
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Player's Hand */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Your Hand</span>
                  <Badge className={playerScore > 21 ? "bg-red-600" : "bg-blue-600"}>
                    Score: {playerScore}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3 justify-center">
                  {playerHand.map((card, index) => (
                    <PlayingCard key={index} card={card} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-6">
            
            {/* Game Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{wins}</div>
                  <div className="text-sm text-gray-600">Wins</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{games}</div>
                  <div className="text-sm text-gray-600">Games</div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{winRate}%</div>
                  <div className="text-sm text-gray-600">Win Rate</div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{streak}</div>
                  <div className="text-sm text-gray-600">Win Streak</div>
                </div>
              </CardContent>
            </Card>

            {/* Strategy Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Strategy Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <strong>Basic Strategy:</strong>
                  <ul className="mt-1 space-y-1 text-gray-600">
                    <li>• Hit if your total is 11 or less</li>
                    <li>• Stand if your total is 17 or more</li>
                    <li>• Consider dealer's visible card</li>
                  </ul>
                </div>
                
                <div>
                  <strong>Card Values:</strong>
                  <ul className="mt-1 space-y-1 text-gray-600">
                    <li>• Ace = 1 or 11</li>
                    <li>• Face cards = 10</li>
                    <li>• Number cards = Face value</li>
                  </ul>
                </div>

                <div>
                  <strong>Probability:</strong>
                  <p className="text-gray-600 mt-1">
                    There are 16 cards worth 10 points in each deck (10, J, Q, K).
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}