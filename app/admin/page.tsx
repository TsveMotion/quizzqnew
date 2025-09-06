'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface User {
  _id: string
  name: string
  email: string
  role: string
  createdAt: Date
  lastActive: Date
}

interface GameSession {
  _id: string
  gameCode: string
  quizTitle: string
  hostName: string
  playerCount: number
  status: string
  createdAt: Date
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [users, setUsers] = useState<any[]>([])
  const [gameSessions, setGameSessions] = useState<any[]>([])
  const [teachers, setTeachers] = useState<any[]>([])
  const [students, setStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [systemLogs, setSystemLogs] = useState<any[]>([])
  const [analytics, setAnalytics] = useState<{
    totalUsers: number
    activeToday: number
    totalQuizzes: number
    totalGamesPlayed: number
    averageScore: number
    peakHours: string
    popularQuizzes: { name: string; plays: number }[]
  }>({
    totalUsers: 0,
    activeToday: 0,
    totalQuizzes: 0,
    totalGamesPlayed: 0,
    averageScore: 0,
    peakHours: '',
    popularQuizzes: []
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (status === 'authenticated') {
      // Check if user is admin
      if ((session?.user as any)?.role !== 'admin') {
        toast.error('Access denied. Admin privileges required.')
        router.push('/dashboard')
      } else {
        fetchAdminData()
        fetchAnalytics()
        fetchSystemLogs()
      }
    }
  }, [status, session, router])

  const fetchAdminData = async () => {
    try {
      // Mock data for admin dashboard
      const mockUsers: User[] = [
        {
          _id: '1',
          name: 'Demo Teacher',
          email: 'teacher@quizzq.com',
          role: 'teacher',
          createdAt: new Date('2024-01-01'),
          lastActive: new Date(),
        },
        {
          _id: '2',
          name: 'Demo Student',
          email: 'student@quizzq.com',
          role: 'student',
          createdAt: new Date('2024-01-02'),
          lastActive: new Date(),
        },
        {
          _id: '3',
          name: 'Admin User',
          email: 'admin@quizzq.com',
          role: 'admin',
          createdAt: new Date('2024-01-01'),
          lastActive: new Date(),
        },
      ]

      const mockSessions: GameSession[] = [
        {
          _id: 'session1',
          gameCode: 'ABC123',
          quizTitle: 'Sample Science Quiz',
          hostName: 'Demo Teacher',
          playerCount: 15,
          status: 'active',
          createdAt: new Date(),
        },
      ]

      setUsers(mockUsers)
      setTeachers(mockUsers.filter(u => u.role === 'teacher'))
      setStudents(mockUsers.filter(u => u.role === 'student'))
      setGameSessions(mockSessions)
    } catch (error) {
      console.error('Error fetching admin data:', error)
      toast.error('Failed to load admin data')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        // Mock delete
        setUsers(users.filter(u => u._id !== userId))
        toast.success('User deleted successfully')
      } catch (error) {
        toast.error('Failed to delete user')
      }
    }
  }

  const handleResetPassword = async (userId: string, email: string) => {
    if (confirm(`Reset password for ${email}?`)) {
      try {
        // Mock password reset
        toast.success(`Password reset link sent to ${email}`)
      } catch (error) {
        toast.error('Failed to reset password')
      }
    }
  }

  const handleBanUser = async (userId: string) => {
    if (confirm('Are you sure you want to ban this user?')) {
      try {
        // Mock ban user
        toast.success('User banned successfully')
      } catch (error) {
        toast.error('Failed to ban user')
      }
    }
  }

  const fetchAnalytics = async () => {
    // Mock analytics data
    setAnalytics({
      totalUsers: 156,
      activeToday: 42,
      totalQuizzes: 89,
      totalGamesPlayed: 234,
      averageScore: 78.5,
      peakHours: '2PM - 4PM',
      popularQuizzes: [
        { name: 'Math Basics', plays: 56 },
        { name: 'Science Quiz', plays: 45 },
        { name: 'History Challenge', plays: 38 }
      ]
    })
  }

  const fetchSystemLogs = async () => {
    // Mock system logs
    setSystemLogs([
      { id: 1, timestamp: new Date(), type: 'info', message: 'System started successfully' },
      { id: 2, timestamp: new Date(), type: 'warning', message: 'High memory usage detected' },
      { id: 3, timestamp: new Date(), type: 'error', message: 'Failed to send email notification' },
      { id: 4, timestamp: new Date(), type: 'info', message: 'Database backup completed' },
      { id: 5, timestamp: new Date(), type: 'info', message: 'New user registration' }
    ])
  }

