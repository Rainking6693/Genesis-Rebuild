// src/components/SeoOptimization.tsx

import React, { useEffect } from 'react';
import Head from 'next/head'; // Assuming Next.js for Head management

interface SeoProps {
  title: string;
  description: string;
  keywords?: string[];
  imageUrl?: string;
  canonicalUrl?: string;
  article?: {
    publishedTime: string;
    modifiedTime: string;
    author: string;
  };
}

const SeoOptimization: React.FC<SeoProps> = ({
  title,
  description,
  keywords,
  imageUrl,
  canonicalUrl,
  article,
}) => {
  useEffect(() => {
    // Log SEO data for debugging (remove in production)
    console.log('SEO Data:', { title, description, keywords, imageUrl, canonicalUrl, article });
  }, [title, description, keywords, imageUrl, canonicalUrl, article]);

  const generateSchemaMarkup = () => {
    try {
      if (article) {
        const schema = {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: title,
          description: description,
          image: imageUrl,
          datePublished: article.publishedTime,
          dateModified: article.modifiedTime,
          author: {
            '@type': 'Person',
            name: article.author,
          },
        };
        return (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        );
      }
      return null;
    } catch (error) {
      console.error('Error generating schema markup:', error);
      return null; // Or a default schema if appropriate
    }
  };

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords.join(', ')} />}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Open Graph / Facebook */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {imageUrl && <meta property="og:image" content={imageUrl} />}
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="website" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {imageUrl && <meta name="twitter:image" content={imageUrl} />}

      {/* Schema.org markup */}
      {generateSchemaMarkup()}
    </Head>
  );
};

export default SeoOptimization;

// src/components/SeoOptimization.tsx

import React, { useEffect } from 'react';
import Head from 'next/head'; // Assuming Next.js for Head management

interface SeoProps {
  title: string;
  description: string;
  keywords?: string[];
  imageUrl?: string;
  canonicalUrl?: string;
  article?: {
    publishedTime: string;
    modifiedTime: string;
    author: string;
  };
}

const SeoOptimization: React.FC<SeoProps> = ({
  title,
  description,
  keywords,
  imageUrl,
  canonicalUrl,
  article,
}) => {
  useEffect(() => {
    // Log SEO data for debugging (remove in production)
    console.log('SEO Data:', { title, description, keywords, imageUrl, canonicalUrl, article });
  }, [title, description, keywords, imageUrl, canonicalUrl, article]);

  const generateSchemaMarkup = () => {
    try {
      if (article) {
        const schema = {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: title,
          description: description,
          image: imageUrl,
          datePublished: article.publishedTime,
          dateModified: article.modifiedTime,
          author: {
            '@type': 'Person',
            name: article.author,
          },
        };
        return (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        );
      }
      return null;
    } catch (error) {
      console.error('Error generating schema markup:', error);
      return null; // Or a default schema if appropriate
    }
  };

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords.join(', ')} />}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Open Graph / Facebook */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {imageUrl && <meta property="og:image" content={imageUrl} />}
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="website" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {imageUrl && <meta name="twitter:image" content={imageUrl} />}

      {/* Schema.org markup */}
      {generateSchemaMarkup()}
    </Head>
  );
};

export default SeoOptimization;