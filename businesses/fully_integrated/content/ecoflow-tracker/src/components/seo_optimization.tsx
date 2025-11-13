import React, { useState } from 'react';

interface Props {
  title: string; // Add a title for SEO purposes
  description: string; // Add a brief description for SEO purposes
  keywords: string[]; // Add relevant keywords for SEO
  message: string;
  id?: string; // Add an optional ID for accessibility purposes
}

const MyComponent: React.FC<Props> = ({ title, description, keywords, message, id }) => {

  // Ensure the ID is unique by appending a timestamp if not provided
  const [uniqueId, setUniqueId] = useState<string>(id || `ecoflow-tracker-seo-component-${Math.random()}-${Date.now()}`);

  // Update the unique ID if it's already used on the page
  React.useEffect(() => {
    const existingIds = document.querySelectorAll(`#${uniqueId}`);
    if (existingIds.length > 1) {
      setUniqueId(`ecoflow-tracker-seo-component-${Math.random()}-${Date.now()}`);
    }
  }, [uniqueId]);

  // Wrap the content in an SEO-friendly HTML structure
  return (
    <section id={uniqueId} aria-labelledby={`${uniqueId}-title`}>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <title>{title}</title>
      <h1 id={`${uniqueId}-title`}>{title}</h1>
      <div dangerouslySetInnerHTML={{ __html: message }} />
    </section>
  );
};

export default MyComponent;

import React, { useState } from 'react';

interface Props {
  title: string; // Add a title for SEO purposes
  description: string; // Add a brief description for SEO purposes
  keywords: string[]; // Add relevant keywords for SEO
  message: string;
  id?: string; // Add an optional ID for accessibility purposes
}

const MyComponent: React.FC<Props> = ({ title, description, keywords, message, id }) => {

  // Ensure the ID is unique by appending a timestamp if not provided
  const [uniqueId, setUniqueId] = useState<string>(id || `ecoflow-tracker-seo-component-${Math.random()}-${Date.now()}`);

  // Update the unique ID if it's already used on the page
  React.useEffect(() => {
    const existingIds = document.querySelectorAll(`#${uniqueId}`);
    if (existingIds.length > 1) {
      setUniqueId(`ecoflow-tracker-seo-component-${Math.random()}-${Date.now()}`);
    }
  }, [uniqueId]);

  // Wrap the content in an SEO-friendly HTML structure
  return (
    <section id={uniqueId} aria-labelledby={`${uniqueId}-title`}>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <title>{title}</title>
      <h1 id={`${uniqueId}-title`}>{title}</h1>
      <div dangerouslySetInnerHTML={{ __html: message }} />
    </section>
  );
};

export default MyComponent;