import React, { memo, useMemo, useCallback } from 'react';

interface MyComponentProps {
  title?: string;
  content?: string;
  className?: string;
  'aria-label'?: string;
  'data-testid'?: string;
}

const MyComponent: React.FC<MyComponentProps> = memo(
  ({ title, content, className = '', 'aria-label': ariaLabel, 'data-testid': dataTestId }) => {
    const safeTitle = useMemo(() => title || 'Untitled', [title]);
    const safeContent = useMemo(() => content || 'No content available', [content]);

    const getClassName = useCallback(() => {
      const baseClassName = 'my-component';
      return `${baseClassName} ${className}`.trim();
    }, [className]);

    return (
      <div
        className={getClassName()}
        aria-label={ariaLabel || safeTitle}
        data-testid={dataTestId || 'my-component'}
      >
        <h2 className="my-component__title" title={safeTitle}>
          {safeTitle}
        </h2>
        <p className="my-component__content" title={safeContent}>
          {safeContent}
        </p>
      </div>
    );
  }
);

export default MyComponent;

import React, { memo, useMemo, useCallback } from 'react';

interface MyComponentProps {
  title?: string;
  content?: string;
  className?: string;
  'aria-label'?: string;
  'data-testid'?: string;
}

const MyComponent: React.FC<MyComponentProps> = memo(
  ({ title, content, className = '', 'aria-label': ariaLabel, 'data-testid': dataTestId }) => {
    const safeTitle = useMemo(() => title || 'Untitled', [title]);
    const safeContent = useMemo(() => content || 'No content available', [content]);

    const getClassName = useCallback(() => {
      const baseClassName = 'my-component';
      return `${baseClassName} ${className}`.trim();
    }, [className]);

    return (
      <div
        className={getClassName()}
        aria-label={ariaLabel || safeTitle}
        data-testid={dataTestId || 'my-component'}
      >
        <h2 className="my-component__title" title={safeTitle}>
          {safeTitle}
        </h2>
        <p className="my-component__content" title={safeContent}>
          {safeContent}
        </p>
      </div>
    );
  }
);

export default MyComponent;