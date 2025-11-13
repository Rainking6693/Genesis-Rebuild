import React, { FC, useEffect, useState } from 'react';
import classnames from 'classnames';
import { VisuallyHidden } from '@reach/visually-hidden';

interface Props {
  error: Error | null;
}

const ErrorMessage: FC<Props> = ({ error }) => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!error) return;

    let formattedMessage = error.message;

    // Handle edge cases like empty messages or messages with only whitespace
    if (!formattedMessage || /^\s*$/.test(formattedMessage)) {
      formattedMessage = 'An unexpected error occurred.';
    }

    setMessage(formattedMessage);
  }, [error]);

  return (
    <div className="error-message">
      <p>{message}</p>
      <VisuallyHidden>
        <p className="visuallyHidden">Error:</p>
      </VisuallyHidden>
    </div>
  );
};

const MyComponent: FC<Props> = ({ error }) => {
  return <ErrorMessage error={error} />;
};

MyComponent.defaultProps = {
  error: null,
};

export default MyComponent;

// Add styles for accessibility and maintainability
import './ErrorMessage.scss';

.error-message {
  border: 1px solid var(--error-border-color);
  padding: 0.5rem;
  border-radius: 0.25rem;
  margin-bottom: 1rem;
  font-size: 1rem;
  line-height: 1.5;
}

.visuallyHidden {
  border: 0;
  clip: rect(0 0 0 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
}

In this updated version, I've made the following changes:

1. Added a `VisuallyHidden` component from `@reach/visually-hidden` to improve accessibility by hiding the error message for screen readers.
2. Added a CSS class for the error message to improve accessibility and maintainability.
3. Added a CSS class for the visually hidden error message to improve accessibility.
4. Imported the `VisuallyHidden` component and added it to the `ErrorMessage` component.
5. Added styles for the error message and visually hidden error message in the `ErrorMessage.scss` file.