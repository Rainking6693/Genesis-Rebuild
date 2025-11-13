import React, { FC, useEffect, useMemo } from 'react';

interface Props {
  title?: string; // Add optional for title
  description?: string; // Add optional for description
  keywords?: string[]; // Add optional for keywords
  message: string;
}

const MyComponent: FC<Props> = ({ title, description, keywords, message }) => {
  const metaTags = useMemo(() => {
    const tags: JSX.Element[] = [];

    if (title) {
      tags.push(<meta name="title" content={title} key="title" />);
    }

    if (description) {
      tags.push(<meta name="description" content={description} key="description" />);
    }

    if (keywords && keywords.length > 0) {
      tags.push(<meta name="keywords" content={keywords.join(', ')} key="keywords" />);
    }

    return tags;
  }, [title, description, keywords]);

  return (
    <div>
      {/* Use dangerouslySetInnerHTML for potentially unsafe user-generated content */}
      <div dangerouslySetInnerHTML={{ __html: message }} />
      {/* Move meta tags to the head of the document */}
      <head>{metaTags}</head>
    </div>
  );
};

export default MyComponent;

// In this updated version, I've added optional props for title, description, and keywords to handle edge cases where they might not be provided.
// I've also used useMemo to optimize performance by only re-creating the meta tags when the props change.
// Lastly, I've moved the meta tags to the head of the document for better SEO and accessibility.

import React, { FC, useEffect, useMemo } from 'react';

interface Props {
  title?: string; // Add optional for title
  description?: string; // Add optional for description
  keywords?: string[]; // Add optional for keywords
  message: string;
}

const MyComponent: FC<Props> = ({ title, description, keywords, message }) => {
  const metaTags = useMemo(() => {
    const tags: JSX.Element[] = [];

    if (title) {
      tags.push(<meta name="title" content={title} key="title" />);
    }

    if (description) {
      tags.push(<meta name="description" content={description} key="description" />);
    }

    if (keywords && keywords.length > 0) {
      tags.push(<meta name="keywords" content={keywords.join(', ')} key="keywords" />);
    }

    return tags;
  }, [title, description, keywords]);

  return (
    <div>
      {/* Use dangerouslySetInnerHTML for potentially unsafe user-generated content */}
      <div dangerouslySetInnerHTML={{ __html: message }} />
      {/* Move meta tags to the head of the document */}
      <head>{metaTags}</head>
    </div>
  );
};

export default MyComponent;

// In this updated version, I've added optional props for title, description, and keywords to handle edge cases where they might not be provided.
// I've also used useMemo to optimize performance by only re-creating the meta tags when the props change.
// Lastly, I've moved the meta tags to the head of the document for better SEO and accessibility.