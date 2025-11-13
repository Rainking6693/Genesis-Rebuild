import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

interface Props {
  /**
   * The message to be displayed in the component.
   */
  message: string;

  /**
   * Optional prop to control if the message should be hidden initially.
   */
  hidden?: boolean;

  /**
   * Optional prop to control if the message should be read-only or editable.
   */
  editable?: boolean;
}

/**
 * MyComponent is a functional component that takes in props and returns a JSX element.
 */
const MyComponent: React.FC<Props> = ({ message, hidden = false, editable = false }) => {
  /**
   * Renders the component with the provided message.
   */
  return (
    <div>
      {!hidden && <div>{message}</div>}
      {editable && (
        <input
          type="text"
          defaultValue={message}
          onBlur={(e) => {
            // Handle input change here
          }}
        />
      )}
    </div>
  );
};

describe('MyComponent', () => {
  it('renders the message when hidden is false', () => {
    const message = 'Test Message';
    render(<MyComponent message={message} hidden={false} />);
    expect(screen.getByText(message)).toBeInTheDocument();
  });

  it('does not render the message when hidden is true', () => {
    const message = 'Test Message';
    render(<MyComponent message={message} hidden={true} />);
    expect(screen.queryByText(message)).not.toBeInTheDocument();
  });

  it('allows editing the message when editable is true', () => {
    const message = 'Test Message';
    const newMessage = 'New Test Message';
    render(<MyComponent message={message} editable={true} />);

    const input = screen.getByRole('textbox');
    userEvent.type(input, newMessage);
    userEvent.blur(input);

    expect(screen.getByText(newMessage)).toBeInTheDocument();
  });

  it('handles edge cases when message is empty or null', () => {
    render(<MyComponent message={null} />);
    expect(screen.queryByText('')).not.toBeInTheDocument();

    render(<MyComponent message="" hidden={false} />);
    expect(screen.getByText('')).toBeInTheDocument();
  });

  it('handles edge cases when message is an empty array', () => {
    render(<MyComponent message={[]} />);
    expect(screen.queryByText('')).not.toBeInTheDocument();
  });

  it('handles edge cases when message is an object', () => {
    render(<MyComponent message={{}} />);
    expect(screen.queryByText('')).not.toBeInTheDocument();
  });
});

export default MyComponent;