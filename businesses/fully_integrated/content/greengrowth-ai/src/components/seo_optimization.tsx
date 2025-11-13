import React, { FC, useEffect } from 'react';

interface Props {
  title: string; // Add a title for SEO optimization
  description: string; // Add a description for SEO optimization
  keywords: string[]; // Add a list of keywords for SEO optimization
  message: string;
}

const MyComponent: FC<Props> = ({ title, description, keywords, message }) => {
  // Use a unique ID for each component for better SEO and accessibility
  const id = `green-growth-ai-seo-component-${Math.random().toString(36).substring(7)}`;

  // Ensure the title and description are set even if they are empty strings
  const safeTitle = title || 'Untitled';
  const safeDescription = description || '';

  // Use a more descriptive and meaningful ID for better accessibility
  const accessibleId = `green-growth-ai-seo-component-${id}`;

  // Add ARIA attributes for better accessibility
  const ariaAttributes = {
    'aria-labelledby': `${accessibleId}-title ${accessibleId}-description`,
  };

  useEffect(() => {
    // Add an SEO-friendly title and meta description
    try {
      document.title = safeTitle;
    } catch (error) {
      console.error('Failed to set document title:', error);
    }

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      try {
        metaDescription.setAttribute('content', safeDescription);
      } catch (error) {
        console.error('Failed to set meta description content:', error);
      }
    } else {
      const metaDescriptionElement = document.createElement('meta');
      metaDescriptionElement.name = 'description';
      metaDescriptionElement.content = safeDescription;
      document.head.appendChild(metaDescriptionElement);
    }

    // Add a meta keywords tag
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      try {
        const keywordsContent = keywords.join(', ');
        metaKeywords.setAttribute('content', keywordsContent);
      } catch (error) {
        console.error('Failed to set meta keywords content:', error);
      }
    } else {
      const metaKeywordsElement = document.createElement('meta');
      metaKeywordsElement.name = 'keywords';
      metaKeywordsElement.content = keywords.join(', ');
      document.head.appendChild(metaKeywordsElement);
    }
  }, [safeTitle, safeDescription, keywords]);

  return (
    <div id={id} {...ariaAttributes}>
      {/* Use semantic HTML elements for better SEO */}
      <h1 id={`${accessibleId}-title`}>{message}</h1>
      <div id={`${accessibleId}-description`}>{safeDescription}</div>
    </div>
  );
};

export default MyComponent;

This version includes error handling for setting the document title, meta description, and meta keywords, which helps improve resiliency and handle edge cases. Additionally, I've added TypeScript type annotations for better type safety and maintainability.