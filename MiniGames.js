import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Puzzle, X, Circle, Dice1, Spade, Crown, Search, Brain, Lightbulb, Shuffle, Zap, Hash, Target, WifiOff, Code, Atom } from "lucide-react";

const games = [
  {
    title: "Tic-Tac-Toe",
    description: "Master set theory and logic through strategic gameplay.",
    icon: (props) => (
      <div {...props} className="relative w-12 h-12">
        <X className="absolute top-0 left-0 w-8 h-8 text-blue-500" />
        <Circle className="absolute bottom-0 right-0 w-8 h-8 text-red-500" />
      </div>
    ),
    tags: ["Logic", "Set Theory"],
    url: createPageUrl("TicTacToe"),
    status: "available",
    color: "from-blue-500 to-indigo-500",
    textColor: "text-blue-600",
    subjects: ["Mathematics", "Logic"]
  },
  {
    title: "MathSnake: Equation Builder",
    description: "Neon snake game that teaches algebraic equations visually!",
    icon: Shuffle,
    tags: ["Algebra", "Equations", "Pythagorean"],
    url: createPageUrl("MathSnake"),
    status: "available",
    color: "from-red-500 to-pink-500",
    textColor: "text-red-600",
    subjects: ["Mathematics", "Engineering"]
  },
  {
    title: "Periodic Table Ludo",
    description: "Learn chemistry through Ludo-style gameplay with elements!",
    icon: Atom,
    tags: ["Chemistry", "Periodic Table", "Multiplayer"],
    url: createPageUrl("PeriodicLudo"),
    status: "available",
    color: "from-purple-500 to-pink-500",
    textColor: "text-purple-600",
    subjects: ["Science", "Chemistry"]
  },
  {
    title: "Dice Game",
    description: "Learn probability and arithmetic through animated dice rolling.",
    icon: Dice1,
    tags: ["Probability", "Arithmetic"],
    url: createPageUrl("DiceGame"),
    status: "available",
    color: "from-green-500 to-emerald-500",
    textColor: "text-green-600",
    subjects: ["Mathematics", "Statistics"]
  },
  {
    title: "Card Game",
    description: "Blackjack-style game teaching probability and strategic thinking.",
    icon: Spade,
    tags: ["Probability", "Strategy"],
    url: createPageUrl("CardGame"),
    status: "available",
    color: "from-red-500 to-rose-500",
    textColor: "text-red-600",
    subjects: ["Mathematics", "Logic"]
  },
  {
    title: "Chess Game",
    description: "Advanced logic, strategy, and algebraic notation practice.",
    icon: Crown,
    tags: ["Logic", "Strategy", "Notation"],
    url: createPageUrl("ChessGame"),
    status: "available",
    color: "from-purple-500 to-violet-500",
    textColor: "text-purple-600",
    subjects: ["Mathematics", "Logic"]
  },
  {
    title: "Word Search",
    description: "Build vocabulary and enhance pattern recognition skills.",
    icon: Search,
    tags: ["Vocabulary", "Patterns"],
    url: createPageUrl("WordSearch"),
    status: "available",
    color: "from-amber-500 to-yellow-500",
    textColor: "text-amber-600",
    subjects: ["Science", "Engineering"]
  },
  {
    title: "Trivia Game",
    description: "Quick-fire knowledge testing across all STEM subjects.",
    icon: Brain,
    tags: ["Knowledge", "Speed"],
    url: createPageUrl("TriviaGame"),
    status: "available",
    color: "from-pink-500 to-rose-500",
    textColor: "text-pink-600",
    subjects: ["All Subjects"]
  },
  {
    title: "Memory Game",
    description: "Enhanced memory training with scientific terms and concepts.",
    icon: Lightbulb,
    tags: ["Memory", "Science Terms"],
    url: createPageUrl("MemoryGame"),
    status: "available",
    color: "from-cyan-500 to-blue-500",
    textColor: "text-cyan-600",
    subjects: ["Science", "Physics"]
  },
  {
    title: "Puzzle Game",
    description: "Advanced problem-solving and logical reasoning challenges.",
    icon: Zap,
    tags: ["Problem-Solving", "Logic"],
    url: createPageUrl("PuzzleGame"),
    status: "available",
    color: "from-orange-500 to-amber-500",
    textColor: "text-orange-600",
    subjects: ["Engineering", "Mathematics"]
  },
  {
    title: "Strategy Games",
    description: "Various board strategy games for advanced strategic thinking.",
    icon: Target,
    tags: ["Strategy", "Planning"],
    url: createPageUrl("StrategyGames"),
    status: "available",
    color: "from-indigo-500 to-purple-500",
    textColor: "text-indigo-600",
    subjects: ["All Subjects"]
  },
  {
    title: "Code Playground",
    description: "Learn 6 programming languages: HTML, CSS, JS, Python, Java, C.",
    icon: Code,
    tags: ["Coding", "Programming"],
    url: createPageUrl("CodePlayground"),
    status: "available",
    color: "from-purple-600 to-pink-600",
    textColor: "text-purple-600",
    subjects: ["Engineering", "Technology"]
  }
];

