import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Creator Sustain',
  description: 'AI-powered platform that helps content creators instantly find and sell sustainable product alternatives to items they feature, earning commissions while promoting eco-friendly choices. Combines affiliate marketing with sustainability data to create a guilt-free shopping experience for audiences who trust their favorite creators.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">Creator Sustain</h1>
      <p className="mt-4 text-lg">AI-powered platform that helps content creators instantly find and sell sustainable product alternatives to items they feature, earning commissions while promoting eco-friendly choices. Combines affiliate marketing with sustainability data to create a guilt-free shopping experience for audiences who trust their favorite creators.</p>
    </main>
  )
}
