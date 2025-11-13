import React, { FC, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';

const MyComponent: FC<Props> = ({ message, className }) => {
  const isValidClassName = typeof className === 'string';

  const memoizedComponent = useMemo(() => {
    if (!isValidClassName) {
      console.error('Invalid className provided');
      return null;
    }

    return (
      <div
        data-testid="my-component"
        role="alert"
        className={`message-container ${className}`}
        style={{
          maxWidth: '500px',
          minWidth: '100px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
        aria-label="Message"
      >
        {message}
      </div>
    );
  }, [message, className, isValidClassName]);

  useEffect(() => {
    if (!message || message.trim().length === 0) {
      console.error('No message provided');
      return;
    }

    console.log(`Message updated: ${message}`);
  }, [message]);

  return memoizedComponent;
};

MyComponent.defaultProps = {
  message: 'No message provided',
};

MyComponent.propTypes = {
  message: PropTypes.string.isRequired,
  className: PropTypes.string,
};

MyComponent.displayName = 'MyComponent';

export default MyComponent;

This version of the component is more robust, handles edge cases better, is more accessible, and easier to maintain.