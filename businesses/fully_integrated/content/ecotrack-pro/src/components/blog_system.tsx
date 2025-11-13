import React, { useState, useMemo, useEffect } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  content: string;
}

const BlogComponent: React.FC<Props> = ({ content }) => {
  const [sanitizedContent, setSanitizedContent] = useState<string>('');
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      const sanitized = DOMPurify.sanitize(content);
      setSanitizedContent(sanitized);
    } catch (error) {
      setError(error);
      setSanitizedContent('');
    }
  }, [content]);

  const handleError = (error: Error) => {
    console.error(error);
    setError(error);
    setSanitizedContent('');
  };

  const sanitizedHtml = useMemo(() => sanitizedContent || '', [sanitizedContent]);

  return (
    <div>
      <h1 aria-level={1}>Blog Post</h1>
      {error && <p>An error occurred while sanitizing the content. Please refresh the page.</p>}
      <div
        // Adding 'dangerouslySetInnerHTML' for sanitized content
        // This allows us to set HTML content safely without XSS vulnerabilities
        dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
      />
    </div>
  );
};

export default BlogComponent;

import React, { useState, useMemo, useEffect } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  content: string;
}

const BlogComponent: React.FC<Props> = ({ content }) => {
  const [sanitizedContent, setSanitizedContent] = useState<string>('');
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      const sanitized = DOMPurify.sanitize(content);
      setSanitizedContent(sanitized);
    } catch (error) {
      setError(error);
      setSanitizedContent('');
    }
  }, [content]);

  const handleError = (error: Error) => {
    console.error(error);
    setError(error);
    setSanitizedContent('');
  };

  const sanitizedHtml = useMemo(() => sanitizedContent || '', [sanitizedContent]);

  return (
    <div>
      <h1 aria-level={1}>Blog Post</h1>
      {error && <p>An error occurred while sanitizing the content. Please refresh the page.</p>}
      <div
        // Adding 'dangerouslySetInnerHTML' for sanitized content
        // This allows us to set HTML content safely without XSS vulnerabilities
        dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
      />
    </div>
  );
};

export default BlogComponent;