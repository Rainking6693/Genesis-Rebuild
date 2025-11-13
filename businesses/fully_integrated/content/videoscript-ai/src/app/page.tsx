import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'VideoScript AI',
  description: 'AI-powered platform that transforms blog posts, product descriptions, and social media content into professional video scripts optimized for different platforms (TikTok, YouTube Shorts, Instagram Reels). Includes AI voiceover generation, scene suggestions, and automated posting schedules to help businesses scale their video content without hiring expensive creators.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">VideoScript AI</h1>
      <p className="mt-4 text-lg">AI-powered platform that transforms blog posts, product descriptions, and social media content into professional video scripts optimized for different platforms (TikTok, YouTube Shorts, Instagram Reels). Includes AI voiceover generation, scene suggestions, and automated posting schedules to help businesses scale their video content without hiring expensive creators.</p>
    </main>
  )
}
