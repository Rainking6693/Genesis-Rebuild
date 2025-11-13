import React, { ReactElement } from 'react';

interface MyComponentProps {
  title: string;
  content: string;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, content }): ReactElement => {
  // Validate input props
  if (typeof title !== 'string' || typeof content !== 'string') {
    throw new Error('Title and content must be strings');
  }

  if (title.trim().length === 0 || content.trim().length === 0) {
    throw new Error('Title and content cannot be empty');
  }

  return (
    <div data-testid="my-component" aria-label="My Component">
      <h1 data-testid="title" aria-label="Title" role="heading" aria-level={1}>
        {title}
      </h1>
      <p data-testid="content" aria-label="Content" role="region">
        {content}
      </p>
    </div>
  );
};

export default MyComponent;

import React, { ReactElement } from 'react';

interface MyComponentProps {
  title: string;
  content: string;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, content }): ReactElement => {
  // Validate input props
  if (typeof title !== 'string' || typeof content !== 'string') {
    throw new Error('Title and content must be strings');
  }

  if (title.trim().length === 0 || content.trim().length === 0) {
    throw new Error('Title and content cannot be empty');
  }

  return (
    <div data-testid="my-component" aria-label="My Component">
      <h1 data-testid="title" aria-label="Title" role="heading" aria-level={1}>
        {title}
      </h1>
      <p data-testid="content" aria-label="Content" role="region">
        {content}
      </p>
    </div>
  );
};

export default MyComponent;