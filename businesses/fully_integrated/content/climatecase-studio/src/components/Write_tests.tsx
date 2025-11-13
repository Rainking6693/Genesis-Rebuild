import React from 'react';

interface MyComponentProps {
  title?: string;
  content?: string;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, content }) => {
  // Validate input props
  if (!title || !content) {
    return (
      <div data-testid="my-component" role="alert" aria-live="assertive">
        <p>Error: Title and content are required.</p>
      </div>
    );
  }

  // Sanitize input props to prevent XSS attacks
  const sanitizedTitle = title.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const sanitizedContent = content.replace(/</g, '&lt;').replace(/>/g, '&gt;');

  return (
    <div data-testid="my-component" aria-live="polite">
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

import React from 'react';

interface MyComponentProps {
  title?: string;
  content?: string;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, content }) => {
  // Validate input props
  if (!title || !content) {
    return (
      <div data-testid="my-component" role="alert" aria-live="assertive">
        <p>Error: Title and content are required.</p>
      </div>
    );
  }

  // Sanitize input props to prevent XSS attacks
  const sanitizedTitle = title.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const sanitizedContent = content.replace(/</g, '&lt;').replace(/>/g, '&gt;');

  return (
    <div data-testid="my-component" aria-live="polite">
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