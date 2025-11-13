import React, { useState, useEffect, useCallback, useMemo } from 'react';
import DOMPurify from 'dompurify';
import { marked } from 'marked';

interface BlogPostProps {
  title: string;
  content: string;
  className?: string; // For custom styling
  errorContent?: React.ReactNode; // Content to display on error
}

const BlogPost: React.FC<BlogPostProps> = ({ title, content, className = '', errorContent }) => {
  // State for error handling
  const [hasError, setHasError] = useState(false);

  // Memoize the safe title to avoid unnecessary re-renders
  const safeTitle = useMemo(() => {
    return title?.trim() || 'Untitled'; // Trim whitespace
  }, [title]);

  // Function to sanitize and render content (using useCallback for memoization)
  const renderContent = useCallback(() => {
    try {
      if (!content) {
        return 'No content available.';
      }

      // Sanitize the content using DOMPurify and render markdown
      const sanitizedContent = DOMPurify.sanitize(marked(content));
      return sanitizedContent;
    } catch (error) {
      console.error('Error rendering blog post content:', error);
      setHasError(true);
      return null; // Return null to prevent rendering potentially unsafe content
    }
  }, [content]);

  // Memoize the rendered content
  const renderedContent = useMemo(() => renderContent(), [renderContent]);

  // Error boundary fallback
  if (hasError) {
    return (
      <article className={`blog-post error ${className}`} aria-label="Error displaying blog post" role="alert">
        <header>
          <h1>Error</h1>
        </header>
        <section>
          {errorContent || <p>An error occurred while displaying this blog post.</p>}
        </section>
      </article>
    );
  }

  return (
    <article className={`blog-post ${className}`} aria-label={safeTitle} role="article">
      <header>
        <h1 id="blog-post-title">{safeTitle}</h1>
      </header>
      <section aria-describedby="blog-post-title">
        {renderedContent && (
          <div dangerouslySetInnerHTML={{ __html: renderedContent }} />
        )}
        {!renderedContent && <p>Loading content...</p>}
      </section>
    </article>
  );
};

export default BlogPost;

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import DOMPurify from 'dompurify';
import { marked } from 'marked';

interface BlogPostProps {
  title: string;
  content: string;
  className?: string; // For custom styling
  errorContent?: React.ReactNode; // Content to display on error
}

const BlogPost: React.FC<BlogPostProps> = ({ title, content, className = '', errorContent }) => {
  // State for error handling
  const [hasError, setHasError] = useState(false);

  // Memoize the safe title to avoid unnecessary re-renders
  const safeTitle = useMemo(() => {
    return title?.trim() || 'Untitled'; // Trim whitespace
  }, [title]);

  // Function to sanitize and render content (using useCallback for memoization)
  const renderContent = useCallback(() => {
    try {
      if (!content) {
        return 'No content available.';
      }

      // Sanitize the content using DOMPurify and render markdown
      const sanitizedContent = DOMPurify.sanitize(marked(content));
      return sanitizedContent;
    } catch (error) {
      console.error('Error rendering blog post content:', error);
      setHasError(true);
      return null; // Return null to prevent rendering potentially unsafe content
    }
  }, [content]);

  // Memoize the rendered content
  const renderedContent = useMemo(() => renderContent(), [renderContent]);

  // Error boundary fallback
  if (hasError) {
    return (
      <article className={`blog-post error ${className}`} aria-label="Error displaying blog post" role="alert">
        <header>
          <h1>Error</h1>
        </header>
        <section>
          {errorContent || <p>An error occurred while displaying this blog post.</p>}
        </section>
      </article>
    );
  }

  return (
    <article className={`blog-post ${className}`} aria-label={safeTitle} role="article">
      <header>
        <h1 id="blog-post-title">{safeTitle}</h1>
      </header>
      <section aria-describedby="blog-post-title">
        {renderedContent && (
          <div dangerouslySetInnerHTML={{ __html: renderedContent }} />
        )}
        {!renderedContent && <p>Loading content...</p>}
      </section>
    </article>
  );
};

export default BlogPost;