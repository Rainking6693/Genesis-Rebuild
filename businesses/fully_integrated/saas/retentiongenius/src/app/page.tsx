import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'RetentionGenius',
  description: 'AI-powered customer retention automation platform that predicts churn risk and automatically deploys personalized re-engagement campaigns across email, SMS, and social channels. Combines behavioral analytics with GPT-powered content generation to create hyper-personalized retention sequences that adapt in real-time based on customer responses.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">RetentionGenius</h1>
      <p className="mt-4 text-lg">AI-powered customer retention automation platform that predicts churn risk and automatically deploys personalized re-engagement campaigns across email, SMS, and social channels. Combines behavioral analytics with GPT-powered content generation to create hyper-personalized retention sequences that adapt in real-time based on customer responses.</p>
    </main>
  )
}
