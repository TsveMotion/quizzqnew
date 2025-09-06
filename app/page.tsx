'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Navbar from '@/components/Navbar'
import ThemeToggle from '@/components/ThemeToggle'

export default function Home() {
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session) {
      router.push('/dashboard')
    }
  }, [session, router])

  const features = [
    {
      icon: '🎯',
      title: 'Interactive Quizzes',
      description: 'Create engaging multiple-choice quizzes with real-time feedback and scoring.'
    },
    {
      icon: '🏆',
      title: 'Live Leaderboards',
      description: 'Compete with friends and see live rankings as you play together.'
    },
    {
      icon: '👥',
      title: 'Multiplayer Games',
      description: 'Join quiz rooms with game codes and play with multiple participants.'
    },
    {
      icon: '📊',
      title: 'Analytics Dashboard',
      description: 'Track performance, view detailed statistics, and monitor progress.'
    },
    {
      icon: '🎨',
      title: 'Beautiful Design',
      description: 'Modern, responsive interface with dark mode and smooth animations.'
    },
    {
      icon: '⚡',
      title: 'Real-time Updates',
      description: 'Instant synchronization across all devices with WebSocket technology.'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-6xl sm:text-7xl font-bold text-gray-900 dark:text-white mb-6"
            >
              Learn, Play, and{' '}
              <span className="text-gradient animate-pulse">
                Excel
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto"
            >
              The most engaging educational quiz platform. Create interactive quizzes, 
              host live games, challenge yourself with trivia, and track your progress!
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link
                href="/auth/signup"
                className="btn-primary text-lg px-8 py-3 w-full sm:w-auto"
              >
                Get Started Free
              </Link>
              <Link
                href="/join"
                className="btn-outline text-lg px-8 py-3 w-full sm:w-auto"
              >
                Join a Quiz
              </Link>
            </motion.div>
          </div>

          {/* Hero Image/Demo */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-16 relative"
          >
            <div className="card p-8 max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                    🎮 Live Quiz Demo
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                      <span className="font-medium">Alex Thompson</span>
                      <span className="text-primary-600 font-bold">2,450 pts</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-secondary-50 dark:bg-secondary-900/20 rounded-lg">
                      <span className="font-medium">Sarah Johnson</span>
                      <span className="text-secondary-600 font-bold">2,200 pts</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-accent-50 dark:bg-accent-900/20 rounded-lg">
                      <span className="font-medium">Mike Chen</span>
                      <span className="text-accent-600 font-bold">1,980 pts</span>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="bg-gradient-primary p-6 rounded-xl text-white">
                    <h4 className="text-lg font-semibold mb-3">Question 3 of 10</h4>
                    <p className="mb-4">What is the capital of France?</p>
                    <div className="space-y-2">
                      <div className="p-2 bg-white/20 rounded-lg">A) London</div>
                      <div className="p-2 bg-white/40 rounded-lg border-2 border-white">B) Paris ✓</div>
                      <div className="p-2 bg-white/20 rounded-lg">C) Berlin</div>
                      <div className="p-2 bg-white/20 rounded-lg">D) Madrid</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose QuizzQ?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Packed with features to make learning fun and engaging for everyone
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card p-6 text-center hover:shadow-xl transition-shadow duration-300"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="card p-8 bg-gradient-primary text-white"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to Start Quizzing?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of educators and students already using QuizzQ
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/signup"
                className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
              >
                Create Account
              </Link>
              <Link
                href="/auth/signin"
                className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
              >
                Sign In
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center mb-4">
            <span className="text-2xl font-bold text-gradient">QuizzQ</span>
          </div>
          <p className="text-gray-400 mb-4">
            Making learning interactive and fun for everyone
          </p>
          <div className="flex justify-center space-x-6">
            <ThemeToggle />
          </div>
        </div>
      </footer>
    </div>
  )
}
