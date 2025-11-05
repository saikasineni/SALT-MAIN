import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  ArrowLeft, 
  Play, 
  RotateCcw, 
  Copy, 
  Code, 
  Lightbulb,
  FileCode,
  Trophy
} from 'lucide-react';
import { motion } from 'framer-motion';
import GameInstructions from '../components/shared/GameInstructions';
import WinCelebration from '../components/shared/WinCelebration';

const languageTemplates = {
  html: {
    name: 'HTML',
    starter: `<!DOCTYPE html>
<html>
<head>
    <title>My First Web Page</title>
</head>
<body>
    <h1>Hello, World!</h1>
    <p>This is my first HTML page.</p>
    <button onclick="alert('Hello!')">Click Me</button>
</body>
</html>`,
    concepts: [
      'HTML structure (<!DOCTYPE>, <html>, <head>, <body>)',
      'Headings (<h1> to <h6>)',
      'Paragraphs (<p>)',
      'Links (<a href="">)',
      'Images (<img src="">)',
      'Lists (<ul>, <ol>, <li>)'
    ],
    exercises: [
      'Create a webpage about yourself with heading and paragraph',
      'Add 3 links to your favorite websites',
      'Insert an image and give it alt text',
      'Create an ordered list of your hobbies'
    ]
  },
  css: {
    name: 'CSS',
    starter: `/* CSS - Styling Your Web Page */
body {
    font-family: Arial, sans-serif;
    background-color: #f0f0f0;
    margin: 0;
    padding: 20px;
}

h1 {
    color: #2c3e50;
    text-align: center;
}

.button {
    background-color: #3498db;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.button:hover {
    background-color: #2980b9;
}`,
    concepts: [
      'Selectors (element, class, id)',
      'Colors and backgrounds',
      'Fonts and text styling',
      'Box model (margin, padding, border)',
      'Positioning (static, relative, absolute)',
      'Flexbox and Grid layouts'
    ],
    exercises: [
      'Change the background color of the page',
      'Style a heading with custom font and color',
      'Create a button with hover effect',
      'Center elements using flexbox'
    ]
  },
  javascript: {
    name: 'JavaScript',
    starter: `// JavaScript - Making Pages Interactive

// Variables
let name = "Student";
let age = 14;

// Function
function greet() {
    console.log("Hello, " + name + "!");
    alert("Welcome to JavaScript!");
}

// Call the function
greet();

// Simple calculation
let sum = 5 + 10;
console.log("5 + 10 = " + sum);

// Array
let fruits = ["Apple", "Banana", "Orange"];
console.log("First fruit: " + fruits[0]);`,
    concepts: [
      'Variables (let, const, var)',
      'Data types (string, number, boolean)',
      'Functions',
      'Arrays',
      'Conditionals (if/else)',
      'Loops (for, while)',
      'DOM manipulation'
    ],
    exercises: [
      'Create a function that adds two numbers',
      'Use an if statement to check if a number is even',
      'Create an array and loop through it',
      'Build a simple calculator function'
    ],
    executable: true
  },
  python: {
    name: 'Python',
    starter: `# Python - Powerful Programming Language

# Variables
name = "Student"
age = 14

# Function
def greet():
    print(f"Hello, {name}!")
    print(f"You are {age} years old.")

# Call function
greet()

# Simple calculation
sum = 5 + 10
print(f"5 + 10 = {sum}")

# List
fruits = ["Apple", "Banana", "Orange"]
print(f"First fruit: {fruits[0]}")

# Loop
for fruit in fruits:
    print(fruit)`,
    concepts: [
      'Variables and data types',
      'Functions (def)',
      'Print statements',
      'Lists and dictionaries',
      'Conditionals (if/elif/else)',
      'Loops (for, while)',
      'List comprehension'
    ],
    exercises: [
      'Create a function that calculates area of rectangle',
      'Use a for loop to print numbers 1 to 10',
      'Create a list and filter even numbers',
      'Build a simple grade calculator'
    ]
  },
  java: {
    name: 'Java',
    starter: `// Java - Object-Oriented Programming

public class HelloWorld {
    public static void main(String[] args) {
        // Print statement
        System.out.println("Hello, World!");
        
        // Variables
        String name = "Student";
        int age = 14;
        
        System.out.println("Name: " + name);
        System.out.println("Age: " + age);
        
        // Simple calculation
        int sum = 5 + 10;
        System.out.println("5 + 10 = " + sum);
        
        // Array
        String[] fruits = {"Apple", "Banana", "Orange"};
        System.out.println("First fruit: " + fruits[0]);
    }
}`,
    concepts: [
      'Class structure',
      'main() method',
      'Variables and data types',
      'System.out.println()',
      'Arrays',
      'Methods',
      'Object-oriented concepts'
    ],
    exercises: [
      'Create a method that returns sum of two numbers',
      'Declare variables of different types',
      'Create an array and access elements',
      'Print your name 5 times using a loop'
    ]
  },
  c: {
    name: 'C',
    starter: `// C - Systems Programming Language

#include <stdio.h>

int main() {
    // Print statement
    printf("Hello, World!\\n");
    
    // Variables
    char name[] = "Student";
    int age = 14;
    
    printf("Name: %s\\n", name);
    printf("Age: %d\\n", age);
    
    // Simple calculation
    int sum = 5 + 10;
    printf("5 + 10 = %d\\n", sum);
    
    // Array
    int numbers[] = {1, 2, 3, 4, 5};
    printf("First number: %d\\n", numbers[0]);
    
    return 0;
}`,
    concepts: [
      '#include directives',
      'main() function',
      'Variables and data types',
      'printf() and scanf()',
      'Arrays',
      'Pointers',
      'Memory management'
    ],
    exercises: [
      'Create a program that adds two numbers',
      'Use printf to display formatted output',
      'Create an array and print all elements',
      'Build a simple calculator'
    ]
  }
};

