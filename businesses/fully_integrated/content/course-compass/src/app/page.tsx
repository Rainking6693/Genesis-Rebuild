import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Course Compass',
  description: 'AI-powered course creation platform that transforms professional expertise into interactive, monetized learning experiences within minutes. Combines no-code course building with automated student engagement and community features to help experts scale their knowledge into recurring revenue streams.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">Course Compass</h1>
      <p className="mt-4 text-lg">AI-powered course creation platform that transforms professional expertise into interactive, monetized learning experiences within minutes. Combines no-code course building with automated student engagement and community features to help experts scale their knowledge into recurring revenue streams.</p>
    </main>
  )
}
