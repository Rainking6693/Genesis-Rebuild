import React, { useState, useCallback, useMemo } from 'react';

interface MyComponentProps {
  title: string;
  description: string;
  onClick: () => void;
  /** Optional class name for the component's container. */
  className?: string;
  /** Optional aria label for the button. Defaults to "Click". */
  buttonAriaLabel?: string;
}

const MyComponent: React.FC<MyComponentProps> = ({
  title,
  description,
  onClick,
  className = '',
  buttonAriaLabel = 'Click',
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const sanitizeString = useCallback((str: string | null | undefined): string => {
    if (!str) {
      return 'No value provided'; // Handle null or undefined gracefully
    }
    try {
      return str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    } catch (error) {
      console.error('Error sanitizing string:', error);
      return 'Invalid value';
    }
  }, []);

  const safeTitle = useMemo(() => sanitizeString(title), [title, sanitizeString]);
  const safeDescription = useMemo(() => sanitizeString(description), [description, sanitizeString]);

  const handleClick = useCallback(() => {
    try {
      onClick();
    } catch (error: any) {
      console.error('Error handling click:', error);
      // Consider a more user-friendly error display, like a toast notification
    }
  }, [onClick]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault(); // Prevent scrolling
        handleClick();
      }
    },
    [handleClick]
  );

  return (
    <div
      className={`my-component ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label={`${safeTitle} - ${safeDescription}`}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <h2 className={`my-component__title ${isHovered ? 'my-component__title--hovered' : ''}`}>
        {safeTitle}
      </h2>
      <p className={`my-component__description ${isHovered ? 'my-component__description--hovered' : ''}`}>
        {safeDescription}
      </p>
      <button
        className={`my-component__button ${isHovered ? 'my-component__button--hovered' : ''}`}
        onClick={handleClick}
        aria-label={buttonAriaLabel}
      >
        {buttonAriaLabel}
      </button>
    </div>
  );
};

export default MyComponent;

import React, { useState, useCallback, useMemo } from 'react';

interface MyComponentProps {
  title: string;
  description: string;
  onClick: () => void;
  /** Optional class name for the component's container. */
  className?: string;
  /** Optional aria label for the button. Defaults to "Click". */
  buttonAriaLabel?: string;
}

const MyComponent: React.FC<MyComponentProps> = ({
  title,
  description,
  onClick,
  className = '',
  buttonAriaLabel = 'Click',
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const sanitizeString = useCallback((str: string | null | undefined): string => {
    if (!str) {
      return 'No value provided'; // Handle null or undefined gracefully
    }
    try {
      return str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    } catch (error) {
      console.error('Error sanitizing string:', error);
      return 'Invalid value';
    }
  }, []);

  const safeTitle = useMemo(() => sanitizeString(title), [title, sanitizeString]);
  const safeDescription = useMemo(() => sanitizeString(description), [description, sanitizeString]);

  const handleClick = useCallback(() => {
    try {
      onClick();
    } catch (error: any) {
      console.error('Error handling click:', error);
      // Consider a more user-friendly error display, like a toast notification
    }
  }, [onClick]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault(); // Prevent scrolling
        handleClick();
      }
    },
    [handleClick]
  );

  return (
    <div
      className={`my-component ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label={`${safeTitle} - ${safeDescription}`}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <h2 className={`my-component__title ${isHovered ? 'my-component__title--hovered' : ''}`}>
        {safeTitle}
      </h2>
      <p className={`my-component__description ${isHovered ? 'my-component__description--hovered' : ''}`}>
        {safeDescription}
      </p>
      <button
        className={`my-component__button ${isHovered ? 'my-component__button--hovered' : ''}`}
        onClick={handleClick}
        aria-label={buttonAriaLabel}
      >
        {buttonAriaLabel}
      </button>
    </div>
  );
};

export default MyComponent;