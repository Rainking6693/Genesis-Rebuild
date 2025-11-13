import React, { FC, ForwardRefRenderFunction, Ref, useCallback, useState } from 'react';
import { act, render, screen } from '@testing-library/react';
import DOMPurify from 'dompurify';

type MessageType = string | null | undefined;
type SanitizeFunction = (html: string) => string;
type RefType = React.RefObject<HTMLDivElement> | null;

interface Props {
  message?: MessageType;
  ref?: Ref<HTMLDivElement>;
}

const MyComponent: ForwardRefRenderFunction<HTMLDivElement, Props> = (
  { message, ref },
  refInstance
) => {
  const [fallbackMessage, setFallbackMessage] = useState('');
  const sanitize: SanitizeFunction = useCallback((html: string) => {
    return html ? DOMPurify.sanitize(html) : '';
  }, []);

  useEffect(() => {
    if (!message) {
      setFallbackMessage('No message provided');
    } else if (sanitize(message) === '') {
      setFallbackMessage('The provided message is not valid');
    } else {
      setFallbackMessage(sanitize(message));
    }
  }, [message, sanitize]);

  return (
    <div ref={refInstance || ref} role="presentation" aria-label="My Component">
      {fallbackMessage}
    </div>
  );
};

export default React.forwardRef(MyComponent);

describe('MyComponent', () => {
  it('renders the provided message', () => {
    const message = '<p>Hello, World!</p>';
    act(() => {
      render(<MyComponent message={message} />);
    });

    expect(screen.getByText('Hello, World!')).toBeInTheDocument();
  });

  it('renders a fallback message when no message is provided', () => {
    act(() => {
      render(<MyComponent />);
    });

    expect(screen.getByText('No message provided')).toBeInTheDocument();
  });

  it('renders a fallback message when the sanitized message is an empty string', () => {
    act(() => {
      render(<MyComponent message="<script>alert('XSS')</script>" />);
    });

    expect(screen.getByText('The provided message is not valid')).toBeInTheDocument();
  });

  it('renders a fallback message when the sanitized message is null', () => {
    act(() => {
      render(<MyComponent message={null} />);
    });

    expect(screen.getByText('No message provided')).toBeInTheDocument();
  });
});

This updated component now handles edge cases such as an empty or invalid message, and it provides better accessibility with the addition of a `role` attribute. The tests ensure that the component behaves as expected in these edge cases.