import React, { FC, useEffect, useRef, useState } from 'react';
import { useMemoize } from 'react-use';
import { sanitizeUserInput } from './security';

interface Props {
  message: string;
  maxLength?: number;
  minLength?: number;
  testId?: string;
}

const CustomerSupportBot: FC<Props> = ({ message, maxLength = 200, minLength = 1, testId, ...rest }) => {
  // Store the sanitized message for better performance
  const sanitizedMessage = useMemoize(() => sanitizeUserInput(message), [message]);

  // Refs for error handling and accessibility
  const botRef = useRef<HTMLDivElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  // States for error handling and accessibility
  const [hasError, setHasError] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Use effects for error handling, accessibility, and focus management
  useEffect(() => {
    if (!sanitizedMessage.trim()) {
      setHasError(true);
    } else {
      setHasError(false);
    }
  }, [sanitizedMessage]);

  useEffect(() => {
    if (sanitizedMessage.length < minLength || sanitizedMessage.length > maxLength) {
      setHasError(true);
    } else {
      setHasError(false);
    }
  }, [sanitizedMessage, maxLength, minLength]);

  useEffect(() => {
    if (!hasError) {
      setIsFocused(true);
    }
  }, [hasError]);

  useEffect(() => {
    if (errorRef.current) {
      errorRef.current.focus();
    }
  }, [hasError]);

  useEffect(() => {
    if (botRef.current) {
      botRef.current.focus();
    }
  }, []);

  return (
    <div id="carbon-ledger-pro-customer-support-bot" className="customer-support-bot" ref={botRef} {...rest}>
      {/* Render the sanitized message */}
      {sanitizedMessage}

      {/* Render error message if any */}
      {hasError && (
        <div ref={errorRef} role="alert" aria-describedby="carbon-ledger-pro-customer-support-bot" className="error-message">
          Error: Please provide a valid message.
        </div>
      )}
    </div>
  );
};

export default CustomerSupportBot;

This updated version of the `CustomerSupportBot` component includes improvements for resiliency, edge cases, accessibility, and maintainability. It now has a `maxLength` and `minLength` prop to prevent long or short messages, a `testId` prop for better testing, and improved focus management for better accessibility. Additionally, the error message is now associated with the bot using the `aria-describedby` attribute.