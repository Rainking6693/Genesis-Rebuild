// src/components/SeoOptimization.tsx
import React, { useEffect } from 'react';
import Head from 'next/head'; // Assuming Next.js for Head component
import { Article } from 'schema-dts'; // For schema.org types

interface SeoOptimizationProps {
  title: string;
  description: string;
  keywords: string[];
  imageUrl: string;
  articleBody?: string; // Optional for article schema
  canonicalUrl: string;
}

const SeoOptimization: React.FC<SeoOptimizationProps> = ({
  title,
  description,
  keywords,
  imageUrl,
  articleBody,
  canonicalUrl
}) => {

  // Generate Schema.org JSON-LD for Article (if articleBody is provided)
  const generateArticleSchema = (): Article | null => {
    if (!articleBody) {
      return null;
    }

    const articleSchema: Article = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: title,
      description: description,
      image: imageUrl,
      author: {
        '@type': 'Organization', // Or Person
        name: 'Your Organization Name' // Replace with your organization or author name
      },
      datePublished: new Date().toISOString(), // Replace with actual publication date
      articleBody: articleBody,
      mainEntityOfPage: canonicalUrl
    };

    return articleSchema;
  };

  const articleSchema = generateArticleSchema();

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />

      {/* Open Graph tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="article" />

      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Schema.org JSON-LD */}
      {articleSchema && (
        <script type="application/ld+json">
          {JSON.stringify(articleSchema)}
        </script>
      )}
    </Head>
  );
};

export default SeoOptimization;