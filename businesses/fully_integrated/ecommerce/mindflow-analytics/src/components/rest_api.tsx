import React, { useState, useEffect } from 'react';

interface MyComponentProps {
  title: string;
  content: string;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, content }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate asynchronous data fetching
    const timer = setTimeout(() => {
      if (!title || !content) {
        setError('Title and content are required.');
      } else {
        setIsLoading(false);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [title, content]);

  if (isLoading) {
    return (
      <div data-testid="my-component">
        <h1 data-testid="component-title">Loading...</h1>
        <p data-testid="component-content">Please wait while the content is being loaded.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div data-testid="my-component">
        <h1 data-testid="component-title">Error</h1>
        <p data-testid="component-content">{error}</p>
      </div>
    );
  }

  return (
    <div data-testid="my-component" role="article" aria-label={title}>
      <h1 data-testid="component-title" aria-live="polite">
        {title}
      </h1>
      <p data-testid="component-content" aria-live="polite">
        {content}
      </p>
    </div>
  );
};

export default MyComponent;

import React, { useState, useEffect } from 'react';

interface MyComponentProps {
  title: string;
  content: string;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, content }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate asynchronous data fetching
    const timer = setTimeout(() => {
      if (!title || !content) {
        setError('Title and content are required.');
      } else {
        setIsLoading(false);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [title, content]);

  if (isLoading) {
    return (
      <div data-testid="my-component">
        <h1 data-testid="component-title">Loading...</h1>
        <p data-testid="component-content">Please wait while the content is being loaded.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div data-testid="my-component">
        <h1 data-testid="component-title">Error</h1>
        <p data-testid="component-content">{error}</p>
      </div>
    );
  }

  return (
    <div data-testid="my-component" role="article" aria-label={title}>
      <h1 data-testid="component-title" aria-live="polite">
        {title}
      </h1>
      <p data-testid="component-content" aria-live="polite">
        {content}
      </p>
    </div>
  );
};

export default MyComponent;