import React, { memo, useCallback, MouseEvent, KeyboardEvent } from 'react';

interface MyComponentProps {
  title?: string;
  description?: string;
  onClick?: () => void;
  'aria-label'?: string;
}

const MyComponent: React.FC<MyComponentProps> = memo(
  ({ title = '', description = '', onClick, 'aria-label': ariaLabel = 'Click me' }) => {
    const handleClick = useCallback(
      (event: MouseEvent<HTMLDivElement> | KeyboardEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();

        if (typeof onClick === 'function') {
          onClick();
        }
      },
      [onClick]
    );

    const handleKeyDown = useCallback(
      (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter' || event.key === ' ') {
          handleClick(event);
        }
      },
      [handleClick]
    );

    return (
      <div
        data-testid="my-component"
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        aria-label={ariaLabel}
        style={{
          cursor: 'pointer',
          outline: 'none',
          padding: '1rem',
          backgroundColor: '#f5f5f5',
          borderRadius: '4px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h2>{title}</h2>
        <p>{description}</p>
        <button
          aria-label={ariaLabel}
          data-testid="my-component-button"
          style={{
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Click me
        </button>
      </div>
    );
  }
);

export default MyComponent;

import React, { memo, useCallback, MouseEvent, KeyboardEvent } from 'react';

interface MyComponentProps {
  title?: string;
  description?: string;
  onClick?: () => void;
  'aria-label'?: string;
}

const MyComponent: React.FC<MyComponentProps> = memo(
  ({ title = '', description = '', onClick, 'aria-label': ariaLabel = 'Click me' }) => {
    const handleClick = useCallback(
      (event: MouseEvent<HTMLDivElement> | KeyboardEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();

        if (typeof onClick === 'function') {
          onClick();
        }
      },
      [onClick]
    );

    const handleKeyDown = useCallback(
      (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter' || event.key === ' ') {
          handleClick(event);
        }
      },
      [handleClick]
    );

    return (
      <div
        data-testid="my-component"
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        aria-label={ariaLabel}
        style={{
          cursor: 'pointer',
          outline: 'none',
          padding: '1rem',
          backgroundColor: '#f5f5f5',
          borderRadius: '4px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h2>{title}</h2>
        <p>{description}</p>
        <button
          aria-label={ariaLabel}
          data-testid="my-component-button"
          style={{
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Click me
        </button>
      </div>
    );
  }
);

export default MyComponent;