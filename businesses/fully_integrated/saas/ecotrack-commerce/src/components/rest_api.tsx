import React, { memo, useMemo, useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

interface MyComponentProps {
  title?: string | null;
  content?: string | null;
  /**
   * An optional className to apply to the component's root element.
   */
  className?: string;
  /**
   * A fallback title to display if the title prop is not provided or is empty.
   * @default "Default Title"
   */
  defaultTitle?: string;
  /**
   * A fallback content to display if the content prop is not provided or is empty.
   * @default "Default Content"
   */
  defaultContent?: string;
  /**
   * Error boundary to catch errors within the component.
   */
  errorBoundary?: React.ComponentType<{ children: React.ReactNode; fallback?: React.ReactNode }>;
}

const DefaultErrorBoundary: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ children, fallback }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const errorHandler = (error: any, info: any) => {
      console.error("Caught an error in MyComponent:", error, info);
      setHasError(true);
    };

    window.addEventListener('error', errorHandler);

    return () => {
      window.removeEventListener('error', errorHandler);
    };
  }, []);

  if (hasError) {
    return fallback || <div>Something went wrong.</div>;
  }

  return children;
};

const MyComponent: React.FC<MyComponentProps> = memo(
  ({
    title,
    content,
    className,
    defaultTitle = 'Default Title',
    defaultContent = 'Default Content',
    errorBoundary: ErrorBoundary = DefaultErrorBoundary,
    children,
  }) => {
    const safeTitle = useMemo(() => title || defaultTitle, [title, defaultTitle]);
    const safeContent = useMemo(() => content || defaultContent, [content, defaultContent]);

    const componentId = useMemo(() => `my-component-${Math.random().toString(36).substring(2, 15)}`, []);

    const handleTitleClick = useCallback(() => {
      console.log('Title clicked!'); // Example action
    }, []);

    const handleContentClick = useCallback(() => {
      console.log('Content clicked!'); // Example action
    }, []);

    return (
      <ErrorBoundary fallback={<div>Error loading component.</div>}>
        <div className={`my-component ${className || ''}`} aria-label="My Component" id={componentId}>
          <h1
            className="my-component__title"
            aria-label="Component Title"
            onClick={handleTitleClick}
            tabIndex={0} // Make clickable for accessibility
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { handleTitleClick(); } }}
          >
            {safeTitle}
          </h1>
          <p
            className="my-component__content"
            aria-label="Component Content"
            onClick={handleContentClick}
            tabIndex={0} // Make clickable for accessibility
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { handleContentClick(); } }}
          >
            {safeContent}
          </p>
          {children}
        </div>
      </ErrorBoundary>
    );
  },
);

MyComponent.displayName = 'MyComponent';

MyComponent.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
  className: PropTypes.string,
  defaultTitle: PropTypes.string,
  defaultContent: PropTypes.string,
  errorBoundary: PropTypes.elementType,
  children: PropTypes.node,
};

export default MyComponent;

import React, { memo, useMemo, useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

interface MyComponentProps {
  title?: string | null;
  content?: string | null;
  /**
   * An optional className to apply to the component's root element.
   */
  className?: string;
  /**
   * A fallback title to display if the title prop is not provided or is empty.
   * @default "Default Title"
   */
  defaultTitle?: string;
  /**
   * A fallback content to display if the content prop is not provided or is empty.
   * @default "Default Content"
   */
  defaultContent?: string;
  /**
   * Error boundary to catch errors within the component.
   */
  errorBoundary?: React.ComponentType<{ children: React.ReactNode; fallback?: React.ReactNode }>;
}

const DefaultErrorBoundary: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ children, fallback }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const errorHandler = (error: any, info: any) => {
      console.error("Caught an error in MyComponent:", error, info);
      setHasError(true);
    };

    window.addEventListener('error', errorHandler);

    return () => {
      window.removeEventListener('error', errorHandler);
    };
  }, []);

  if (hasError) {
    return fallback || <div>Something went wrong.</div>;
  }

  return children;
};

const MyComponent: React.FC<MyComponentProps> = memo(
  ({
    title,
    content,
    className,
    defaultTitle = 'Default Title',
    defaultContent = 'Default Content',
    errorBoundary: ErrorBoundary = DefaultErrorBoundary,
    children,
  }) => {
    const safeTitle = useMemo(() => title || defaultTitle, [title, defaultTitle]);
    const safeContent = useMemo(() => content || defaultContent, [content, defaultContent]);

    const componentId = useMemo(() => `my-component-${Math.random().toString(36).substring(2, 15)}`, []);

    const handleTitleClick = useCallback(() => {
      console.log('Title clicked!'); // Example action
    }, []);

    const handleContentClick = useCallback(() => {
      console.log('Content clicked!'); // Example action
    }, []);

    return (
      <ErrorBoundary fallback={<div>Error loading component.</div>}>
        <div className={`my-component ${className || ''}`} aria-label="My Component" id={componentId}>
          <h1
            className="my-component__title"
            aria-label="Component Title"
            onClick={handleTitleClick}
            tabIndex={0} // Make clickable for accessibility
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { handleTitleClick(); } }}
          >
            {safeTitle}
          </h1>
          <p
            className="my-component__content"
            aria-label="Component Content"
            onClick={handleContentClick}
            tabIndex={0} // Make clickable for accessibility
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { handleContentClick(); } }}
          >
            {safeContent}
          </p>
          {children}
        </div>
      </ErrorBoundary>
    );
  },
);

MyComponent.displayName = 'MyComponent';

MyComponent.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
  className: PropTypes.string,
  defaultTitle: PropTypes.string,
  defaultContent: PropTypes.string,
  errorBoundary: PropTypes.elementType,
  children: PropTypes.node,
};

export default MyComponent;