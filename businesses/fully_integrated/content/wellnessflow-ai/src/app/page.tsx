import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'WellnessFlow AI',
  description: 'AI-powered no-code platform that automatically generates personalized wellness content calendars and compliance documentation for small businesses implementing employee wellness programs. Combines health & wellness trends with no-code automation to solve the complex problem of workplace wellness program management.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">WellnessFlow AI</h1>
      <p className="mt-4 text-lg">AI-powered no-code platform that automatically generates personalized wellness content calendars and compliance documentation for small businesses implementing employee wellness programs. Combines health & wellness trends with no-code automation to solve the complex problem of workplace wellness program management.</p>
    </main>
  )
}