const gameInstructions = {
  title: "Code Playground",
  rules: [
    "Select a programming language from the tabs (HTML, CSS, JavaScript, Python, Java, C)",
    "Each language comes with starter code and examples",
    "Edit the code in the editor to experiment and learn",
    "For JavaScript, click 'Run Code' to execute and see console output",
    "Use 'Copy Code' to save your work, 'Reset' to restore starter code",
    "Complete the practice exercises to earn points and badges"
  ],
  objectives: [
    "Learn syntax and structure of 6 programming languages",
    "Understand fundamental programming concepts",
    "Practice writing and editing code",
    "Build confidence in coding through hands-on experimentation",
    "Develop problem-solving skills through exercises"
  ],
  tips: [
    "Start with HTML and CSS if you're new to coding",
    "Read the concepts section before writing code",
    "Try the exercises one by one to build skills gradually",
    "Experiment freely - you can always reset the code!",
    "JavaScript execution is live - see your changes immediately"
  ]
};

export default function CodePlayground() {
  const [selectedLanguage, setSelectedLanguage] = useState('html');
  const [code, setCode] = useState(languageTemplates.html.starter);
  const [output, setOutput] = useState('');
  const [showInstructions, setShowInstructions] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);
  const [points, setPoints] = useState(0);

  useEffect(() => {
    setCode(languageTemplates[selectedLanguage].starter);
    setOutput('');
  }, [selectedLanguage]);

  const runCode = () => {
    if (selectedLanguage === 'javascript') {
      try {
        let consoleOutput = [];
        const customConsole = {
          log: (...args) => consoleOutput.push(args.join(' '))
        };
        
        const func = new Function('console', code);
        func(customConsole);
        
        setOutput(consoleOutput.join('\n') || 'Code executed successfully!');
        setPoints(prev => prev + 10);
        
        if (points > 0 && points % 50 === 0) {
          setShowCelebration(true);
        }
      } catch (error) {
        setOutput(`Error: ${error.message}`);
      }
    } else {
      setOutput(`Note: ${languageTemplates[selectedLanguage].name} cannot be executed in browser. Use the concepts and exercises to learn!`);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setOutput('Code copied to clipboard!');
  };

  const resetCode = () => {
    setCode(languageTemplates[selectedLanguage].starter);
    setOutput('Code reset to starter template');
  };

  const currentLang = languageTemplates[selectedLanguage];

  if (showInstructions) {
    return (
      <GameInstructions
        {...gameInstructions}
        onStart={() => setShowInstructions(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to={createPageUrl("MiniGames")}>
              <Button variant="outline" size="icon">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Code Playground</h1>
              <p className="text-gray-600">Learn 6 programming languages interactively</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowInstructions(true)}
            >
              View Rules
            </Button>
            <Badge className="bg-purple-600 text-white text-lg px-4 py-2">
              <Trophy className="w-4 h-4 mr-2" />
              {points} pts
            </Badge>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Code Editor */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Language Tabs */}
            <Card>
              <CardContent className="p-6">
                <Tabs value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <TabsList className="grid grid-cols-6 mb-6">
                    {Object.keys(languageTemplates).map(lang => (
                      <TabsTrigger key={lang} value={lang} className="text-xs md:text-sm">
                        {languageTemplates[lang].name}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </CardContent>
            </Card>

            {/* Code Editor */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  {currentLang.name} Editor
                </CardTitle>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={copyCode}>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                  <Button size="sm" variant="outline" onClick={resetCode}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                  {currentLang.executable && (
                    <Button size="sm" onClick={runCode} className="bg-green-600 hover:bg-green-700">
                      <Play className="w-4 h-4 mr-2" />
                      Run Code
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="font-mono text-sm min-h-[400px] bg-gray-900 text-green-400 border-gray-700"
                  spellCheck={false}
                />
              </CardContent>
            </Card>

            {/* Output Console */}
            {output && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileCode className="w-5 h-5" />
                      Console Output
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto font-mono text-sm">
                      {output}
                    </pre>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Learning Resources */}
          <div className="space-y-6">
            
            {/* Key Concepts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  Key Concepts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {currentLang.concepts.map((concept, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-blue-600 font-bold">•</span>
                      <span className="text-gray-700">{concept}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Practice Exercises */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-orange-500" />
                  Practice Exercises
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {currentLang.exercises.map((exercise, index) => (
                    <div key={index} className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <div className="flex items-start gap-2">
                        <Badge variant="outline" className="flex-shrink-0">
                          {index + 1}
                        </Badge>
                        <p className="text-sm text-gray-700">{exercise}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Tips */}
            <Card className="bg-gradient-to-r from-purple-50 to-blue-50">
              <CardHeader>
                <CardTitle className="text-sm">💡 Quick Tips</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-gray-700 space-y-2">
                <p>• Experiment freely - you can always reset!</p>
                <p>• Try modifying the starter code bit by bit</p>
                <p>• Complete exercises to earn bonus points</p>
                <p>• {currentLang.executable ? 'Click "Run Code" to see your changes!' : 'Study the syntax and try the exercises!'}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <WinCelebration
        show={showCelebration}
        onClose={() => setShowCelebration(false)}
        points={50}
        message="Coding Master! Keep practicing!"
      />
    </div>
  );
}