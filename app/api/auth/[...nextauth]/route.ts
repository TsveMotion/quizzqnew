import NextAuth from 'next-auth'
// Use simplified auth for development - switch to '@/lib/auth' for production with MongoDB
import { authOptions } from '@/lib/auth-dev'

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
