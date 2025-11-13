import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Community Pulse',
  description: 'AI-powered community analytics platform that automatically generates weekly engagement reports and content recommendations for Discord/Slack community managers. Combines community data with no-code automation to help small business communities increase member retention by 40%.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">Community Pulse</h1>
      <p className="mt-4 text-lg">AI-powered community analytics platform that automatically generates weekly engagement reports and content recommendations for Discord/Slack community managers. Combines community data with no-code automation to help small business communities increase member retention by 40%.</p>
    </main>
  )
}
