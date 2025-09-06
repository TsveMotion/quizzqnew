import mongoose from 'mongoose'

export interface IQuestion {
  question: string
  options: string[]
  correctAnswer: number
  timeLimit: number
  points: number
}

export interface IQuiz extends mongoose.Document {
  title: string
  description: string
  creatorId: mongoose.Types.ObjectId
  questions: IQuestion[]
  gameCode?: string
  isActive: boolean
  settings: {
    timePerQuestion: number
    showCorrectAnswer: boolean
    randomizeQuestions: boolean
    randomizeOptions: boolean
  }
  createdAt: Date
  updatedAt: Date
}

const QuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true,
  },
  options: [{
    type: String,
    required: true,
  }],
  correctAnswer: {
    type: Number,
    required: true,
    min: 0,
    max: 3,
  },
  timeLimit: {
    type: Number,
    default: 30,
    min: 5,
    max: 120,
  },
  points: {
    type: Number,
    default: 1000,
    min: 100,
    max: 5000,
  },
})

const QuizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Quiz title is required'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  questions: [QuestionSchema],
  gameCode: {
    type: String,
    unique: true,
    sparse: true,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  settings: {
    timePerQuestion: {
      type: Number,
      default: 30,
    },
    showCorrectAnswer: {
      type: Boolean,
      default: true,
    },
    randomizeQuestions: {
      type: Boolean,
      default: false,
    },
    randomizeOptions: {
      type: Boolean,
      default: false,
    },
  },
}, {
  timestamps: true,
})

export default mongoose.models.Quiz || mongoose.model<IQuiz>('Quiz', QuizSchema)
