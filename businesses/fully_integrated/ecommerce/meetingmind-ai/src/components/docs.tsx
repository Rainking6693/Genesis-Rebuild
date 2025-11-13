import React, { memo, useCallback } from 'react';

interface MyComponentProps {
  title?: string;
  description?: string;
  onClick?: () => void;
}

const MyComponent: React.FC<MyComponentProps> = memo(({ title, description, onClick }) => {
  // Resiliency: Handle edge cases
  if (!title || !description || typeof onClick !== 'function') {
    return null;
  }

  // Accessibility: Add aria-label for button
  const handleClick = useCallback(() => {
    onClick();
  }, [onClick]);

  return (
    <div>
      <h2>{title}</h2>
      <p>{description}</p>
      <button onClick={handleClick} aria-label="Click to perform the action">
        Click me
      </button>
    </div>
  );
});

export default MyComponent;

import React, { memo, useCallback } from 'react';

interface MyComponentProps {
  title?: string;
  description?: string;
  onClick?: () => void;
}

const MyComponent: React.FC<MyComponentProps> = memo(({ title, description, onClick }) => {
  // Resiliency: Handle edge cases
  if (!title || !description || typeof onClick !== 'function') {
    return null;
  }

  // Accessibility: Add aria-label for button
  const handleClick = useCallback(() => {
    onClick();
  }, [onClick]);

  return (
    <div>
      <h2>{title}</h2>
      <p>{description}</p>
      <button onClick={handleClick} aria-label="Click to perform the action">
        Click me
      </button>
    </div>
  );
});

export default MyComponent;