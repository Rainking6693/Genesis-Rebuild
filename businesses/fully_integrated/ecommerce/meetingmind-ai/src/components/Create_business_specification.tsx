import React, { memo, useMemo, useState, useEffect } from 'react';

interface MyComponentProps {
  title: string;
  content: string;
}

const sanitizeHTML = (input: string): string => {
  return input.replace(/</g, '&lt;').replace(/>/g, '&gt;');
};

const MyComponent: React.FC<MyComponentProps> = memo(({ title, content }) => {
  const [sanitizedTitle, setSanitizedTitle] = useState<string>('');
  const [sanitizedContent, setSanitizedContent] = useState<string>('');

  useEffect(() => {
    try {
      setSanitizedTitle(sanitizeHTML(title));
      setSanitizedContent(sanitizeHTML(content));
    } catch (error) {
      console.error('Error sanitizing input:', error);
      setSanitizedTitle('Error: Invalid input');
      setSanitizedContent('Error: Invalid input');
    }
  }, [title, content]);

  return (
    <div className="my-component" aria-label={sanitizedTitle}>
      <h1 className="my-component__title" tabIndex={0}>
        {sanitizedTitle}
      </h1>
      <p className="my-component__content" tabIndex={0}>
        {sanitizedContent}
      </p>
    </div>
  );
});

MyComponent.displayName = 'MyComponent';

export default MyComponent;

import React, { memo, useMemo, useState, useEffect } from 'react';

interface MyComponentProps {
  title: string;
  content: string;
}

const sanitizeHTML = (input: string): string => {
  return input.replace(/</g, '&lt;').replace(/>/g, '&gt;');
};

const MyComponent: React.FC<MyComponentProps> = memo(({ title, content }) => {
  const [sanitizedTitle, setSanitizedTitle] = useState<string>('');
  const [sanitizedContent, setSanitizedContent] = useState<string>('');

  useEffect(() => {
    try {
      setSanitizedTitle(sanitizeHTML(title));
      setSanitizedContent(sanitizeHTML(content));
    } catch (error) {
      console.error('Error sanitizing input:', error);
      setSanitizedTitle('Error: Invalid input');
      setSanitizedContent('Error: Invalid input');
    }
  }, [title, content]);

  return (
    <div className="my-component" aria-label={sanitizedTitle}>
      <h1 className="my-component__title" tabIndex={0}>
        {sanitizedTitle}
      </h1>
      <p className="my-component__content" tabIndex={0}>
        {sanitizedContent}
      </p>
    </div>
  );
});

MyComponent.displayName = 'MyComponent';

export default MyComponent;