import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import CredentialsProvider from 'next-auth/providers/credentials'

// Simplified auth for development without MongoDB
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Demo Login',
      credentials: {
        email: { label: "Email", type: "email", placeholder: "demo@quizzq.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Demo users for testing
        const demoUsers = [
          { id: '1', name: 'Demo Teacher', email: 'teacher@quizzq.com', role: 'teacher' },
          { id: '2', name: 'Demo Student', email: 'student@quizzq.com', role: 'student' },
          { id: '3', name: 'Admin User', email: 'admin@quizzq.com', role: 'admin' }
        ]
        
        const user = demoUsers.find(u => u.email === credentials?.email)
        if (user && credentials?.password === 'demo123') {
          return user
        }
        return null
      }
    }),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      })
    ] : []),
    ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET ? [
      GitHubProvider({
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
      })
    ] : []),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session?.user) {
        (session.user as any).id = token.sub || '1';
        (session.user as any).role = (token as any).role || 'student'
      }
      return session
    },
    async jwt({ user, token }) {
      if (user) {
        token.role = (user as any).role || 'student'
      }
      return token
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET || 'development-secret-key-replace-in-production',
}
