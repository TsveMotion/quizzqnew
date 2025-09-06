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
  const [playerId, setPlayerId] = useState<string | null>(null)
  const [playerName, setPlayerName] = useState<string | null>(null)

  useEffect(() => {
    const storedPlayerId = sessionStorage.getItem('playerId')
    const storedPlayerName = sessionStorage.getItem('playerName')
    
    if (!storedPlayerId || !storedPlayerName) {
      toast.error('Please join the game first')
      router.push('/join')
      return
    }

    setPlayerId(storedPlayerId)
    setPlayerName(storedPlayerName)
  }, [router])

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
    })

    newSocket.on('connect', () => {
      console.log('Player connected to game')
    })

    newSocket.on('playerJoined', (data) => {
      toast.success(`${data.playerName} joined the game`)
      setPlayers(data.players)
    })

    newSocket.on('gameStarted', () => {
      setGameStatus('playing')
      toast.success('Game started!')
    })

    newSocket.on('nextQuestion', (data) => {
      setCurrentQuestion(data.question)
      setQuestionIndex(data.questionIndex)
      setTotalQuestions(data.totalQuestions || 10)
      setSelectedAnswer(null)
      setShowResult(false)
      setTimeLeft(data.question.timeLimit || 30)
    })

    newSocket.on('showLeaderboard', (data) => {
      setLeaderboard(data.players || [])
      setShowResult(true)
    })

    newSocket.on('gameEnded', (data) => {
      setGameStatus('finished')
      setLeaderboard(data.finalScores || [])
    })

    newSocket.on('error', (error) => {
      toast.error(error.message || 'An error occurred')
    })

    setSocket(newSocket)

    return () => {
      newSocket.disconnect()
    }
  }, [gameCode, playerId, playerName])

  useEffect(() => {
    if (currentQuestion && timeLeft > 0 && !selectedAnswer) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [timeLeft, currentQuestion, selectedAnswer])

  const submitAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null) return
    
    setSelectedAnswer(answerIndex)
    socket?.emit('submitAnswer', {
      gameCode,
      playerId,
      answerIndex,
      timeLeft,
    })
  }

  if (!playerId || !playerName) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Game Code: {gameCode}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Playing as: {playerName}
          </p>
          {gameStatus === 'playing' && currentQuestion && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Question {questionIndex + 1} of {totalQuestions}
            </p>
          )}
        </div>

        {/* Waiting Screen */}
        {gameStatus === 'waiting' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-8 text-center"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Waiting for Game to Start
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              The host will start the game soon...
            </p>
            
            <div className="mb-8">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Players Joined ({players.length})
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {players.map((player) => (
                  <span
                    key={player.playerId}
                    className="px-3 py-1 bg-primary-100 dark:bg-primary-900/20 rounded-full text-sm"
                  >
                    {player.playerName}
                  </span>
                ))}
              </div>
            </div>

            <div className="animate-pulse">
              <div className="w-16 h-16 mx-auto bg-primary-500 rounded-full"></div>
            </div>
          </motion.div>
        )}

        {/* Question Screen */}
        {gameStatus === 'playing' && currentQuestion && !showResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card p-8"
          >
            {/* Timer */}
            <div className="mb-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/20">
                <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {timeLeft}
                </span>
              </div>
            </div>

            {/* Question */}
            <h2 className="text-2xl font-bold text-center mb-8 text-gray-900 dark:text-white">
              {currentQuestion.question}
            </h2>

            {/* Answer Options */}
            <div className="grid grid-cols-2 gap-4">
              {currentQuestion.options.map((option, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: selectedAnswer === null ? 1.02 : 1 }}
                  whileTap={{ scale: selectedAnswer === null ? 0.98 : 1 }}
                  onClick={() => submitAnswer(index)}
                  disabled={selectedAnswer !== null}
                  className={`p-6 rounded-lg text-white font-medium transition-all ${
                    selectedAnswer === index
                      ? 'ring-4 ring-white/50 transform scale-105'
                      : selectedAnswer !== null
                      ? 'opacity-50'
                      : 'hover:brightness-110'
                  } ${
                    index === 0 ? 'bg-red-500' :
                    index === 1 ? 'bg-blue-500' :
                    index === 2 ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`}
                >
                  {option}
                </motion.button>
              ))}
            </div>

            {selectedAnswer !== null && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 text-center"
              >
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  Answer submitted! Waiting for others...
                </p>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Leaderboard Screen */}
        {showResult && leaderboard.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-8"
          >
            <h2 className="text-2xl font-bold text-center mb-8 text-gray-900 dark:text-white">
              Leaderboard
            </h2>
            
            {/* Your Score */}
            <div className="mb-8 text-center">
              <p className="text-lg text-gray-600 dark:text-gray-400">Your Score</p>
              <p className="text-4xl font-bold text-primary-600 dark:text-primary-400">
                {playerScore} pts
              </p>
            </div>

            {/* Top Players */}
            <div className="space-y-3">
              {leaderboard
                .sort((a, b) => b.score - a.score)
                .slice(0, 5)
                .map((player, index) => (
                  <div
                    key={player.playerId}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      player.playerId === playerId
                        ? 'bg-primary-100 dark:bg-primary-900/20 border-2 border-primary-500'
                        : index === 0 ? 'bg-yellow-100 dark:bg-yellow-900/20' :
                          index === 1 ? 'bg-gray-100 dark:bg-gray-700' :
                          index === 2 ? 'bg-orange-100 dark:bg-orange-900/20' :
                          'bg-white dark:bg-gray-800'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="text-lg font-bold mr-3">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {player.playerName}
                        {player.playerId === playerId && ' (You)'}
                      </span>
                    </div>
                    <span className="font-bold text-gray-900 dark:text-white">
                      {player.score} pts
                    </span>
                  </div>
                ))}
            </div>
          </motion.div>
        )}

        {/* Game Finished Screen */}
        {gameStatus === 'finished' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-8 text-center"
          >
            <h2 className="text-3xl font-bold mb-6 text-gradient">
              Game Complete! 🎉
            </h2>
            
            <div className="mb-8">
              <p className="text-lg text-gray-600 dark:text-gray-400">Final Score</p>
              <p className="text-5xl font-bold text-primary-600 dark:text-primary-400">
                {playerScore} pts
              </p>
            </div>

            <button
              onClick={() => router.push('/join')}
              className="btn-primary"
            >
              Play Another Game
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
