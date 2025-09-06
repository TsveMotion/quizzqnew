// Simple in-memory persistence for quizzes
// In production, use a proper database

interface Quiz {
  _id: string
  title: string
  description: string
  questions: any[]
  subject: string
  gradeLevel: string
  createdBy: string
  createdAt: Date
  updatedAt: Date
  isPublic: boolean
  totalQuestions: number
  totalTime: number
  difficulty: string
  tags: string[]
  playCount: number
  averageScore: number
  thumbnail: string
}

class QuizStore {
  private static instance: QuizStore
  private quizzes: Map<string, Quiz> = new Map()

  private constructor() {}

  public static getInstance(): QuizStore {
    if (!QuizStore.instance) {
      QuizStore.instance = new QuizStore()
    }
    return QuizStore.instance
  }

  public addQuiz(quiz: Quiz): void {
    this.quizzes.set(quiz._id, quiz)
  }

  public getQuiz(id: string): Quiz | undefined {
    return this.quizzes.get(id)
  }

  public getAllQuizzes(): Quiz[] {
    return Array.from(this.quizzes.values())
  }

  public deleteQuiz(id: string): boolean {
    return this.quizzes.delete(id)
  }

  public updateQuiz(id: string, updates: Partial<Quiz>): Quiz | undefined {
    const quiz = this.quizzes.get(id)
    if (quiz) {
      const updatedQuiz = { ...quiz, ...updates, updatedAt: new Date() }
      this.quizzes.set(id, updatedQuiz)
      return updatedQuiz
    }
    return undefined
  }
}

export const quizStore = QuizStore.getInstance()
