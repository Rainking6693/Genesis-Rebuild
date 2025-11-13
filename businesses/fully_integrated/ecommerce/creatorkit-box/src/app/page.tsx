import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CreatorKit Box',
  description: 'AI-curated monthly subscription boxes containing trending products from independent creators, paired with exclusive digital content and early access to launches. Each box targets specific niches (productivity, wellness, tech, etc.) and uses machine learning to personalize selections based on member preferences and creator performance data.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">CreatorKit Box</h1>
      <p className="mt-4 text-lg">AI-curated monthly subscription boxes containing trending products from independent creators, paired with exclusive digital content and early access to launches. Each box targets specific niches (productivity, wellness, tech, etc.) and uses machine learning to personalize selections based on member preferences and creator performance data.</p>
    </main>
  )
}
