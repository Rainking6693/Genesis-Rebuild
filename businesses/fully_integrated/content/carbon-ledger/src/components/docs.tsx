import React, { memo, useCallback, MouseEvent, ReactNode } from 'react';

interface MyComponentProps {
  title?: string;
  description?: string;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  'aria-label'?: string;
  'data-testid'?: string;
  className?: string;
}

const MyComponent: React.FC<MyComponentProps> = memo(
  ({
    title,
    description,
    onClick,
    'aria-label': ariaLabel = 'Click me',
    'data-testid': dataTestId = 'my-component',
    className = 'my-component',
  }) => {
    const handleClick = useCallback(
      (event: MouseEvent<HTMLButtonElement>) => {
        if (typeof onClick === 'function') {
          onClick(event);
        }
      },
      [onClick]
    );

    return (
      <div data-testid={dataTestId} className={className}>
        {title && <h2 className={`${className}__title`}>{title}</h2>}
        {description && <p className={`${className}__description`}>{description}</p>}
        {onClick && (
          <button
            onClick={handleClick}
            data-testid={`${dataTestId}-button`}
            className={`${className}__button`}
            aria-label={ariaLabel}
          >
            Click me
          </button>
        )}
      </div>
    );
  }
);

export default MyComponent;

import React, { memo, useCallback, MouseEvent, ReactNode } from 'react';

interface MyComponentProps {
  title?: string;
  description?: string;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  'aria-label'?: string;
  'data-testid'?: string;
  className?: string;
}

const MyComponent: React.FC<MyComponentProps> = memo(
  ({
    title,
    description,
    onClick,
    'aria-label': ariaLabel = 'Click me',
    'data-testid': dataTestId = 'my-component',
    className = 'my-component',
  }) => {
    const handleClick = useCallback(
      (event: MouseEvent<HTMLButtonElement>) => {
        if (typeof onClick === 'function') {
          onClick(event);
        }
      },
      [onClick]
    );

    return (
      <div data-testid={dataTestId} className={className}>
        {title && <h2 className={`${className}__title`}>{title}</h2>}
        {description && <p className={`${className}__description`}>{description}</p>}
        {onClick && (
          <button
            onClick={handleClick}
            data-testid={`${dataTestId}-button`}
            className={`${className}__button`}
            aria-label={ariaLabel}
          >
            Click me
          </button>
        )}
      </div>
    );
  }
);

export default MyComponent;