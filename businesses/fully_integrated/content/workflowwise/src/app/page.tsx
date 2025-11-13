import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'WorkflowWise',
  description: 'AI-powered platform that creates personalized workflow automation blueprints and templates for small businesses, combining interactive tutorials with ready-to-deploy no-code solutions. Users get step-by-step video guides, template libraries, and custom automation recommendations based on their industry and team size.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">WorkflowWise</h1>
      <p className="mt-4 text-lg">AI-powered platform that creates personalized workflow automation blueprints and templates for small businesses, combining interactive tutorials with ready-to-deploy no-code solutions. Users get step-by-step video guides, template libraries, and custom automation recommendations based on their industry and team size.</p>
    </main>
  )
}
