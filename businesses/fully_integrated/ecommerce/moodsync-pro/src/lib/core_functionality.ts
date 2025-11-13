import React, { FC, ReactNode, useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

interface Props {
  message: string;
  children?: ReactNode;
  isEditable?: boolean;
}

const FunctionalComponent: FC<Props> = ({ message, children, isEditable }) => {
  const [error, setError] = useState(false);

  const handleMessageChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;

    // Add basic input validation for message prop
    if (!value.trim()) {
      setError(true);
      return;
    }

    if (value.length < 5 || value.length > 255) {
      setError(true);
      return;
    }

    setError(false);
  }, []);

  const handleKeyPress = useCallback((event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey && error) {
      event.preventDefault();
    }
  }, [error]);

  useEffect(() => {
    if (!isEditable) {
      setError(false);
    }
  }, [isEditable]);

  return (
    <div>
      {/* Add error message if the message prop is empty or invalid */}
      {error && <p>Please provide a valid message (min 5 chars, max 255 chars).</p>}

      {/* Use a textarea for better accessibility */}
      <textarea
        value={message}
        onChange={handleMessageChange}
        onKeyPress={handleKeyPress}
        placeholder="Enter your message"
        pattern="[a-zA-Z0-9 ]+"
        aria-label="Message input"
        role="textbox"
        name="message"
        disabled={!isEditable}
        data-testid="message-input"
      />

      {/* Render the provided children or the message prop */}
      {children || <div>{message}</div>}
    </div>
  );
};

FunctionalComponent.defaultProps = {
  message: '',
  isEditable: true,
};

FunctionalComponent.propTypes = {
  message: PropTypes.string.isRequired,
  children: PropTypes.node,
  isEditable: PropTypes.bool,
};

// Import and use PropTypes for type checking
import PropTypes from 'prop-types';

// Use React.memo for performance optimization
export const MemoizedFunctionalComponent = React.memo(FunctionalComponent);

This updated component now has better input validation, improved accessibility, and is more maintainable. It also handles edge cases more effectively and provides a better user experience.