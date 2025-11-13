import React, { useState, useCallback, useEffect, useRef } from 'react';

interface ContentMetadata {
  title: string;
  description?: string;
  keywords?: string[];
  author?: string;
  publicationDate?: string; // ISO 8601 format
  category?: string;
  tags?: string[];
  [key: string]: any; // Allow for custom metadata
}

interface ContentSource {
  type: 'url' | 'text' | 'file';
  url?: string;
  text?: string;
  file?: File;
}

interface ContentProcessingOptions {
  sanitizeHtml?: boolean;
  truncateLength?: number;
  enableCORS?: boolean;
  imageOptimization?: boolean; // Option to enable image optimization
}

interface ContentDisplayOptions {
  theme?: 'light' | 'dark' | 'custom';
  customStyles?: React.CSSProperties;
  truncateTitle?: number;
  truncateDescription?: number;
  enableTextScaling?: boolean; // Option for text scaling
}

interface ContentAnalytics {
  views: number;
  likes: number;
  shares: number;
  lastUpdated: string; // ISO 8601 format
}

interface ContentProps {
  contentSource: ContentSource;
  metadata: ContentMetadata;
  processingOptions?: ContentProcessingOptions;
  displayOptions?: ContentDisplayOptions;
  onError?: (error: Error) => void;
  onLoad?: () => void;
  analytics?: ContentAnalytics;
  fallbackContent?: React.ReactNode;
  debounceLoadTime?: number;
  ariaLabel?: string; // ARIA label for the content container
}

/**
 * Content Component: A versatile component for displaying content from various sources.
 *
 *  Resiliency: Handles loading errors, provides fallback content, and debounces loading.
 *  Edge Cases: Handles empty content, invalid URLs, and large content sizes.
 *  Accessibility: Uses semantic HTML, ARIA attributes, and provides options for text scaling.
 *  Maintainability:  Well-documented, uses functional components and hooks, and is easily extensible.
 */
