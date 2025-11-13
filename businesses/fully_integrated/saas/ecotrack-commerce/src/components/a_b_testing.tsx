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
      aria-label="My Component"
      aria-live="polite"
    >
      {title ? (
        <h1 data-testid="title" id="my-component-title">
          {title}
        </h1>
      ) : (
        <p data-testid="empty-message">No title to display.</p>
      )}
      {content ? (
        <p data-testid="content" aria-describedby="my-component-title">
          {content}
        </p>
      ) : (
        <p data-testid="empty-message">No content to display.</p>
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
      aria-label="My Component"
      aria-live="polite"
    >
      {title ? (
        <h1 data-testid="title" id="my-component-title">
          {title}
        </h1>
      ) : (
        <p data-testid="empty-message">No title to display.</p>
      )}
      {content ? (
        <p data-testid="content" aria-describedby="my-component-title">
          {content}
        </p>
      ) : (
        <p data-testid="empty-message">No content to display.</p>
      )}
    </div>
  );
};

export default MyComponent;