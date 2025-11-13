import React, { useState, useEffect, useCallback, memo } from 'react';

interface MyComponentProps {
  title: string;
  description: string;
  onClick?: () => void;
}

const MyComponent: React.FC<MyComponentProps> = memo(({ title, description, onClick }) => {
  const [safeTitle, setSafeTitle] = useState<string>('');
  const [safeDescription, setSafeDescription] = useState<string>('');

  const sanitizeInput = useCallback((input: string): string => {
    return input.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }, []);

  useEffect(() => {
    setSafeTitle(sanitizeInput(title || ''));
    setSafeDescription(sanitizeInput(description || ''));
  }, [title, description, sanitizeInput]);

  const handleClick = useCallback(() => {
    if (typeof onClick === 'function') {
      try {
        onClick();
      } catch (error) {
        console.error('Error in onClick handler:', error);
      }
    }
  }, [onClick]);

  return (
    <div className="my-component" aria-label="My Component">
      <h2 className="my-component__title" id="my-component-title">
        {safeTitle}
      </h2>
      <p className="my-component__description" aria-describedby="my-component-title">
        {safeDescription}
      </p>
      <button
        className="my-component__button"
        onClick={handleClick}
        aria-label="Click me"
        disabled={typeof onClick !== 'function'}
      >
        Click me
      </button>
    </div>
  );
});

export default MyComponent;

import React, { useState, useEffect, useCallback, memo } from 'react';

interface MyComponentProps {
  title: string;
  description: string;
  onClick?: () => void;
}

const MyComponent: React.FC<MyComponentProps> = memo(({ title, description, onClick }) => {
  const [safeTitle, setSafeTitle] = useState<string>('');
  const [safeDescription, setSafeDescription] = useState<string>('');

  const sanitizeInput = useCallback((input: string): string => {
    return input.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }, []);

  useEffect(() => {
    setSafeTitle(sanitizeInput(title || ''));
    setSafeDescription(sanitizeInput(description || ''));
  }, [title, description, sanitizeInput]);

  const handleClick = useCallback(() => {
    if (typeof onClick === 'function') {
      try {
        onClick();
      } catch (error) {
        console.error('Error in onClick handler:', error);
      }
    }
  }, [onClick]);

  return (
    <div className="my-component" aria-label="My Component">
      <h2 className="my-component__title" id="my-component-title">
        {safeTitle}
      </h2>
      <p className="my-component__description" aria-describedby="my-component-title">
        {safeDescription}
      </p>
      <button
        className="my-component__button"
        onClick={handleClick}
        aria-label="Click me"
        disabled={typeof onClick !== 'function'}
      >
        Click me
      </button>
    </div>
  );
});

export default MyComponent;