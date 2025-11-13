import React, { useState } from 'react';
import { sanitizeUserInput } from '../../security/input_sanitization';

interface Props {
  message?: string;
  defaultMessage?: string;
}

type SanitizeFunction = (input: string) => string | null;

const sanitizeUserInput: SanitizeFunction = (input) => {
  let sanitized: string | null = null;

  try {
    // Implement a function to sanitize user input, e.g., remove any malicious scripts or tags
    // For simplicity, let's just remove any script tags
    sanitized = input.replace(/<script[^>]*>([\w\W]*?)<\/script>/g, '');
  } catch (error) {
    console.error('Error sanitizing user input:', error);
    return null;
  }

  return sanitized;
};

interface DangerouslySetInnerHTML {
  __html: string;
}

const MyComponent: React.FC<Props> = ({ message, defaultMessage }) => {
  const [sanitizedMessage, setSanitizedMessage] = useState(defaultMessage || '');

  React.useEffect(() => {
    const sanitized = sanitizeUserInput(message || '');
    if (sanitized) {
      setSanitizedMessage(sanitized);
    }
  }, [message]);

  const dangerouslySetInnerHTML: DangerouslySetInnerHTML = { __html: sanitizedMessage };

  return (
    <div aria-label={sanitizedMessage || '(empty|null)'}>
      <div dangerouslySetInnerHTML={dangerouslySetInnerHTML} />
    </div>
  );
};

export default MyComponent;

import React from 'react';
import { render, screen } from '@testing-library/react';
import MyComponent from './MyComponent';
import { sanitizeUserInput } from '../../security/input_sanitization';

describe('sanitizeUserInput', () => {
  it('should remove script tags', () => {
    const input = '<script>alert("XSS Attack!");</script> Hello World!';
    const output = sanitizeUserInput(input);
    expect(output).toBe(' Hello World!');
  });

  it('should return null for invalid input', () => {
    const input = '<invalid input>';
    const output = sanitizeUserInput(input);
    expect(output).toBeNull();
  });
});

describe('MyComponent', () => {
  it('should render the sanitized message', () => {
    const message = '<script>alert("XSS Attack!");</script> Hello World!';
    render(<MyComponent message={message} />);
    const output = screen.getByText(/hello world!/i);
    expect(output).toBeInTheDocument();
  });

  it('should handle an empty message', () => {
    render(<MyComponent message="" />);
    const output = screen.getByText(/(empty|null)/i);
    expect(output).toBeInTheDocument();
  });

  it('should handle a null message', () => {
    render(<MyComponent message={null} />);
    const output = screen.getByText(/(empty|null)/i);
    expect(output).toBeInTheDocument();
  });

  it('should have a proper ARIA label', () => {
    const message = '<script>alert("XSS Attack!");</script> Hello World!';
    render(<MyComponent message={message} />);
    const label = screen.getByLabelText(/hello world!/i);
    expect(label).toBeInTheDocument();
  });

  it('should update the ARIA label when the message changes', () => {
    const message1 = '<script>alert("XSS Attack!");</script> Hello World!';
    const message2 = '<script>alert("XSS Attack!");</script> Goodbye World!';

    let label1: HTMLElement | null = null;
    let label2: HTMLElement | null = null;

    render(
      <MyComponent message={message1}>
        {(component) => {
          label1 = component.getByLabelText(/hello world!/i);
        }}
      </MyComponent>
    );

    render(
      <MyComponent message={message2}>
        {(component) => {
          label2 = component.getByLabelText(/goodbye world!/i);
        }}
      </MyComponent>
    );

    expect(label1).toBeInTheDocument();
    expect(label2).toBeInTheDocument();
    expect(label1).not.toBe(label2);
  });
});