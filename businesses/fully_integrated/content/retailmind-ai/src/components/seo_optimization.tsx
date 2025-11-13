import React, { FC, PropsWithChildren } from 'react';

interface Props {
  seoTitle: string;
  seoDescription: string;
  seoKeywords?: string[];
}

const MyComponent: FC<Props & { children: PropsWithChildren<JSX.Element> }> = ({
  seoTitle,
  seoDescription,
  seoKeywords = [],
  children,
}) => {
  // Validate seoKeywords to ensure it contains only strings
  const sanitizedSeoKeywords = seoKeywords.filter((keyword): keyword is string => typeof keyword === 'string');

  // Sanitize SEO keywords by removing any non-alphanumeric characters and filtering out empty strings
  const cleanedSeoKeywords = sanitizedSeoKeywords.map((keyword) => keyword.replace(/[^a-zA-Z0-9-]/g, '')).filter((keyword) => keyword.length > 0);

  // Check for empty seoTitle and seoDescription
  if (!seoTitle || !seoDescription) return null;

  return (
    <>
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      <meta name="keywords" content={cleanedSeoKeywords.join(', ')} />

      {/* Add ARIA attributes for accessibility */}
      <meta name="description" aria-hidden="false" content={seoDescription} />
      <meta name="keywords" aria-hidden="true" content={cleanedSeoKeywords.join(', ')} />

      {children}
    </>
  );
};

// Add a comment to explain the purpose of the component
/**
 * MyComponent is a React functional component that handles SEO optimization for a content business.
 * It sets the title, description, and keywords meta tags for a webpage.
 */

export default MyComponent;

import React, { FC, PropsWithChildren } from 'react';

interface Props {
  seoTitle: string;
  seoDescription: string;
  seoKeywords?: string[];
}

const MyComponent: FC<Props & { children: PropsWithChildren<JSX.Element> }> = ({
  seoTitle,
  seoDescription,
  seoKeywords = [],
  children,
}) => {
  // Validate seoKeywords to ensure it contains only strings
  const sanitizedSeoKeywords = seoKeywords.filter((keyword): keyword is string => typeof keyword === 'string');

  // Sanitize SEO keywords by removing any non-alphanumeric characters and filtering out empty strings
  const cleanedSeoKeywords = sanitizedSeoKeywords.map((keyword) => keyword.replace(/[^a-zA-Z0-9-]/g, '')).filter((keyword) => keyword.length > 0);

  // Check for empty seoTitle and seoDescription
  if (!seoTitle || !seoDescription) return null;

  return (
    <>
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      <meta name="keywords" content={cleanedSeoKeywords.join(', ')} />

      {/* Add ARIA attributes for accessibility */}
      <meta name="description" aria-hidden="false" content={seoDescription} />
      <meta name="keywords" aria-hidden="true" content={cleanedSeoKeywords.join(', ')} />

      {children}
    </>
  );
};

// Add a comment to explain the purpose of the component
/**
 * MyComponent is a React functional component that handles SEO optimization for a content business.
 * It sets the title, description, and keywords meta tags for a webpage.
 */

export default MyComponent;