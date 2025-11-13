import React from 'react';
import { render, screen } from '@testing-library/react';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  const basicMessage = 'This is a basic message';
  const edgeCaseMessage = 'This is an edge case message with special characters: !@#$%^&*()_+-=[]{}|;:,.<> ?';
  const emptyMessage = '';

  it('should render the provided message', () => {
    render(<MyComponent message={basicMessage} />);
    expect(screen.getByText(basicMessage)).toBeInTheDocument();
  });

  it('should render the edge case message correctly', () => {
    render(<MyComponent message={edgeCaseMessage} />);
    expect(screen.getByText(edgeCaseMessage)).toBeInTheDocument();
  });

  it('should not render any message when the message prop is empty', () => {
    render(<MyComponent message={emptyMessage} />);
    expect(screen.queryByText(emptyMessage)).not.toBeInTheDocument();
  });

  it('should pass accessibility test', () => {
    const { container } = render(<MyComponent message={basicMessage} />);
    expect(container).toHaveAccessibilityTree();
  });

  it('should not throw an error when the message prop is not provided', () => {
    expect(() => render(<MyComponent />)).not.toThrow();
  });
});

This test suite covers the following aspects:

1. Rendering the provided message correctly.
2. Rendering edge case messages correctly.
3. Handling empty messages gracefully.
4. Ensuring the component is accessible.
5. Verifying that the component doesn't throw an error when the message prop is not provided.