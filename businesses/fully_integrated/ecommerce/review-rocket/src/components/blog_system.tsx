import React, { useMemo } from 'react';
import DOMPurify from 'dompurify';

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
  // Ensure that the content is properly sanitized to prevent XSS attacks
  const sanitizedContent = useMemo(() => {
    const sanitizer = DOMPurify.sanitize;
    return sanitizer(content);
  }, [content]);

  return (
    <article aria-label={title}>
      <header>
        <h1>{title}</h1>
        {author && <p>By {author}</p>}
        {publishedDate && (
          <p>
            Published on{' '}
            <time dateTime={publishedDate.toISOString()}>
              {publishedDate.toLocaleDateString()}
            </time>
          </p>
        )}
      </header>
      <div
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        aria-live="polite"
        aria-atomic="true"
        role="region"
      />
    </article>
  );
};

export default BlogPost;

import React, { useMemo } from 'react';
import DOMPurify from 'dompurify';

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
  // Ensure that the content is properly sanitized to prevent XSS attacks
  const sanitizedContent = useMemo(() => {
    const sanitizer = DOMPurify.sanitize;
    return sanitizer(content);
  }, [content]);

  return (
    <article aria-label={title}>
      <header>
        <h1>{title}</h1>
        {author && <p>By {author}</p>}
        {publishedDate && (
          <p>
            Published on{' '}
            <time dateTime={publishedDate.toISOString()}>
              {publishedDate.toLocaleDateString()}
            </time>
          </p>
        )}
      </header>
      <div
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        aria-live="polite"
        aria-atomic="true"
        role="region"
      />
    </article>
  );
};

export default BlogPost;