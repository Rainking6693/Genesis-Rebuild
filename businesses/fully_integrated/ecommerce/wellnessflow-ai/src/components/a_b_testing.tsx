import React from 'react';

interface MyComponentProps {
  title?: string;
  content?: string;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, content }) => {
  return (
    <div
      data-testid="my-component"
      aria-live="polite"
      aria-atomic="true"
      role="region"
    >
      {title && (
        <h1 data-testid="title" aria-label={title}>
          {title}
        </h1>
      )}
      {content && (
        <p data-testid="content" aria-label={content}>
          {content}
        </p>
      )}
      {!title && !content && (
        <div data-testid="empty-component" aria-label="No content available">
          No content available
        </div>
      )}
    </div>
  );
};

export default React.memo(MyComponent);

import React from 'react';

interface MyComponentProps {
  title?: string;
  content?: string;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, content }) => {
  return (
    <div
      data-testid="my-component"
      aria-live="polite"
      aria-atomic="true"
      role="region"
    >
      {title && (
        <h1 data-testid="title" aria-label={title}>
          {title}
        </h1>
      )}
      {content && (
        <p data-testid="content" aria-label={content}>
          {content}
        </p>
      )}
      {!title && !content && (
        <div data-testid="empty-component" aria-label="No content available">
          No content available
        </div>
      )}
    </div>
  );
};

export default React.memo(MyComponent);