  const handleEndGame = async (sessionId: string) => {
    if (confirm('Are you sure you want to end this game session?')) {
      try {
        // Mock end game
        setGameSessions(gameSessions.filter(s => s._id !== sessionId))
        toast.success('Game session ended')
      } catch (error) {
        toast.error('Failed to end game session')
      }
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="pt-20 px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage users, monitor games, and control platform settings
            </p>
          </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex flex-wrap gap-4 mb-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'analytics'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Analytics
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'users'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              All Users
            </button>
            <button
              onClick={() => setActiveTab('teachers')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'teachers'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Teachers
            </button>
            <button
              onClick={() => setActiveTab('students')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'students'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Students
            </button>
            <button
              onClick={() => setActiveTab('games')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'games'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Active Games
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'logs'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              System Logs
            </button>
          </div>
        </motion.div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <>
            {/* Statistics */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
              >
                <div className="card p-6">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total Users</div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">{users.length}</div>
                  <div className="text-xs text-green-600 mt-2">+12% from last month</div>
                </div>
                <div className="card p-6">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Active Games</div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">
                    {gameSessions.filter(s => s.status === 'active').length}
                  </div>
                  <div className="text-xs text-gray-500 mt-2">Live right now</div>
                </div>
                <div className="card p-6">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Teachers</div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">{teachers.length}</div>
                  <div className="text-xs text-gray-500 mt-2">Content creators</div>
                </div>
                <div className="card p-6">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Students</div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">{students.length}</div>
                  <div className="text-xs text-gray-500 mt-2">Active learners</div>
                </div>
              </motion.div>

              {/* Recent Activity */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="card p-6"
              >
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Recent Activity
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          New user registration
                        </p>
                        <p className="text-xs text-gray-500">student@quizzq.com joined</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">2 mins ago</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Quiz created
                        </p>
                        <p className="text-xs text-gray-500">Science Quiz by Demo Teacher</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">15 mins ago</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Game started
                        </p>
                        <p className="text-xs text-gray-500">Math Quiz with 10 players</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">1 hour ago</span>
                  </div>
                </div>
              </motion.div>
            </>
          )}

          {(activeTab === 'users' || activeTab === 'teachers' || activeTab === 'students') && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {activeTab === 'users' ? 'All Users' : 
                   activeTab === 'teachers' ? 'Teachers' : 'Students'}
                </h2>
                <button className="btn-primary text-sm">
                  Add User
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Last Active
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {(activeTab === 'users' ? users : 
                      activeTab === 'teachers' ? teachers : students).map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {user.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                            user.role === 'teacher' ? 'bg-blue-100 text-blue-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {new Date(user.lastActive).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleResetPassword(user._id, user.email)}
                              className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                              title="Reset Password"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleBanUser(user._id)}
                              className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300"
                              title="Ban User"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user._id)}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                              title="Delete User"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="card p-6">
                  <h3 className="text-lg font-semibold mb-4">User Growth</h3>
                  <div className="text-3xl font-bold text-primary-600">{analytics.totalUsers}</div>
                  <p className="text-gray-600 dark:text-gray-400">Total Users</p>
                  <div className="mt-4 text-sm text-green-600">+15% from last month</div>
                </div>
                
                <div className="card p-6">
                  <h3 className="text-lg font-semibold mb-4">Active Today</h3>
                  <div className="text-3xl font-bold text-blue-600">{analytics.activeToday}</div>
                  <p className="text-gray-600 dark:text-gray-400">Currently Active</p>
                  <div className="mt-4 text-sm">Peak: {analytics.peakHours}</div>
                </div>
                
                <div className="card p-6">
                  <h3 className="text-lg font-semibold mb-4">Quiz Stats</h3>
                  <div className="text-3xl font-bold text-purple-600">{analytics.totalQuizzes}</div>
                  <p className="text-gray-600 dark:text-gray-400">Total Quizzes</p>
                  <div className="mt-4 text-sm">Avg Score: {analytics.averageScore}%</div>
                </div>
              </div>

              <div className="card p-6">
                <h3 className="text-lg font-semibold mb-4">Popular Quizzes</h3>
                <div className="space-y-3">
                  {analytics.popularQuizzes.map((quiz: any, index: number) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-gray-700 dark:text-gray-300">{quiz.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">{quiz.plays} plays</span>
                        <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-primary-600 h-2 rounded-full"
                            style={{ width: `${(quiz.plays / 60) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'logs' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-6"
            >
              <h2 className="text-xl font-semibold mb-4">System Logs</h2>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {systemLogs.map((log: any) => (
                  <div key={log.id} className={`p-3 rounded-lg flex items-start gap-3 ${
                    log.type === 'error' ? 'bg-red-50 dark:bg-red-900/20' :
                    log.type === 'warning' ? 'bg-yellow-50 dark:bg-yellow-900/20' :
                    'bg-gray-50 dark:bg-gray-800'
                  }`}>
                    <div className={`mt-1 w-2 h-2 rounded-full ${
                      log.type === 'error' ? 'bg-red-500' :
                      log.type === 'warning' ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`} />
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">{log.message}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'games' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Active Game Sessions
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Game Code
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Quiz
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Host
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Players
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Started
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {gameSessions.map((session) => (
                      <tr key={session._id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold text-primary-600">
                            {session.gameCode}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {session.quizTitle}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {session.hostName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {session.playerCount}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {session.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {new Date(session.createdAt).toLocaleTimeString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleEndGame(session._id)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          >
                            End Game
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {gameSessions.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No active game sessions
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
