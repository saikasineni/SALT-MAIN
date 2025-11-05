import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Dices, Trophy, Users, Zap, Star, Crown, PlayCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import GameInstructions from "../components/shared/GameInstructions";
import WinCelebration from "../components/shared/WinCelebration";

// Periodic Table Elements with their properties
const periodicElements = {
  sblock: [
    { symbol: "H", name: "Hydrogen", number: 1, fact: "Lightest element, powers the sun!" },
    { symbol: "He", name: "Helium", number: 2, fact: "Makes balloons float!" },
    { symbol: "Li", name: "Lithium", number: 3, fact: "Used in batteries!" },
    { symbol: "Be", name: "Beryllium", number: 4, fact: "Strong and light metal!" },
    { symbol: "Na", name: "Sodium", number: 11, fact: "Found in table salt!" },
    { symbol: "Mg", name: "Magnesium", number: 12, fact: "Burns with bright white light!" },
    { symbol: "K", name: "Potassium", number: 19, fact: "Essential for life!" },
    { symbol: "Ca", name: "Calcium", number: 20, fact: "Makes bones strong!" },
    { symbol: "Rb", name: "Rubidium", number: 37, fact: "Reacts violently with water!" },
    { symbol: "Sr", name: "Strontium", number: 38, fact: "Makes red fireworks!" },
    { symbol: "Cs", name: "Cesium", number: 55, fact: "Most reactive metal!" },
    { symbol: "Ba", name: "Barium", number: 56, fact: "Makes green fireworks!" }
  ],
  pblock: [
    { symbol: "B", name: "Boron", number: 5, fact: "Used in glass and ceramics!" },
    { symbol: "C", name: "Carbon", number: 6, fact: "Building block of life!" },
    { symbol: "N", name: "Nitrogen", number: 7, fact: "78% of Earth's atmosphere!" },
    { symbol: "O", name: "Oxygen", number: 8, fact: "We breathe this to live!" },
    { symbol: "F", name: "Fluorine", number: 9, fact: "Most reactive element!" },
    { symbol: "Ne", name: "Neon", number: 10, fact: "Makes bright neon signs!" },
    { symbol: "Al", name: "Aluminum", number: 13, fact: "Lightweight and strong!" },
    { symbol: "Si", name: "Silicon", number: 14, fact: "Used in computer chips!" },
    { symbol: "P", name: "Phosphorus", number: 15, fact: "Glows in the dark!" },
    { symbol: "S", name: "Sulfur", number: 16, fact: "Smells like rotten eggs!" },
    { symbol: "Cl", name: "Chlorine", number: 17, fact: "Used to clean pools!" },
    { symbol: "Ar", name: "Argon", number: 18, fact: "Used in light bulbs!" }
  ],
  dblock: [
    { symbol: "Sc", name: "Scandium", number: 21, fact: "Makes aluminum alloys!" },
    { symbol: "Ti", name: "Titanium", number: 22, fact: "Strong as steel, light as aluminum!" },
    { symbol: "V", name: "Vanadium", number: 23, fact: "Makes steel stronger!" },
    { symbol: "Cr", name: "Chromium", number: 24, fact: "Makes stainless steel shiny!" },
    { symbol: "Mn", name: "Manganese", number: 25, fact: "Removes sulfur from steel!" },
    { symbol: "Fe", name: "Iron", number: 26, fact: "Makes our blood red!" },
    { symbol: "Co", name: "Cobalt", number: 27, fact: "Makes blue glass!" },
    { symbol: "Ni", name: "Nickel", number: 28, fact: "Used in coins!" },
    { symbol: "Cu", name: "Copper", number: 29, fact: "Best conductor of electricity!" },
    { symbol: "Zn", name: "Zinc", number: 30, fact: "Protects iron from rust!" }
  ],
  fblock: [
    { symbol: "La", name: "Lanthanum", number: 57, fact: "Used in camera lenses!" },
    { symbol: "Ce", name: "Cerium", number: 58, fact: "Most abundant rare earth!" },
    { symbol: "Pr", name: "Praseodymium", number: 59, fact: "Makes green glass!" },
    { symbol: "Nd", name: "Neodymium", number: 60, fact: "Strongest permanent magnets!" },
    { symbol: "Pm", name: "Promethium", number: 61, fact: "Radioactive and rare!" },
    { symbol: "Sm", name: "Samarium", number: 62, fact: "Used in headphones!" },
    { symbol: "Eu", name: "Europium", number: 63, fact: "Makes euro notes glow!" },
    { symbol: "Gd", name: "Gadolinium", number: 64, fact: "Used in MRI machines!" },
    { symbol: "Tb", name: "Terbium", number: 65, fact: "Makes green screens!" },
    { symbol: "Dy", name: "Dysprosium", number: 66, fact: "Used in lasers!" }
  ]
};

