import React, { FC, useMemo } from 'react';
import DOMPurify from 'dompurify';

type SanitizeMessageType = (message: string | null | undefined) => string;

interface Props {
  message: string;
}

const sanitizeMessage: SanitizeMessageType = (message) => {
  if (!message) return '';

  try {
    const sanitized = DOMPurify.sanitize(message);
    if (!sanitized) {
      throw new Error('Invalid or malicious content');
    }
    return sanitized;
  } catch (error) {
    console.error(error);
    return 'Invalid or malicious content';
  }
};

// Use named exports for better readability and maintainability
export const MyComponent: FC<Props> = ({ message }: Props) => {
  const sanitizedMessage = useMemo(() => sanitizeMessage(message), [message]);

  // Add accessibility by providing an ARIA label for screen readers
  const ariaLabel = 'Custom message';
  return (
    <div
      dangerouslySetInnerHTML={{ __html: sanitizedMessage || '' }}
      aria-label={ariaLabel}
    />
  );
};

// Add unit tests for the component and sanitization function
// (You'll need to set up a testing environment for this)
import React from 'react';
import { render, screen } from '@testing-library/react';
import { sanitizeMessage } from './MyComponent';

describe('MyComponent', () => {
  it('renders the sanitized message', () => {
    const message = '<script>alert("XSS Attack")</script>';
    const sanitizedMessage = sanitizeMessage(message);

    render(<MyComponent message={sanitizedMessage} />);

    expect(screen.getByText('Invalid or malicious content')).toBeInTheDocument();
  });

  it('provides an ARIA label', () => {
    render(<MyComponent message="Test message" />);

    expect(screen.getByRole('img', { hidden: true })).toHaveAttribute('aria-label', 'Custom message');
  });
});

import React, { FC, useMemo } from 'react';
import DOMPurify from 'dompurify';

type SanitizeMessageType = (message: string | null | undefined) => string;

interface Props {
  message: string;
}

const sanitizeMessage: SanitizeMessageType = (message) => {
  if (!message) return '';

  try {
    const sanitized = DOMPurify.sanitize(message);
    if (!sanitized) {
      throw new Error('Invalid or malicious content');
    }
    return sanitized;
  } catch (error) {
    console.error(error);
    return 'Invalid or malicious content';
  }
};

// Use named exports for better readability and maintainability
export const MyComponent: FC<Props> = ({ message }: Props) => {
  const sanitizedMessage = useMemo(() => sanitizeMessage(message), [message]);

  // Add accessibility by providing an ARIA label for screen readers
  const ariaLabel = 'Custom message';
  return (
    <div
      dangerouslySetInnerHTML={{ __html: sanitizedMessage || '' }}
      aria-label={ariaLabel}
    />
  );
};

// Add unit tests for the component and sanitization function
// (You'll need to set up a testing environment for this)
import React from 'react';
import { render, screen } from '@testing-library/react';
import { sanitizeMessage } from './MyComponent';

describe('MyComponent', () => {
  it('renders the sanitized message', () => {
    const message = '<script>alert("XSS Attack")</script>';
    const sanitizedMessage = sanitizeMessage(message);

    render(<MyComponent message={sanitizedMessage} />);

    expect(screen.getByText('Invalid or malicious content')).toBeInTheDocument();
  });

  it('provides an ARIA label', () => {
    render(<MyComponent message="Test message" />);

    expect(screen.getByRole('img', { hidden: true })).toHaveAttribute('aria-label', 'Custom message');
  });
});