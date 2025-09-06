'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import io, { Socket } from 'socket.io-client'
import toast from 'react-hot-toast'

interface Question {
  question: string
  options: string[]
  timeLimit: number
  points: number
}

interface Player {
  playerId: string
  playerName: string
  score: number
}

export default function PlayGame() {
  const params = useParams()
  const router = useRouter()
  const gameCode = params.gameCode as string
  
  const [socket, setSocket] = useState<Socket | null>(null)
  const [gameStatus, setGameStatus] = useState<'waiting' | 'playing' | 'finished'>('waiting')
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [totalQuestions, setTotalQuestions] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30)
  const [players, setPlayers] = useState<Player[]>([])
  const [playerScore, setPlayerScore] = useState(0)
  const [leaderboard, setLeaderboard] = useState<Player[]>([])

  useEffect(() => {
    const playerId = sessionStorage.getItem('playerId')
    const playerName = sessionStorage.getItem('playerName')
    
    if (!playerId || !playerName) {
      toast.error('Please join the game first')
      router.push('/join')
      return
    }

    useEffect(() => {
      if (!playerId || !playerName) return

      const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://127.0.0.1:3001'
      console.log('Player connecting to:', socketUrl)
      
      const newSocket = io(socketUrl, {
        transports: ['websocket', 'polling'],
        query: {
          gameCode,
          playerId,
          playerName,
          role: 'player',
        },
      toast.success(`${data.playerName} joined the game`)
    })

    newSocket.on('gameStarted', () => {
      setGameStatus('playing')
      toast.success('Game started!')
    })

    newSocket.on('questionStart', (data) => {
      setCurrentQuestion(data.question)
      setQuestionIndex(data.questionIndex)
      setTotalQuestions(data.totalQuestions)
      setSelectedAnswer(null)
      setShowResult(false)
      setTimeLeft(data.question.timeLimit)
    })

    newSocket.on('questionEnd', (data) => {
      setShowResult(true)
      setIsCorrect(data.isCorrect)
      if (data.isCorrect) {
        setPlayerScore(prev => prev + data.pointsEarned)
      }
    })

    newSocket.on('leaderboardUpdate', (data) => {
      setLeaderboard(data.leaderboard)
    })

    newSocket.on('gameFinished', (data) => {
      setGameStatus('finished')
      setLeaderboard(data.finalLeaderboard)
    })

    newSocket.on('error', (error) => {
      toast.error(error.message)
    })

    setSocket(newSocket)

    return () => {
      newSocket.disconnect()
    }
  }, [gameCode, router])

  useEffect(() => {
    if (timeLeft > 0 && gameStatus === 'playing' && currentQuestion && !showResult) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !showResult) {
      handleTimeUp()
    }
  }, [timeLeft, gameStatus, currentQuestion, showResult])

  const handleTimeUp = () => {
    if (selectedAnswer === null && socket) {
      socket.emit('submitAnswer', {
        questionIndex,
        selectedAnswer: -1,
        timeToAnswer: currentQuestion?.timeLimit || 30,
      })
    }
  }

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null || showResult) return
    
    setSelectedAnswer(answerIndex)
    const timeToAnswer = (currentQuestion?.timeLimit || 30) - timeLeft
    
    if (socket) {
      socket.emit('submitAnswer', {
        questionIndex,
        selectedAnswer: answerIndex,
        timeToAnswer,
      })
    }
  }

  if (gameStatus === 'waiting') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="card p-8 max-w-md mx-auto">
            <h1 className="text-3xl font-bold text-gradient mb-4">
              Waiting for Game to Start
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Game Code: <span className="font-bold text-2xl">{gameCode}</span>
            </p>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                Players Joined ({players.length})
              </h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {players.map((player) => (
                  <div
                    key={player.playerId}
                    className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg"
                  >
                    {player.playerName}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="animate-pulse">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-500"></div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Waiting for the host to start the game...
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  if (gameStatus === 'playing' && currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              Question {questionIndex + 1} of {totalQuestions}
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                Score: {playerScore}
              </div>
              <div className={`text-2xl font-bold ${timeLeft <= 5 ? 'text-red-600' : 'text-primary-600'}`}>
                {timeLeft}s
              </div>
            </div>
          </div>

          {/* Question */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-8 mb-6"
          >
            <h2 className="text-2xl font-bold text-center mb-8 text-gray-900 dark:text-white">
              {currentQuestion.question}
            </h2>

            {/* Answer Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQuestion.options.map((option, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={selectedAnswer !== null || showResult}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    selectedAnswer === index
                      ? showResult
                        ? isCorrect
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                          : 'border-red-500 bg-red-50 dark:bg-red-900/20'
                        : 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-primary-500 bg-white dark:bg-gray-700'
                  } ${selectedAnswer !== null && selectedAnswer !== index ? 'opacity-50' : ''}`}
                >
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold mr-4 ${
                      index === 0 ? 'bg-red-500' :
                      index === 1 ? 'bg-blue-500' :
                      index === 2 ? 'bg-yellow-500' :
                      'bg-green-500'
                    } text-white`}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="text-lg font-medium text-gray-900 dark:text-white">
                      {option}
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>

            {showResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 text-center"
              >
                <p className={`text-2xl font-bold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                  {isCorrect ? 'Correct! ✅' : 'Wrong! ❌'}
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    )
  }

  if (gameStatus === 'finished') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card p-8 max-w-2xl mx-auto text-center"
        >
          <h1 className="text-4xl font-bold text-gradient mb-6">
            Game Over! 🎉
          </h1>
          
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              Final Leaderboard
            </h2>
            <div className="space-y-3">
              {leaderboard.slice(0, 10).map((player, index) => (
                <motion.div
                  key={player.playerId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center justify-between p-4 rounded-lg ${
                    index === 0 ? 'bg-yellow-100 dark:bg-yellow-900/20 border-2 border-yellow-500' :
                    index === 1 ? 'bg-gray-100 dark:bg-gray-700 border-2 border-gray-400' :
                    index === 2 ? 'bg-orange-100 dark:bg-orange-900/20 border-2 border-orange-500' :
                    'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="text-2xl font-bold mr-4">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {player.playerName}
                    </span>
                  </div>
                  <span className="text-xl font-bold text-primary-600">
                    {player.score} pts
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="flex space-x-4 justify-center">
            <button
              onClick={() => router.push('/join')}
              className="btn-primary"
            >
              Play Again
            </button>
            <button
              onClick={() => router.push('/')}
              className="btn-outline"
            >
              Go Home
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  return null
}
