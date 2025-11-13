import React, { ReactElement } from 'react';

interface MyComponentProps {
  title?: string;
  content?: string;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, content }): ReactElement => {
  return (
    <div
      data-testid="my-component"
      role="region"
      aria-label="My Component"
      aria-live={!title && !content ? 'polite' : undefined}
    >
      {title ? (
        <h1 data-testid="title" id="my-component-title">
          {title}
        </h1>
      ) : null}
      {content ? (
        <p data-testid="content" aria-describedby="my-component-title">
          {content}
        </p>
      ) : null}
      {!title && !content && (
        <p data-testid="empty-message">No content available.</p>
      )}
    </div>
  );
};

export default MyComponent;

import React, { ReactElement } from 'react';

interface MyComponentProps {
  title?: string;
  content?: string;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, content }): ReactElement => {
  return (
    <div
      data-testid="my-component"
      role="region"
      aria-label="My Component"
      aria-live={!title && !content ? 'polite' : undefined}
    >
      {title ? (
        <h1 data-testid="title" id="my-component-title">
          {title}
        </h1>
      ) : null}
      {content ? (
        <p data-testid="content" aria-describedby="my-component-title">
          {content}
        </p>
      ) : null}
      {!title && !content && (
        <p data-testid="empty-message">No content available.</p>
      )}
    </div>
  );
};

export default MyComponent;