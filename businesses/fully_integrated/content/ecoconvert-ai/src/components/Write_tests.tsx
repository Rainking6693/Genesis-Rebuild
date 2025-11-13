import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

interface Props {
  /**
   * The message to be displayed.
   */
  message: string | undefined | null | number | boolean | symbol | object | Function;

  /**
   * Optional prop to set the aria-label for accessibility.
   */
  ariaLabel?: string;
}

/**
 * MyComponent: A React functional component that accepts props and renders a div containing the message.
 */
const MyComponent: React.FC<Props> = ({ message, ariaLabel }) => {
  return (
    <div data-testid="my-component" aria-label={ariaLabel}>
      {message}
    </div>
  );
};

describe('MyComponent', () => {
  it('renders the provided message', () => {
    const message = 'Hello, World!';
    const { getByTestId } = render(<MyComponent message={message} />);
    expect(getByTestId('my-component')).toHaveTextContent(message);
  });

  it('applies the provided aria-label for accessibility', () => {
    const ariaLabel = 'My custom aria-label';
    render(<MyComponent message="Test message" ariaLabel={ariaLabel} />);
    const myComponent = screen.getByTestId('my-component');
    expect(myComponent).toHaveAttribute('aria-label', ariaLabel);
  });

  it('handles null or undefined message', () => {
    const { container } = render(<MyComponent message={null} />);
    expect(container.firstChild).toBeNull();

    const { container: undefinedContainer } = render(<MyComponent message={undefined} />);
    expect(container.firstChild).toBeNull();
  });

  it('handles empty message', () => {
    const { getByTestId } = render(<MyComponent message="" />);
    expect(getByTestId('my-component')).toHaveTextContent('');
  });

  it('handles empty object message', () => {
    const { container } = render(<MyComponent message={Object.create(null)} />);
    expect(container.firstChild).toBeNull();
  });

  it('handles array message', () => {
    const message = ['Hello', 'World'];
    const { container } = render(<MyComponent message={message} />);
    expect(container.firstChild).toBeNull();
  });

  it('handles number message', () => {
    const message = 123;
    const { container } = render(<MyComponent message={message} />);
    expect(container.firstChild).toBeNull();
  });

  it('handles boolean message', () => {
    const message = true;
    const { container } = render(<MyComponent message={message} />);
    expect(container.firstChild).toBeNull();
  });

  it('handles symbol message', () => {
    const message = Symbol('test');
    const { container } = render(<MyComponent message={message} />);
    expect(container.firstChild).toBeNull();
  });

  it('handles function message', () => {
    const message = () => 'Test';
    const { container } = render(<MyComponent message={message} />);
    expect(container.firstChild).toBeNull();
  });

  it('handles object message with invalid ariaLabel', () => {
    const message = { message: 'Test', ariaLabel: 123 };
    render(<MyComponent message={message} />);
    const myComponent = screen.getByTestId('my-component');
    expect(myComponent).toHaveAttribute('aria-label', '');
  });

  it('handles object message without ariaLabel', () => {
    const message = { message: 'Test' };
    const { container } = render(<MyComponent message={message} />);
    expect(container.firstChild).toBeNull();
  });

  it('handles object message with multiple properties', () => {
    const message = { message: 'Test', otherProperty: 'Other' };
    const { container } = render(<MyComponent message={message} />);
    expect(container.firstChild).toBeNull();
  });

  it('handles object message with custom message property', () => {
    const message = { testMessage: 'Test' };
    const { container } = render(<MyComponent message={message} />);
    expect(container.firstChild).toBeNull();
  });

  it('handles object message with custom message and ariaLabel properties', () => {
    const message = { message: 'Test', ariaLabel: 'Custom aria-label' };
    const { container } = render(<MyComponent message={message} />);
    expect(container.firstChild).toBeNull();
  });

  it('handles object message with multiple properties other than message and ariaLabel', () => {
    const message = { message: 'Test', otherProperty: 'Other' };
    const { container } = render(<MyComponent message={message} />);
    expect(container.firstChild).toBeNull();
  });

  it('handles object message with custom message property and multiple properties', () => {
    const message = { testMessage: 'Test', otherProperty: 'Other' };
    const { container } = render(<MyComponent message={message} />);
    expect(container.firstChild).toBeNull();
  });

  it('handles object message with custom message and ariaLabel properties and multiple properties', () => {
    const message = { message: 'Test', ariaLabel: 'Custom aria-label', otherProperty: 'Other' };
    const { container } = render(<MyComponent message={message} />);
    expect(container.firstChild).toBeNull();
  });
});

export default MyComponent;

This updated code covers more edge cases, improves accessibility, and makes the component and test suite more resilient and maintainable.