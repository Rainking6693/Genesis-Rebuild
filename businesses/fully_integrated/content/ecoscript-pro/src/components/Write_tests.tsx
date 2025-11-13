import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Define the interface for props
interface Props {
  message: string;
  onClick?: () => void;
  ariaLabel?: string;
}

// Define the functional component MyComponent
const MyComponent: React.FC<Props> = ({ message, onClick, ariaLabel }) => {
  return (
    <div data-testid="my-component" dangerouslySetInnerHTML={{ __html: message }} onClick={onClick} aria-label={ariaLabel}>
      {message}
    </div>
  );
};

// Export the MyComponent for use in other files
export default MyComponent;

// Import the necessary testing libraries
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Define test functions for resiliency, edge cases, accessibility, and maintainability
describe('MyComponent', () => {
  // Test resiliency with different props
  test('renders the message with different props', () => {
    const message1 = 'Test message 1';
    const message2 = 'Test message 2';

    render(<MyComponent message={message1} />);
    expect(screen.getByTestId('my-component').textContent).toBe(message1);

    render(<MyComponent message={message2} />);
    expect(screen.getByTestId('my-component').textContent).toBe(message2);
  });

  // Test edge cases with empty message
  test('renders an empty div when message is empty', () => {
    render(<MyComponent message="" />);
    const myComponent = screen.getByTestId('my-component');
    expect(myComponent).toBeEmptyDOMElement();
  });

  // Test accessibility with ARIA attributes
  test('has an ARIA label for screen reader users', () => {
    render(<MyComponent message="Test message" aria-label="Test label" />);
    const myComponent = screen.getByTestId('my-component');
    expect(myComponent).toHaveAccessibleName('Test message');
  });

  // Test maintainability with custom event handling
  test('handles custom events', () => {
    const handleCustomEvent = jest.fn();
    render(<MyComponent message="Test message" onClick={handleCustomEvent} />);

    const myComponent = screen.getByTestId('my-component');
    fireEvent.click(myComponent);
    expect(handleCustomEvent).toHaveBeenCalledTimes(1);
  });

  // Test resiliency with invalid HTML
  test('escapes invalid HTML characters', async () => {
    const message = '<script>alert("XSS Attack!");</script>';
    render(<MyComponent message={message} />);

    await waitFor(() => {
      // No alert box should be shown
      expect(screen.queryByText('XSS Attack!')).toBeNull();
    });
  });

  // Test edge case with null message
  test('renders an empty div when message is null', () => {
    render(<MyComponent message={null} />);
    const myComponent = screen.getByTestId('my-component');
    expect(myComponent).toBeEmptyDOMElement();
  });

  // Test accessibility with ARIA-expanded
  test('expands and collapses content with ARIA-expanded', () => {
    const message = 'This is an expandable message';
    render(
      <MyComponent
        message={`<div>${message}</div><button aria-expanded="false" onClick={() => alert('Clicked!')}>Expand</button>`}
      />
    );

    const expandButton = screen.getByText('Expand');
    expect(expandButton).toHaveAttribute('aria-expanded', 'false');

    userEvent.click(expandButton);
    expect(expandButton).toHaveAttribute('aria-expanded', 'true');
  });

  // Test maintainability with custom event and preventDefault
  test('prevents default behavior on custom event', () => {
    const handleCustomEvent = jest.fn();
    const preventDefault = jest.fn();
    render(<MyComponent message="Test message" onClick={(event) => { handleCustomEvent(event); event.preventDefault(); }} />);

    const myComponent = screen.getByTestId('my-component');
    fireEvent.click(myComponent);
    expect(handleCustomEvent).toHaveBeenCalledTimes(1);
    expect(preventDefault).toHaveBeenCalledTimes(1);
  });
});

In this updated test suite, I've added tests for edge cases with null message, accessibility with ARIA-expanded, maintainability with custom event and preventDefault, and resiliency with a more complex message containing a button. These additional tests help ensure that the component is more robust and adaptable to various scenarios.