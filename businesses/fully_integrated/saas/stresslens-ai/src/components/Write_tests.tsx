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
        <p>No content to display.</p>
      </div>
    );
  }

  // Accessibility
  return (
    <div data-testid="my-component" role="region" aria-label="My Component">
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
        <p>No content to display.</p>
      </div>
    );
  }

  // Accessibility
  return (
    <div data-testid="my-component" role="region" aria-label="My Component">
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
    </div>
  );
};

export default MyComponent;