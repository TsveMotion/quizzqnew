'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

interface QuizReport {
  _id: string
  title: string
  playCount: number
  averageScore: number
  completionRate: number
  lastPlayed: Date
}

export default function Reports() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [reports, setReports] = useState<QuizReport[]>([])
  const [loading, setLoading] = useState(true)
  const [timeFilter, setTimeFilter] = useState('all')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (status === 'authenticated') {
      fetchReports()
    }
  }, [status, router])

  const fetchReports = async () => {
    try {
      // Mock data for reports
      const mockReports: QuizReport[] = [
        {
          _id: 'quiz1',
          title: 'Sample Science Quiz',
          playCount: 25,
          averageScore: 78,
          completionRate: 92,
          lastPlayed: new Date('2024-01-15'),
        },
        {
          _id: 'quiz2',
          title: 'Math Basics',
          playCount: 18,
          averageScore: 85,
          completionRate: 88,
          lastPlayed: new Date('2024-01-14'),
        },
      ]
      setReports(mockReports)
    } catch (error) {
      console.error('Error fetching reports:', error)
    } finally {
      setLoading(false)
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
              Quiz Reports & Analytics
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Track performance and engagement across your quizzes
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card p-6 mb-8"
          >
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex gap-2">
                <button
                  onClick={() => setTimeFilter('all')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    timeFilter === 'all'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  All Time
                </button>
                <button
                  onClick={() => setTimeFilter('week')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    timeFilter === 'week'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  This Week
                </button>
                <button
                  onClick={() => setTimeFilter('month')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    timeFilter === 'month'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  This Month
                </button>
              </div>
              <button className="btn-primary">
                Export Report
              </button>
            </div>
          </motion.div>

          {/* Statistics Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          >
            <div className="card p-6">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total Quizzes</div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{reports.length}</div>
            </div>
            <div className="card p-6">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total Players</div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {reports.reduce((sum, r) => sum + r.playCount, 0)}
              </div>
            </div>
            <div className="card p-6">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Avg Score</div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {reports.length > 0
                  ? Math.round(reports.reduce((sum, r) => sum + r.averageScore, 0) / reports.length)
                  : 0}%
              </div>
            </div>
            <div className="card p-6">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Completion Rate</div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {reports.length > 0
                  ? Math.round(reports.reduce((sum, r) => sum + r.completionRate, 0) / reports.length)
                  : 0}%
              </div>
            </div>
          </motion.div>

          {/* Quiz Reports Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Quiz Performance
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Quiz Title
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Times Played
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Avg Score
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Completion Rate
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Last Played
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {reports.map((report) => (
                    <tr key={report._id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {report.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {report.playCount}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {report.averageScore}%
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {report.completionRate}%
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {new Date(report.lastPlayed).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          href={`/reports/${report._id}`}
                          className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
