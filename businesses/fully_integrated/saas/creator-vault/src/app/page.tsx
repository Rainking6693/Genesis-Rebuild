import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Creator Vault',
  description: 'AI-powered subscription box curation platform that helps content creators monetize their expertise by automatically generating personalized physical product boxes for their audience. Combines creator economy monetization with subscription commerce, using AI to match creator content themes with relevant products from vetted suppliers.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">Creator Vault</h1>
      <p className="mt-4 text-lg">AI-powered subscription box curation platform that helps content creators monetize their expertise by automatically generating personalized physical product boxes for their audience. Combines creator economy monetization with subscription commerce, using AI to match creator content themes with relevant products from vetted suppliers.</p>
    </main>
  )
}
