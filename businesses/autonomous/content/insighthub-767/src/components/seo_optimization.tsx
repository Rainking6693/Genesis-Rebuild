// src/components/SeoOptimization.tsx
import React, { useEffect } from 'react';
import Head from 'next/head'; // Assuming Next.js for Head component
import { validateSchema } from './utils/schemaValidator'; // Placeholder for schema validation utility

interface SeoProps {
  title: string;
  description: string;
  keywords?: string[];
  imageUrl?: string;
  articleBody?: string; // For article schema
}

const SeoOptimization: React.FC<SeoProps> = ({ title, description, keywords, imageUrl, articleBody }) => {

  useEffect(() => {
    try {
      // Example: Generate schema markup for an article
      const schema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": title,
        "description": description,
        "image": imageUrl,
        "author": {
          "@type": "Organization",
          "name": "Your Content Business Name" // Replace with actual name
        },
        "datePublished": new Date().toISOString(),
        "articleBody": articleBody,
      };

      const isValid = validateSchema(schema); // Placeholder - Implement schema validation

      if (!isValid) {
        console.warn("Schema markup is not valid.");
      }

      // You would typically inject this schema into the <head>
      // using a library like react-helmet or next/head.
      // For demonstration purposes, we're just logging it.
      console.log("Generated Schema:", JSON.stringify(schema, null, 2));

    } catch (error: any) {
      console.error("Error generating or validating schema:", error.message);
    }
  }, [title, description, imageUrl, articleBody]);

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords.join(', ')} />}

      {/* Open Graph / Facebook */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {imageUrl && <meta property="og:image" content={imageUrl} />}
      <meta property="og:type" content="website" /> {/* Or "article" if it's a specific article */}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {imageUrl && <meta name="twitter:image" content={imageUrl} />}
    </Head>
  );
};

export default SeoOptimization;

import SeoOptimization from './components/SeoOptimization';

function MyPage() {
  return (
    <>
      <SeoOptimization
        title="My Awesome Article"
        description="A detailed description of my awesome article."
        keywords={["SEO", "article", "content"]}
        imageUrl="https://example.com/image.jpg"
        articleBody="The main content of my article..."
      />
      {/* Rest of your page content */}
    </>
  );
}

export default MyPage;

// src/components/SeoOptimization.tsx
import React, { useEffect } from 'react';
import Head from 'next/head'; // Assuming Next.js for Head component
import { validateSchema } from './utils/schemaValidator'; // Placeholder for schema validation utility

interface SeoProps {
  title: string;
  description: string;
  keywords?: string[];
  imageUrl?: string;
  articleBody?: string; // For article schema
}

const SeoOptimization: React.FC<SeoProps> = ({ title, description, keywords, imageUrl, articleBody }) => {

  useEffect(() => {
    try {
      // Example: Generate schema markup for an article
      const schema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": title,
        "description": description,
        "image": imageUrl,
        "author": {
          "@type": "Organization",
          "name": "Your Content Business Name" // Replace with actual name
        },
        "datePublished": new Date().toISOString(),
        "articleBody": articleBody,
      };

      const isValid = validateSchema(schema); // Placeholder - Implement schema validation

      if (!isValid) {
        console.warn("Schema markup is not valid.");
      }

      // You would typically inject this schema into the <head>
      // using a library like react-helmet or next/head.
      // For demonstration purposes, we're just logging it.
      console.log("Generated Schema:", JSON.stringify(schema, null, 2));

    } catch (error: any) {
      console.error("Error generating or validating schema:", error.message);
    }
  }, [title, description, imageUrl, articleBody]);

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords.join(', ')} />}

      {/* Open Graph / Facebook */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {imageUrl && <meta property="og:image" content={imageUrl} />}
      <meta property="og:type" content="website" /> {/* Or "article" if it's a specific article */}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {imageUrl && <meta name="twitter:image" content={imageUrl} />}
    </Head>
  );
};

export default SeoOptimization;

import SeoOptimization from './components/SeoOptimization';

function MyPage() {
  return (
    <>
      <SeoOptimization
        title="My Awesome Article"
        description="A detailed description of my awesome article."
        keywords={["SEO", "article", "content"]}
        imageUrl="https://example.com/image.jpg"
        articleBody="The main content of my article..."
      />
      {/* Rest of your page content */}
    </>
  );
}

export default MyPage;

Explanation:

*   **TypeScript & React:** The component is written in TypeScript and uses React for rendering.  I'm assuming a Next.js environment, hence the use of `next/head`.
*   **Props:**  The component accepts `title`, `description`, `keywords`, `imageUrl`, and `articleBody` as props.
*   **Meta Tags:**  It generates basic meta tags for title, description, and keywords.
*   **Open Graph & Twitter Cards:**  It includes meta tags for Open Graph (Facebook) and Twitter Cards.
*   **Schema Markup (JSON-LD):**  It generates a basic Article schema markup.  This is a crucial part of SEO.  It uses a placeholder function `validateSchema`.  **Important:**  A real implementation would use a proper schema validation library (e.g., `ajv`) to ensure the generated schema is valid.
*   **Error Handling:**  A `try...catch` block is used to handle potential errors during schema generation and validation.
*   **`useEffect` Hook:** The schema generation logic is placed inside a `useEffect` hook to run after the component mounts.
*   **Warnings:** The build report includes warnings about the placeholder schema validation and the need for backend integration for sitemap generation.
*   **Test Coverage:**  Unit testing this component directly is difficult because it primarily manipulates meta tags.  Integration tests would be more appropriate to verify that the meta tags are correctly rendered on the page.

To use this component: