'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Navbar from '@/components/Navbar'
import toast from 'react-hot-toast'

interface TriviaQuestion {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  points: number
}

const triviaQuestions: TriviaQuestion[] = [
  {
    id: 1,
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: 2,
    category: "Geography",
    difficulty: "easy",
    points: 10
  },
  {
    id: 2,
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: 1,
    category: "Science",
    difficulty: "easy",
    points: 10
  },
  {
    id: 3,
    question: "Who painted the Mona Lisa?",
    options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
    correctAnswer: 2,
    category: "Art",
    difficulty: "easy",
    points: 10
  },
  {
    id: 4,
    question: "What is the largest ocean on Earth?",
    options: ["Atlantic", "Indian", "Arctic", "Pacific"],
    correctAnswer: 3,
    category: "Geography",
    difficulty: "medium",
    points: 20
  },
  {
    id: 5,
    question: "In what year did World War II end?",
    options: ["1943", "1944", "1945", "1946"],
    correctAnswer: 2,
    category: "History",
    difficulty: "medium",
    points: 20
  },
  {
    id: 6,
    question: "What is the chemical symbol for gold?",
    options: ["Go", "Gd", "Au", "Ag"],
    correctAnswer: 2,
    category: "Science",
    difficulty: "medium",
    points: 20
  },
  {
    id: 7,
    question: "Which programming language is known as 'the language of the web'?",
    options: ["Python", "JavaScript", "Java", "C++"],
    correctAnswer: 1,
    category: "Technology",
    difficulty: "easy",
    points: 10
  },
  {
    id: 8,
    question: "What is the square root of 144?",
    options: ["10", "11", "12", "13"],
    correctAnswer: 2,
    category: "Math",
    difficulty: "easy",
    points: 10
  },
  {
    id: 9,
    question: "Who wrote 'Romeo and Juliet'?",
    options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
    correctAnswer: 1,
    category: "Literature",
    difficulty: "easy",
    points: 10
  },
  {
    id: 10,
    question: "What is the smallest prime number?",
    options: ["0", "1", "2", "3"],
    correctAnswer: 2,
    category: "Math",
    difficulty: "medium",
    points: 20
  }
]

