import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Carbon Credits',
  description: 'AI-powered platform that automatically generates personalized carbon offset content and marketing materials for small e-commerce businesses to showcase their sustainability efforts. Combines climate tech with creator economy tools to help businesses build authentic green brands through automated storytelling and customer engagement.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">Carbon Credits</h1>
      <p className="mt-4 text-lg">AI-powered platform that automatically generates personalized carbon offset content and marketing materials for small e-commerce businesses to showcase their sustainability efforts. Combines climate tech with creator economy tools to help businesses build authentic green brands through automated storytelling and customer engagement.</p>
    </main>
  )
}
