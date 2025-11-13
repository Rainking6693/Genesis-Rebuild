import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EcoLaunch Academy',
  description: 'AI-powered learning platform that teaches small business owners how to implement profitable climate-tech solutions through interactive case studies and no-code automation tools. Combines sustainability education with actionable business growth strategies, featuring real ROI calculators and implementation roadmaps.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">EcoLaunch Academy</h1>
      <p className="mt-4 text-lg">AI-powered learning platform that teaches small business owners how to implement profitable climate-tech solutions through interactive case studies and no-code automation tools. Combines sustainability education with actionable business growth strategies, featuring real ROI calculators and implementation roadmaps.</p>
    </main>
  )
}
