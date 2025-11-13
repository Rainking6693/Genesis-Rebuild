import React from 'react';

interface MyComponentProps {
  title?: string;
  content?: string;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, content }) => {
  return (
    <div
      data-testid="my-component"
      role="region"
      aria-live="polite"
      aria-label={title || 'No content available'}
    >
      {title && (
        <h1 data-testid="title" id="my-component-title">
          {title}
        </h1>
      )}
      {content && (
        <p data-testid="content" aria-describedby="my-component-title">
          {content}
        </p>
      )}
      {!title && !content && (
        <div data-testid="empty-message" role="alert">
          No content available.
        </div>
      )}
    </div>
  );
};

export default MyComponent;

import React from 'react';

interface MyComponentProps {
  title?: string;
  content?: string;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, content }) => {
  return (
    <div
      data-testid="my-component"
      role="region"
      aria-live="polite"
      aria-label={title || 'No content available'}
    >
      {title && (
        <h1 data-testid="title" id="my-component-title">
          {title}
        </h1>
      )}
      {content && (
        <p data-testid="content" aria-describedby="my-component-title">
          {content}
        </p>
      )}
      {!title && !content && (
        <div data-testid="empty-message" role="alert">
          No content available.
        </div>
      )}
    </div>
  );
};

export default MyComponent;