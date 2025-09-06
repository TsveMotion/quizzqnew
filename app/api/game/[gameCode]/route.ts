import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth-dev'
import { mockGameSessions, mockQuizzes } from '../../quizzes/mock-data'
import { createdQuizzes } from '../../quizzes/route'

export async function GET(
  request: NextRequest,
  { params }: { params: { gameCode: string } }
) {
  try {
    // Find game session in mock data
    const gameSession = mockGameSessions.get(params.gameCode.toUpperCase())
    
    if (!gameSession) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 })
    }

    // Find the quiz associated with this game session
    let quiz = mockQuizzes.find(q => q._id === gameSession.quizId)
    if (!quiz) {
      quiz = createdQuizzes.get(gameSession.quizId)
    }
    
    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 })
    }

    return NextResponse.json({
      session: gameSession,
      quiz: quiz
    })
  } catch (error) {
    console.error('Error fetching game:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
