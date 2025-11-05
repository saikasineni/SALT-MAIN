
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Lightbulb, Trophy, Timer, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const scienceTerms = [
  { term: "Photosynthesis", definition: "Process by which plants make food using sunlight" },
  { term: "Mitochondria", definition: "Powerhouse of the cell" },
  { term: "DNA", definition: "Genetic material containing hereditary information" },
  { term: "Ecosystem", definition: "Community of living and non-living things in an environment" },
  { term: "Catalyst", definition: "Substance that speeds up a chemical reaction" },
  { term: "Antibody", definition: "Protein that fights against harmful substances" },
  { term: "Gravity", definition: "Force that pulls objects toward each other" },
  { term: "Molecule", definition: "Two or more atoms bonded together" },
];

const mathTerms = [
  { term: "Hypotenuse", definition: "Longest side of a right triangle" },
  { term: "Integer", definition: "Whole number (positive, negative, or zero)" },
  { term: "Prime Number", definition: "Number only divisible by 1 and itself" },
  { term: "Polynomial", definition: "Expression with multiple terms" },
  { term: "Diameter", definition: "Distance across a circle through its center" },
  { term: "Variable", definition: "Symbol representing an unknown value" },
  { term: "Fraction", definition: "Number representing a part of a whole" },
  { term: "Perimeter", definition: "Distance around the outside of a shape" },
];

const physicsTerms = [ // This array's content is used for 'technology' as per the outline
  { term: "Velocity", definition: "Speed in a specific direction" },
  { term: "Energy", definition: "Ability to do work or cause change" },
  { term: "Frequency", definition: "Number of waves that pass a point per second" },
  { term: "Momentum", definition: "Mass times velocity of a moving object" },
  { term: "Circuit", definition: "Closed path for electric current to flow" },
  { term: "Wavelength", definition: "Distance between two identical points on a wave" },
  { term: "Resistance", definition: "Opposition to the flow of electric current" },
  { term: "Amplitude", definition: "Maximum displacement of a wave from rest position" },
];

const subjects = {
  science: { terms: scienceTerms, color: "green", name: "Science" },
  mathematics: { terms: mathTerms, color: "blue", name: "Mathematics" },
  technology: { terms: physicsTerms, color: "purple", name: "Technology" }
};