const gameInstructions = {
  title: "Periodic Table Ludo",
  rules: [
    "🎲 Roll dice to move your tokens across the Periodic Table board",
    "🔴 Red Zone = s-block elements (Hydrogen, Sodium, etc.)",
    "🟡 Yellow Zone = p-block elements (Carbon, Oxygen, etc.)",
    "🟢 Green Zone = d-block elements (Iron, Copper, etc.)",
    "🔵 Blue Zone = f-block elements (Rare earth metals)",
    "✨ Landing on your own block type gives +2 bonus moves!",
    "📚 Land on elements to learn atomic numbers and facts",
    "🎯 First player to get all 4 tokens to the center (Nucleus) wins!",
    "👥 Play with 1-4 players (AI fills remaining slots)"
  ],
  objectives: [
    "Learn periodic table structure through gameplay",
    "Understand s, p, d, f block classification",
    "Memorize element symbols and atomic numbers",
    "Recognize element properties and uses",
    "Build chemistry knowledge through visual patterns"
  ],
  tips: [
    "🎯 Plan ahead! Try to land on your own block elements for bonus moves",
    "⚡ Rare elements (like radioactive ones) give extra points!",
    "💡 Watch the element facts popup - they help with memory!",
    "🏆 Complete your element collection for achievement badges",
    "🎲 Roll a 6 to get an extra turn!"
  ]
};

const BOARD_POSITIONS = 52; // Total positions on the Ludo board
const TOKENS_PER_PLAYER = 4;

