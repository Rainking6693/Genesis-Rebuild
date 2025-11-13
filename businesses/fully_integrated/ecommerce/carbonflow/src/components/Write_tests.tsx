import React from 'react';

interface MyComponentProps {
  title?: string;
  content?: string;
}

const MyComponent: React.FC<MyComponentProps> = ({ title = '', content = '' }) => {
  // Resiliency and Edge Cases
  if (!title && !content) {
    return null; // Return null if both title and content are empty
  }

  // Accessibility
  return (
    <div data-testid="my-component" aria-label="My Component">
      {title && (
        <h1 data-testid="title" aria-label="Title">
          {title}
        </h1>
      )}
      {content && (
        <p data-testid="content" aria-label="Content">
          {content}
        </p>
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

const MyComponent: React.FC<MyComponentProps> = ({ title = '', content = '' }) => {
  // Resiliency and Edge Cases
  if (!title && !content) {
    return null; // Return null if both title and content are empty
  }

  // Accessibility
  return (
    <div data-testid="my-component" aria-label="My Component">
      {title && (
        <h1 data-testid="title" aria-label="Title">
          {title}
        </h1>
      )}
      {content && (
        <p data-testid="content" aria-label="Content">
          {content}
        </p>
      )}
    </div>
  );
};

export default MyComponent;