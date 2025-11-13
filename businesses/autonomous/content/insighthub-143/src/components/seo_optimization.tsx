import React from 'react';
import Head from 'next/head'; // Assuming Next.js for Head management

interface SeoOptimizerProps {
  title: string;
  description: string;
  keywords: string;
  imageUrl?: string; // Optional image URL for social sharing
}

const SeoOptimizer: React.FC<SeoOptimizerProps> = ({ title, description, keywords, imageUrl }) => {
  try {
    const keywordList = keywords.split(',').map(k => k.trim());

    return (
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywordList.join(', ')} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : ''} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        {imageUrl && <meta property="og:image" content={imageUrl} />}

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={typeof window !== 'undefined' ? window.location.href : ''} />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
        {imageUrl && <meta property="twitter:image" content={imageUrl} />}
      </Head>
    );
  } catch (error) {
    console.error("Error generating SEO meta tags:", error);
    // Consider a more robust error boundary here for production
    return null; // Or a fallback component
  }
};

export default SeoOptimizer;

{
  "build_report": {
    "status": "success",
    "errors": [],
    "warnings": [],
    "language": "TypeScript React",
    "lines": 50
  },
  "generated_code": {
    "code_file": "src/components/SeoOptimizer.tsx",
    "language": "TypeScript",
    "error_handling": "try-catch block with console.error and fallback return"
  }
}