export default function PeriodicLudo() {
  const [numPlayers, setNumPlayers] = useState(null);
  const [players, setPlayers] = useState([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [diceValue, setDiceValue] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [winner, setWinner] = useState(null);
  const [showCelebration, setCelebrationData] = useState({ show: false, points: 0, message: "" });
  const [elementPopup, setElementPopup] = useState(null);
  const [selectedToken, setSelectedToken] = useState(null);

  const playerConfigs = [
    { color: "red", block: "sblock", name: "Red", bg: "bg-red-500", border: "border-red-600" },
    { color: "yellow", block: "pblock", name: "Yellow", bg: "bg-yellow-500", border: "border-yellow-600" },
    { color: "green", block: "dblock", name: "Green", bg: "bg-green-500", border: "border-green-600" },
    { color: "blue", block: "fblock", name: "Blue", bg: "bg-blue-500", border: "border-blue-600" }
  ];

  const initializePlayers = (count) => {
    const newPlayers = [];
    
    for (let i = 0; i < 4; i++) {
      const config = playerConfigs[i];
      const tokens = [];
      
      for (let j = 0; j < TOKENS_PER_PLAYER; j++) {
        tokens.push({
          id: `${i}-${j}`,
          position: -1, // -1 means at home
          finished: false
        });
      }
      
      newPlayers.push({
        id: i,
        ...config,
        tokens: tokens,
        isAI: i >= count, // First 'count' players are human
        score: 0,
        elementsDiscovered: []
      });
    }
    
    setPlayers(newPlayers);
    setNumPlayers(count);
    setGameStarted(true);
    setCurrentPlayerIndex(0);
  };

  const rollDice = () => {
    if (isRolling || selectedToken === null) return;
    
    setIsRolling(true);
    const roll = Math.floor(Math.random() * 6) + 1;
    
    setTimeout(() => {
      setDiceValue(roll);
      setIsRolling(false);
      moveToken(roll);
    }, 600);
  };

  const moveToken = (steps) => {
    const currentPlayer = players[currentPlayerIndex];
    const token = currentPlayer.tokens[selectedToken];
    
    // Can only start if rolled 6 and token is at home
    if (token.position === -1 && steps !== 6) {
      nextPlayer();
      return;
    }
    
    // Start token if at home and rolled 6
    if (token.position === -1 && steps === 6) {
      const updatedPlayers = [...players];
      updatedPlayers[currentPlayerIndex].tokens[selectedToken].position = 0;
      setPlayers(updatedPlayers);
      showElementInfo(0, currentPlayer);
      // Extra turn for rolling 6
      setSelectedToken(null);
      return;
    }
    
    let newPosition = token.position + steps;
    
    // Check if reached center (finished)
    if (newPosition >= BOARD_POSITIONS) {
      const updatedPlayers = [...players];
      updatedPlayers[currentPlayerIndex].tokens[selectedToken].finished = true;
      updatedPlayers[currentPlayerIndex].score += 50;
      setPlayers(updatedPlayers);
      
      // Check if all tokens finished
      const allFinished = updatedPlayers[currentPlayerIndex].tokens.every(t => t.finished);
      if (allFinished) {
        setWinner(currentPlayer);
        setCelebrationData({
          show: true,
          points: updatedPlayers[currentPlayerIndex].score,
          message: `🏆 ${currentPlayer.name} Player Wins!`
        });
      }
      
      if (steps === 6) {
        setSelectedToken(null);
        return;
      }
      
      nextPlayer();
      return;
    }
    
    // Move token
    const updatedPlayers = [...players];
    updatedPlayers[currentPlayerIndex].tokens[selectedToken].position = newPosition;
    
    // Show element info
    showElementInfo(newPosition, currentPlayer);
    
    // Check for bonus moves (landing on own block)
    const element = getElementAtPosition(newPosition, currentPlayer.block);
    if (element && element.bonus) {
      updatedPlayers[currentPlayerIndex].score += 10;
      // Bonus: roll again
      setPlayers(updatedPlayers);
      setSelectedToken(null);
      return;
    }
    
    setPlayers(updatedPlayers);
    
    // Extra turn if rolled 6
    if (steps === 6) {
      setSelectedToken(null);
    } else {
      nextPlayer();
    }
  };

  const getElementAtPosition = (position, block) => {
    const elements = periodicElements[block];
    if (!elements) return null;
    
    const elementIndex = position % elements.length;
    const element = elements[elementIndex];
    
    // Check if this element matches player's block (bonus)
    return { ...element, bonus: true };
  };

  const showElementInfo = (position, player) => {
    const element = getElementAtPosition(position, player.block);
    if (element) {
      setElementPopup({
        ...element,
        block: player.block,
        color: player.color
      });
      
      // Update discovered elements
      const updatedPlayers = [...players];
      if (!updatedPlayers[currentPlayerIndex].elementsDiscovered.includes(element.symbol)) {
        updatedPlayers[currentPlayerIndex].elementsDiscovered.push(element.symbol);
        updatedPlayers[currentPlayerIndex].score += 5;
        setPlayers(updatedPlayers);
      }
      
      setTimeout(() => setElementPopup(null), 3000);
    }
  };

  const nextPlayer = () => {
    setSelectedToken(null);
    const nextIndex = (currentPlayerIndex + 1) % 4;
    setCurrentPlayerIndex(nextIndex);
    
    // AI turn
    if (players[nextIndex].isAI && !winner) {
      setTimeout(() => {
        // AI selects a random movable token
        const movableTokens = players[nextIndex].tokens
          .map((t, idx) => ({ token: t, idx }))
          .filter(({ token }) => !token.finished);
        
        if (movableTokens.length > 0) {
          const randomToken = movableTokens[Math.floor(Math.random() * movableTokens.length)];
          setSelectedToken(randomToken.idx);
          setTimeout(() => rollDice(), 500);
        } else {
          nextPlayer();
        }
      }, 1000);
    }
  };

  const selectToken = (tokenIndex) => {
    if (players[currentPlayerIndex].isAI) return;
    setSelectedToken(tokenIndex);
  };

  if (showInstructions) {
    return (
      <GameInstructions
        {...gameInstructions}
        onStart={() => setShowInstructions(false)}
      />
    );
  }

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-teal-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-3xl bg-white/95 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-center text-3xl">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Dices className="w-12 h-12 text-purple-600 animate-bounce" />
                <span>Periodic Table Ludo</span>
              </div>
              <p className="text-base text-gray-600 font-normal mt-2">
                Select number of human players (AI will fill remaining slots)
              </p>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(count => (
                <motion.button
                  key={count}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => initializePlayers(count)}
                  className="p-8 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 text-white font-bold text-2xl hover:shadow-2xl transition-all flex flex-col items-center gap-3"
                >
                  <Users className="w-10 h-10" />
                  <div>
                    <div className="text-3xl">{count}</div>
                    <div className="text-sm font-normal">Player{count > 1 ? 's' : ''}</div>
                  </div>
                  {4 - count > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      + {4 - count} AI
                    </Badge>
                  )}
                </motion.button>
              ))}
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl">
              <h3 className="font-bold text-lg mb-3">🧪 How to Win:</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>✅ Move all 4 of your tokens from home to the center (Nucleus)</li>
                <li>✅ Roll a 6 to start your tokens</li>
                <li>✅ Land on your color's elements for bonus moves!</li>
                <li>✅ Learn about 40+ elements while playing</li>
              </ul>
            </div>

            <Button 
              variant="outline" 
              onClick={() => setShowInstructions(true)}
              className="w-full"
            >
              📖 View Full Rules
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentPlayer = players[currentPlayerIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link to={createPageUrl("MiniGames")}>
            <Button variant="outline" size="icon" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">Periodic Table Ludo</h1>
            <p className="text-blue-200">Learn chemistry through gameplay!</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          
          {/* Game Board */}
          <div className="lg:col-span-3">
            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 ${currentPlayer.bg} rounded-full animate-pulse`}></div>
                    <span>{winner ? `🏆 ${winner.name} Wins!` : `${currentPlayer.name}'s Turn`}</span>
                  </div>
                  {!winner && !currentPlayer.isAI && (
                    <Button 
                      onClick={rollDice} 
                      disabled={isRolling || selectedToken === null}
                      className={`${currentPlayer.bg} hover:opacity-90`}
                    >
                      <Dices className="w-4 h-4 mr-2" />
                      Roll Dice
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Dice Display */}
                <div className="flex justify-center mb-6">
                  <motion.div
                    animate={{ rotate: isRolling ? 360 : 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-24 h-24 bg-white rounded-2xl shadow-2xl flex items-center justify-center text-5xl font-bold text-purple-600"
                  >
                    {diceValue}
                  </motion.div>
                </div>

                {/* Simplified Board Visualization */}
                <div className="bg-slate-800/50 p-6 rounded-xl">
                  {/* 4 Corners for Players */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {/* Top Row */}
                    <div className="col-span-3 grid grid-cols-3 gap-4">
                      {/* Red Corner */}
                      <div className="bg-red-500/20 border-2 border-red-500 rounded-lg p-4">
                        <div className="text-red-300 font-bold text-center mb-2">🔴 RED (s-block)</div>
                        <div className="grid grid-cols-2 gap-2">
                          {players[0].tokens.map((token, idx) => (
                            <button
                              key={token.id}
                              onClick={() => selectToken(idx)}
                              disabled={currentPlayerIndex !== 0 || players[0].isAI || token.finished}
                              className={`w-12 h-12 rounded-full ${players[0].bg} border-4 ${
                                selectedToken === idx && currentPlayerIndex === 0 ? 'border-yellow-400 scale-110' : 'border-red-700'
                              } flex items-center justify-center text-white font-bold transition-transform ${
                                token.finished ? 'opacity-30' : 'hover:scale-110'
                              }`}
                            >
                              {token.position === -1 ? '🏠' : token.finished ? '✓' : token.position}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Center - Element Path */}
                      <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 border-2 border-purple-400 rounded-lg p-4 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-4xl mb-2">⚛️</div>
                          <div className="text-white font-bold">NUCLEUS</div>
                          <div className="text-purple-300 text-xs">Center Goal</div>
                        </div>
                      </div>

                      {/* Green Corner */}
                      <div className="bg-green-500/20 border-2 border-green-500 rounded-lg p-4">
                        <div className="text-green-300 font-bold text-center mb-2">🟢 GREEN (d-block)</div>
                        <div className="grid grid-cols-2 gap-2">
                          {players[2].tokens.map((token, idx) => (
                            <button
                              key={token.id}
                              onClick={() => selectToken(idx)}
                              disabled={currentPlayerIndex !== 2 || players[2].isAI || token.finished}
                              className={`w-12 h-12 rounded-full ${players[2].bg} border-4 ${
                                selectedToken === idx && currentPlayerIndex === 2 ? 'border-yellow-400 scale-110' : 'border-green-700'
                              } flex items-center justify-center text-white font-bold transition-transform ${
                                token.finished ? 'opacity-30' : 'hover:scale-110'
                              }`}
                            >
                              {token.position === -1 ? '🏠' : token.finished ? '✓' : token.position}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Row */}
                    <div className="col-span-3 grid grid-cols-3 gap-4 mt-4">
                      {/* Blue Corner */}
                      <div className="bg-blue-500/20 border-2 border-blue-500 rounded-lg p-4">
                        <div className="text-blue-300 font-bold text-center mb-2">🔵 BLUE (f-block)</div>
                        <div className="grid grid-cols-2 gap-2">
                          {players[3].tokens.map((token, idx) => (
                            <button
                              key={token.id}
                              onClick={() => selectToken(idx)}
                              disabled={currentPlayerIndex !== 3 || players[3].isAI || token.finished}
                              className={`w-12 h-12 rounded-full ${players[3].bg} border-4 ${
                                selectedToken === idx && currentPlayerIndex === 3 ? 'border-yellow-400 scale-110' : 'border-blue-700'
                              } flex items-center justify-center text-white font-bold transition-transform ${
                                token.finished ? 'opacity-30' : 'hover:scale-110'
                              }`}
                            >
                              {token.position === -1 ? '🏠' : token.finished ? '✓' : token.position}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Element Path Indicator */}
                      <div className="bg-slate-700/50 border-2 border-slate-600 rounded-lg p-4 flex items-center justify-center">
                        <div className="text-center text-white">
                          <div className="text-sm mb-1">Element Path</div>
                          <div className="text-xs text-gray-400">52 positions</div>
                          <div className="text-2xl mt-2">🧪</div>
                        </div>
                      </div>

                      {/* Yellow Corner */}
                      <div className="bg-yellow-500/20 border-2 border-yellow-500 rounded-lg p-4">
                        <div className="text-yellow-300 font-bold text-center mb-2">🟡 YELLOW (p-block)</div>
                        <div className="grid grid-cols-2 gap-2">
                          {players[1].tokens.map((token, idx) => (
                            <button
                              key={token.id}
                              onClick={() => selectToken(idx)}
                              disabled={currentPlayerIndex !== 1 || players[1].isAI || token.finished}
                              className={`w-12 h-12 rounded-full ${players[1].bg} border-4 ${
                                selectedToken === idx && currentPlayerIndex === 1 ? 'border-yellow-400 scale-110' : 'border-yellow-700'
                              } flex items-center justify-center text-white font-bold transition-transform ${
                                token.finished ? 'opacity-30' : 'hover:scale-110'
                              }`}
                            >
                              {token.position === -1 ? '🏠' : token.finished ? '✓' : token.position}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Instructions */}
                  {!winner && (
                    <div className="mt-4 text-center text-white/80 text-sm">
                      {!currentPlayer.isAI && selectedToken === null && (
                        <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-3">
                          👆 Click on one of your tokens to select it, then roll the dice!
                        </div>
                      )}
                      {!currentPlayer.isAI && selectedToken !== null && (
                        <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-3">
                          ✅ Token selected! Now click "Roll Dice" to move
                        </div>
                      )}
                      {currentPlayer.isAI && (
                        <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-3">
                          🤖 AI is thinking...
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Scoreboard Sidebar */}
          <div className="space-y-4">
            
            {/* Scores */}
            <Card className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  Scores
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {players.map((player, idx) => (
                  <div 
                    key={player.id} 
                    className={`flex justify-between items-center p-3 rounded-lg ${
                      currentPlayerIndex === idx ? 'bg-white/20 ring-2 ring-white' : 'bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 ${player.bg} rounded-full`}></div>
                      <span className="text-white font-semibold">{player.name}</span>
                      {player.isAI && <Badge variant="outline" className="text-xs">AI</Badge>}
                    </div>
                    <span className="text-xl font-bold text-white">{player.score}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Block Info */}
            <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Star className="w-5 h-5 text-purple-400" />
                  Element Blocks
                </CardTitle>
              </CardHeader>
              <CardContent className="text-white text-sm space-y-2">
                <div className="p-2 bg-red-500/30 rounded border border-red-500/50">
                  <strong>🔴 s-block:</strong> Alkali & Alkaline Earth Metals
                </div>
                <div className="p-2 bg-yellow-500/30 rounded border border-yellow-500/50">
                  <strong>🟡 p-block:</strong> Non-metals & Metalloids
                </div>
                <div className="p-2 bg-green-500/30 rounded border border-green-500/50">
                  <strong>🟢 d-block:</strong> Transition Metals
                </div>
                <div className="p-2 bg-blue-500/30 rounded border border-blue-500/50">
                  <strong>🔵 f-block:</strong> Lanthanides & Actinides
                </div>
              </CardContent>
            </Card>

            {/* Game Rules */}
            <Card className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white text-sm">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  Quick Rules
                </CardTitle>
              </CardHeader>
              <CardContent className="text-white/90 text-xs space-y-2">
                <div>• Roll 6 to start tokens</div>
                <div>• Land on your block = +2 moves</div>
                <div>• First to finish all 4 tokens wins</div>
                <div>• Learn elements as you play!</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Element Popup */}
      <AnimatePresence>
        {elementPopup && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
          >
            <Card className="bg-white shadow-2xl w-96 border-4" style={{ borderColor: elementPopup.color }}>
              <CardContent className="p-8 text-center">
                <div className="text-7xl font-bold mb-2" style={{ color: elementPopup.color }}>
                  {elementPopup.symbol}
                </div>
                <div className="text-2xl font-semibold text-gray-800 mb-1">
                  {elementPopup.name}
                </div>
                <Badge className="mb-4">Atomic Number: {elementPopup.number}</Badge>
                <p className="text-gray-700 text-lg">{elementPopup.fact}</p>
                <Badge variant="outline" className="mt-4">{elementPopup.block}</Badge>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <WinCelebration
        show={showCelebration.show}
        onClose={() => {
          setCelebrationData({ show: false, points: 0, message: "" });
          setGameStarted(false);
          setWinner(null);
          setNumPlayers(null);
        }}
        points={showCelebration.points}
        message={showCelebration.message}
      />
    </div>
  );
}