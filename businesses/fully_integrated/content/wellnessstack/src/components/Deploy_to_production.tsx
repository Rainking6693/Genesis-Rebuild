import React, { FC, ReactNode, useEffect, useState } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  children: ReactNode;
  message?: string;
}

const MyComponent: FC<Props> = ({ children, message }) => {
  const [htmlContent, setHtmlContent] = useState(children);

  useEffect(() => {
    if (message) {
      sanitizeAndSetHtmlContent(message);
    }
  }, [message, htmlContent]); // Add htmlContent to dependency array to prevent infinite loops

  const sanitizeAndSetHtmlContent = (html: string) => {
    try {
      const sanitizedHtml = DOMPurify.sanitize(html);
      setHtmlContent(sanitizedHtml);
    } catch (error) {
      console.error('Error sanitizing HTML content:', error);
    }
  };

  // Add aria-label for accessibility
  const ariaLabel = htmlContent ? 'HTML content' : 'No HTML content';

  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} aria-label={ariaLabel} />
      {!htmlContent && <div>No HTML content available</div>}
    </div>
  );
};

MyComponent.error = (error: Error) => {
  console.error('Error rendering MyComponent:', error);
};

export default MyComponent;

import React, { FC, ReactNode, useEffect, useState } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  children: ReactNode;
  message?: string;
}

const MyComponent: FC<Props> = ({ children, message }) => {
  const [htmlContent, setHtmlContent] = useState(children);

  useEffect(() => {
    if (message) {
      sanitizeAndSetHtmlContent(message);
    }
  }, [message, htmlContent]); // Add htmlContent to dependency array to prevent infinite loops

  const sanitizeAndSetHtmlContent = (html: string) => {
    try {
      const sanitizedHtml = DOMPurify.sanitize(html);
      setHtmlContent(sanitizedHtml);
    } catch (error) {
      console.error('Error sanitizing HTML content:', error);
    }
  };

  // Add aria-label for accessibility
  const ariaLabel = htmlContent ? 'HTML content' : 'No HTML content';

  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} aria-label={ariaLabel} />
      {!htmlContent && <div>No HTML content available</div>}
    </div>
  );
};

MyComponent.error = (error: Error) => {
  console.error('Error rendering MyComponent:', error);
};

export default MyComponent;