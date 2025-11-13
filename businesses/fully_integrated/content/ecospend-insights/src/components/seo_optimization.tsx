import React from 'react';

interface Props {
  title: string; // Add a title for better SEO structure
  description: string; // Add a description for better SEO meta tags
  keywords: string[]; // Add relevant keywords for SEO
  message: string;
}

const maxTitleLength = 70;
const maxDescriptionLength = 155;

const MyComponent: React.FC<Props> = ({ title, description, keywords, message }) => {
  // Use a unique ID for accessibility and SEO purposes
  const id = `ecospend-insights-seo-component-${Math.random().toString(36).substring(7)}`;

  // Ensure the title is always present and within a reasonable length
  const truncatedTitle = title ? title.length > maxTitleLength ? title.slice(0, maxTitleLength) + '...' : title : 'Untitled';

  // Ensure the description is always present and within a reasonable length
  const truncatedDescription = description ? description.length > maxDescriptionLength ? description.slice(0, maxDescriptionLength) + '...' : description : 'No description provided';

  // Use a semantic HTML element for the main content
  const mainContentId = `ecospend-insights-seo-component-main-content-${Math.random().toString(36).substring(7)}`;

  return (
    <div id={id}>
      {/* Add an SEO-friendly heading */}
      <h1>{truncatedTitle}</h1>
      {/* Add meta tags for SEO */}
      <meta name="description" content={truncatedDescription} />
      <meta name="keywords" content={keywords.join(', ')} />

      {/* Use a semantic HTML element for the main content */}
      <main id={mainContentId} aria-labelledby={id}>
        {message}
      </main>
    </div>
  );
};

export default MyComponent;

import React from 'react';

interface Props {
  title: string; // Add a title for better SEO structure
  description: string; // Add a description for better SEO meta tags
  keywords: string[]; // Add relevant keywords for SEO
  message: string;
}

const maxTitleLength = 70;
const maxDescriptionLength = 155;

const MyComponent: React.FC<Props> = ({ title, description, keywords, message }) => {
  // Use a unique ID for accessibility and SEO purposes
  const id = `ecospend-insights-seo-component-${Math.random().toString(36).substring(7)}`;

  // Ensure the title is always present and within a reasonable length
  const truncatedTitle = title ? title.length > maxTitleLength ? title.slice(0, maxTitleLength) + '...' : title : 'Untitled';

  // Ensure the description is always present and within a reasonable length
  const truncatedDescription = description ? description.length > maxDescriptionLength ? description.slice(0, maxDescriptionLength) + '...' : description : 'No description provided';

  // Use a semantic HTML element for the main content
  const mainContentId = `ecospend-insights-seo-component-main-content-${Math.random().toString(36).substring(7)}`;

  return (
    <div id={id}>
      {/* Add an SEO-friendly heading */}
      <h1>{truncatedTitle}</h1>
      {/* Add meta tags for SEO */}
      <meta name="description" content={truncatedDescription} />
      <meta name="keywords" content={keywords.join(', ')} />

      {/* Use a semantic HTML element for the main content */}
      <main id={mainContentId} aria-labelledby={id}>
        {message}
      </main>
    </div>
  );
};

export default MyComponent;