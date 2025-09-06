import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth-dev'
import { mockQuizzes } from './mock-data'
import { quizStore } from './persistence'
import { v4 as uuidv4 } from 'uuid'

// Store created quizzes in memory (in production, use a database)
const createdQuizzes = new Map<string, any>()

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Filter quizzes based on user role
    const userRole = (session.user as any)?.role || 'student'
    const userEmail = session.user?.email

    // Combine mock quizzes with created quizzes from both sources
    const allQuizzes = [...mockQuizzes, ...Array.from(createdQuizzes.values()), ...quizStore.getAllQuizzes()]

    let filteredQuizzes = allQuizzes

    if (userRole === 'teacher') {
      // Teachers see only their own quizzes
      filteredQuizzes = allQuizzes.filter(quiz => 
        quiz.createdBy === userEmail || quiz.createdBy === 'teacher@quizzq.com'
      )
    } else if (userRole === 'admin') {
      // Admins see all quizzes
      filteredQuizzes = allQuizzes
    } else {
      // Students see public quizzes
      filteredQuizzes = allQuizzes.filter(quiz => quiz.isPublic)
    }

    return NextResponse.json(filteredQuizzes)
  } catch (error) {
    console.error('Error fetching quizzes:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userRole = (session.user as any)?.role || 'student'
    
    if (userRole !== 'teacher' && userRole !== 'admin') {
      return NextResponse.json({ error: 'Only teachers can create quizzes' }, { status: 403 })
    }

    const body = await request.json()
    const { title, description, questions, settings } = body
    
    const newQuiz = {
      _id: uuidv4(),
      title: title || 'Untitled Quiz',
      description: description || '',
      questions: questions || [],
      subject: body.subject || 'General',
      gradeLevel: body.gradeLevel || 'All',
      createdBy: session.user?.email || 'unknown',
      createdAt: new Date(),
      updatedAt: new Date(),
      isPublic: body.isPublic !== false,
      totalQuestions: questions?.length || 0,
      totalTime: body.totalTime || 30,
      difficulty: body.difficulty || 'medium',
      tags: body.tags || [],
      playCount: 0,
      averageScore: 0,
      thumbnail: body.thumbnail || '📚'
    }

    // Store in both memory map and persistent store
    createdQuizzes.set(newQuiz._id, newQuiz)
    quizStore.addQuiz(newQuiz)

    return NextResponse.json(newQuiz)
  } catch (error) {
    console.error('Error creating quiz:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Export for use in other routes
export { createdQuizzes }
