import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { sanitizeHTML } from './utils';

export interface BlogPostProps {
  title: string;
  content: string;
  author: string;
  publishedDate: string | number | Date; // Allow different date formats
  className?: string; // Optional class name for styling
  onError?: (error: Error) => void; // Optional error handler
}

const BlogPost: React.FC<BlogPostProps> = ({
  title,
  content,
  author,
  publishedDate,
  className,
  onError,
}) => {
  const [sanitizedContent, setSanitizedContent] = useState<string>('');
  const [dateError, setDateError] = useState<boolean>(false);

  const handleSanitizeError = useCallback((error: Error) => {
    console.error('Error sanitizing content:', error);
    onError?.(error); // Call the provided error handler if available
    setSanitizedContent(
      '<p>Error displaying content. Please contact support.</p>'
    ); // Fallback content
  }, [onError]);

  useEffect(() => {
    try {
      setSanitizedContent(sanitizeHTML(content));
    } catch (error: any) {
      handleSanitizeError(error);
    }
  }, [content, handleSanitizeError]);

  const formattedPublishedDate = useMemo(() => {
    try {
      const date = new Date(publishedDate);

      if (isNaN(date.getTime())) {
        setDateError(true);
        return 'Invalid Date';
      }

      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (error: any) {
      console.error('Error formatting date:', error);
      setDateError(true);
      return 'Invalid Date';
    }
  }, [publishedDate]);

  const ariaLabel = `Blog Post: ${title || 'Untitled'}`;

  return (
    <article className={`blog-post ${className || ''}`} aria-label={ariaLabel}>
      <header>
        <h1 className="blog-post__title">{title || 'Untitled'}</h1>
        <p className="blog-post__author">
          By{' '}
          <span className="blog-post__author-name">
            {author || 'Unknown Author'}
          </span>
        </p>
        <p className="blog-post__published-date">
          Published on{' '}
          {dateError ? (
            <span aria-invalid="true" role="alert">
              Invalid Date
            </span>
          ) : (
            formattedPublishedDate || 'Unknown Date'
          )}
        </p>
      </header>
      <div
        className="blog-post__content"
        dangerouslySetInnerHTML={{ __html: sanitizedContent || '' }}
      />
      {sanitizedContent ===
        '<p>Error displaying content. Please contact support.</p>' && (
        <div role="alert" className="error-message">
          There was an error displaying the blog post content. Please contact
          support.
        </div>
      )}
    </article>
  );
};

export default BlogPost;

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { sanitizeHTML } from './utils';

export interface BlogPostProps {
  title: string;
  content: string;
  author: string;
  publishedDate: string | number | Date; // Allow different date formats
  className?: string; // Optional class name for styling
  onError?: (error: Error) => void; // Optional error handler
}

const BlogPost: React.FC<BlogPostProps> = ({
  title,
  content,
  author,
  publishedDate,
  className,
  onError,
}) => {
  const [sanitizedContent, setSanitizedContent] = useState<string>('');
  const [dateError, setDateError] = useState<boolean>(false);

  const handleSanitizeError = useCallback((error: Error) => {
    console.error('Error sanitizing content:', error);
    onError?.(error); // Call the provided error handler if available
    setSanitizedContent(
      '<p>Error displaying content. Please contact support.</p>'
    ); // Fallback content
  }, [onError]);

  useEffect(() => {
    try {
      setSanitizedContent(sanitizeHTML(content));
    } catch (error: any) {
      handleSanitizeError(error);
    }
  }, [content, handleSanitizeError]);

  const formattedPublishedDate = useMemo(() => {
    try {
      const date = new Date(publishedDate);

      if (isNaN(date.getTime())) {
        setDateError(true);
        return 'Invalid Date';
      }

      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (error: any) {
      console.error('Error formatting date:', error);
      setDateError(true);
      return 'Invalid Date';
    }
  }, [publishedDate]);

  const ariaLabel = `Blog Post: ${title || 'Untitled'}`;

  return (
    <article className={`blog-post ${className || ''}`} aria-label={ariaLabel}>
      <header>
        <h1 className="blog-post__title">{title || 'Untitled'}</h1>
        <p className="blog-post__author">
          By{' '}
          <span className="blog-post__author-name">
            {author || 'Unknown Author'}
          </span>
        </p>
        <p className="blog-post__published-date">
          Published on{' '}
          {dateError ? (
            <span aria-invalid="true" role="alert">
              Invalid Date
            </span>
          ) : (
            formattedPublishedDate || 'Unknown Date'
          )}
        </p>
      </header>
      <div
        className="blog-post__content"
        dangerouslySetInnerHTML={{ __html: sanitizedContent || '' }}
      />
      {sanitizedContent ===
        '<p>Error displaying content. Please contact support.</p>' && (
        <div role="alert" className="error-message">
          There was an error displaying the blog post content. Please contact
          support.
        </div>
      )}
    </article>
  );
};

export default BlogPost;