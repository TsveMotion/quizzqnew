'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import io, { Socket } from 'socket.io-client'
import toast from 'react-hot-toast'

interface Player {
  playerId: string
  playerName: string
  score: number
  hasAnswered?: boolean
}

interface Quiz {
  _id: string
  title: string
  questions: any[]
}

export default function HostGame() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const gameCode = params.gameCode as string
  
  const [socket, setSocket] = useState<Socket | null>(null)
  const [quiz, setQuiz] = useState<any>(null)
  const [players, setPlayers] = useState<any[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(-1)
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [answersReceived, setAnswersReceived] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchGameData()
  }, [gameCode])

  const fetchGameData = async () => {
    try {
      const response = await fetch(`/api/game/${gameCode}`)
      if (response.ok) {
        const data = await response.json()
        setQuiz(data.quiz)
        setLoading(false)
      } else {
        toast.error('Failed to load game data')
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Error fetching game data:', error)
      toast.error('Failed to load game')
    }
  }

  useEffect(() => {
    if (!gameCode || !quiz) return

    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://127.0.0.1:3001'
    console.log('Connecting to Socket.io server:', socketUrl)
    
    const newSocket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      query: {
        gameCode,
        role: 'host',
        hostId: (session?.user as any)?.id || '1',
      },
    })

    newSocket.on('connect', () => {
      console.log('Host connected to game server')
    })

    newSocket.on('playerJoined', (data) => {
      setPlayers(data.players)
      toast.success(`${data.playerName} joined!`)
    })

    newSocket.on('playerLeft', (data) => {
      setPlayers(data.players)
      toast(`${data.playerName} left the game`)
    })

    newSocket.on('answerReceived', (data) => {
      setAnswersReceived(prev => prev + 1)
      setPlayers(data.players)
    })

    newSocket.on('questionComplete', () => {
      setShowLeaderboard(true)
    })

    setSocket(newSocket)

    return () => {
      newSocket.disconnect()
    }
  }, [gameCode, quiz, session])

  const startGame = () => {
    if (socket && players.length > 0) {
      setGameStarted(true)
      nextQuestion()
    } else {
      toast.error('Need at least one player to start')
    }
  }

  const nextQuestion = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      const nextIndex = currentQuestion + 1
      setShowLeaderboard(false)
      setAnswersReceived(0)
      setCurrentQuestion(nextIndex)
      
      socket?.emit('nextQuestion', {
        questionIndex: nextIndex,
        question: quiz.questions[nextIndex],
      })
      
      // Auto-advance to leaderboard after time limit
      setTimeout(() => {
        showQuestionResults()
      }, (quiz.questions[nextIndex].timeLimit || 30) * 1000)
    } else {
      endGame()
    }
  }

  const showQuestionResults = () => {
    setShowLeaderboard(true)
    socket?.emit('showLeaderboard', { players })
  }

  const endGame = () => {
    setGameStarted(false)
    socket?.emit('gameEnded', { finalScores: players })
    toast.success('Game finished!')
  }

  const skipQuestion = () => {
    if (socket) {
      socket.emit('skipQuestion')
    }
    nextQuestion()
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {quiz.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Game Code: <span className="font-bold text-2xl">{gameCode}</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {players.length} Players
            </p>
            {gameStarted && (
              <p className="text-gray-600 dark:text-gray-400">
                Question {currentQuestion + 1} of {quiz.questions.length}
              </p>
            )}
          </div>
        </div>

        {/* Main Content */}
        {!gameStarted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-8"
          >
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Waiting for Players to Join
              </p>
              {players.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-400">No players yet...</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                  {players.map((player) => (
                    <div key={player.playerId} className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                      <p className="font-medium text-gray-900 dark:text-white">{player.playerName}</p>
                    </div>
                  ))}
                </div>
              )}
              <button
                onClick={startGame}
                disabled={players.length === 0}
                className="btn-primary px-8 py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Start Game
              </button>
            </div>
          </motion.div>
        )}

          {/* Question Display */}
          {gameStarted && !showLeaderboard && currentQuestion >= 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-8"
            >
              <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
                {quiz.questions[currentQuestion].question}
              </h2>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {quiz.questions[currentQuestion].options.map((option: string, index: number) => (
                <div
                  key={index}
                  className={`p-6 rounded-lg text-center font-medium text-white ${
                    index === 0 ? 'bg-red-500' :
                    index === 1 ? 'bg-blue-500' :
                    index === 2 ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`}
                >
                  {option}
                </div>
              ))}
            </div>

            <div className="text-center mb-6">
              <p className="text-xl font-semibold text-gray-900 dark:text-white">
                {answersReceived} / {players.length} answers received
              </p>
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={skipQuestion}
                className="btn-outline"
              >
                Skip Question
              </button>
              {answersReceived === players.length && (
                <button
                  onClick={nextQuestion}
                  className="btn-primary"
                >
                  Next Question
                </button>
              )}
            </div>
          </motion.div>
        )}

        {showLeaderboard && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card p-8"
          >
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
              Leaderboard
            </h2>
            
            <div className="space-y-3 mb-8">
              {players
                .sort((a, b) => b.score - a.score)
                .slice(0, 5)
                .map((player, index) => (
                  <motion.div
                    key={player.playerId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center justify-between p-4 rounded-lg ${
                      index === 0 ? 'bg-yellow-100 dark:bg-yellow-900/20' :
                      index === 1 ? 'bg-gray-100 dark:bg-gray-700' :
                      index === 2 ? 'bg-orange-100 dark:bg-orange-900/20' :
                      'bg-white dark:bg-gray-800'
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

            <div className="text-center">
              <button
                onClick={nextQuestion}
                className="btn-primary text-xl px-8 py-4"
              >
                Next Question
              </button>
            </div>
          </motion.div>
        )}

        {!gameStarted && currentQuestion === quiz.questions.length - 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-8 text-center"
          >
            <h2 className="text-3xl font-bold mb-6 text-gradient">
              Game Complete! 🎉
            </h2>
            
            <div className="space-y-3 mb-8 max-w-2xl mx-auto">
              {players
                .sort((a, b) => b.score - a.score)
                .map((player, index) => (
                  <div
                    key={player.playerId}
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
                  </div>
                ))}
            </div>

            <button
              onClick={() => router.push('/dashboard')}
              className="btn-primary"
            >
              Back to Dashboard
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
