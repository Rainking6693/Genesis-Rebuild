import React, { ReactElement } from 'react';

interface MyComponentProps {
  title?: string;
  content?: string;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, content }): ReactElement => {
  // Validate input props
  if (!title || !content) {
    return (
      <div data-testid="my-component" aria-label="My Component">
        <h1 data-testid="title" aria-label="Missing title or content">
          Missing title or content
        </h1>
        <p data-testid="content" aria-label="Please provide a title and content for this component.">
          Please provide a title and content for this component.
        </p>
      </div>
    );
  }

  // Sanitize input props to prevent XSS attacks
  const sanitizedTitle = title.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const sanitizedContent = content.replace(/</g, '&lt;').replace(/>/g, '&gt;');

  return (
    <div data-testid="my-component" aria-label="My Component">
      <h1 data-testid="title" aria-label={sanitizedTitle}>
        {sanitizedTitle}
      </h1>
      <p data-testid="content" aria-label={sanitizedContent}>
        {sanitizedContent}
      </p>
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
  // Validate input props
  if (!title || !content) {
    return (
      <div data-testid="my-component" aria-label="My Component">
        <h1 data-testid="title" aria-label="Missing title or content">
          Missing title or content
        </h1>
        <p data-testid="content" aria-label="Please provide a title and content for this component.">
          Please provide a title and content for this component.
        </p>
      </div>
    );
  }

  // Sanitize input props to prevent XSS attacks
  const sanitizedTitle = title.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const sanitizedContent = content.replace(/</g, '&lt;').replace(/>/g, '&gt;');

  return (
    <div data-testid="my-component" aria-label="My Component">
      <h1 data-testid="title" aria-label={sanitizedTitle}>
        {sanitizedTitle}
      </h1>
      <p data-testid="content" aria-label={sanitizedContent}>
        {sanitizedContent}
      </p>
    </div>
  );
};

export default MyComponent;