import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FlowMap AI',
  description: 'AI-powered workflow automation builder that helps small businesses create custom automation sequences using plain English commands, eliminating the need for technical expertise. Combines no-code simplicity with community-driven templates and sustainable business practice tracking.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">FlowMap AI</h1>
      <p className="mt-4 text-lg">AI-powered workflow automation builder that helps small businesses create custom automation sequences using plain English commands, eliminating the need for technical expertise. Combines no-code simplicity with community-driven templates and sustainable business practice tracking.</p>
    </main>
  )
}
