// src/components/SeoOptimization.tsx
import React, { useEffect } from 'react';
import Head from 'next/head'; // Assuming Next.js for Head component
import { useRouter } from 'next/router'; // Assuming Next.js for router

interface SeoOptimizationProps {
  title: string;
  description: string;
  keywords: string[];
  imageUrl?: string;
  articleBody?: string; // For article schema
}

const SeoOptimization: React.FC<SeoOptimizationProps> = ({
  title,
  description,
  keywords,
  imageUrl,
  articleBody,
}) => {
  const router = useRouter();
  const canonicalUrl = `https://yourdomain.com${router.asPath}`; // Replace with your domain

  // Function to generate JSON-LD schema markup for articles
  const generateArticleSchema = () => {
    if (!articleBody) return null;

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: title,
      description: description,
      image: imageUrl,
      author: {
        '@type': 'Organization', // Or Person
        name: 'Your Organization', // Replace with your organization name
      },
      datePublished: new Date().toISOString(), // Replace with actual publication date
      dateModified: new Date().toISOString(), // Replace with actual modification date
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': canonicalUrl,
      },
      publisher: {
        '@type': 'Organization',
        name: 'Your Organization', // Replace with your organization name
        logo: {
          '@type': 'ImageObject',
          url: 'https://yourdomain.com/logo.png', // Replace with your logo URL
        },
      },
      articleBody: articleBody,
    };

    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    );
  };

  useEffect(() => {
    try {
      // Log SEO information for debugging
      console.log('SEO Optimization Component Mounted');
      console.log('Title:', title);
      console.log('Description:', description);
      console.log('Keywords:', keywords);
      console.log('Canonical URL:', canonicalUrl);
    } catch (error) {
      console.error('Error in SEO Optimization Component:', error);
    }
  }, [title, description, keywords, canonicalUrl]);

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {imageUrl && <meta property="og:image" content={imageUrl} />}

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonicalUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      {imageUrl && <meta property="twitter:image" content={imageUrl} />}

      {/* JSON-LD Schema Markup */}
      {generateArticleSchema()}
    </Head>
  );
};

export default SeoOptimization;

// src/components/SeoOptimization.tsx
import React, { useEffect } from 'react';
import Head from 'next/head'; // Assuming Next.js for Head component
import { useRouter } from 'next/router'; // Assuming Next.js for router

interface SeoOptimizationProps {
  title: string;
  description: string;
  keywords: string[];
  imageUrl?: string;
  articleBody?: string; // For article schema
}

const SeoOptimization: React.FC<SeoOptimizationProps> = ({
  title,
  description,
  keywords,
  imageUrl,
  articleBody,
}) => {
  const router = useRouter();
  const canonicalUrl = `https://yourdomain.com${router.asPath}`; // Replace with your domain

  // Function to generate JSON-LD schema markup for articles
  const generateArticleSchema = () => {
    if (!articleBody) return null;

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: title,
      description: description,
      image: imageUrl,
      author: {
        '@type': 'Organization', // Or Person
        name: 'Your Organization', // Replace with your organization name
      },
      datePublished: new Date().toISOString(), // Replace with actual publication date
      dateModified: new Date().toISOString(), // Replace with actual modification date
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': canonicalUrl,
      },
      publisher: {
        '@type': 'Organization',
        name: 'Your Organization', // Replace with your organization name
        logo: {
          '@type': 'ImageObject',
          url: 'https://yourdomain.com/logo.png', // Replace with your logo URL
        },
      },
      articleBody: articleBody,
    };

    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    );
  };

  useEffect(() => {
    try {
      // Log SEO information for debugging
      console.log('SEO Optimization Component Mounted');
      console.log('Title:', title);
      console.log('Description:', description);
      console.log('Keywords:', keywords);
      console.log('Canonical URL:', canonicalUrl);
    } catch (error) {
      console.error('Error in SEO Optimization Component:', error);
    }
  }, [title, description, keywords, canonicalUrl]);

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {imageUrl && <meta property="og:image" content={imageUrl} />}

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonicalUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      {imageUrl && <meta property="twitter:image" content={imageUrl} />}

      {/* JSON-LD Schema Markup */}
      {generateArticleSchema()}
    </Head>
  );
};

export default SeoOptimization;