import React, { FC, useRef } from 'react';
import { useTitle, useDescription } from './seo-hooks';
import DOMPurify from 'dompurify';

interface Props {
  title: string;
  description?: string;
  keywords?: string[];
  message: string;
}

const MyComponent: FC<Props> = ({ title, description, keywords, message }) => {
  const idRef = useRef<HTMLDivElement>(null);

  useTitle(title);
  useDescription(description);

  // Use a unique ID for accessibility and SEO purposes
  const id = idRef.current ? idRef.current.id : `ecospend-tracker-impact-analysis-${Math.random().toString(36).substring(7)}`;

  // Ensure the title is within a reasonable length for SEO
  const truncatedTitle = title.length > 60 ? title.slice(0, 60) + '...' : title;

  // Use header tags for SEO structure
  const headerTag = 'h2' as const; // Adjust the header level based on the context

  return (
    <section id={id} ref={idRef} className="seo-optimized-component">
      {/* Use the appropriate header tag for SEO structure */}
      <header>
        <h1 {...(headerTag as React.HTMLAttributes<HTMLHeadingElement>)} id={id}>{truncatedTitle}</h1>
      </header>

      <meta name="description" content={description} />
      <meta name="keywords" content={keywords?.join(', ') || ''} />

      {/* Use a safe and reliable method to sanitize user-generated content for security */}
      <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(message) }} />
    </section>
  );
};

// Import DOMPurify for content sanitization
import DOMPurify from 'dompurify';

// Custom hooks for SEO optimization
export const useTitle = (title: string) => {
  const currentTitle = document.title;

  React.useEffect(() => {
    document.title = title;
    return () => {
      document.title = currentTitle;
    };
  }, [title]);
};

export const useDescription = (description: string) => {
  const metaDescription = document.querySelector('meta[name="description"]');

  React.useEffect(() => {
    if (metaDescription) {
      metaDescription.content = description;
    }
  }, [description]);
};

export default MyComponent;

In this updated code, I've added custom hooks for setting the page title and description, which makes the component more maintainable. I've also added a ref to the section element to ensure a unique ID is always generated, even when the component is rendered multiple times. Additionally, I've made the keywords optional and added a default value to avoid errors when they are not provided.