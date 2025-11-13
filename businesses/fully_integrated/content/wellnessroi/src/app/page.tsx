import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'WellnessROI',
  description: 'AI-powered wellness program ROI calculator that helps small businesses measure and optimize their employee wellness investments with personalized recommendations. Combines health analytics with financial insights to prove wellness program value through reduced healthcare costs, improved productivity, and lower turnover rates.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">WellnessROI</h1>
      <p className="mt-4 text-lg">AI-powered wellness program ROI calculator that helps small businesses measure and optimize their employee wellness investments with personalized recommendations. Combines health analytics with financial insights to prove wellness program value through reduced healthcare costs, improved productivity, and lower turnover rates.</p>
    </main>
  )
}
