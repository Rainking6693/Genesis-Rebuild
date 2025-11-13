import React, { memo, useMemo, useCallback } from 'react';

interface MyComponentProps {
  title?: string;
  content?: string;
}

const MyComponent: React.FC<MyComponentProps> = memo(({ title, content }) => {
  const safeTitle = useMemo(() => title || 'Untitled', [title]);
  const safeContent = useMemo(() => content || 'No content available', [content]);

  const getAriaLabel = useCallback(() => {
    if (typeof safeTitle === 'string') {
      return safeTitle;
    }
    return 'Untitled';
  }, [safeTitle]);

  return (
    <div
      className="my-component"
      aria-label={getAriaLabel()}
      data-testid="my-component"
    >
      <h1
        className="my-component__title"
        id="my-component-title"
        data-testid="my-component-title"
      >
        {safeTitle}
      </h1>
      <p
        className="my-component__content"
        aria-describedby="my-component-title"
        data-testid="my-component-content"
      >
        {safeContent}
      </p>
    </div>
  );
});

export default MyComponent;

import React, { memo, useMemo, useCallback } from 'react';

interface MyComponentProps {
  title?: string;
  content?: string;
}

const MyComponent: React.FC<MyComponentProps> = memo(({ title, content }) => {
  const safeTitle = useMemo(() => title || 'Untitled', [title]);
  const safeContent = useMemo(() => content || 'No content available', [content]);

  const getAriaLabel = useCallback(() => {
    if (typeof safeTitle === 'string') {
      return safeTitle;
    }
    return 'Untitled';
  }, [safeTitle]);

  return (
    <div
      className="my-component"
      aria-label={getAriaLabel()}
      data-testid="my-component"
    >
      <h1
        className="my-component__title"
        id="my-component-title"
        data-testid="my-component-title"
      >
        {safeTitle}
      </h1>
      <p
        className="my-component__content"
        aria-describedby="my-component-title"
        data-testid="my-component-content"
      >
        {safeContent}
      </p>
    </div>
  );
});

export default MyComponent;