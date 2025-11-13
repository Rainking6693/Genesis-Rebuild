import React, { useState, useEffect, useCallback } from 'react';
import DOMPurify from 'dompurify';
import { marked, Renderer } from 'marked';

interface BlogPostProps {
  title: string;
  content: string;
  className?: string; // For custom styling
  errorTitle?: string; // Default error title
  errorMessage?: string; // Default error message
}

const defaultErrorTitle = 'Oops! Something went wrong.';
const defaultErrorMessage = 'We\'re sorry, but we encountered an issue while displaying this blog post. Please try again later.';

const BlogPost: React.FC<BlogPostProps> = ({
  title,
  content,
  className = '',
  errorTitle = defaultErrorTitle,
  errorMessage = defaultErrorMessage,
}) => {
  const [safeContent, setSafeContent] = useState<string | null>(null);
  const [error, setError] = useState<boolean>(false);

  const sanitizeAndSetContent = useCallback(async () => {
    try {
      if (!content) {
        throw new Error('Blog post content is empty.'); // Handle empty content
      }

      // Convert Markdown to HTML using a custom renderer
      const renderer = new Renderer();
      renderer.link = (href, title, text) => {
        return `<a href="${href}" title="${title || ''}" target="_blank" rel="noopener noreferrer">${text}</a>`;
      };
      const htmlContent = marked(content, { renderer });

      // Sanitize HTML to prevent XSS attacks
      const cleanHtml = DOMPurify.sanitize(htmlContent, {
        ALLOWED_TAGS: ['a', 'b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
        ALLOWED_ATTR: ['href', 'title', 'target', 'rel'],
      });

      setSafeContent(cleanHtml);
      setError(false); // Reset error state if successful
    } catch (err) {
      console.error('Error processing blog post content:', err);
      setSafeContent(null);
      setError(true);
    }
  }, [content]);

  useEffect(() => {
    sanitizeAndSetContent();
  }, [content, sanitizeAndSetContent]);

  if (error) {
    return (
      <article className={`blog-post error ${className}`} aria-label="Blog Post - Error">
        <header>
          <h1>{errorTitle}</h1>
        </header>
        <section>
          <p>{errorMessage}</p>
        </section>
      </article>
    );
  }

  if (!safeContent) {
    return (
      <article className={`blog-post loading ${className}`} aria-label="Blog Post - Loading">
        <header>
          <h1>Loading...</h1>
        </header>
        <section>
          <p>Please wait, loading blog post content.</p>
        </section>
      </article>
    );
  }

  return (
    <article className={`blog-post ${className}`} aria-label={`Blog Post - ${title}`}>
      <header>
        <h1>{title}</h1>
      </header>
      <section dangerouslySetInnerHTML={{ __html: safeContent }} />
    </article>
  );
};

export default BlogPost;

import React, { useState, useEffect, useCallback } from 'react';
import DOMPurify from 'dompurify';
import { marked, Renderer } from 'marked';

interface BlogPostProps {
  title: string;
  content: string;
  className?: string; // For custom styling
  errorTitle?: string; // Default error title
  errorMessage?: string; // Default error message
}

const defaultErrorTitle = 'Oops! Something went wrong.';
const defaultErrorMessage = 'We\'re sorry, but we encountered an issue while displaying this blog post. Please try again later.';

const BlogPost: React.FC<BlogPostProps> = ({
  title,
  content,
  className = '',
  errorTitle = defaultErrorTitle,
  errorMessage = defaultErrorMessage,
}) => {
  const [safeContent, setSafeContent] = useState<string | null>(null);
  const [error, setError] = useState<boolean>(false);

  const sanitizeAndSetContent = useCallback(async () => {
    try {
      if (!content) {
        throw new Error('Blog post content is empty.'); // Handle empty content
      }

      // Convert Markdown to HTML using a custom renderer
      const renderer = new Renderer();
      renderer.link = (href, title, text) => {
        return `<a href="${href}" title="${title || ''}" target="_blank" rel="noopener noreferrer">${text}</a>`;
      };
      const htmlContent = marked(content, { renderer });

      // Sanitize HTML to prevent XSS attacks
      const cleanHtml = DOMPurify.sanitize(htmlContent, {
        ALLOWED_TAGS: ['a', 'b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
        ALLOWED_ATTR: ['href', 'title', 'target', 'rel'],
      });

      setSafeContent(cleanHtml);
      setError(false); // Reset error state if successful
    } catch (err) {
      console.error('Error processing blog post content:', err);
      setSafeContent(null);
      setError(true);
    }
  }, [content]);

  useEffect(() => {
    sanitizeAndSetContent();
  }, [content, sanitizeAndSetContent]);

  if (error) {
    return (
      <article className={`blog-post error ${className}`} aria-label="Blog Post - Error">
        <header>
          <h1>{errorTitle}</h1>
        </header>
        <section>
          <p>{errorMessage}</p>
        </section>
      </article>
    );
  }

  if (!safeContent) {
    return (
      <article className={`blog-post loading ${className}`} aria-label="Blog Post - Loading">
        <header>
          <h1>Loading...</h1>
        </header>
        <section>
          <p>Please wait, loading blog post content.</p>
        </section>
      </article>
    );
  }

  return (
    <article className={`blog-post ${className}`} aria-label={`Blog Post - ${title}`}>
      <header>
        <h1>{title}</h1>
      </header>
      <section dangerouslySetInnerHTML={{ __html: safeContent }} />
    </article>
  );
};

export default BlogPost;