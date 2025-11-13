import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'StoryChain AI',
  description: 'AI-powered content authenticity platform that helps small businesses create and verify original marketing content while building blockchain-verified proof of ownership. Combines AI content generation with Web3 authenticity verification to solve the growing problem of content plagiarism and brand trust in digital marketing.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">StoryChain AI</h1>
      <p className="mt-4 text-lg">AI-powered content authenticity platform that helps small businesses create and verify original marketing content while building blockchain-verified proof of ownership. Combines AI content generation with Web3 authenticity verification to solve the growing problem of content plagiarism and brand trust in digital marketing.</p>
    </main>
  )
}
