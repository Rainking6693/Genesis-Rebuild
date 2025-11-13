import React, { memo, useCallback, useMemo } from 'react';

interface MyComponentProps {
  title?: string;
  description?: string;
  onClick?: () => void;
}

const MyComponent: React.FC<MyComponentProps> = memo(({ title, description, onClick }) => {
  const handleClick = useCallback(() => {
    if (typeof onClick === 'function') {
      onClick();
    }
  }, [onClick]);

  const componentTitle = useMemo(() => title || 'My Component', [title]);
  const componentDescription = useMemo(() => description || '', [description]);
  const componentButtonLabel = useMemo(() => onClick ? 'Click me' : '', [onClick]);

  return (
    <div
      className="my-component"
      role="region"
      aria-label={componentTitle}
      data-testid="my-component"
    >
      {componentTitle && (
        <h2 className="my-component__title" id="my-component-title">
          {componentTitle}
        </h2>
      )}
      {componentDescription && (
        <p className="my-component__description" aria-describedby="my-component-title">
          {componentDescription}
        </p>
      )}
      {componentButtonLabel && (
        <button
          className="my-component__button"
          onClick={handleClick}
          aria-label={componentButtonLabel}
          tabIndex={0}
          data-testid="my-component-button"
        >
          {componentButtonLabel}
        </button>
      )}
    </div>
  );
});

export default MyComponent;

import React, { memo, useCallback, useMemo } from 'react';

interface MyComponentProps {
  title?: string;
  description?: string;
  onClick?: () => void;
}

const MyComponent: React.FC<MyComponentProps> = memo(({ title, description, onClick }) => {
  const handleClick = useCallback(() => {
    if (typeof onClick === 'function') {
      onClick();
    }
  }, [onClick]);

  const componentTitle = useMemo(() => title || 'My Component', [title]);
  const componentDescription = useMemo(() => description || '', [description]);
  const componentButtonLabel = useMemo(() => onClick ? 'Click me' : '', [onClick]);

  return (
    <div
      className="my-component"
      role="region"
      aria-label={componentTitle}
      data-testid="my-component"
    >
      {componentTitle && (
        <h2 className="my-component__title" id="my-component-title">
          {componentTitle}
        </h2>
      )}
      {componentDescription && (
        <p className="my-component__description" aria-describedby="my-component-title">
          {componentDescription}
        </p>
      )}
      {componentButtonLabel && (
        <button
          className="my-component__button"
          onClick={handleClick}
          aria-label={componentButtonLabel}
          tabIndex={0}
          data-testid="my-component-button"
        >
          {componentButtonLabel}
        </button>
      )}
    </div>
  );
});

export default MyComponent;