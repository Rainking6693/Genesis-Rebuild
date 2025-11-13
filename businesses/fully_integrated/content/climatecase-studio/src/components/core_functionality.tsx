import React, { memo, useMemo, useCallback } from 'react';

interface MyComponentProps {
  title?: string;
  content?: string;
}

const MyComponent: React.FC<MyComponentProps> = memo(({ title, content }) => {
  const getSafeValue = useCallback((value: string | undefined, fallback: string): string => {
    return value?.trim() || fallback;
  }, []);

  const safeTitle = useMemo(() => getSafeValue(title, 'Untitled'), [title, getSafeValue]);
  const safeContent = useMemo(() => getSafeValue(content, 'No content available'), [content, getSafeValue]);

  return (
    <div className="my-component" aria-label={safeTitle}>
      <h1 className="my-component__title" id="my-component-title">
        {safeTitle}
      </h1>
      <p className="my-component__content" aria-describedby="my-component-title">
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
  const getSafeValue = useCallback((value: string | undefined, fallback: string): string => {
    return value?.trim() || fallback;
  }, []);

  const safeTitle = useMemo(() => getSafeValue(title, 'Untitled'), [title, getSafeValue]);
  const safeContent = useMemo(() => getSafeValue(content, 'No content available'), [content, getSafeValue]);

  return (
    <div className="my-component" aria-label={safeTitle}>
      <h1 className="my-component__title" id="my-component-title">
        {safeTitle}
      </h1>
      <p className="my-component__content" aria-describedby="my-component-title">
        {safeContent}
      </p>
    </div>
  );
});

export default MyComponent;