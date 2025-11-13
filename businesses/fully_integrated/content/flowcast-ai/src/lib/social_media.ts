import React, { FC, PropsWithChildren, useContext } from 'react';
import { ThemeContext } from './ThemeContext';

// Move sanitizeMessage function outside the component for reusability
// Consider using a library like DOMPurify for production
const sanitizeMessage = (message: string): string => {
  const sanitizedMessage = message
    .replace(/<script>/g, '')
    .replace(/<style>/g, '')
    .replace(/<iframe>/g, '');

  if (!sanitizedMessage) {
    throw new Error('Invalid or empty message');
  }

  return sanitizedMessage;
};

interface Props {
  message: string;
}

// Add a children prop for accessibility and flexibility
// Use useContext to access theme context for better encapsulation
const MyComponent: FC<PropsWithChildren<Props>> = ({ children, message }) => {
  const { theme } = useContext(ThemeContext);

  // Use children prop if provided, otherwise use message prop
  const content = children ? children : sanitizeMessage(message);

  return (
    <div data-testid="MyComponent" dangerouslySetInnerHTML={{ __html: content, __style: { color: theme.textColor } }} />
  );
};

// Add type for defaultProps
MyComponent.defaultProps = {
  message: 'Welcome to FlowCast AI Podcast!',
};

// Add tests for MyComponent and sanitizeMessage function
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  // Wrap the FC function to mock its return value
  FC: (Component: any) => (props: any) => <div data-testid="MyComponent">{Component(props)}</div>,
}));

describe('MyComponent', () => {
  it('renders the provided message', () => {
    const message = 'Test message';
    const { getByTestId } = render(<MyComponent message={message} />);
    expect(getByTestId('MyComponent')).toHaveTextContent(message);
  });

  it('renders the children if provided', () => {
    const children = <span data-testid="children">Test children</span>;
    const { getByTestId } = render(<MyComponent>{children}</MyComponent>);
    expect(getByTestId('MyComponent')).toContainElement(getByTestId('children'));
  });

  it('throws an error for an empty or invalid message', () => {
    expect(() => render(<MyComponent message="" />)).toThrow('Invalid or empty message');
  });
});

describe('sanitizeMessage', () => {
  it('sanitizes the message', () => {
    const message = '<script>alert("XSS attack")</script>';
    expect(sanitizeMessage(message)).not.toContain('<script>');
  });

  it('returns the original message if it is safe', () => {
    const message = 'Safe message';
    expect(sanitizeMessage(message)).toBe(message);
  });
});

In this version, I've added a ThemeContext to allow for theming, and I've used the useContext hook to access the theme context within the component. This makes the component more flexible and maintainable. Additionally, I've added a test for the sanitizeMessage function to ensure it returns the original message if it is safe.