const MemoryCard = ({ item, isFlipped, onClick, isMatched }) => {
  return (
    <motion.div
      className="relative w-full aspect-square cursor-pointer"
      onClick={onClick}
      whileHover={{ scale: isMatched ? 1 : 1.05 }}
      whileTap={{ scale: isMatched ? 1 : 0.95 }}
    >
      <motion.div
        className={`absolute inset-0 w-full h-full preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}
        style={{ transformStyle: 'preserve-3d' }}
        transition={{ duration: 0.6 }}
      >
        {/* Front of card */}
        <div className={`absolute inset-0 backface-hidden rounded-lg border-2 flex items-center justify-center p-2 ${
          isMatched ? 'bg-green-100 border-green-300' : 'bg-blue-100 border-blue-300 hover:bg-blue-200'
        }`}>
          <Lightbulb className={`w-6 h-6 ${isMatched ? 'text-green-600' : 'text-blue-600'}`} />
        </div>
        
        {/* Back of card */}
        <div className={`absolute inset-0 backface-hidden rotate-y-180 rounded-lg border-2 flex items-center justify-center p-2 text-center ${
          isMatched ? 'bg-green-50 border-green-400' : 'bg-white border-gray-300'
        }`}>
          <div className="text-xs font-medium leading-tight">
            {item.content}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function MemoryGamePage() {
  const [currentSubject, setCurrentSubject] = useState("science");
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [moves, setMoves] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);

  // Get subject from URL parameters on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const subjectParam = urlParams.get('subject');
    if (subjectParam && subjects[subjectParam]) {
      setCurrentSubject(subjectParam);
    }
  }, []);

  const initializeGame = useCallback(() => {
    const selectedTerms = subjects[currentSubject].terms.slice(0, 6);
    const gameCards = [];
    
    // Create pairs - one card for term, one for definition
    selectedTerms.forEach((item, index) => {
      gameCards.push({
        id: `term-${index}`,
        content: item.term,
        pairId: index,
        type: 'term'
      });
      gameCards.push({
        id: `def-${index}`,
        content: item.definition,
        pairId: index,
        type: 'definition'
      });
    });
    
    // Shuffle the cards
    const shuffledCards = gameCards.sort(() => Math.random() - 0.5);
    setCards(shuffledCards);
    setFlippedCards([]);
    setMatchedPairs([]);
    setMoves(0);
    setTimeElapsed(0);
    setGameStarted(false);
    setGameComplete(false);
  }, [currentSubject]);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  useEffect(() => {
    let timer;
    if (gameStarted && !gameComplete) {
      timer = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameStarted, gameComplete]);

  useEffect(() => {
    if (matchedPairs.length === cards.length / 2 && cards.length > 0) {
      setGameComplete(true);
      setGameStarted(false);
    }
  }, [matchedPairs.length, cards.length]);

  const handleCardClick = (cardIndex) => {
    if (!gameStarted) setGameStarted(true);
    
    const card = cards[cardIndex];
    
    // Don't flip if already flipped or matched
    if (flippedCards.includes(cardIndex) || matchedPairs.some(pair => pair.includes(cardIndex))) {
      return;
    }
    
    const newFlippedCards = [...flippedCards, cardIndex];
    setFlippedCards(newFlippedCards);
    
    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1);
      
      const [firstIndex, secondIndex] = newFlippedCards;
      const firstCard = cards[firstIndex];
      const secondCard = cards[secondIndex];
      
      // Check if cards match (same pairId)
      if (firstCard.pairId === secondCard.pairId) {
        setMatchedPairs(prev => [...prev, newFlippedCards]);
        setFlippedCards([]);
      } else {
        // Flip cards back after a delay
        setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const resetGame = () => {
    initializeGame();
  };

  const isCardFlipped = (index) => {
    return flippedCards.includes(index) || matchedPairs.some(pair => pair.includes(index));
  };

  const isCardMatched = (index) => {
    return matchedPairs.some(pair => pair.includes(index));
  };

  const score = Math.max(0, 1000 - (moves * 10) - Math.floor(timeElapsed / 10));

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to={createPageUrl("GameBoards")}>
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {subjects[currentSubject].name} Memory Match
            </h1>
            <p className="text-gray-600">Match {subjects[currentSubject].name.toLowerCase()} terms with their definitions</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          
          {/* Game Area */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Current Subject Display - Subject selection removed as it's URL-based */}
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <Badge className={`bg-${subjects[currentSubject].color}-600 text-white mb-4`}>
                    {subjects[currentSubject].name} Challenge
                  </Badge>
                  <p className="text-gray-600">
                    Match {subjects[currentSubject].name.toLowerCase()} terms with their correct definitions.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Game Board */}
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
                  {cards.map((card, index) => (
                    <MemoryCard
                      key={card.id}
                      item={card}
                      isFlipped={isCardFlipped(index)}
                      isMatched={isCardMatched(index)}
                      onClick={() => handleCardClick(index)}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Game Complete */}
            {gameComplete && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center p-6 bg-green-100 rounded-lg"
              >
                <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-green-800 mb-2">Congratulations! 🎉</h2>
                <p className="text-green-700 mb-4">
                  You matched all pairs in {moves} moves and {Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')}!
                </p>
                <p className="text-green-700 font-semibold mb-4">Score: {score} points</p>
                <Button onClick={resetGame} className="bg-green-600 hover:bg-green-700">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Play Again
                </Button>
              </motion.div>
            )}
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-6">
            
            {/* Game Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Game Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{matchedPairs.length}/{cards.length / 2}</div>
                  <div className="text-sm text-gray-600">Pairs Matched</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{moves}</div>
                  <div className="text-sm text-gray-600">Moves</div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')}
                  </div>
                  <div className="text-sm text-gray-600">Time</div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{score}</div>
                  <div className="text-sm text-gray-600">Score</div>
                </div>
                
                <Button onClick={resetGame} variant="outline" className="w-full">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset Game
                </Button>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  How to Play
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2 text-gray-600">
                <p>• Click cards to flip them over</p>
                <p>• Match scientific terms with their definitions</p>
                <p>• Find all pairs to win the game</p>
                <p>• Fewer moves = higher score!</p>
                <p>• Challenge yourself with different subjects</p>
              </CardContent>
            </Card>

            {/* Current Subject Info - This card's content is now redundant with the above 'Current Subject Display'
                                    but the outline kept a similar card structure in the sidebar too, so I'll preserve
                                    this card as it was, containing slightly different info (no Challenge in title).
                                    Keeping it as per the structure of the original file for the sidebar.
                                    The outline specifically modified the main 'Subject Selection' area, not this sidebar one. */}
            <Card>
              <CardHeader>
                <CardTitle>Current Subject</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge className={`bg-${subjects[currentSubject].color}-600 text-white`}>
                  {subjects[currentSubject].name}
                </Badge>
                <p className="text-sm text-gray-600 mt-2">
                  Match {subjects[currentSubject].name.toLowerCase()} terms with their correct definitions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
