import React from 'react';

interface BlogPostProps {
  title: string;
  content: string;
  author?: string;
  publishedDate?: Date;
}

const BlogPost: React.FC<BlogPostProps> = ({
  title,
  content,
  author,
  publishedDate,
}) => {
  // Resiliency: Handle edge cases for missing or invalid data
  const formattedPublishedDate = publishedDate
    ? publishedDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Unknown';
  const formattedAuthor = author || 'Anonymous';

  // Accessibility: Add appropriate ARIA attributes
  return (
    <article aria-label="Blog Post" role="article">
      <header aria-label={title} role="heading">
        <h1>{title}</h1>
        <p aria-label={`Author: ${formattedAuthor}`}>By {formattedAuthor}</p>
        <p aria-label={`Published on: ${formattedPublishedDate}`}>
          Published on {formattedPublishedDate}
        </p>
      </header>
      <div aria-label="Blog Content" role="region">
        {content}
      </div>
    </article>
  );
};

export default BlogPost;

import React from 'react';

interface BlogPostProps {
  title: string;
  content: string;
  author?: string;
  publishedDate?: Date;
}

const BlogPost: React.FC<BlogPostProps> = ({
  title,
  content,
  author,
  publishedDate,
}) => {
  // Resiliency: Handle edge cases for missing or invalid data
  const formattedPublishedDate = publishedDate
    ? publishedDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Unknown';
  const formattedAuthor = author || 'Anonymous';

  // Accessibility: Add appropriate ARIA attributes
  return (
    <article aria-label="Blog Post" role="article">
      <header aria-label={title} role="heading">
        <h1>{title}</h1>
        <p aria-label={`Author: ${formattedAuthor}`}>By {formattedAuthor}</p>
        <p aria-label={`Published on: ${formattedPublishedDate}`}>
          Published on {formattedPublishedDate}
        </p>
      </header>
      <div aria-label="Blog Content" role="region">
        {content}
      </div>
    </article>
  );
};

export default BlogPost;