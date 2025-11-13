import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'WellnessStack',
  description: 'AI-powered wellness content automation platform that helps small businesses create, schedule, and personalize employee wellness programs without HR expertise. Combines health & wellness trends with no-code automation to solve the employee retention crisis through automated wellness engagement.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">WellnessStack</h1>
      <p className="mt-4 text-lg">AI-powered wellness content automation platform that helps small businesses create, schedule, and personalize employee wellness programs without HR expertise. Combines health & wellness trends with no-code automation to solve the employee retention crisis through automated wellness engagement.</p>
    </main>
  )
}
