// src/components/SeoOptimizer.tsx
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet'; // For managing head elements
import { analyzeContent } from '../utils/contentAnalysis'; // Placeholder for content analysis utility

interface SeoOptimizerProps {
  title: string;
  description: string;
  keywords: string;
  content: string; // The actual content of the page
  imageUrl?: string; // Optional image URL for social sharing
}

const SeoOptimizer: React.FC<SeoOptimizerProps> = ({ title, description, keywords, content, imageUrl }) => {
  const [schemaMarkup, setSchemaMarkup] = useState<string>('');
  const [keywordDensity, setKeywordDensity] = useState<{[key: string]: number}>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Generate Schema Markup (Example: Article schema)
      const articleSchema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": title,
        "description": description,
        "image": imageUrl || "",
        "author": {
          "@type": "Organization",
          "name": "Your Organization Name" // Replace with actual organization name
        },
        "datePublished": new Date().toISOString(),
      };
      setSchemaMarkup(JSON.stringify(articleSchema));

      // Analyze Content for Keyword Density
      const analysisResult = analyzeContent(content, keywords.split(','));
      setKeywordDensity(analysisResult);

    } catch (e: any) {
      console.error("Error generating SEO data:", e);
      setError("Failed to generate SEO data. Please check the input.");
    }
  }, [title, description, keywords, content, imageUrl]);

  if (error) {
    return <div style={{color: 'red'}}>Error: {error}</div>;
  }

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />

        {/* Open Graph / Facebook */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        {imageUrl && <meta property="og:image" content={imageUrl} />}

        {/* Twitter */}
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
        {imageUrl && <meta property="twitter:image" content={imageUrl} />}

        {/* Schema Markup */}
        {schemaMarkup && <script type="application/ld+json">{schemaMarkup}</script>}
      </Helmet>

      {/* Optional: Display keyword density analysis for debugging */}
      {/* <div>
        <h3>Keyword Density Analysis</h3>
        <ul>
          {Object.entries(keywordDensity).map(([keyword, density]) => (
            <li key={keyword}>{keyword}: {density.toFixed(2)}%</li>
          ))}
        </ul>
      </div> */}
    </>
  );
};

export default SeoOptimizer;

// Placeholder for content analysis utility (Implement this separately)
// utils/contentAnalysis.ts
export const analyzeContent = (content: string, keywords: string[]): {[key: string]: number} => {
  const keywordCounts: {[key: string]: number} = {};
  keywords.forEach(keyword => {
    keywordCounts[keyword.trim()] = (content.split(keyword.trim()).length - 1);
  });

  const totalWords = content.split(/\s+/).length;
  const keywordDensity: {[key: string]: number} = {};

  for (const keyword in keywordCounts) {
    keywordDensity[keyword] = (keywordCounts[keyword] / totalWords) * 100;
  }

  return keywordDensity;
};

// src/components/SeoOptimizer.tsx
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet'; // For managing head elements
import { analyzeContent } from '../utils/contentAnalysis'; // Placeholder for content analysis utility

interface SeoOptimizerProps {
  title: string;
  description: string;
  keywords: string;
  content: string; // The actual content of the page
  imageUrl?: string; // Optional image URL for social sharing
}

const SeoOptimizer: React.FC<SeoOptimizerProps> = ({ title, description, keywords, content, imageUrl }) => {
  const [schemaMarkup, setSchemaMarkup] = useState<string>('');
  const [keywordDensity, setKeywordDensity] = useState<{[key: string]: number}>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Generate Schema Markup (Example: Article schema)
      const articleSchema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": title,
        "description": description,
        "image": imageUrl || "",
        "author": {
          "@type": "Organization",
          "name": "Your Organization Name" // Replace with actual organization name
        },
        "datePublished": new Date().toISOString(),
      };
      setSchemaMarkup(JSON.stringify(articleSchema));

      // Analyze Content for Keyword Density
      const analysisResult = analyzeContent(content, keywords.split(','));
      setKeywordDensity(analysisResult);

    } catch (e: any) {
      console.error("Error generating SEO data:", e);
      setError("Failed to generate SEO data. Please check the input.");
    }
  }, [title, description, keywords, content, imageUrl]);

  if (error) {
    return <div style={{color: 'red'}}>Error: {error}</div>;
  }

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />

        {/* Open Graph / Facebook */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        {imageUrl && <meta property="og:image" content={imageUrl} />}

        {/* Twitter */}
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
        {imageUrl && <meta property="twitter:image" content={imageUrl} />}

        {/* Schema Markup */}
        {schemaMarkup && <script type="application/ld+json">{schemaMarkup}</script>}
      </Helmet>

      {/* Optional: Display keyword density analysis for debugging */}
      {/* <div>
        <h3>Keyword Density Analysis</h3>
        <ul>
          {Object.entries(keywordDensity).map(([keyword, density]) => (
            <li key={keyword}>{keyword}: {density.toFixed(2)}%</li>
          ))}
        </ul>
      </div> */}
    </>
  );
};

export default SeoOptimizer;

// Placeholder for content analysis utility (Implement this separately)
// utils/contentAnalysis.ts
export const analyzeContent = (content: string, keywords: string[]): {[key: string]: number} => {
  const keywordCounts: {[key: string]: number} = {};
  keywords.forEach(keyword => {
    keywordCounts[keyword.trim()] = (content.split(keyword.trim()).length - 1);
  });

  const totalWords = content.split(/\s+/).length;
  const keywordDensity: {[key: string]: number} = {};

  for (const keyword in keywordCounts) {
    keywordDensity[keyword] = (keywordCounts[keyword] / totalWords) * 100;
  }

  return keywordDensity;
};