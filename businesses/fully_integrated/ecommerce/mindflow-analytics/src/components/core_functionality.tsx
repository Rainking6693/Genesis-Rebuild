import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';

interface MyComponentProps {
  title?: string | React.ReactNode; // Allow React nodes for richer titles, make it optional
  content?: string | React.ReactNode; // Allow React nodes for richer content, make it optional
  className?: string; // Allow external styling
  titleLevel?: 1 | 2 | 3 | 4 | 5 | 6; // Allow control over title level for accessibility
  error?: string; // Optional error message to display
  loading?: boolean; // Optional loading state
}

const MyComponent: React.FC<MyComponentProps> = memo(
  ({ title, content, className = '', titleLevel = 1, error, loading }) => {
    const TitleTag = useMemo<keyof JSX.IntrinsicElements>(() => {
      return `h${titleLevel}` as keyof JSX.IntrinsicElements;
    }, [titleLevel]);

    const contentDisplay = useMemo(() => {
      if (loading) {
        return <div data-testid="loading">Loading...</div>;
      }

      if (error) {
        return <div data-testid="error">{error}</div>;
      }

      if (typeof content === 'string') {
        return <p data-testid="content">{content}</p>;
      }

      if (React.isValidElement(content)) {
        return <div data-testid="content">{content}</div>;
      }

      return null; // Return null if content is not a valid string or React element
    }, [content, error, loading]);

    return (
      <div
        data-testid="my-component"
        className={`my-component ${className}`}
        aria-busy={loading}
        aria-live={error ? 'assertive' : 'polite'} // Accessibility: Indicate error or content updates
      >
        {title && (
          <TitleTag data-testid="title">{title}</TitleTag>
        )}
        {contentDisplay}
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.title === nextProps.title &&
      prevProps.content === nextProps.content &&
      prevProps.className === nextProps.className &&
      prevProps.titleLevel === nextProps.titleLevel &&
      prevProps.error === nextProps.error &&
      prevProps.loading === nextProps.loading
    );
  }
);

MyComponent.propTypes = {
  title: PropTypes.node,
  content: PropTypes.node,
  className: PropTypes.string,
  titleLevel: PropTypes.oneOf([1, 2, 3, 4, 5, 6]),
  error: PropTypes.string,
  loading: PropTypes.bool,
};

MyComponent.defaultProps = {
  className: '',
  titleLevel: 1,
  loading: false,
  error: undefined,
};

export default MyComponent;

import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';

interface MyComponentProps {
  title?: string | React.ReactNode; // Allow React nodes for richer titles, make it optional
  content?: string | React.ReactNode; // Allow React nodes for richer content, make it optional
  className?: string; // Allow external styling
  titleLevel?: 1 | 2 | 3 | 4 | 5 | 6; // Allow control over title level for accessibility
  error?: string; // Optional error message to display
  loading?: boolean; // Optional loading state
}

const MyComponent: React.FC<MyComponentProps> = memo(
  ({ title, content, className = '', titleLevel = 1, error, loading }) => {
    const TitleTag = useMemo<keyof JSX.IntrinsicElements>(() => {
      return `h${titleLevel}` as keyof JSX.IntrinsicElements;
    }, [titleLevel]);

    const contentDisplay = useMemo(() => {
      if (loading) {
        return <div data-testid="loading">Loading...</div>;
      }

      if (error) {
        return <div data-testid="error">{error}</div>;
      }

      if (typeof content === 'string') {
        return <p data-testid="content">{content}</p>;
      }

      if (React.isValidElement(content)) {
        return <div data-testid="content">{content}</div>;
      }

      return null; // Return null if content is not a valid string or React element
    }, [content, error, loading]);

    return (
      <div
        data-testid="my-component"
        className={`my-component ${className}`}
        aria-busy={loading}
        aria-live={error ? 'assertive' : 'polite'} // Accessibility: Indicate error or content updates
      >
        {title && (
          <TitleTag data-testid="title">{title}</TitleTag>
        )}
        {contentDisplay}
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.title === nextProps.title &&
      prevProps.content === nextProps.content &&
      prevProps.className === nextProps.className &&
      prevProps.titleLevel === nextProps.titleLevel &&
      prevProps.error === nextProps.error &&
      prevProps.loading === nextProps.loading
    );
  }
);

MyComponent.propTypes = {
  title: PropTypes.node,
  content: PropTypes.node,
  className: PropTypes.string,
  titleLevel: PropTypes.oneOf([1, 2, 3, 4, 5, 6]),
  error: PropTypes.string,
  loading: PropTypes.bool,
};

MyComponent.defaultProps = {
  className: '',
  titleLevel: 1,
  loading: false,
  error: undefined,
};

export default MyComponent;