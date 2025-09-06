import { NextRequest, NextResponse } from 'next/server'
import { mockGameSessions } from '../../quizzes/mock-data'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { gameCode, playerName } = body

    if (!gameCode || !playerName) {
      return NextResponse.json({ error: 'Game code and player name are required' }, { status: 400 })
    }

    // Find active game session
    const gameSession = mockGameSessions.get(gameCode.toUpperCase())

    if (!gameSession || gameSession.status !== 'waiting') {
      return NextResponse.json({ error: 'Game not found or already started' }, { status: 404 })
    }

    // Check if player name already exists
    const existingPlayer = gameSession.players?.find((p: any) => p.playerName === playerName)
    if (existingPlayer) {
      return NextResponse.json({ error: 'Player name already taken' }, { status: 400 })
    }

    // Add player to session
    const playerId = uuidv4()
    const player = {
      playerId,
      playerName,
      score: 0,
      answers: [],
      joinedAt: new Date()
    }

    gameSession.players.push(player)
    gameSession.updatedAt = new Date()

    return NextResponse.json({
      playerId,
      sessionId: gameSession._id,
      quizId: gameSession.quizId
    })
  } catch (error) {
    console.error('Error joining game:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
