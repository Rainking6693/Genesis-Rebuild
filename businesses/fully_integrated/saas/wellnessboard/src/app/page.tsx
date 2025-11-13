import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'WellnessBoard',
  description: 'AI-powered employee wellness dashboard that gamifies team health goals while providing HR analytics and automated wellness program management. Combines workplace wellness tracking with community challenges and financial incentives to boost employee engagement and reduce healthcare costs.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">WellnessBoard</h1>
      <p className="mt-4 text-lg">AI-powered employee wellness dashboard that gamifies team health goals while providing HR analytics and automated wellness program management. Combines workplace wellness tracking with community challenges and financial incentives to boost employee engagement and reduce healthcare costs.</p>
    </main>
  )
}
