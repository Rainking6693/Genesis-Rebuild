import React, { FC, useEffect, useMemo } from 'react';

interface Props {
  title: string; // Add a title for SEO optimization
  description: string; // Add a description for SEO optimization
  keywords: string[]; // Add relevant keywords for SEO optimization
  message: string;
}

const MyComponent: FC<Props> = ({ title, description, keywords, message }) => {
  // Use a unique ID for each component for better accessibility and SEO
  const id = `seo-optimized-component-${Math.random().toString(36).substring(7)}`;

  // Ensure meta tags are only added once, even in edge cases like server-side rendering
  const [hasRendered, setHasRendered] = React.useState(false);

  // Check if the document exists before adding meta tags
  const documentExists = typeof document !== 'undefined';

  // Check if the document head exists before adding meta tags
  const headExists = documentExists && document.head;

  // Memoize the creation of the meta tags to improve performance
  const metaDescription = useMemo(() => {
    if (documentExists && headExists) {
      const metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        const metaDescriptionTag = document.createElement('meta');
        metaDescriptionTag.name = 'description';
        metaDescriptionTag.content = description;
        return metaDescriptionTag;
      }
    }
    return null;
  }, [description]);

  const metaKeywords = useMemo(() => {
    if (documentExists && headExists) {
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        const metaKeywordsTag = document.createElement('meta');
        metaKeywordsTag.name = 'keywords';
        metaKeywordsTag.content = keywords.join(', ');
        return metaKeywordsTag;
      }
    }
    return null;
  }, [keywords]);

  useEffect(() => {
    if (!hasRendered && documentExists && headExists) {
      // Add an SEO-friendly heading
      document.title = title;

      // Add the meta tags
      if (metaDescription) {
        document.head.appendChild(metaDescription);
      }

      if (metaKeywords) {
        document.head.appendChild(metaKeywords);
      }

      setHasRendered(true);
    }
  }, [title, description, keywords, hasRendered, documentExists, headExists, metaDescription, metaKeywords]);

  // Add an ARIA label for accessibility
  const ariaLabel = `SEO-optimized component with title "${title}"`;

  // Add the main content
  return (
    <div id={id} aria-label={ariaLabel} dangerouslySetInnerHTML={{ __html: message }} />
  );
};

export default MyComponent;

import React, { FC, useEffect, useMemo } from 'react';

interface Props {
  title: string; // Add a title for SEO optimization
  description: string; // Add a description for SEO optimization
  keywords: string[]; // Add relevant keywords for SEO optimization
  message: string;
}

const MyComponent: FC<Props> = ({ title, description, keywords, message }) => {
  // Use a unique ID for each component for better accessibility and SEO
  const id = `seo-optimized-component-${Math.random().toString(36).substring(7)}`;

  // Ensure meta tags are only added once, even in edge cases like server-side rendering
  const [hasRendered, setHasRendered] = React.useState(false);

  // Check if the document exists before adding meta tags
  const documentExists = typeof document !== 'undefined';

  // Check if the document head exists before adding meta tags
  const headExists = documentExists && document.head;

  // Memoize the creation of the meta tags to improve performance
  const metaDescription = useMemo(() => {
    if (documentExists && headExists) {
      const metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        const metaDescriptionTag = document.createElement('meta');
        metaDescriptionTag.name = 'description';
        metaDescriptionTag.content = description;
        return metaDescriptionTag;
      }
    }
    return null;
  }, [description]);

  const metaKeywords = useMemo(() => {
    if (documentExists && headExists) {
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        const metaKeywordsTag = document.createElement('meta');
        metaKeywordsTag.name = 'keywords';
        metaKeywordsTag.content = keywords.join(', ');
        return metaKeywordsTag;
      }
    }
    return null;
  }, [keywords]);

  useEffect(() => {
    if (!hasRendered && documentExists && headExists) {
      // Add an SEO-friendly heading
      document.title = title;

      // Add the meta tags
      if (metaDescription) {
        document.head.appendChild(metaDescription);
      }

      if (metaKeywords) {
        document.head.appendChild(metaKeywords);
      }

      setHasRendered(true);
    }
  }, [title, description, keywords, hasRendered, documentExists, headExists, metaDescription, metaKeywords]);

  // Add an ARIA label for accessibility
  const ariaLabel = `SEO-optimized component with title "${title}"`;

  // Add the main content
  return (
    <div id={id} aria-label={ariaLabel} dangerouslySetInnerHTML={{ __html: message }} />
  );
};

export default MyComponent;