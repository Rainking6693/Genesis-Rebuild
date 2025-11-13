// src/components/SeoOptimizer.tsx
import React, { useEffect } from 'react';
import Head from 'next/head'; // Assuming Next.js for easy meta tag management
import { useRouter } from 'next/router';

interface SeoOptimizerProps {
  title: string;
  description: string;
  keywords: string[];
  imageUrl?: string;
  articleSchema?: any; // Optional: JSON-LD schema for articles
}

const SeoOptimizer: React.FC<SeoOptimizerProps> = ({
  title,
  description,
  keywords,
  imageUrl,
  articleSchema,
}) => {
  const router = useRouter();
  const currentUrl = `https://yourdomain.com${router.asPath}`; // Replace with your actual domain

  useEffect(() => {
    // Basic keyword analysis (can be expanded with NLP libraries)
    const keywordString = keywords.join(', ');
    console.log(`SEO Optimizer: Keywords used - ${keywordString}`);

    // Log current URL for debugging
    console.log(`SEO Optimizer: Current URL - ${currentUrl}`);
  }, [keywords, currentUrl]);

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {imageUrl && <meta property="og:image" content={imageUrl} />}

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={currentUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      {imageUrl && <meta property="twitter:image" content={imageUrl} />}

      {/* Canonical URL */}
      <link rel="canonical" href={currentUrl} />

      {/* Schema.org JSON-LD (Article) */}
      {articleSchema && (
        <script type="application/ld+json">
          {JSON.stringify(articleSchema)}
        </script>
      )}
    </Head>
  );
};

export default SeoOptimizer;

// Example usage (in a page or component):
// <SeoOptimizer
//   title="My Awesome Article"
//   description="A detailed description of my awesome article."
//   keywords={['awesome', 'article', 'seo']}
//   imageUrl="https://yourdomain.com/images/awesome-article.jpg"
//   articleSchema={{
//     "@context": "https://schema.org",
//     "@type": "Article",
//     "headline": "My Awesome Article",
//     "description": "A detailed description of my awesome article.",
//     "image": "https://yourdomain.com/images/awesome-article.jpg",
//     "author": {
//       "@type": "Person",
//       "name": "John Doe"
//     },
//     "datePublished": "2023-11-07"
//   }}
// />

// Error Handling Considerations:
// 1.  Type checking with TypeScript ensures props are of the correct type.
// 2.  The imageUrl is optional, preventing errors if an image is not provided.
// 3.  The articleSchema is optional, allowing for flexibility in content types.
// 4.  The component uses Next.js's Head component, which handles meta tag injection safely.
// 5.  The useEffect hook logs keyword usage and the current URL for debugging purposes.
// 6.  Consider adding more robust error handling for the articleSchema JSON-LD to ensure it is valid.  A try-catch block around the JSON.stringify() call would be beneficial.

// src/components/SeoOptimizer.tsx
import React, { useEffect } from 'react';
import Head from 'next/head'; // Assuming Next.js for easy meta tag management
import { useRouter } from 'next/router';

interface SeoOptimizerProps {
  title: string;
  description: string;
  keywords: string[];
  imageUrl?: string;
  articleSchema?: any; // Optional: JSON-LD schema for articles
}

const SeoOptimizer: React.FC<SeoOptimizerProps> = ({
  title,
  description,
  keywords,
  imageUrl,
  articleSchema,
}) => {
  const router = useRouter();
  const currentUrl = `https://yourdomain.com${router.asPath}`; // Replace with your actual domain

  useEffect(() => {
    // Basic keyword analysis (can be expanded with NLP libraries)
    const keywordString = keywords.join(', ');
    console.log(`SEO Optimizer: Keywords used - ${keywordString}`);

    // Log current URL for debugging
    console.log(`SEO Optimizer: Current URL - ${currentUrl}`);
  }, [keywords, currentUrl]);

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {imageUrl && <meta property="og:image" content={imageUrl} />}

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={currentUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      {imageUrl && <meta property="twitter:image" content={imageUrl} />}

      {/* Canonical URL */}
      <link rel="canonical" href={currentUrl} />

      {/* Schema.org JSON-LD (Article) */}
      {articleSchema && (
        <script type="application/ld+json">
          {JSON.stringify(articleSchema)}
        </script>
      )}
    </Head>
  );
};

export default SeoOptimizer;

// Example usage (in a page or component):
// <SeoOptimizer
//   title="My Awesome Article"
//   description="A detailed description of my awesome article."
//   keywords={['awesome', 'article', 'seo']}
//   imageUrl="https://yourdomain.com/images/awesome-article.jpg"
//   articleSchema={{
//     "@context": "https://schema.org",
//     "@type": "Article",
//     "headline": "My Awesome Article",
//     "description": "A detailed description of my awesome article.",
//     "image": "https://yourdomain.com/images/awesome-article.jpg",
//     "author": {
//       "@type": "Person",
//       "name": "John Doe"
//     },
//     "datePublished": "2023-11-07"
//   }}
// />

// Error Handling Considerations:
// 1.  Type checking with TypeScript ensures props are of the correct type.
// 2.  The imageUrl is optional, preventing errors if an image is not provided.
// 3.  The articleSchema is optional, allowing for flexibility in content types.
// 4.  The component uses Next.js's Head component, which handles meta tag injection safely.
// 5.  The useEffect hook logs keyword usage and the current URL for debugging purposes.
// 6.  Consider adding more robust error handling for the articleSchema JSON-LD to ensure it is valid.  A try-catch block around the JSON.stringify() call would be beneficial.