import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'GreenTeam Hub',
  description: 'AI-powered platform that helps small businesses track, gamify, and monetize their team's sustainability efforts while building authentic green marketing content. Transform employee eco-actions into verified carbon credits, social media content, and customer trust through automated tracking and community challenges.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">GreenTeam Hub</h1>
      <p className="mt-4 text-lg">AI-powered platform that helps small businesses track, gamify, and monetize their team's sustainability efforts while building authentic green marketing content. Transform employee eco-actions into verified carbon credits, social media content, and customer trust through automated tracking and community challenges.</p>
    </main>
  )
}
