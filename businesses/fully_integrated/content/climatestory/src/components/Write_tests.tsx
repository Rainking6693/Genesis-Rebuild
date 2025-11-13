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
      aria-label="Content Section"
      aria-live="polite"
    >
      {title && (
        <h1 data-testid="title" id="content-title">
          {title}
        </h1>
      )}
      {content && (
        <p data-testid="content" id="content-body">
          {content}
        </p>
      )}
      {!title && !content && (
        <div data-testid="empty-component" role="alert">
          No content to display.
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
      aria-label="Content Section"
      aria-live="polite"
    >
      {title && (
        <h1 data-testid="title" id="content-title">
          {title}
        </h1>
      )}
      {content && (
        <p data-testid="content" id="content-body">
          {content}
        </p>
      )}
      {!title && !content && (
        <div data-testid="empty-component" role="alert">
          No content to display.
        </div>
      )}
    </div>
  );
};

export default MyComponent;