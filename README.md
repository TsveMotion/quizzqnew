# QuizzQ - Interactive Quiz Platform

A Blooket-style interactive quiz platform built with Next.js, featuring real-time multiplayer gameplay, beautiful UI, and comprehensive teacher/student interfaces.

## Features

- 🎯 **Interactive Quizzes** - Create engaging multiple-choice quizzes with real-time feedback
- 🏆 **Live Leaderboards** - Real-time score updates and rankings
- 👥 **Multiplayer Games** - Join quiz rooms with game codes
- 📊 **Teacher Dashboard** - Create, manage, and host quizzes
- 🎨 **Modern UI** - Beautiful, responsive design with dark mode support
- ⚡ **Real-time Updates** - Instant synchronization with Socket.io
- 🔐 **Authentication** - Secure login with Google and GitHub OAuth

## Tech Stack

- **Frontend**: Next.js 13 (App Router), React, TypeScript
- **Styling**: TailwindCSS, Framer Motion
- **Authentication**: NextAuth.js
- **Database**: MongoDB
- **Real-time**: Socket.io
- **Deployment**: Vercel (Next.js) + Railway/Render (Socket.io)

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- MongoDB database (MongoDB Atlas recommended)
- Google OAuth credentials (optional)
- GitHub OAuth credentials (optional)

### Installation

1. Clone the repository or copy the project files

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file based on `.env.local.example`:
```bash
cp .env.local.example .env.local
```

4. Configure environment variables in `.env.local`:
```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-generate-with-openssl

# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/quizzq?retryWrites=true&w=majority

# OAuth Providers (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Socket.io Server URL (for production)
NEXT_PUBLIC_SOCKET_URL=https://your-socket-server.railway.app
```

### Running Locally

1. Start the Next.js development server:
```bash
npm run dev
```

2. In a separate terminal, start the Socket.io server:
```bash
cd server
npm install express socket.io cors
node socket.js
```

3. Open [http://localhost:3000](http://localhost:3000)

## Deployment

### Deploy to Vercel (Next.js App)

1. Push your code to GitHub

2. Import project to Vercel:
```bash
npm install -g vercel
vercel
```

3. Configure environment variables in Vercel dashboard:
   - Go to Project Settings → Environment Variables
   - Add all variables from `.env.local`
   - Update `NEXTAUTH_URL` to your Vercel domain

### Deploy Socket.io Server

#### Option 1: Railway

1. Create account at [railway.app](https://railway.app)

2. Create new project and add the Socket.io server code

3. Set environment variables:
   - `CLIENT_URL`: Your Vercel app URL
   - `PORT`: 3001 (or leave empty for auto)

4. Deploy and get the server URL

5. Update `NEXT_PUBLIC_SOCKET_URL` in Vercel

#### Option 2: Render

1. Create account at [render.com](https://render.com)

2. Create new Web Service

3. Connect GitHub repo or upload server files

4. Configure:
   - Build Command: `npm install`
   - Start Command: `node server/socket.js`

5. Add environment variables and deploy

### MongoDB Setup (MongoDB Atlas)

1. Create account at [mongodb.com](https://www.mongodb.com/cloud/atlas)

2. Create new cluster (free tier available)

3. Configure:
   - Create database user
   - Whitelist IP addresses (0.0.0.0/0 for any)
   - Get connection string

4. Replace `MONGODB_URI` with your connection string

## Usage

### For Teachers

1. Sign up with Google/GitHub
2. Create quizzes from the dashboard
3. Start a game and share the game code
4. Monitor players joining and control the game flow
5. View real-time results and leaderboards

### For Students

1. Go to "Join Quiz" page
2. Enter the game code from teacher
3. Enter your name
4. Answer questions as they appear
5. View your score and ranking

## Project Structure

```
quizzq/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Teacher dashboard
│   ├── host/              # Game host interface
│   ├── join/              # Join game page
│   ├── play/              # Student game interface
│   └── quiz/              # Quiz creation/editing
├── components/            # React components
├── lib/                   # Utility functions
├── models/                # Database models
├── server/                # Socket.io server
├── public/                # Static assets
└── styles/                # Global styles
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXTAUTH_URL` | Your app URL | Yes |
| `NEXTAUTH_SECRET` | Random secret for JWT | Yes |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | No |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret | No |
| `GITHUB_CLIENT_ID` | GitHub OAuth client ID | No |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth secret | No |
| `NEXT_PUBLIC_SOCKET_URL` | Socket.io server URL | Yes (production) |

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Troubleshooting

### MongoDB Connection Issues
- Ensure IP whitelist includes your IP or 0.0.0.0/0
- Check username/password in connection string
- Verify database name in URI

### OAuth Not Working
- Check redirect URIs in provider settings
- Ensure environment variables are set correctly
- For production, update callback URLs

### Socket.io Connection Failed
- Verify `NEXT_PUBLIC_SOCKET_URL` is correct
- Check CORS settings in Socket.io server
- Ensure Socket.io server is running

## License

MIT

## Support

For issues or questions, please create an issue in the repository.

---

Built with ❤️ using Next.js and TailwindCSS
