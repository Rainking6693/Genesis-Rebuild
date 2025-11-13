// src/components/SeoOptimization.tsx
import React, { useState, useEffect } from 'react';
import Head from 'next/head'; // Assuming Next.js for Head component
import { useRouter } from 'next/router'; // Assuming Next.js for router

interface SeoProps {
  title: string;
  description: string;
  keywords: string[];
  imageUrl?: string;
  article?: boolean;
}

const SeoOptimization: React.FC<SeoProps> = ({
  title,
  description,
  keywords,
  imageUrl,
  article = false,
}) => {
  const router = useRouter();
  const currentUrl = `https://yourdomain.com${router.asPath}`; // Replace with your domain

  const [schemaMarkup, setSchemaMarkup] = useState<string>('');

  useEffect(() => {
    try {
      // Generate Schema Markup
      const generateSchemaMarkup = () => {
        const schema = {
          '@context': 'https://schema.org',
          '@type': article ? 'Article' : 'WebPage',
          headline: title,
          description: description,
          image: imageUrl || 'https://yourdomain.com/default-image.jpg', // Replace with your default image
          author: {
            '@type': 'Organization', // Or Person
            name: 'Your Organization', // Replace with your organization name
          },
          datePublished: new Date().toISOString(), // Replace with actual date if available
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': currentUrl,
          },
        };

        return JSON.stringify(schema);
      };

      setSchemaMarkup(generateSchemaMarkup());
    } catch (error: any) {
      console.error('Error generating schema markup:', error);
      // Consider a more robust error reporting mechanism here
    }
  }, [title, description, imageUrl, article, currentUrl]);

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />

      {/* Open Graph Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content={imageUrl || 'https://yourdomain.com/default-image.jpg'} /> {/* Replace with your default image */}
      <meta property="og:type" content={article ? 'article' : 'website'} />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl || 'https://yourdomain.com/default-image.jpg'} /> {/* Replace with your default image */}

      {/* Schema Markup */}
      {schemaMarkup && (
        <script type="application/ld+json">
          {schemaMarkup}
        </script>
      )}
    </Head>
  );
};

export default SeoOptimization;

// src/components/SeoOptimization.tsx
import React, { useState, useEffect } from 'react';
import Head from 'next/head'; // Assuming Next.js for Head component
import { useRouter } from 'next/router'; // Assuming Next.js for router

interface SeoProps {
  title: string;
  description: string;
  keywords: string[];
  imageUrl?: string;
  article?: boolean;
}

const SeoOptimization: React.FC<SeoProps> = ({
  title,
  description,
  keywords,
  imageUrl,
  article = false,
}) => {
  const router = useRouter();
  const currentUrl = `https://yourdomain.com${router.asPath}`; // Replace with your domain

  const [schemaMarkup, setSchemaMarkup] = useState<string>('');

  useEffect(() => {
    try {
      // Generate Schema Markup
      const generateSchemaMarkup = () => {
        const schema = {
          '@context': 'https://schema.org',
          '@type': article ? 'Article' : 'WebPage',
          headline: title,
          description: description,
          image: imageUrl || 'https://yourdomain.com/default-image.jpg', // Replace with your default image
          author: {
            '@type': 'Organization', // Or Person
            name: 'Your Organization', // Replace with your organization name
          },
          datePublished: new Date().toISOString(), // Replace with actual date if available
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': currentUrl,
          },
        };

        return JSON.stringify(schema);
      };

      setSchemaMarkup(generateSchemaMarkup());
    } catch (error: any) {
      console.error('Error generating schema markup:', error);
      // Consider a more robust error reporting mechanism here
    }
  }, [title, description, imageUrl, article, currentUrl]);

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />

      {/* Open Graph Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content={imageUrl || 'https://yourdomain.com/default-image.jpg'} /> {/* Replace with your default image */}
      <meta property="og:type" content={article ? 'article' : 'website'} />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl || 'https://yourdomain.com/default-image.jpg'} /> {/* Replace with your default image */}

      {/* Schema Markup */}
      {schemaMarkup && (
        <script type="application/ld+json">
          {schemaMarkup}
        </script>
      )}
    </Head>
  );
};

export default SeoOptimization;