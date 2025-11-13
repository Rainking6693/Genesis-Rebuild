import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Creator Vault',
  description: 'AI-powered digital asset marketplace where content creators sell premium templates, presets, and digital tools with automated licensing and usage tracking. Combines creator economy monetization with AI-driven personalization to match buyers with exactly the digital assets they need for their projects.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">Creator Vault</h1>
      <p className="mt-4 text-lg">AI-powered digital asset marketplace where content creators sell premium templates, presets, and digital tools with automated licensing and usage tracking. Combines creator economy monetization with AI-driven personalization to match buyers with exactly the digital assets they need for their projects.</p>
    </main>
  )
}
