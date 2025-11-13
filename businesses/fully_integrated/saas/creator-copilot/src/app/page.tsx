import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Creator Copilot',
  description: 'AI-powered automation platform that transforms content creators into efficient businesses by automatically handling client communications, proposal generation, and project management. It uses AI to analyze creator portfolios and automatically match them with relevant brand collaboration opportunities while managing the entire workflow.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">Creator Copilot</h1>
      <p className="mt-4 text-lg">AI-powered automation platform that transforms content creators into efficient businesses by automatically handling client communications, proposal generation, and project management. It uses AI to analyze creator portfolios and automatically match them with relevant brand collaboration opportunities while managing the entire workflow.</p>
    </main>
  )
}
