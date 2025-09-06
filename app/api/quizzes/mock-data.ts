// Mock data for development without MongoDB
export const mockQuizzes = [
  {
    _id: 'quiz1',
    title: 'Sample Science Quiz',
    description: 'Test your knowledge of basic science concepts',
    questions: [
      {
        question: 'What is the chemical symbol for water?',
        options: ['H2O', 'CO2', 'O2', 'N2'],
        correctAnswer: 0,
        timeLimit: 30,
        points: 1000,
      },
      {
        question: 'What planet is known as the Red Planet?',
        options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
        correctAnswer: 1,
        timeLimit: 30,
        points: 1000,
      },
      {
        question: 'What is the largest mammal in the world?',
        options: ['Elephant', 'Giraffe', 'Blue Whale', 'Hippopotamus'],
        correctAnswer: 2,
        timeLimit: 30,
        points: 1000,
      },
    ],
    settings: {
      timePerQuestion: 30,
      showCorrectAnswer: true,
      randomizeQuestions: false,
      randomizeOptions: false,
    },
    creatorEmail: 'teacher@quizzq.com',
    creatorName: 'Demo Teacher',
    isActive: false,
    playCount: 5,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    _id: 'quiz2',
    title: 'Math Basics',
    description: 'Basic arithmetic and math concepts',
    questions: [
      {
        question: 'What is 15 + 27?',
        options: ['42', '41', '43', '40'],
        correctAnswer: 0,
        timeLimit: 20,
        points: 500,
      },
      {
        question: 'What is 8 × 7?',
        options: ['54', '56', '58', '52'],
        correctAnswer: 1,
        timeLimit: 20,
        points: 500,
      },
    ],
    settings: {
      timePerQuestion: 20,
      showCorrectAnswer: true,
      randomizeQuestions: false,
      randomizeOptions: false,
    },
    creatorEmail: 'teacher@quizzq.com',
    creatorName: 'Demo Teacher',
    isActive: false,
    playCount: 3,
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
  },
]

export const mockGameSessions = new Map()
