import React from 'react';

interface MyComponentProps {
  title?: string;
  content?: string;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, content }) => {
  // Resiliency and Edge Cases
  if (!title && !content) {
    return null; // Return null if both title and content are missing
  }

  // Accessibility
  return (
    <div data-testid="my-component" aria-label="My Component">
      {title && (
        <h1 data-testid="component-title" aria-label="Component Title">
          {title}
        </h1>
      )}
      {content && (
        <p data-testid="component-content" aria-label="Component Content">
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

const MyComponent: React.FC<MyComponentProps> = ({ title, content }) => {
  // Resiliency and Edge Cases
  if (!title && !content) {
    return null; // Return null if both title and content are missing
  }

  // Accessibility
  return (
    <div data-testid="my-component" aria-label="My Component">
      {title && (
        <h1 data-testid="component-title" aria-label="Component Title">
          {title}
        </h1>
      )}
      {content && (
        <p data-testid="component-content" aria-label="Component Content">
          {content}
        </p>
      )}
    </div>
  );
};

export default MyComponent;