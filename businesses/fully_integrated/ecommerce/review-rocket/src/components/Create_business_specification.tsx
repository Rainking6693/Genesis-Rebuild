import React, { useMemo, useState, useEffect } from 'react';

interface MyComponentProps {
  title: string;
  content: string;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, content }) => {
  const [sanitizedTitle, setSanitizedTitle] = useState<string>('');
  const [sanitizedContent, setSanitizedContent] = useState<string>('');

  useEffect(() => {
    // Sanitize input to prevent XSS attacks
    setSanitizedTitle(sanitizeInput(title));
    setSanitizedContent(sanitizeInput(content));
  }, [title, content]);

  // Sanitize input to prevent XSS attacks
  const sanitizeInput = (input: string): string => {
    return input.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  };

  return (
    <div className="my-component" aria-label="My Component">
      <h1 className="my-component__title" tabIndex={0}>
        {sanitizedTitle || 'Loading...'}
      </h1>
      <p className="my-component__content" tabIndex={0}>
        {sanitizedContent || 'Loading...'}
      </p>
    </div>
  );
};

export default MyComponent;

import React, { useMemo, useState, useEffect } from 'react';

interface MyComponentProps {
  title: string;
  content: string;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, content }) => {
  const [sanitizedTitle, setSanitizedTitle] = useState<string>('');
  const [sanitizedContent, setSanitizedContent] = useState<string>('');

  useEffect(() => {
    // Sanitize input to prevent XSS attacks
    setSanitizedTitle(sanitizeInput(title));
    setSanitizedContent(sanitizeInput(content));
  }, [title, content]);

  // Sanitize input to prevent XSS attacks
  const sanitizeInput = (input: string): string => {
    return input.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  };

  return (
    <div className="my-component" aria-label="My Component">
      <h1 className="my-component__title" tabIndex={0}>
        {sanitizedTitle || 'Loading...'}
      </h1>
      <p className="my-component__content" tabIndex={0}>
        {sanitizedContent || 'Loading...'}
      </p>
    </div>
  );
};

export default MyComponent;