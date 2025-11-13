import React, { PropsWithChildren, useEffect, useState } from 'react';

interface Props {
  title: string; // Add a title for SEO and better structure
  description: string; // Add a description for SEO and better understanding of the blog post
  content: string; // Rename 'message' to 'content' for better semantic meaning
  className?: string; // Add a prop for custom CSS classes
  // Add a prop for the blog post's URL for better SEO and accessibility
  url?: string;
}

const BlogPost: React.FC<Props> = ({ title, description, content, className, url }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Set the meta description based on the content if not provided
    if (!description) {
      const metaDescription = content.slice(0, 160); // Limit meta description to 160 characters for SEO
      setDescription(metaDescription);
    }

    setIsLoaded(true);
  }, [content]);

  const [description, setDescription] = useState(description || '');

  return (
    <article className={className}>
      {/* Wrap title in h1 for proper heading structure */}
      <header>
        <h1>{title}</h1>
        {/* Add meta description for SEO */}
        <meta name="description" content={description} />
        {/* Add a link element for the blog post's URL for better SEO and accessibility */}
        {url && (
          <link rel="canonical" href={url} />
        )}
      </header>
      {/* Wrap content in main for proper content structure and sanitize HTML */}
      <main dangerouslySetInnerHTML={{ __html: content }} />
    </article>
  );
};

export default BlogPost;

import React, { PropsWithChildren, useEffect, useState } from 'react';

interface Props {
  title: string; // Add a title for SEO and better structure
  description: string; // Add a description for SEO and better understanding of the blog post
  content: string; // Rename 'message' to 'content' for better semantic meaning
  className?: string; // Add a prop for custom CSS classes
  // Add a prop for the blog post's URL for better SEO and accessibility
  url?: string;
}

const BlogPost: React.FC<Props> = ({ title, description, content, className, url }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Set the meta description based on the content if not provided
    if (!description) {
      const metaDescription = content.slice(0, 160); // Limit meta description to 160 characters for SEO
      setDescription(metaDescription);
    }

    setIsLoaded(true);
  }, [content]);

  const [description, setDescription] = useState(description || '');

  return (
    <article className={className}>
      {/* Wrap title in h1 for proper heading structure */}
      <header>
        <h1>{title}</h1>
        {/* Add meta description for SEO */}
        <meta name="description" content={description} />
        {/* Add a link element for the blog post's URL for better SEO and accessibility */}
        {url && (
          <link rel="canonical" href={url} />
        )}
      </header>
      {/* Wrap content in main for proper content structure and sanitize HTML */}
      <main dangerouslySetInnerHTML={{ __html: content }} />
    </article>
  );
};

export default BlogPost;