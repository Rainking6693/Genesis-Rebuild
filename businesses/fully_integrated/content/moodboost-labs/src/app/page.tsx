import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MoodBoost Labs',
  description: 'AI-powered micro-learning platform that delivers personalized 60-second mental wellness content to employees based on their real-time mood and productivity patterns. Combines bite-sized expert content with mood tracking automation to reduce workplace burnout and increase team performance.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">MoodBoost Labs</h1>
      <p className="mt-4 text-lg">AI-powered micro-learning platform that delivers personalized 60-second mental wellness content to employees based on their real-time mood and productivity patterns. Combines bite-sized expert content with mood tracking automation to reduce workplace burnout and increase team performance.</p>
    </main>
  )
}
