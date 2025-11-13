import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SkillSwap Studio',
  description: 'AI-powered marketplace where professionals create micro-learning courses by teaching skills they need to learn, earning credits to access courses from others. Revolutionary bartering system for professional development that reduces cost barriers while building engaged learning communities.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">SkillSwap Studio</h1>
      <p className="mt-4 text-lg">AI-powered marketplace where professionals create micro-learning courses by teaching skills they need to learn, earning credits to access courses from others. Revolutionary bartering system for professional development that reduces cost barriers while building engaged learning communities.</p>
    </main>
  )
}
