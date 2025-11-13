import React from 'react';

interface MyComponentProps {
  title: string;
  content: string;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, content }) => {
  // Validate input props
  if (typeof title !== 'string' || typeof content !== 'string') {
    throw new Error('Title and content must be strings');
  }

  if (title.trim() === '' || content.trim() === '') {
    throw new Error('Title and content cannot be empty');
  }

  // Sanitize input to prevent XSS attacks
  const sanitizedTitle = title.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const sanitizedContent = content.replace(/</g, '&lt;').replace(/>/g, '&gt;');

  return (
    <div
      data-testid="my-component"
      role="article"
      aria-label={sanitizedTitle}
      aria-describedby="my-component-title"
    >
      <h1 id="my-component-title">{sanitizedTitle}</h1>
      <p>{sanitizedContent}</p>
    </div>
  );
};

export default MyComponent;

import React from 'react';

interface MyComponentProps {
  title: string;
  content: string;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, content }) => {
  // Validate input props
  if (typeof title !== 'string' || typeof content !== 'string') {
    throw new Error('Title and content must be strings');
  }

  if (title.trim() === '' || content.trim() === '') {
    throw new Error('Title and content cannot be empty');
  }

  // Sanitize input to prevent XSS attacks
  const sanitizedTitle = title.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const sanitizedContent = content.replace(/</g, '&lt;').replace(/>/g, '&gt;');

  return (
    <div
      data-testid="my-component"
      role="article"
      aria-label={sanitizedTitle}
      aria-describedby="my-component-title"
    >
      <h1 id="my-component-title">{sanitizedTitle}</h1>
      <p>{sanitizedContent}</p>
    </div>
  );
};

export default MyComponent;