// Educational questions for different subjects and difficulty levels
export const questionBank = {
  mathematics: [
    {
      question: "What is 15% of 200?",
      options: ["20", "30", "40", "50"],
      correctAnswer: 1,
      explanation: "15% of 200 = 0.15 × 200 = 30",
      difficulty: "easy"
    },
    {
      question: "If a triangle has angles of 60° and 80°, what is the third angle?",
      options: ["30°", "40°", "50°", "60°"],
      correctAnswer: 1,
      explanation: "The sum of angles in a triangle is 180°. So 180° - 60° - 80° = 40°",
      difficulty: "medium"
    },
    {
      question: "What is the value of π (pi) rounded to 2 decimal places?",
      options: ["3.12", "3.14", "3.16", "3.18"],
      correctAnswer: 1,
      explanation: "π (pi) is approximately 3.14159, which rounds to 3.14",
      difficulty: "easy"
    },
    {
      question: "What is 7 × 8?",
      options: ["54", "56", "63", "64"],
      correctAnswer: 1,
      explanation: "7 × 8 = 56. This is basic multiplication.",
      difficulty: "easy"
    },
    {
      question: "What is the square root of 144?",
      options: ["11", "12", "13", "14"],
      correctAnswer: 1,
      explanation: "12 × 12 = 144, therefore √144 = 12",
      difficulty: "medium"
    }
  ],
  science: [
    {
      question: "What is the chemical symbol for water?",
      options: ["H2O", "O2", "CO2", "H2"],
      correctAnswer: 0,
      explanation: "Water is H2O - two hydrogen atoms bonded to one oxygen atom",
      difficulty: "easy"
    },
    {
      question: "How many chambers does a human heart have?",
      options: ["2", "3", "4", "5"],
      correctAnswer: 2,
      explanation: "The human heart has 4 chambers: 2 atria (upper) and 2 ventricles (lower)",
      difficulty: "medium"
    },
    {
      question: "What gas do plants absorb during photosynthesis?",
      options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
      correctAnswer: 2,
      explanation: "Plants absorb CO2 (Carbon Dioxide) and release Oxygen during photosynthesis",
      difficulty: "easy"
    },
    {
      question: "What is the center of an atom called?",
      options: ["Electron", "Proton", "Nucleus", "Neutron"],
      correctAnswer: 2,
      explanation: "The nucleus is the center of an atom, containing protons and neutrons",
      difficulty: "easy"
    },
    {
      question: "What is the boiling point of water at sea level?",
      options: ["90°C", "100°C", "110°C", "120°C"],
      correctAnswer: 1,
      explanation: "Water boils at 100°C (212°F) at standard atmospheric pressure",
      difficulty: "medium"
    }
  ],
  technology: [
    {
      question: "What does CPU stand for?",
      options: ["Central Processing Unit", "Computer Personal Unit", "Central Program Utility", "Computer Processing Utility"],
      correctAnswer: 0,
      explanation: "CPU stands for Central Processing Unit - the 'brain' of the computer",
      difficulty: "easy"
    },
    {
      question: "What is the binary representation of the number 8?",
      options: ["1000", "1100", "1010", "0111"],
      correctAnswer: 0,
      explanation: "8 in binary is 1000 (1×8 + 0×4 + 0×2 + 0×1 = 8)",
      difficulty: "medium"
    },
    {
      question: "Which of these is a programming language?",
      options: ["HTTP", "Python", "HTML", "CSS"],
      correctAnswer: 1,
      explanation: "Python is a high-level programming language. HTML/CSS are markup languages, HTTP is a protocol",
      difficulty: "easy"
    },
    {
      question: "What does RAM stand for?",
      options: ["Random Access Memory", "Read Access Memory", "Run Application Memory", "Rapid Access Module"],
      correctAnswer: 0,
      explanation: "RAM stands for Random Access Memory - temporary storage for running programs",
      difficulty: "easy"
    },
    {
      question: "What is an algorithm?",
      options: ["A computer virus", "A step-by-step solution", "A programming error", "A type of hardware"],
      correctAnswer: 1,
      explanation: "An algorithm is a step-by-step procedure for solving a problem or completing a task",
      difficulty: "medium"
    }
  ],
  engineering: [
    {
      question: "What is the next number in this sequence? 2, 4, 8, 16, ?",
      options: ["24", "28", "32", "36"],
      correctAnswer: 2,
      explanation: "Each number is doubled: 2×2=4, 4×2=8, 8×2=16, 16×2=32",
      difficulty: "medium"
    },
    {
      question: "In Python, what symbol is used for comments?",
      options: ["//", "#", "/*", "<!--"],
      correctAnswer: 1,
      explanation: "Python uses # for single-line comments",
      difficulty: "easy"
    },
    {
      question: "What is 2 + 2 × 3?",
      options: ["8", "10", "12", "14"],
      correctAnswer: 0,
      explanation: "Following order of operations (PEMDAS): 2 + (2 × 3) = 2 + 6 = 8",
      difficulty: "medium"
    },
    {
      question: "What does HTML stand for?",
      options: ["HyperText Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyperlink and Text Markup Language"],
      correctAnswer: 0,
      explanation: "HTML stands for HyperText Markup Language - used to structure web pages",
      difficulty: "easy"
    },
    {
      question: "If a = 5 and b = 3, what is a + b × 2?",
      options: ["11", "13", "16", "10"],
      correctAnswer: 0,
      explanation: "Following order of operations: a + (b × 2) = 5 + (3 × 2) = 5 + 6 = 11",
      difficulty: "medium"
    }
  ]
};

// Get random question by subject
export const getRandomQuestion = (subject, difficulty = null) => {
  const questions = questionBank[subject] || questionBank.mathematics;
  let filtered = questions;
  
  if (difficulty) {
    filtered = questions.filter(q => q.difficulty === difficulty);
  }
  
  if (filtered.length === 0) filtered = questions;
  
  const randomIndex = Math.floor(Math.random() * filtered.length);
  return filtered[randomIndex];
};