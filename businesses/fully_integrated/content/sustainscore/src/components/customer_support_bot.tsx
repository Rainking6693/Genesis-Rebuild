import React, { memo, useCallback, useMemo } from 'react';

interface MyComponentProps {
  title?: string;
  description?: string;
  onClick?: () => void;
}

const MyComponent: React.FC<MyComponentProps> = memo(({ title, description, onClick }) => {
  // Resiliency: Handle edge cases
  const handleClick = useCallback(() => {
    if (typeof onClick === 'function') {
      onClick();
    }
  }, [onClick]);

  // Accessibility: Provide meaningful aria-label
  const ariaLabel = useMemo(() => {
    if (typeof title === 'string' && typeof description === 'string') {
      return `${title}: ${description}`;
    } else if (typeof title === 'string') {
      return title;
    } else if (typeof description === 'string') {
      return description;
    } else {
      return 'Click me';
    }
  }, [title, description]);

  // Maintainability: Render component only when necessary
  if (!title && !description && !onClick) {
    return null;
  }

  return (
    <div>
      {title && <h2>{title}</h2>}
      {description && <p>{description}</p>}
      <button onClick={handleClick} aria-label={ariaLabel}>
        Click me
      </button>
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
  // Resiliency: Handle edge cases
  const handleClick = useCallback(() => {
    if (typeof onClick === 'function') {
      onClick();
    }
  }, [onClick]);

  // Accessibility: Provide meaningful aria-label
  const ariaLabel = useMemo(() => {
    if (typeof title === 'string' && typeof description === 'string') {
      return `${title}: ${description}`;
    } else if (typeof title === 'string') {
      return title;
    } else if (typeof description === 'string') {
      return description;
    } else {
      return 'Click me';
    }
  }, [title, description]);

  // Maintainability: Render component only when necessary
  if (!title && !description && !onClick) {
    return null;
  }

  return (
    <div>
      {title && <h2>{title}</h2>}
      {description && <p>{description}</p>}
      <button onClick={handleClick} aria-label={ariaLabel}>
        Click me
      </button>
    </div>
  );
});

export default MyComponent;