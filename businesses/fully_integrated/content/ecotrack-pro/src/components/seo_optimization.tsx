import React, { FC, useEffect, useRef } from 'react';

interface Props {
  title: string;
  description?: string;
  keywords?: string[];
  message: string;
  noindex?: boolean;
  lang?: string;
}

const MyComponent: FC<Props> = ({ title, description, keywords, message, noindex, lang }) => {
  const idRef = useRef<string>(`ecotrack-pro-seo-component-${Math.random().toString(36).substring(7)}`);
  const safeTitle = title || 'Untitled';
  const safeDescription = description || '';
  const safeKeywords = keywords?.join(', ') || '';

  useEffect(() => {
    document.documentElement.lang = lang || 'en';
    if (noindex) {
      document.head.appendChild(document.createElement('meta')).setAttribute('name', 'robots').setAttribute('content', 'noindex');
    }
  }, [noindex, lang]);

  // Use a semantic element for the main content
  const mainContent = (
    <main id={idRef.current} role="main" tabIndex={0}>
      {message}
    </main>
  );

  // Add an ARIA label for better accessibility
  const ariaLabel = `EcoTrack Pro SEO Component with title: ${safeTitle}`;

  return (
    <div aria-labelledby={ariaLabel}>
      {/* Add an SEO-friendly title */}
      <title>{safeTitle}</title>
      {/* Add a meta description */}
      <meta name="description" content={safeDescription} />
      {/* Add meta keywords */}
      <meta name="keywords" content={safeKeywords} />
      {/* Wrap the content in a semantic element for better SEO */}
      {mainContent}
    </div>
  );
};

export default MyComponent;

This updated version addresses the requested improvements and adds additional features for better resiliency, edge cases handling, accessibility, and maintainability.