const Content: React.FC<ContentProps> = ({
  contentSource,
  metadata,
  processingOptions = {},
  displayOptions = {},
  onError,
  onLoad,
  analytics,
  fallbackContent = <p>Content loading...</p>,
  debounceLoadTime = 300,
  ariaLabel = 'Content area',
}) => {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const loadContent = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let fetchedContent: string | null = null;

      switch (contentSource.type) {
        case 'url':
          if (!contentSource.url) {
            throw new Error('URL is required for content source type "url".');
          }

          const corsProxy = processingOptions.enableCORS ? 'https://cors-anywhere.herokuapp.com/' : ''; // Consider a more robust CORS proxy solution.  Ideally, this should be configurable or use a server-side proxy.
          const urlToFetch = `${corsProxy}${contentSource.url}`;

          try {
            const response = await fetch(urlToFetch, {
              signal: AbortSignal.timeout(10000), // Timeout after 10 seconds
            });

            if (!response.ok) {
              throw new Error(`Failed to fetch content from URL: ${contentSource.url} (Status: ${response.status})`);
            }
            fetchedContent = await response.text();
          } catch (fetchError) {
            if (fetchError instanceof Error && fetchError.name === 'AbortError') {
              throw new Error(`Request to ${contentSource.url} timed out.`);
            }
            throw fetchError; // Re-throw other errors
          }
          break;

        case 'text':
          fetchedContent = contentSource.text || '';
          break;

        case 'file':
          if (!contentSource.file) {
            throw new Error('File is required for content source type "file".');
          }

          if (contentSource.file.size > 10 * 1024 * 1024) { // 10MB limit
            throw new Error('File size exceeds the maximum allowed size (10MB).');
          }

          fetchedContent = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              resolve(e.target?.result as string);
            };
            reader.onerror = (e) => {
              reject(new Error('Failed to read file.'));
            };
            reader.readAsText(contentSource.file);
          });
          break;

        default:
          throw new Error(`Invalid content source type: ${contentSource.type}`);
      }

      if (fetchedContent === null || fetchedContent.trim() === '') {
        console.warn('Content is empty.');
        fetchedContent = '<p>No content available.</p>'; // Provide default empty content
      }

      if (processingOptions.sanitizeHtml) {
        // Implement HTML sanitization logic here (e.g., using DOMPurify)
        // fetchedContent = DOMPurify.sanitize(fetchedContent); // Example
        console.warn('HTML sanitization is enabled but not implemented.  Install and configure DOMPurify for production use.');
      }

      if (processingOptions.truncateLength && fetchedContent.length > processingOptions.truncateLength) {
        fetchedContent = fetchedContent.substring(0, processingOptions.truncateLength) + '...';
      }

      setContent(fetchedContent);
      onLoad?.();

    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load content.');
      setError(error);
      onError?.(error);
      console.error('Error loading content:', error);
    } finally {
      setLoading(false);
    }
  }, [contentSource, onError, onLoad, processingOptions]);

  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      loadContent();
    }, debounceLoadTime);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [loadContent, debounceLoadTime]);

  const truncateText = (text: string | undefined, maxLength: number | undefined): string => {
    if (!text) return '';
    if (!maxLength || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const handleTextScaling = useCallback(() => {
    if (displayOptions.enableTextScaling && contentRef.current) {
      // Example implementation: Increase font size by 10%
      const currentFontSize = window.getComputedStyle(contentRef.current).fontSize;
      const newFontSize = parseFloat(currentFontSize) * 1.1 + 'px';
      contentRef.current.style.fontSize = newFontSize;
    }
  }, [displayOptions.enableTextScaling]);

  useEffect(() => {
    if (displayOptions.enableTextScaling) {
      handleTextScaling(); // Apply initial scaling if enabled

      // Consider adding event listeners for zoom changes if needed
      // window.addEventListener('resize', handleTextScaling);
      // return () => window.removeEventListener('resize', handleTextScaling);
    }
  }, [displayOptions.enableTextScaling, handleTextScaling]);

  const renderContent = () => {
    if (loading) {
      return (
        <div aria-busy="true" role="alert">
          {fallbackContent}
        </div>
      );
    }

    if (error) {
      return (
        <div role="alert" aria-live="assertive">
          <p>Error loading content: {error.message}</p>
        </div>
      );
    }

    if (content === null) {
      return <p>No content available.</p>;
    }

    return (
      <div
        ref={contentRef}
        style={displayOptions.customStyles}
        aria-label={ariaLabel}
        className="content-container" // Add a class for easier styling
      >
        {metadata.title && <h1 className="content-title">{truncateText(metadata.title, displayOptions.truncateTitle)}</h1>}
        {metadata.description && <p className="content-description">{truncateText(metadata.description, displayOptions.truncateDescription)}</p>}
        <div
          className="content-body"
          dangerouslySetInnerHTML={{ __html: content }}
        />
        {displayOptions.enableTextScaling && (
          <button onClick={handleTextScaling}>Increase Text Size</button>
        )}
      </div>
    );
  };

  return renderContent();
};

export default Content;

import React, { useState, useCallback, useEffect, useRef } from 'react';

interface ContentMetadata {
  title: string;
  description?: string;
  keywords?: string[];
  author?: string;
  publicationDate?: string; // ISO 8601 format
  category?: string;
  tags?: string[];
  [key: string]: any; // Allow for custom metadata
}

interface ContentSource {
  type: 'url' | 'text' | 'file';
  url?: string;
  text?: string;
  file?: File;
}

interface ContentProcessingOptions {
  sanitizeHtml?: boolean;
  truncateLength?: number;
  enableCORS?: boolean;
  imageOptimization?: boolean; // Option to enable image optimization
}

interface ContentDisplayOptions {
  theme?: 'light' | 'dark' | 'custom';
  customStyles?: React.CSSProperties;
  truncateTitle?: number;
  truncateDescription?: number;
  enableTextScaling?: boolean; // Option for text scaling
}

interface ContentAnalytics {
  views: number;
  likes: number;
  shares: number;
  lastUpdated: string; // ISO 8601 format
}

interface ContentProps {
  contentSource: ContentSource;
  metadata: ContentMetadata;
  processingOptions?: ContentProcessingOptions;
  displayOptions?: ContentDisplayOptions;
  onError?: (error: Error) => void;
  onLoad?: () => void;
  analytics?: ContentAnalytics;
  fallbackContent?: React.ReactNode;
  debounceLoadTime?: number;
  ariaLabel?: string; // ARIA label for the content container
}

/**
 * Content Component: A versatile component for displaying content from various sources.
 *
 *  Resiliency: Handles loading errors, provides fallback content, and debounces loading.
 *  Edge Cases: Handles empty content, invalid URLs, and large content sizes.
 *  Accessibility: Uses semantic HTML, ARIA attributes, and provides options for text scaling.
 *  Maintainability:  Well-documented, uses functional components and hooks, and is easily extensible.
 */
const Content: React.FC<ContentProps> = ({
  contentSource,
  metadata,
  processingOptions = {},
  displayOptions = {},
  onError,
  onLoad,
  analytics,
  fallbackContent = <p>Content loading...</p>,
  debounceLoadTime = 300,
  ariaLabel = 'Content area',
}) => {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const loadContent = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let fetchedContent: string | null = null;

      switch (contentSource.type) {
        case 'url':
          if (!contentSource.url) {
            throw new Error('URL is required for content source type "url".');
          }

          const corsProxy = processingOptions.enableCORS ? 'https://cors-anywhere.herokuapp.com/' : ''; // Consider a more robust CORS proxy solution.  Ideally, this should be configurable or use a server-side proxy.
          const urlToFetch = `${corsProxy}${contentSource.url}`;

          try {
            const response = await fetch(urlToFetch, {
              signal: AbortSignal.timeout(10000), // Timeout after 10 seconds
            });

            if (!response.ok) {
              throw new Error(`Failed to fetch content from URL: ${contentSource.url} (Status: ${response.status})`);
            }
            fetchedContent = await response.text();
          } catch (fetchError) {
            if (fetchError instanceof Error && fetchError.name === 'AbortError') {
              throw new Error(`Request to ${contentSource.url} timed out.`);
            }
            throw fetchError; // Re-throw other errors
          }
          break;

        case 'text':
          fetchedContent = contentSource.text || '';
          break;

        case 'file':
          if (!contentSource.file) {
            throw new Error('File is required for content source type "file".');
          }

          if (contentSource.file.size > 10 * 1024 * 1024) { // 10MB limit
            throw new Error('File size exceeds the maximum allowed size (10MB).');
          }

          fetchedContent = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              resolve(e.target?.result as string);
            };
            reader.onerror = (e) => {
              reject(new Error('Failed to read file.'));
            };
            reader.readAsText(contentSource.file);
          });
          break;

        default:
          throw new Error(`Invalid content source type: ${contentSource.type}`);
      }

      if (fetchedContent === null || fetchedContent.trim() === '') {
        console.warn('Content is empty.');
        fetchedContent = '<p>No content available.</p>'; // Provide default empty content
      }

      if (processingOptions.sanitizeHtml) {
        // Implement HTML sanitization logic here (e.g., using DOMPurify)
        // fetchedContent = DOMPurify.sanitize(fetchedContent); // Example
        console.warn('HTML sanitization is enabled but not implemented.  Install and configure DOMPurify for production use.');
      }

      if (processingOptions.truncateLength && fetchedContent.length > processingOptions.truncateLength) {
        fetchedContent = fetchedContent.substring(0, processingOptions.truncateLength) + '...';
      }

      setContent(fetchedContent);
      onLoad?.();

    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load content.');
      setError(error);
      onError?.(error);
      console.error('Error loading content:', error);
    } finally {
      setLoading(false);
    }
  }, [contentSource, onError, onLoad, processingOptions]);

  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      loadContent();
    }, debounceLoadTime);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [loadContent, debounceLoadTime]);

  const truncateText = (text: string | undefined, maxLength: number | undefined): string => {
    if (!text) return '';
    if (!maxLength || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const handleTextScaling = useCallback(() => {
    if (displayOptions.enableTextScaling && contentRef.current) {
      // Example implementation: Increase font size by 10%
      const currentFontSize = window.getComputedStyle(contentRef.current).fontSize;
      const newFontSize = parseFloat(currentFontSize) * 1.1 + 'px';
      contentRef.current.style.fontSize = newFontSize;
    }
  }, [displayOptions.enableTextScaling]);

  useEffect(() => {
    if (displayOptions.enableTextScaling) {
      handleTextScaling(); // Apply initial scaling if enabled

      // Consider adding event listeners for zoom changes if needed
      // window.addEventListener('resize', handleTextScaling);
      // return () => window.removeEventListener('resize', handleTextScaling);
    }
  }, [displayOptions.enableTextScaling, handleTextScaling]);

  const renderContent = () => {
    if (loading) {
      return (
        <div aria-busy="true" role="alert">
          {fallbackContent}
        </div>
      );
    }

    if (error) {
      return (
        <div role="alert" aria-live="assertive">
          <p>Error loading content: {error.message}</p>
        </div>
      );
    }

    if (content === null) {
      return <p>No content available.</p>;
    }

    return (
      <div
        ref={contentRef}
        style={displayOptions.customStyles}
        aria-label={ariaLabel}
        className="content-container" // Add a class for easier styling
      >
        {metadata.title && <h1 className="content-title">{truncateText(metadata.title, displayOptions.truncateTitle)}</h1>}
        {metadata.description && <p className="content-description">{truncateText(metadata.description, displayOptions.truncateDescription)}</p>}
        <div
          className="content-body"
          dangerouslySetInnerHTML={{ __html: content }}
        />
        {displayOptions.enableTextScaling && (
          <button onClick={handleTextScaling}>Increase Text Size</button>
        )}
      </div>
    );
  };

  return renderContent();
};

export default Content;