import React, { FC, useState, useCallback, useMemo } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  title?: string;
  message: string;
  maxLength?: number;
  className?: string;
}

const Newsletter: FC<Props> = ({ title = 'Newsletter', message, maxLength = 1000, className, ...rest }) => {
  const [newsletterContent, setNewsletterContent] = useState(message);
  const [isFocused, setIsFocused] = useState(false);

  const sanitizedMessage = useMemo(
    () => Newsletter.sanitize(message),
    [message]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        handleBlur(event);
      }
    },
    [handleBlur]
  );

  const handleFocus = useCallback(
    (event: React.FocusEvent<HTMLDivElement>) => {
      setIsFocused(true);
      event.currentTarget.setSelectionRange(0, 0);
    },
    []
  );

  const handleBlur = useCallback(
    (event: React.FocusEvent<HTMLDivElement>) => {
      setIsFocused(false);
      if (newsletterContent.trim() === '') {
        setNewsletterContent(sanitizedMessage);
      }
    },
    [newsletterContent, sanitizedMessage]
  );

  const handleInput = useCallback(
    (event: React.ChangeEvent<HTMLDivElement>) => {
      setNewsletterContent(event.target.value);
    },
    []
  );

  const focus = useCallback(() => {
    if (newsletterContent.trim() === '') {
      setNewsletterContent(sanitizedMessage);
    }
    setIsFocused(true);
  }, [newsletterContent, sanitizedMessage]);

  const blur = useCallback(() => {
    setIsFocused(false);
    if (newsletterContent.trim() === '') {
      setNewsletterContent(sanitizedMessage);
    }
  }, [newsletterContent, sanitizedMessage]);

  const setValue = useCallback((value: string) => {
    setNewsletterContent(value);
    setIsFocused(false);
  }, []);

  const getValue = useCallback(() => newsletterContent, [newsletterContent]);

  const reset = useCallback(() => {
    setNewsletterContent(sanitizedMessage);
    setIsFocused(false);
  }, [sanitizedMessage]);

  return (
    <div {...rest} className={className}>
      <h2>{title}</h2>
      <div
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="textbox"
        aria-label="Newsletter content"
        maxLength={maxLength}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onInput={handleInput}
        value={newsletterContent}
        dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
      />
    </div>
  );
};

// Import sanitizer for security best practices
import DOMPurify from 'dompurify';

// Use sanitizer to prevent XSS attacks
Newsletter.sanitize = (message: string) => {
  try {
    return DOMPurify.sanitize(message);
  } catch (error) {
    console.error('Sanitization error:', error);
    return message;
  }
};

export default Newsletter;

This updated Newsletter component now includes additional features for better resiliency, edge cases handling, accessibility, and maintainability.