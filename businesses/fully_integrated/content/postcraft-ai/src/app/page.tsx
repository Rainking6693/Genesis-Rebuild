import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PostCraft AI',
  description: 'An AI-powered social media automation platform that creates, schedules, and optimizes content specifically for small businesses by analyzing their industry trends and competitor strategies. It combines no-code workflow builders with intelligent content generation to help businesses maintain consistent, engaging social presence without hiring agencies.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">PostCraft AI</h1>
      <p className="mt-4 text-lg">An AI-powered social media automation platform that creates, schedules, and optimizes content specifically for small businesses by analyzing their industry trends and competitor strategies. It combines no-code workflow builders with intelligent content generation to help businesses maintain consistent, engaging social presence without hiring agencies.</p>
    </main>
  )
}
