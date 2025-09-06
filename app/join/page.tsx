'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'
import toast from 'react-hot-toast'

export default function JoinQuiz() {
  const [gameCode, setGameCode] = useState('')
  const [playerName, setPlayerName] = useState('')
  const [isJoining, setIsJoining] = useState(false)
  const router = useRouter()

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!gameCode.trim()) {
      toast.error('Please enter a game code')
      return
    }
    
    if (!playerName.trim()) {
      toast.error('Please enter your name')
      return
    }

    setIsJoining(true)

    try {
      const response = await fetch('/api/game/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gameCode: gameCode.toUpperCase(),
          playerName: playerName.trim(),
        }),
      })

      if (response.ok) {
        const data = await response.json()
        // Store player info in session storage
        sessionStorage.setItem('playerId', data.playerId)
        sessionStorage.setItem('playerName', playerName)
        sessionStorage.setItem('gameCode', gameCode.toUpperCase())
        
        router.push(`/play/${gameCode.toUpperCase()}`)
      } else {
        const error = await response.json()
        toast.error(error.message || 'Failed to join quiz')
      }
    } catch (error) {
      console.error('Error joining quiz:', error)
      toast.error('Failed to join quiz')
    } finally {
      setIsJoining(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8 pt-12"
          >
            <h1 className="text-4xl font-bold text-gradient mb-4">
              Join a Quiz
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Enter the game code to start playing
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-8"
          >
            <form onSubmit={handleJoin} className="space-y-6">
              <div>
                <label htmlFor="gameCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Game Code
                </label>
                <input
                  type="text"
                  id="gameCode"
                  value={gameCode}
                  onChange={(e) => setGameCode(e.target.value.toUpperCase())}
                  className="input-field text-center text-2xl font-bold tracking-wider"
                  placeholder="ENTER CODE"
                  maxLength={6}
                  autoComplete="off"
                  required
                />
              </div>

              <div>
                <label htmlFor="playerName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  id="playerName"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="input-field"
                  placeholder="Enter your name"
                  maxLength={20}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isJoining}
                className="w-full btn-primary text-lg py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isJoining ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Joining...
                  </span>
                ) : (
                  'Join Quiz'
                )}
              </button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 text-center"
          >
            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                How to join a quiz
              </h3>
              <ol className="text-left space-y-2 text-gray-600 dark:text-gray-400">
                <li className="flex items-start">
                  <span className="font-bold text-primary-600 mr-2">1.</span>
                  Get the game code from your teacher or quiz host
                </li>
                <li className="flex items-start">
                  <span className="font-bold text-primary-600 mr-2">2.</span>
                  Enter the code in the field above
                </li>
                <li className="flex items-start">
                  <span className="font-bold text-primary-600 mr-2">3.</span>
                  Type your name and click "Join Quiz"
                </li>
                <li className="flex items-start">
                  <span className="font-bold text-primary-600 mr-2">4.</span>
                  Wait for the host to start the game
                </li>
              </ol>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
