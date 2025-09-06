import mongoose from 'mongoose'

export interface IPlayerScore {
  playerId: string
  playerName: string
  score: number
  answers: {
    questionIndex: number
    selectedAnswer: number
    isCorrect: boolean
    timeToAnswer: number
    pointsEarned: number
  }[]
}

export interface IGameSession extends mongoose.Document {
  quizId: mongoose.Types.ObjectId
  gameCode: string
  hostId: mongoose.Types.ObjectId
  players: IPlayerScore[]
  currentQuestion: number
  status: 'waiting' | 'active' | 'finished'
  startedAt?: Date
  finishedAt?: Date
  createdAt: Date
  updatedAt: Date
}

const PlayerAnswerSchema = new mongoose.Schema({
  questionIndex: Number,
  selectedAnswer: Number,
  isCorrect: Boolean,
  timeToAnswer: Number,
  pointsEarned: Number,
})

const PlayerScoreSchema = new mongoose.Schema({
  playerId: String,
  playerName: String,
  score: { type: Number, default: 0 },
  answers: [PlayerAnswerSchema],
})

const GameSessionSchema = new mongoose.Schema({
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true,
  },
  gameCode: {
    type: String,
    required: true,
    unique: true,
  },
  hostId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  players: [PlayerScoreSchema],
  currentQuestion: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['waiting', 'active', 'finished'],
    default: 'waiting',
  },
  startedAt: Date,
  finishedAt: Date,
}, {
  timestamps: true,
})

export default mongoose.models.GameSession || mongoose.model<IGameSession>('GameSession', GameSessionSchema)
