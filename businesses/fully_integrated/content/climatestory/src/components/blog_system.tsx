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
  // Ensure that the title and content are not empty
  if (!title || !content) {
    return null;
  }

  // Ensure that the publishedDate is a valid Date object
  const formattedPublishedDate = publishedDate
    ? publishedDate.toLocaleDateString('en-US')
    : '';

  return (
    <article aria-label={title}>
      <header>
        <h1>{title}</h1>
        {author && <p>By {author}</p>}
        {formattedPublishedDate && (
          <p>Published on {formattedPublishedDate}</p>
        )}
      </header>
      <div
        dangerouslySetInnerHTML={{
          __html: content.trim(),
        }}
        // Ensure that the content is accessible by adding ARIA attributes
        aria-live="polite"
        role="region"
        tabIndex={0}
      />
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
  // Ensure that the title and content are not empty
  if (!title || !content) {
    return null;
  }

  // Ensure that the publishedDate is a valid Date object
  const formattedPublishedDate = publishedDate
    ? publishedDate.toLocaleDateString('en-US')
    : '';

  return (
    <article aria-label={title}>
      <header>
        <h1>{title}</h1>
        {author && <p>By {author}</p>}
        {formattedPublishedDate && (
          <p>Published on {formattedPublishedDate}</p>
        )}
      </header>
      <div
        dangerouslySetInnerHTML={{
          __html: content.trim(),
        }}
        // Ensure that the content is accessible by adding ARIA attributes
        aria-live="polite"
        role="region"
        tabIndex={0}
      />
    </article>
  );
};

export default BlogPost;