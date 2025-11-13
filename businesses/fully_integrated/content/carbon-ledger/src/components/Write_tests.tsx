import React, { ReactElement } from 'react';

interface MyComponentProps {
  title?: string;
  content?: string;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, content }): ReactElement => {
  // Resiliency and Edge Cases
  if (!title && !content) {
    return (
      <div data-testid="my-component">
        <p>No content available.</p>
      </div>
    );
  }

  // Accessibility
  return (
    <div data-testid="my-component" role="article" aria-label="Content">
      {title && (
        <h1 data-testid="title" id="component-title">
          {title}
        </h1>
      )}
      {content && (
        <p data-testid="content" aria-describedby="component-title">
          {content}
        </p>
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
  // Resiliency and Edge Cases
  if (!title && !content) {
    return (
      <div data-testid="my-component">
        <p>No content available.</p>
      </div>
    );
  }

  // Accessibility
  return (
    <div data-testid="my-component" role="article" aria-label="Content">
      {title && (
        <h1 data-testid="title" id="component-title">
          {title}
        </h1>
      )}
      {content && (
        <p data-testid="content" aria-describedby="component-title">
          {content}
        </p>
      )}
    </div>
  );
};

export default MyComponent;