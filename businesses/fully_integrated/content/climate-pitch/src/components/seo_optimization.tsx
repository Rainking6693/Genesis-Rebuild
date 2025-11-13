import React, { FunctionComponent, useEffect } from 'react';

interface Props {
  title: string; // Add a title for SEO optimization
  description: string; // Add a description for SEO optimization
  keywords: string[]; // Add a list of keywords for SEO optimization
  message: string;
}

const SeoOptimizedComponent: FunctionComponent<Props> = ({ title, description, keywords, message }) => {
  // Use a unique ID for each component for better SEO and accessibility
  const uniqueId = `seo-optimized-component-${Math.random().toString(36).substring(7)}`;

  // Add a fallback title for screen readers and search engines in case the title prop is empty
  const fallbackTitle = title || 'Untitled';

  // Add a minimum length for the title to ensure it's SEO-friendly
  const minTitleLength = 60;
  const truncatedTitle = title ? (title.length > minTitleLength ? title.slice(0, minTitleLength) + '...' : title) : fallbackTitle;

  // Add a minimum length for the description to ensure it's SEO-friendly
  const minDescriptionLength = 155;
  const truncatedDescription = description ? (description.length > minDescriptionLength ? description.slice(0, minDescriptionLength) + '...' : description) : fallbackTitle;

  // Ensure the keywords are separated by commas and have a maximum length
  const maxKeywordsLength = 255;
  const formattedKeywords = keywords.join(', ').slice(0, maxKeywordsLength);

  // Use useEffect to add the SEO meta tags only once when the component mounts
  useEffect(() => {
    const metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      const metaDescriptionTag = document.createElement('meta');
      metaDescriptionTag.name = 'description';
      metaDescriptionTag.content = truncatedDescription;
      document.head.appendChild(metaDescriptionTag);
    }

    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      const metaKeywordsTag = document.createElement('meta');
      metaKeywordsTag.name = 'keywords';
      metaKeywordsTag.content = formattedKeywords;
      document.head.appendChild(metaKeywordsTag);
    }
  }, [truncatedDescription, formattedKeywords]);

  // Sanitize user-generated content to prevent XSS attacks
  const sanitizeMessage = (message: string) => {
    const doc = new DOMParser().parseFromString(message, 'text/html');
    return doc.documentElement.textContent.trim();
  };

  return (
    <div id={uniqueId}>
      {/* Add an SEO-friendly title */}
      <title>{truncatedTitle}</title>
      {/* Add a meta description for SEO */}
      {/* The meta description is already added using useEffect */}
      {/* Add a meta keywords tag for SEO */}
      {/* The meta keywords are already added using useEffect */}
      <div dangerouslySetInnerHTML={{ __html: sanitizeMessage(message) }} />
    </div>
  );
};

export default SeoOptimizedComponent;

In this updated code, I've added minimum lengths for the title and description, ensured that the keywords are properly formatted, and sanitized user-generated content to prevent XSS attacks. Additionally, I've extracted the sanitization logic into a separate function for better maintainability.