export default function MiniGames() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const isOffline = params.get('mode') === 'offline';
  
  const availableGames = games.length;

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center">
          <div className="inline-block p-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl mb-4">
             <Puzzle className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            SALT Game Center
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
            Explore our comprehensive collection of educational games designed for grades 6-10. 
            Each game targets specific STEM learning objectives with progressive difficulty levels.
          </p>
          {isOffline && (
            <Badge variant="outline" className="text-lg py-2 px-4 border-2">
              <WifiOff className="w-5 h-5 mr-2" />
              You are in Offline Mode
            </Badge>
          )}
          
          {/* Stats Bar */}
          <div className="flex justify-center gap-8 my-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{availableGames}</div>
              <div className="text-sm text-gray-600">Available Games</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">4</div>
              <div className="text-sm text-gray-600">STEM Subjects</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">40</div>
              <div className="text-sm text-gray-600">Chapters Covered</div>
            </div>
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {games.map((game, index) => {
            const gameUrl = isOffline ? `${game.url}?mode=offline` : game.url;
            return (
            <Card
              key={index}
              className="group overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 flex flex-col relative"
            >
              <div className={`h-3 bg-gradient-to-r ${game.color}`} />
              <CardHeader className="flex-shrink-0 pb-3">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-14 h-14 flex items-center justify-center bg-gray-50 rounded-xl">
                     <game.icon className={`${game.textColor} w-8 h-8`} />
                  </div>
                  <Badge className="bg-green-100 text-green-800 text-xs">Available</Badge>
                </div>
                 <CardTitle className="text-lg leading-tight">{game.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-between pt-0">
                <div>
                  <p className="text-gray-600 mb-3 text-sm leading-relaxed">{game.description}</p>
                  
                  {/* Subject Tags */}
                  <div className="mb-3">
                    <div className="text-xs text-gray-500 mb-1">Subjects:</div>
                    <div className="flex flex-wrap gap-1">
                      {game.subjects.slice(0, 2).map((subject, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {/* Skill Tags */}
                  <div className="flex flex-wrap gap-1">
                    {game.tags.map((tag, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="mt-4">
                  <Link to={gameUrl}>
                    <Button className={`w-full bg-gradient-to-r ${game.color} hover:shadow-lg text-white text-sm`}>
                      Play Now <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )})}
        </div>

        {/* Subject Coverage Section */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-center mb-6">Comprehensive Subject Coverage</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Mathematics", chapters: 10, color: "blue", topics: ["Algebra", "Geometry", "Statistics", "Calculus"] },
              { name: "Science", chapters: 10, color: "green", topics: ["Biology", "Chemistry", "Earth Science", "Ecology"] },
              { name: "Technology", chapters: 10, color: "purple", topics: ["Aptitude", "Reasoning", "Logic", "Critical Thinking"] },
              { name: "Engineering", chapters: 10, color: "orange", topics: ["Python", "JavaScript", "Algorithms", "Web Dev"] }
            ].map((subject, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 bg-${subject.color}-100 rounded-full flex items-center justify-center mx-auto mb-3`}>
                    <div className={`w-6 h-6 bg-${subject.color}-500 rounded`} />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{subject.name}</h3>
                  <div className="text-2xl font-bold text-blue-600 mb-2">{subject.chapters}</div>
                  <div className="text-sm text-gray-600 mb-3">Chapters</div>
                  <div className="space-y-1">
                    {subject.topics.map((topic, i) => (
                      <div key={i} className="text-xs text-gray-500">• {topic}</div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}