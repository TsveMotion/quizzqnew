const express = require('express')
const http = require('http')
const socketIo = require('socket.io')
const cors = require('cors')

const app = express()
app.use(cors())

const server = http.createServer(app)
const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:3000", "http://127.0.0.1:3000", "http://127.0.0.1:3001"],
    methods: ["GET", "POST"]
  },
  transports: ['websocket', 'polling']
})

const games = new Map()

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id)
  const { gameCode, role, playerId, playerName, hostId } = socket.handshake.query
  
  if (!gameCode) {
    console.log('No game code provided, disconnecting')
    socket.disconnect()
    return
  }

  socket.join(gameCode)
  
  // Initialize game if it doesn't exist
  if (!games.has(gameCode)) {
    games.set(gameCode, {
      host: null,
      players: [],
      currentQuestion: -1,
      status: 'waiting'
    })
  }
  
  const game = games.get(gameCode)
  
  // Handle host joining
  if (role === 'host') {
    game.host = socket.id
    console.log(`Host joined game ${gameCode}`)
  } 
  // Handle player joining
  else if (role === 'player' && playerId && playerName) {
    const existingPlayer = game.players.find(p => p.playerId === playerId)
    if (!existingPlayer) {
      game.players.push({
        playerId,
        playerName,
        score: 0,
        socketId: socket.id
      })
      
      io.to(gameCode).emit('playerJoined', {
        playerName,
        players: game.players
      })
      console.log(`Player ${playerName} joined game ${gameCode}`)
    }
  }
  
  // Handle next question event from host
  socket.on('nextQuestion', (data) => {
    if (games.has(gameCode) && role === 'host') {
      const game = games.get(gameCode)
      game.currentQuestion = data.questionIndex
      io.to(gameCode).emit('nextQuestion', data)
      console.log(`Question ${data.questionIndex} sent to game ${gameCode}`)
    }
  })
  
  // Handle answer submission from player
  socket.on('submitAnswer', (data) => {
    const targetGameCode = data.gameCode || gameCode
    if (games.has(targetGameCode)) {
      const game = games.get(targetGameCode)
      const player = game.players.find(p => p.playerId === data.playerId)
      if (player) {
        // Update player score based on answer (simplified scoring)
        const points = 1000 * (data.timeLeft / 30) // More points for faster answers
        player.score += Math.round(points)
        
        io.to(targetGameCode).emit('answerReceived', {
          playerId: data.playerId,
          players: game.players
        })
        console.log(`Answer received from ${data.playerId} in game ${targetGameCode}`)
      }
    }
  })
  
  // Handle showing leaderboard
  socket.on('showLeaderboard', (data) => {
    io.to(gameCode).emit('showLeaderboard', data)
    console.log(`Leaderboard shown for game ${gameCode}`)
  })
  
  // Handle game end
  socket.on('gameEnded', (data) => {
    io.to(gameCode).emit('gameEnded', data)
    console.log(`Game ${gameCode} ended`)
    // Clean up game after a delay
    setTimeout(() => {
      if (games.has(gameCode)) {
        games.delete(gameCode)
        console.log(`Game ${gameCode} cleaned up`)
      }
    }, 60000) // Clean up after 1 minute
  })
  
  // Handle skip question
  socket.on('skipQuestion', () => {
    if (role === 'host') {
      io.to(gameCode).emit('skipQuestion')
      console.log(`Question skipped in game ${gameCode}`)
    }
  })
  
  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id)
    
    // Remove player from all games they might be in
    for (const [code, game] of games.entries()) {
      // Check if this was the host
      if (game.host === socket.id) {
        console.log(`Host disconnected from game ${code}`)
        io.to(code).emit('hostDisconnected')
        // Don't immediately delete the game, give host a chance to reconnect
      }
      
      // Check if this was a player
      const playerIndex = game.players.findIndex(p => p.socketId === socket.id)
      if (playerIndex !== -1) {
        const player = game.players[playerIndex]
        game.players.splice(playerIndex, 1)
        io.to(code).emit('playerLeft', {
          playerName: player.playerName,
          players: game.players
        })
        console.log(`Player ${player.playerName} left game ${code}`)
      }
    }
  })
})

const PORT = process.env.PORT || 3001

server.listen(PORT, () => {
  console.log(`Socket.io server running on port ${PORT}`)
})

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    activeGames: games.size,
    games: Array.from(games.keys())
  })
})

// Debug endpoint to see current games
app.get('/games', (req, res) => {
  const gamesList = []
  for (const [code, game] of games.entries()) {
    gamesList.push({
      code,
      playerCount: game.players.length,
      status: game.status,
      currentQuestion: game.currentQuestion
    })
  }
  res.json(gamesList)
})
