import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ShiftSync Pro',
  description: 'AI-powered micro-SaaS that automatically generates optimized work schedules for small businesses while integrating real-time availability tracking and instant shift-swap automation. Eliminates the endless back-and-forth of manual scheduling and reduces no-shows by 80% through smart predictive algorithms.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">ShiftSync Pro</h1>
      <p className="mt-4 text-lg">AI-powered micro-SaaS that automatically generates optimized work schedules for small businesses while integrating real-time availability tracking and instant shift-swap automation. Eliminates the endless back-and-forth of manual scheduling and reduces no-shows by 80% through smart predictive algorithms.</p>
    </main>
  )
}