export default function TriviaGame() {
  const { data: session } = useSession()
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [gameComplete, setGameComplete] = useState(false)
  const [streak, setStreak] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [gameStarted, setGameStarted] = useState(false)
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>([])
  const [highScore, setHighScore] = useState(0)

  useEffect(() => {
    const saved = localStorage.getItem('triviaHighScore')
    if (saved) {
      setHighScore(parseInt(saved))
    }
  }, [])

  useEffect(() => {
    if (gameStarted && !showResult && !gameComplete && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !showResult) {
      handleTimeout()
    }
  }, [timeLeft, gameStarted, showResult, gameComplete])

  const startGame = () => {
    setGameStarted(true)
    setCurrentQuestion(0)
    setScore(0)
    setStreak(0)
    setAnsweredQuestions([])
    setTimeLeft(30)
    setShowResult(false)
    setGameComplete(false)
  }

  const handleTimeout = () => {
    setShowResult(true)
    setStreak(0)
    toast.error('Time\'s up!')
    setTimeout(() => nextQuestion(), 2000)
  }

  const handleAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null) return
    
    setSelectedAnswer(answerIndex)
    setShowResult(true)
    
    const question = triviaQuestions[currentQuestion]
    const isCorrect = answerIndex === question.correctAnswer
    
    if (isCorrect) {
      const bonusPoints = Math.floor(timeLeft / 3) // Time bonus
      const streakBonus = streak * 5
      const totalPoints = question.points + bonusPoints + streakBonus
      
      setScore(score + totalPoints)
      setStreak(streak + 1)
      setAnsweredQuestions([...answeredQuestions, true])
      
      toast.success(`Correct! +${totalPoints} points`)
    } else {
      setStreak(0)
      setAnsweredQuestions([...answeredQuestions, false])
      toast.error('Wrong answer!')
    }
    
    setTimeout(() => nextQuestion(), 2000)
  }

  const nextQuestion = () => {
    if (currentQuestion < triviaQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowResult(false)
      setTimeLeft(30)
    } else {
      endGame()
    }
  }

  const endGame = () => {
    setGameComplete(true)
    if (score > highScore) {
      setHighScore(score)
      localStorage.setItem('triviaHighScore', score.toString())
      toast.success('New high score!')
    }
  }

  const getScoreMessage = () => {
    const percentage = (answeredQuestions.filter(a => a).length / triviaQuestions.length) * 100
    if (percentage === 100) return "Perfect! You're a trivia master! 🏆"
    if (percentage >= 80) return "Excellent work! 🌟"
    if (percentage >= 60) return "Good job! Keep practicing! 👍"
    if (percentage >= 40) return "Not bad! Try again to improve! 💪"
    return "Keep learning! You'll do better next time! 📚"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navbar />
      
      <div className="pt-20 px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold text-gradient mb-2">
              🎯 Trivia Challenge
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Test your knowledge and compete for the high score!
            </p>
          </motion.div>

          {/* High Score Display */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center mb-6"
          >
            <div className="inline-flex items-center gap-4 bg-white dark:bg-gray-800 rounded-full px-6 py-3 shadow-lg">
              <div>
                <span className="text-sm text-gray-600 dark:text-gray-400">High Score</span>
                <p className="text-xl font-bold text-yellow-600">🏆 {highScore}</p>
              </div>
              <div className="w-px h-10 bg-gray-300 dark:bg-gray-600"></div>
              <div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Current Score</span>
                <p className="text-xl font-bold text-primary-600">{score}</p>
              </div>
              {streak > 0 && (
                <>
                  <div className="w-px h-10 bg-gray-300 dark:bg-gray-600"></div>
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Streak</span>
                    <p className="text-xl font-bold text-orange-600">🔥 {streak}</p>
                  </div>
                </>
              )}
            </div>
          </motion.div>

          {/* Game Start Screen */}
          {!gameStarted && !gameComplete && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-8 text-center"
            >
              <div className="mb-8">
                <div className="text-6xl mb-4">🧠</div>
                <h2 className="text-2xl font-bold mb-4">Ready to Test Your Knowledge?</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Answer {triviaQuestions.length} questions across various categories.
                  The faster you answer, the more points you earn!
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-purple-100 dark:bg-purple-900/20 rounded-lg p-4">
                  <div className="text-2xl mb-1">📚</div>
                  <p className="text-sm font-medium">Multiple Topics</p>
                </div>
                <div className="bg-blue-100 dark:bg-blue-900/20 rounded-lg p-4">
                  <div className="text-2xl mb-1">⏱️</div>
                  <p className="text-sm font-medium">30s per Question</p>
                </div>
                <div className="bg-green-100 dark:bg-green-900/20 rounded-lg p-4">
                  <div className="text-2xl mb-1">🔥</div>
                  <p className="text-sm font-medium">Streak Bonus</p>
                </div>
                <div className="bg-yellow-100 dark:bg-yellow-900/20 rounded-lg p-4">
                  <div className="text-2xl mb-1">🏆</div>
                  <p className="text-sm font-medium">High Scores</p>
                </div>
              </div>
              
              <button
                onClick={startGame}
                className="btn-primary text-lg px-8 py-4"
              >
                Start Game
              </button>
            </motion.div>
          )}

          {/* Question Display */}
          {gameStarted && !gameComplete && (
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card p-8"
            >
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <span>Question {currentQuestion + 1} of {triviaQuestions.length}</span>
                  <span>{triviaQuestions[currentQuestion].category}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full transition-all"
                    style={{ width: `${((currentQuestion + 1) / triviaQuestions.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Timer */}
              <div className="text-center mb-6">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${
                  timeLeft > 10 ? 'bg-green-100 dark:bg-green-900/20' :
                  timeLeft > 5 ? 'bg-yellow-100 dark:bg-yellow-900/20' :
                  'bg-red-100 dark:bg-red-900/20 animate-pulse'
                }`}>
                  <span className={`text-2xl font-bold ${
                    timeLeft > 10 ? 'text-green-600' :
                    timeLeft > 5 ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {timeLeft}
                  </span>
                </div>
              </div>

              {/* Question */}
              <h2 className="text-2xl font-bold text-center mb-8 text-gray-900 dark:text-white">
                {triviaQuestions[currentQuestion].question}
              </h2>

              {/* Answer Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {triviaQuestions[currentQuestion].options.map((option, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: !showResult ? 1.02 : 1 }}
                    whileTap={{ scale: !showResult ? 0.98 : 1 }}
                    onClick={() => !showResult && handleAnswer(index)}
                    disabled={showResult}
                    className={`p-4 rounded-lg text-left font-medium transition-all ${
                      showResult
                        ? index === triviaQuestions[currentQuestion].correctAnswer
                          ? 'bg-green-500 text-white ring-4 ring-green-300'
                          : index === selectedAnswer
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-500'
                        : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border-2 border-gray-200 dark:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className={`mr-3 w-8 h-8 rounded-full flex items-center justify-center ${
                        showResult
                          ? index === triviaQuestions[currentQuestion].correctAnswer
                            ? 'bg-green-600'
                            : index === selectedAnswer
                            ? 'bg-red-600'
                            : 'bg-gray-300 dark:bg-gray-600'
                          : 'bg-primary-100 dark:bg-primary-900/20 text-primary-600'
                      }`}>
                        {String.fromCharCode(65 + index)}
                      </span>
                      {option}
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Difficulty Badge */}
              <div className="text-center mt-6">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                  triviaQuestions[currentQuestion].difficulty === 'easy' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                    : triviaQuestions[currentQuestion].difficulty === 'medium'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                }`}>
                  {triviaQuestions[currentQuestion].difficulty.toUpperCase()} • {triviaQuestions[currentQuestion].points} points
                </span>
              </div>
            </motion.div>
          )}

          {/* Game Complete Screen */}
          {gameComplete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card p-8 text-center"
            >
              <div className="text-6xl mb-4">
                {score > highScore * 0.9 ? '🏆' : '🎉'}
              </div>
              <h2 className="text-3xl font-bold mb-4 text-gradient">
                Game Complete!
              </h2>
              
              <div className="mb-6">
                <p className="text-5xl font-bold text-primary-600 mb-2">{score}</p>
                <p className="text-gray-600 dark:text-gray-400">Final Score</p>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <p className="text-2xl font-bold text-green-600">
                    {answeredQuestions.filter(a => a).length}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Correct</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <p className="text-2xl font-bold text-red-600">
                    {answeredQuestions.filter(a => !a).length}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Wrong</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <p className="text-2xl font-bold text-blue-600">
                    {Math.round((answeredQuestions.filter(a => a).length / triviaQuestions.length) * 100)}%
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Accuracy</p>
                </div>
              </div>

              <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
                {getScoreMessage()}
              </p>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={startGame}
                  className="btn-primary"
                >
                  Play Again
                </button>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="btn-outline"
                >
                  Back to Dashboard
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
