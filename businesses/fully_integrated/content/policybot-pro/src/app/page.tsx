import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PolicyBot Pro',
  description: 'AI-powered platform that generates customized business policies, employee handbooks, and compliance documents for small businesses in minutes. Combines legal expertise with no-code document automation to eliminate expensive lawyer consultations for routine policy creation.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">PolicyBot Pro</h1>
      <p className="mt-4 text-lg">AI-powered platform that generates customized business policies, employee handbooks, and compliance documents for small businesses in minutes. Combines legal expertise with no-code document automation to eliminate expensive lawyer consultations for routine policy creation.</p>
    </main>
  )
}
