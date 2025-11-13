import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EcoSkill Hub',
  description: 'An AI-powered learning platform that teaches professionals climate-tech skills through bite-sized, interactive modules while automatically matching them with green job opportunities and sustainability projects. Think LinkedIn Learning meets climate action, with smart career pathways that turn environmental passion into profitable expertise.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">EcoSkill Hub</h1>
      <p className="mt-4 text-lg">An AI-powered learning platform that teaches professionals climate-tech skills through bite-sized, interactive modules while automatically matching them with green job opportunities and sustainability projects. Think LinkedIn Learning meets climate action, with smart career pathways that turn environmental passion into profitable expertise.</p>
    </main>
  )
}
