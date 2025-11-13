import React, { FC, ReactNode, useCallback, useMemo, useRef } from 'react';
import isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';

interface Props {
  message: string;
  children?: ReactNode;
}

const MyComponent: FC<Props> = ({ message, children }) => {
  const sanitizedMessage = useMemo(() => {
    // Sanitize the message to prevent XSS attacks
    return DOMPurify.sanitize(message);
  }, [message]);

  const divRef = useRef<HTMLDivElement>(null);

  // Use useCallback to memoize the function and avoid unnecessary re-renders
  const handleClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    event.currentTarget.focus();
    if (divRef.current) divRef.current.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <div
      ref={divRef}
      onClick={handleClick}
      tabIndex={0} // Add tab index for accessibility
      role="textbox" // Add role for screen readers
      dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
    >
      {children}
    </div>
  );
};

MyComponent.defaultProps = {
  message: '',
  children: null,
};

MyComponent.propTypes = {
  message: PropTypes.string,
  children: PropTypes.node,
};

// Use memo for performance optimization if the component is pure
const MemoizedMyComponent = React.memo(MyComponent);

export default MemoizedMyComponent;

import React, { FC, ReactNode, useCallback, useMemo, useRef } from 'react';
import isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';

interface Props {
  message: string;
  children?: ReactNode;
}

const MyComponent: FC<Props> = ({ message, children }) => {
  const sanitizedMessage = useMemo(() => {
    // Sanitize the message to prevent XSS attacks
    return DOMPurify.sanitize(message);
  }, [message]);

  const divRef = useRef<HTMLDivElement>(null);

  // Use useCallback to memoize the function and avoid unnecessary re-renders
  const handleClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    event.currentTarget.focus();
    if (divRef.current) divRef.current.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <div
      ref={divRef}
      onClick={handleClick}
      tabIndex={0} // Add tab index for accessibility
      role="textbox" // Add role for screen readers
      dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
    >
      {children}
    </div>
  );
};

MyComponent.defaultProps = {
  message: '',
  children: null,
};

MyComponent.propTypes = {
  message: PropTypes.string,
  children: PropTypes.node,
};

// Use memo for performance optimization if the component is pure
const MemoizedMyComponent = React.memo(MyComponent);

export default MemoizedMyComponent;