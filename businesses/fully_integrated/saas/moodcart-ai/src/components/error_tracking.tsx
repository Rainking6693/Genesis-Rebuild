import React, { FC, useEffect, useState } from 'react';
import { classNames } from 'polished';
import { useClipboard } from '@react-aria/clipboard';

interface Props {
  message: string;
  errorId?: string;
}

const ErrorMessage: FC<Props> = ({ message, errorId }) => {
  const [copied, setCopied] = useState(false);
  const { copy, isCopied } = useClipboard({
    onCopy: () => {
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    },
  });

  const errorMessageClasses = classNames('error-message', {
    'error-message--copied': copied,
  });

  useEffect(() => {
    if (errorId) {
      // Track the error using your error tracking service
      // For example:
      // trackError(errorId, message);
    }
  }, [errorId, message]);

  return (
    <div className={errorMessageClasses} role="alert">
      <button
        className="error-message__copy-button"
        aria-label="Copy Error ID"
        onClick={copy}
      >
        Copy Error ID
      </button>
      <div className="error-message__content">{message}</div>
      {errorId && (
        <div className="error-message__id">Error ID: {errorId}</div>
      )}
    </div>
  );
};

export default ErrorMessage;

// Import error-message CSS class from a separate file
// For example:
// import 'styles/error-message.css';

In this updated version, I've added the `useClipboard` hook from `@react-aria/clipboard` to handle the copy-to-clipboard functionality more efficiently and reliably. I've also added an `aria-label` to the copy button for better accessibility. Additionally, I've updated the `isCopied` state variable to match the new `useClipboard` state.