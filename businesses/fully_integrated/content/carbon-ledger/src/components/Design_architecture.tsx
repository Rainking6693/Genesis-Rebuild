import React, { memo, useCallback, useMemo } from 'react';

interface MyComponentProps {
  title?: string;
  description?: string;
  onClick?: () => void;
}

const MyComponent: React.FC<MyComponentProps> = memo(({ title, description, onClick }) => {
  const handleClick = useCallback(() => {
    if (typeof onClick === 'function') {
      try {
        onClick();
      } catch (error) {
        console.error('Error in onClick handler:', error);
      }
    }
  }, [onClick]);

  const componentClassName = useMemo(() => {
    const baseClassName = 'my-component';
    const classNames = [baseClassName];

    if (title) {
      classNames.push(`${baseClassName}__title`);
    }

    if (description) {
      classNames.push(`${baseClassName}__description`);
    }

    if (onClick) {
      classNames.push(`${baseClassName}__button`);
    }

    return classNames.join(' ');
  }, [title, description, onClick]);

  return (
    <div data-testid="my-component" className={componentClassName}>
      {title && <h2 className={`${componentClassName}__title`}>{title}</h2>}
      {description && <p className={`${componentClassName}__description`}>{description}</p>}
      {onClick && (
        <button
          onClick={handleClick}
          data-testid="my-component-button"
          className={`${componentClassName}__button`}
          aria-label="Click me"
          aria-disabled={!onClick}
        >
          Click me
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
      try {
        onClick();
      } catch (error) {
        console.error('Error in onClick handler:', error);
      }
    }
  }, [onClick]);

  const componentClassName = useMemo(() => {
    const baseClassName = 'my-component';
    const classNames = [baseClassName];

    if (title) {
      classNames.push(`${baseClassName}__title`);
    }

    if (description) {
      classNames.push(`${baseClassName}__description`);
    }

    if (onClick) {
      classNames.push(`${baseClassName}__button`);
    }

    return classNames.join(' ');
  }, [title, description, onClick]);

  return (
    <div data-testid="my-component" className={componentClassName}>
      {title && <h2 className={`${componentClassName}__title`}>{title}</h2>}
      {description && <p className={`${componentClassName}__description`}>{description}</p>}
      {onClick && (
        <button
          onClick={handleClick}
          data-testid="my-component-button"
          className={`${componentClassName}__button`}
          aria-label="Click me"
          aria-disabled={!onClick}
        >
          Click me
        </button>
      )}
    </div>
  );
});

export default MyComponent;