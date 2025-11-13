import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MindShift Analytics',
  description: 'AI-powered employee mental health prediction platform that analyzes workplace communication patterns to identify burnout risks before they happen. Combines anonymous sentiment analysis with personalized wellness recommendations to boost productivity while reducing turnover costs.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">MindShift Analytics</h1>
      <p className="mt-4 text-lg">AI-powered employee mental health prediction platform that analyzes workplace communication patterns to identify burnout risks before they happen. Combines anonymous sentiment analysis with personalized wellness recommendations to boost productivity while reducing turnover costs.</p>
    </main>
  )
}
