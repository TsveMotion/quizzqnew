import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth-dev'
import { mockQuizzes } from '../mock-data'
import { createdQuizzes } from '../route'
import { quizStore } from '../persistence'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check mock quizzes, created quizzes, and persistent store
    let quiz = mockQuizzes.find(q => q._id === params.id)
    if (!quiz) {
      quiz = createdQuizzes.get(params.id)
    }
    if (!quiz) {
      quiz = quizStore.getQuiz(params.id)
    }
    
    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 })
    }

    return NextResponse.json(quiz)
  } catch (error) {
    console.error('Error fetching quiz:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    
    // Find quiz in mock data
    const quizIndex = mockQuizzes.findIndex(q => q._id === params.id)
    
    if (quizIndex === -1) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 })
    }

    // Update quiz in mock data
    mockQuizzes[quizIndex] = {
      ...mockQuizzes[quizIndex],
      ...body,
      updatedAt: new Date(),
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating quiz:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find and remove quiz from mock data
    const quizIndex = mockQuizzes.findIndex(q => q._id === params.id)
    
    if (quizIndex === -1) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 })
    }

    // Remove from mock data
    mockQuizzes.splice(quizIndex, 1)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting quiz:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
