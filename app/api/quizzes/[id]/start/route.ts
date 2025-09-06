import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth-dev'
import { mockQuizzes, mockGameSessions } from '../../mock-data'
import { createdQuizzes } from '../../route'
import { quizStore } from '../../persistence'
import { v4 as uuidv4 } from 'uuid'

function generateGameCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check mock quizzes, created quizzes, and persistent store
    let quiz = mockQuizzes.find(q => q._id === params.id)
    if (!quiz) {
      quiz = createdQuizzes.get(params.id)
    }
    if (!quiz) {
      quiz = quizStore.getQuiz(params.id)
    }
    
    if (!quiz) {
      console.log(`Quiz not found with id: ${params.id}`)
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 })
    }

    // Generate unique game code
    let gameCode = generateGameCode()
    while (mockGameSessions.has(gameCode)) {
      gameCode = generateGameCode()
    }

    // Create game session
    const gameSession = {
      _id: uuidv4(),
      quizId: params.id,
      gameCode,
      hostId: (session.user as any)?.id || '1',
      hostEmail: session.user?.email,
      hostName: session.user?.name,
      players: [],
      currentQuestion: -1,
      status: 'waiting',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    mockGameSessions.set(gameCode, gameSession)

    return NextResponse.json({
      gameCode,
      sessionId: gameSession._id,
    })
  } catch (error) {
    console.error('Error starting quiz:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
