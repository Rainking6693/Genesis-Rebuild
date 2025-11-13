import React, { memo, useMemo } from 'react';

interface MyComponentProps {
  title?: string;
  content?: string;
}

const MyComponent: React.FC<MyComponentProps> = memo(({ title, content }) => {
  const safeTitle = useMemo(() => title ?? 'Untitled', [title]);
  const safeContent = useMemo(() => content ?? 'No content available', [content]);

  return (
    <div
      data-testid="my-component"
      aria-label="My Component"
      role="region"
      aria-live="polite"
    >
      <h1
        data-testid="title"
        aria-label="Title"
        tabIndex={0}
        aria-describedby="title-description"
      >
        {safeTitle}
      </h1>
      <p id="title-description" className="sr-only">
        The title of the content.
      </p>
      <p
        data-testid="content"
        aria-label="Content"
        tabIndex={0}
        aria-describedby="content-description"
      >
        {safeContent}
      </p>
      <p id="content-description" className="sr-only">
        The content of the component.
      </p>
    </div>
  );
});

export default MyComponent;

import React, { memo, useMemo } from 'react';

interface MyComponentProps {
  title?: string;
  content?: string;
}

const MyComponent: React.FC<MyComponentProps> = memo(({ title, content }) => {
  const safeTitle = useMemo(() => title ?? 'Untitled', [title]);
  const safeContent = useMemo(() => content ?? 'No content available', [content]);

  return (
    <div
      data-testid="my-component"
      aria-label="My Component"
      role="region"
      aria-live="polite"
    >
      <h1
        data-testid="title"
        aria-label="Title"
        tabIndex={0}
        aria-describedby="title-description"
      >
        {safeTitle}
      </h1>
      <p id="title-description" className="sr-only">
        The title of the content.
      </p>
      <p
        data-testid="content"
        aria-label="Content"
        tabIndex={0}
        aria-describedby="content-description"
      >
        {safeContent}
      </p>
      <p id="content-description" className="sr-only">
        The content of the component.
      </p>
    </div>
  );
});

export default MyComponent;