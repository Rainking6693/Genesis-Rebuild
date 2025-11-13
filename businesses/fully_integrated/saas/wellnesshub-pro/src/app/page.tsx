import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'WellnessHub Pro',
  description: 'AI-powered employee wellness platform that combines mental health check-ins, personalized wellness content, and team community features to reduce burnout and increase productivity in small businesses. Automatically generates wellness reports and intervention recommendations for HR teams while creating peer support networks among employees.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">WellnessHub Pro</h1>
      <p className="mt-4 text-lg">AI-powered employee wellness platform that combines mental health check-ins, personalized wellness content, and team community features to reduce burnout and increase productivity in small businesses. Automatically generates wellness reports and intervention recommendations for HR teams while creating peer support networks among employees.</p>
    </main>
  )
}
